// ============================================================
// POST /api/report-chat
// Securely chat about a specific health report
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiClient, getGeminiModel } from "@/lib/gemini/client";

export async function POST(request: NextRequest) {
  try {
    const supabase = (await createClient()) as any;
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { reportId, question, history } = await request.json();

    if (!reportId || !question || typeof question !== "string") {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 });
    }

    if (question.length > 2000) {
      return NextResponse.json({ error: "Question too long." }, { status: 400 });
    }

    // Verify report ownership
    const { data: report, error: reportError } = (await supabase
      .from("reports")
      .select("id, report_type, created_at")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single()) as any;

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found or unauthorized." }, { status: 404 });
    }

    // Retrieve report context for Gemini
    const [
      { data: metadata },
      { data: summary },
      { data: parameters },
    ] = (await Promise.all([
      supabase.from("report_metadata").select("*").eq("report_id", reportId).single(),
      supabase.from("report_summaries").select("*").eq("report_id", reportId).single(),
      supabase.from("health_parameters").select("name, status, value_text, reference_range, unit, explanation").eq("report_id", reportId),
    ])) as any;

    // Build strict context prompt
    const systemPrompt = `
You are a helpful, empathetic, and highly accurate assistant embedded in the 'AI Health Report Explainer' app.
You are explaining information from a specific health report to the user.

RULES:
1. You must not diagnose a disease.
2. You must not prescribe medication or dosage.
3. You must not instruct a user to start or stop medication.
4. You must not guarantee a diagnosis or medical outcome.
5. You must not claim certainty where the source report does not support certainty.
6. You may explain values, units, reference ranges, and terminology.
7. You must say when information is unavailable from the provided report.
8. Do not invent values or use outside assumptions as though they came from the report.
9. Keep answers concise, easy to understand, and well-structured.
10. ALWAYS suggest discussing concerning findings with a qualified healthcare professional.

--- REPORT CONTEXT ---
Report Type: ${report.report_type || "Unknown"}
Report Date: ${metadata?.report_date || "Unknown"}
Laboratory: ${metadata?.laboratory_name || "Unknown"}
Summary Note: ${summary?.summary || "None"}
Important Overall Note: ${summary?.overall_note || "None"}

${parameters?.map((p: any) => `- ${p.name}: ${p.value_text} ${p.unit || ''} (Range: ${p.reference_range || 'N/A'}, Status: ${p.status}). Meaning: ${p.explanation}`).join('\n')}
----------------------
    `;

    // We do not save to DB right now to keep it simple, but we pass recent history.
    // Ensure history is properly formatted for Gemini if needed, but we'll just append it to the prompt for simplicity.
    let conversationContext = "";
    if (history && Array.isArray(history) && history.length > 0) {
      conversationContext = "\n\nPrevious Conversation:\n" + history.map((h: any) => `${h.role}: ${h.content}`).join("\n");
    }

    const finalPrompt = `${systemPrompt}${conversationContext}\n\nUser Question: ${question}`;

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: getGeminiModel(),
      contents: finalPrompt,
    });
    const geminiResponse = response.text;

    return NextResponse.json({ success: true, answer: geminiResponse });
  } catch (err) {
    console.error("[report-chat] Unexpected error:", err);
    return NextResponse.json({ error: "Failed to generate answer." }, { status: 500 });
  }
}
