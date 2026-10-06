// ============================================================
// POST /api/analyze-report
// Secure server-side AI analysis pipeline
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  analyzeReportWithGemini,
  validateFileForGemini,
} from "@/lib/gemini/analyze-report";
import { getGeminiModel } from "@/lib/gemini/client";

const ANALYSIS_VERSION = "phase2-v1";

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse request body ────────────────────────────────
    let body: { reportId: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request format." },
        { status: 400 }
      );
    }

    const { reportId } = body;

    if (!reportId || typeof reportId !== "string") {
      return NextResponse.json(
        { error: "reportId is required." },
        { status: 400 }
      );
    }

    // ── 2. Authenticate user ─────────────────────────────────
    const supabase = (await createClient()) as any;
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    // ── 3. Fetch report and verify ownership ─────────────────
    const { data: report, error: reportError } = await supabase
      .from("reports")
      .select("*")
      .eq("id", reportId)
      .eq("user_id", user.id) // Ownership check at DB level
      .single();

    if (reportError || !report) {
      return NextResponse.json(
        { error: "Report not found." },
        { status: 404 }
      );
    }

    // ── 4. Prevent duplicate analysis ────────────────────────
    if (report.status === "processing") {
      return NextResponse.json(
        { error: "This report is already being analyzed. Please wait." },
        { status: 409 }
      );
    }

    if (report.status === "completed") {
      return NextResponse.json(
        { error: "This report has already been analyzed." },
        { status: 409 }
      );
    }

    // ── 5. Mark as processing ────────────────────────────────
    await supabase
      .from("reports")
      .update({
        status: "processing",
        processing_started_at: new Date().toISOString(),
        error_message: null,
      })
      .eq("id", reportId)
      .eq("user_id", user.id);

    // ── 6. Download file from private Supabase Storage ───────
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("medical-reports")
      .download(report.file_path);

    if (downloadError || !fileData) {
      await markFailed(supabase, reportId, user.id, "Could not retrieve the report file.");
      return NextResponse.json(
        { error: "Could not retrieve the report file." },
        { status: 500 }
      );
    }

    const fileBuffer = await fileData.arrayBuffer();

    // Determine MIME type from stored path or default
    let mimeType = fileData.type || "application/pdf";
    if (!mimeType || mimeType === "application/octet-stream") {
      const ext = report.file_path.split(".").pop()?.toLowerCase();
      if (ext === "pdf") mimeType = "application/pdf";
      else if (ext === "jpg" || ext === "jpeg") mimeType = "image/jpeg";
      else if (ext === "png") mimeType = "image/png";
      else mimeType = "application/pdf";
    }

    // ── 7. Validate file server-side ─────────────────────────
    try {
      validateFileForGemini(fileBuffer, mimeType);
    } catch (validationError) {
      const msg = validationError instanceof Error
        ? validationError.message
        : "Invalid file.";
      await markFailed(supabase, reportId, user.id, msg);
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // ── 8. Call Gemini AI ────────────────────────────────────
    let geminiResult;
    try {
      geminiResult = await analyzeReportWithGemini(fileBuffer, mimeType);
    } catch (aiError) {
      const rawMsg = aiError instanceof Error ? aiError.message : "Unknown AI error";

      // Map to user-safe messages
      let userMsg = "We couldn't analyze this report right now. Please try again.";
      if (rawMsg.includes("GEMINI_API_KEY")) {
        userMsg = "Gemini AI is not configured. Please add GEMINI_API_KEY to the environment.";
      } else if (rawMsg.includes("quota") || rawMsg.includes("RESOURCE_EXHAUSTED")) {
        userMsg = "AI analysis is temporarily unavailable. Please try again later.";
      } else if (rawMsg.includes("API_KEY_INVALID") || rawMsg.includes("PERMISSION_DENIED")) {
        userMsg = "Gemini API key is invalid. Please check your configuration.";
      }

      // Log minimal server-side info (no file content, no keys)
      console.error("[analyze-report] Gemini error:", rawMsg.substring(0, 200));

      await markFailed(supabase, reportId, user.id, userMsg);
      return NextResponse.json({ error: userMsg }, { status: 502 });
    }

    // ── 9. Persist results to Supabase ───────────────────────
    const now = new Date().toISOString();
    const modelName = getGeminiModel();

    try {
      // 9a. Report metadata
      await supabase.from("report_metadata").upsert({
        report_id: reportId,
        user_id: user.id,
        patient_name: geminiResult.report.patientName ?? null,
        report_date: geminiResult.report.reportDate ?? null,
        laboratory_name: geminiResult.report.laboratoryName ?? null,
        report_type: geminiResult.report.reportType ?? null,
        updated_at: now,
      }, { onConflict: "report_id" });

      // 9b. Report summary
      await supabase.from("report_summaries").upsert({
        report_id: reportId,
        user_id: user.id,
        summary: geminiResult.summary.overview,
        report_type: geminiResult.report.reportType ?? null,
        overall_note: geminiResult.summary.overallNote ?? null,
        updated_at: now,
      }, { onConflict: "report_id" });

      // 9c. Health parameters — delete old if re-analyzing
      await supabase
        .from("health_parameters")
        .delete()
        .eq("report_id", reportId)
        .eq("user_id", user.id);

      if (geminiResult.parameters.length > 0) {
        await supabase.from("health_parameters").insert(
          geminiResult.parameters.map((p) => ({
            report_id: reportId,
            user_id: user.id,
            name: p.name,
            value_text: p.valueText ?? null,
            numeric_value: p.numericValue ?? null,
            unit: p.unit ?? null,
            reference_range: p.referenceRange ?? null,
            status: p.status,
            explanation: p.explanation,
          }))
        );
      }

      // 9d. Raw AI result
      await supabase.from("ai_analysis_results").upsert({
        report_id: reportId,
        user_id: user.id,
        model_name: modelName,
        analysis_version: ANALYSIS_VERSION,
        raw_result: geminiResult as unknown as Record<string, unknown>,
      }, { onConflict: "report_id" });

      // 9e. Update report — completed
      await supabase
        .from("reports")
        .update({
          status: "completed",
          report_type: geminiResult.report.reportType ?? null,
          processing_completed_at: now,
          analyzed_at: now,
          error_message: null,
        })
        .eq("id", reportId)
        .eq("user_id", user.id);

    } catch (dbError) {
      const dbMsg = dbError instanceof Error ? dbError.message : "DB error";
      console.error("[analyze-report] DB persistence error:", dbMsg.substring(0, 200));
      await markFailed(supabase, reportId, user.id, "Failed to save analysis results.");
      return NextResponse.json(
        { error: "Failed to save analysis results. Please try again." },
        { status: 500 }
      );
    }

    // ── 10. Return success ───────────────────────────────────
    return NextResponse.json({
      success: true,
      reportId,
      reportType: geminiResult.report.reportType,
      parameterCount: geminiResult.parameters.length,
    });

  } catch (unexpectedError) {
    const msg = unexpectedError instanceof Error
      ? unexpectedError.message
      : "Unexpected error";
    console.error("[analyze-report] Unexpected error:", msg.substring(0, 200));
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// ── Helper: mark report as failed ────────────────────────────
async function markFailed(
  supabase: any,
  reportId: string,
  userId: string,
  message: string
) {
  await supabase
    .from("reports")
    .update({
      status: "failed",
      error_message: message,
    })
    .eq("id", reportId)
    .eq("user_id", userId);
}
