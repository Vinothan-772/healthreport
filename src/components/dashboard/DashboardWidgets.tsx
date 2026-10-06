"use client";

// ============================================================
// DASHBOARD COMPONENTS
// ============================================================

import { Activity, ArrowUp, ArrowDown, CheckCircle2 } from "lucide-react";

export function HealthOverview({
  parametersReviewed,
  withinRange,
  aboveRange,
  belowRange,
}: {
  parametersReviewed: number;
  withinRange: number;
  aboveRange: number;
  belowRange: number;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
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
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-navy)" }}>
          Health Overview
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--color-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border-light)",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "4px" }}>
            Parameters Reviewed
          </p>
          <p style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-navy)", lineHeight: 1 }}>
            {parametersReviewed}
          </p>
        </div>
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--color-success-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid #bbf7d0",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--color-success)", marginBottom: "4px" }}>
            Within Range
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <p style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-success)", lineHeight: 1 }}>
              {withinRange}
            </p>
            <CheckCircle2 size={16} color="var(--color-success)" />
          </div>
        </div>
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--color-warning-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid #fde68a",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--color-warning)", marginBottom: "4px" }}>
            Above Range
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <p style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-warning)", lineHeight: 1 }}>
              {aboveRange}
            </p>
            <ArrowUp size={16} color="var(--color-warning)" />
          </div>
        </div>
        <div
          style={{
            padding: "16px",
            backgroundColor: "var(--color-warning-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px solid #fde68a",
          }}
        >
          <p style={{ fontSize: "13px", color: "var(--color-warning)", marginBottom: "4px" }}>
            Below Range
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <p style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-warning)", lineHeight: 1 }}>
              {belowRange}
            </p>
            <ArrowDown size={16} color="var(--color-warning)" />
          </div>
        </div>
      </div>
      <p style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "16px", textAlign: "center" }}>
        *Based on reference ranges from your uploaded reports. Not a medical diagnosis.
      </p>
    </div>
  );
}

export function TrendPreview({
  trends,
}: {
  trends: { name: string; unit: string; values: number[] }[];
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "24px",
      }}
    >
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-navy)" }}>
          Recent Trends
        </h2>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
          Parameters tracked across multiple reports.
        </p>
      </div>

      {trends.length === 0 ? (
        <div
          style={{
            padding: "32px",
            textAlign: "center",
            backgroundColor: "var(--color-bg)",
            borderRadius: "var(--radius-md)",
            border: "1px dashed var(--color-border)",
          }}
        >
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Upload more reports to see trends.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {trends.map((trend, i) => (
            <div
              key={i}
              style={{
                padding: "16px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-navy)" }}>
                  {trend.name}
                </span>
                <span style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                  {trend.unit}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                {trend.values.map((v, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "15px", fontWeight: "600", color: "var(--color-navy)" }}>
                      {v}
                    </span>
                    {idx < trend.values.length - 1 && (
                      <span style={{ color: "var(--color-text-muted)" }}>→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
