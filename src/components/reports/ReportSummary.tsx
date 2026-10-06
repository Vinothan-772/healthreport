// ============================================================
// REPORT SUMMARY COMPONENT
// ============================================================

import { FileText, Calendar, Activity, AlertCircle } from "lucide-react";
import type { ReportMetadata, ReportSummary as ReportSummaryType } from "@/types/database";

interface ReportSummaryProps {
  metadata: ReportMetadata | null;
  summary: ReportSummaryType | null;
  importantObservations: string[];
}

export function ReportSummary({
  metadata,
  summary,
  importantObservations,
}: ReportSummaryProps) {
  if (!summary) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Overview Section */}
      <section
        style={{
          backgroundColor: "var(--color-white)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "24px",
        }}
      >
        <div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--color-teal-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={18} style={{ color: "var(--color-teal)" }} />
          </div>
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "var(--color-navy)",
            }}
          >
            Understanding Your Report
          </h2>
        </div>
        <p
          style={{
            fontSize: "15px",
            color: "var(--color-text-body)",
            lineHeight: "1.6",
            marginBottom: summary.overall_note ? "16px" : "0",
          }}
        >
          {summary.summary}
        </p>
        {summary.overall_note && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--color-bg)",
              borderRadius: "var(--radius-md)",
              borderLeft: "3px solid var(--color-teal)",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-navy)",
                lineHeight: "1.5",
                fontWeight: "500",
              }}
            >
              {summary.overall_note}
            </p>
          </div>
        )}
      </section>

      {/* Metadata Grid (if any) */}
      {metadata && (metadata.patient_name || metadata.report_date || metadata.laboratory_name) && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}
        >
          {metadata.patient_name && (
            <div
              style={{
                backgroundColor: "var(--color-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
              }}
            >
              <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginBottom: "4px" }}>
                Patient Name
              </p>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-navy)" }}>
                {metadata.patient_name}
              </p>
            </div>
          )}
          {metadata.report_date && (
            <div
              style={{
                backgroundColor: "var(--color-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <Calendar size={12} style={{ color: "var(--color-text-muted)" }} />
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                  Report Date
                </p>
              </div>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-navy)" }}>
                {metadata.report_date}
              </p>
            </div>
          )}
          {metadata.laboratory_name && (
            <div
              style={{
                backgroundColor: "var(--color-white)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <FileText size={12} style={{ color: "var(--color-text-muted)" }} />
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                  Laboratory
                </p>
              </div>
              <p style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-navy)" }}>
                {metadata.laboratory_name}
              </p>
            </div>
          )}
        </section>
      )}

      {/* Important Observations */}
      {importantObservations && importantObservations.length > 0 && (
        <section
          style={{
            backgroundColor: "var(--color-warning-bg)",
            border: "1px solid #fde68a",
            borderRadius: "var(--radius-lg)",
            padding: "20px 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <AlertCircle size={18} style={{ color: "var(--color-warning)" }} />
            <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--color-warning)" }}>
              Important Observations
            </h3>
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "24px",
              color: "#92400e",
              fontSize: "14px",
              lineHeight: "1.6",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {importantObservations.map((obs, idx) => (
              <li key={idx}>{obs}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
