// ============================================================
// REPORT DETAILS PAGE — /reports/[id]
// Server component: fetches all report details + parameters
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, ShieldAlert } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ReportSummary } from "@/components/reports/ReportSummary";
import { ParameterList } from "@/components/reports/ParameterList";
import { ReportChat } from "@/components/chat/ReportChat";
import { formatDateShort } from "@/lib/utils";
import type { AIAnalysisResult } from "@/types/database";

export const metadata: Metadata = {
  title: "Report Details",
};

export default async function ReportDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: reportId } = await params;
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile for the shell
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch report core data (checks ownership)
  const { data: report, error: reportError } = (await supabase
    .from("reports")
    .select("*")
    .eq("id", reportId)
    .eq("user_id", user.id)
    .single()) as any;

  if (reportError || !report) {
    redirect("/reports");
  }

  // Handle incomplete reports
  if (report.status !== "completed") {
    // If it's processing or failed, we just show a basic page or redirect back to list
    // In a real app we might show a live status page here. For now, redirect to list.
    redirect("/reports");
  }

  // Fetch all related data in parallel
  const [
    { data: metadata },
    { data: summary },
    { data: parameters },
    { data: aiResult },
  ] = await Promise.all([
    supabase.from("report_metadata").select("*").eq("report_id", reportId).single(),
    supabase.from("report_summaries").select("*").eq("report_id", reportId).single(),
    supabase.from("health_parameters").select("*").eq("report_id", reportId).order("name"),
    supabase.from("ai_analysis_results").select("raw_result").eq("report_id", reportId).single(),
  ]);

  const typedAiResult = aiResult?.raw_result as AIAnalysisResult["raw_result"] | undefined;
  const importantObservations = typedAiResult?.importantObservations || [];
  const limitations = typedAiResult?.limitations || [];

  return (
    <DashboardShell profile={profile} userEmail={user.email ?? ""}>
      <div style={{ maxWidth: "900px" }}>
        {/* Navigation */}
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/reports"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              color: "var(--color-text-muted)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            className="hover:text-[var(--color-navy)]"
          >
            <ArrowLeft size={16} />
            Back to My Reports
          </Link>
        </div>

        {/* Page header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "32px",
            gap: "16px",
            flexWrap: "wrap",
            paddingBottom: "24px",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "600",
                color: "var(--color-navy)",
                marginBottom: "6px",
                letterSpacing: "-0.02em",
              }}
            >
              {report.report_type || "Health Report"}
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
              {report.file_name} · Uploaded {formatDateShort(report.uploaded_at)}
            </p>
          </div>

          <a
            href={`/api/reports/${reportId}/signed-url`} // This isn't perfect for an anchor href as it returns JSON, but we'll wire it with a client component or handle it via a new tab later. For Phase 2 simplicity, we'll keep it as a button that fetches the URL.
            onClick={async (e) => {
              e.preventDefault();
              try {
                const res = await fetch(`/api/reports/${reportId}/signed-url`);
                const data = await res.json();
                if (data.signedUrl) {
                  window.open(data.signedUrl, "_blank", "noopener,noreferrer");
                } else {
                  alert("Could not load the original file.");
                }
              } catch {
                alert("Something went wrong.");
              }
            }}
            className="btn btn-secondary btn-sm"
          >
            <ExternalLink size={14} />
            View Original
          </a>
        </div>

        {/* Content sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <ReportSummary
            metadata={metadata}
            summary={summary}
            importantObservations={importantObservations}
          />

          <ParameterList parameters={parameters ?? []} />

          {/* AI Follow-up Chat */}
          <ReportChat reportId={report.id} />

          {/* Limitations & Disclaimer */}
          <section
            style={{
              padding: "24px",
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <ShieldAlert size={18} style={{ color: "var(--color-text-muted)" }} />
              <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-navy)" }}>
                Limitations & Medical Disclaimer
              </h2>
            </div>
            
            {limitations.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "24px",
                    color: "var(--color-text-body)",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {limitations.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                lineHeight: "1.6",
                paddingTop: "16px",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              <strong>Disclaimer:</strong> This tool is an educational aid powered by AI. It is not a medical diagnosis or a replacement for a qualified healthcare professional. Always consult your doctor regarding any medical conditions, test results, or before making any health decisions.
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
