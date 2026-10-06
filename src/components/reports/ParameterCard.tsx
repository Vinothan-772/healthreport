// ============================================================
// PARAMETER CARD COMPONENT
// ============================================================

import { CheckCircle2, AlertTriangle, HelpCircle, ArrowUp, ArrowDown } from "lucide-react";
import type { HealthParameter } from "@/types/database";

interface ParameterCardProps {
  parameter: HealthParameter;
}

export function ParameterCard({ parameter }: ParameterCardProps) {
  const statusConfig = {
    normal: {
      color: "var(--color-success)",
      bg: "var(--color-success-bg)",
      border: "#86efac",
      icon: CheckCircle2,
      label: "Within range",
    },
    high: {
      color: "var(--color-warning)",
      bg: "var(--color-warning-bg)",
      border: "#fcd34d",
      icon: ArrowUp,
      label: "Above range",
    },
    low: {
      color: "var(--color-warning)",
      bg: "var(--color-warning-bg)",
      border: "#fcd34d",
      icon: ArrowDown,
      label: "Below range",
    },
    critical: {
      color: "var(--color-danger)",
      bg: "var(--color-danger-bg)",
      border: "#fca5a5",
      icon: AlertTriangle,
      label: "Critical",
    },
    unknown: {
      color: "var(--color-text-muted)",
      bg: "var(--color-bg)",
      border: "var(--color-border)",
      icon: HelpCircle,
      label: "Status unclear",
    },
  };

  const config = statusConfig[parameter.status] || statusConfig.unknown;
  const StatusIcon = config.icon;

  return (
    <div
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header section with value */}
      <div
        style={{
          padding: "20px",
          borderBottom: "1px solid var(--color-border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "var(--color-navy)",
              marginBottom: "8px",
            }}
          >
            {parameter.name}
          </h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
            <span
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "var(--color-navy)",
                letterSpacing: "-0.02em",
              }}
            >
              {parameter.value_text || "—"}
            </span>
            {parameter.unit && (
              <span style={{ fontSize: "14px", color: "var(--color-text-muted)", fontWeight: "500" }}>
                {parameter.unit}
              </span>
            )}
          </div>
          {parameter.reference_range && (
            <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "4px" }}>
              Reference: {parameter.reference_range}
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 10px",
            borderRadius: "var(--radius-md)",
            backgroundColor: config.bg,
            border: `1px solid ${config.border}`,
            color: config.color,
            fontSize: "12px",
            fontWeight: "600",
            flexShrink: 0,
          }}
        >
          <StatusIcon size={14} />
          {config.label}
        </div>
      </div>

      {/* Explanation section */}
      <div
        style={{
          padding: "16px 20px",
          backgroundColor: "var(--color-bg)",
          flex: 1,
        }}
      >
        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--color-text-muted)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          What it means
        </p>
        <p style={{ fontSize: "14px", color: "var(--color-text-body)", lineHeight: "1.5" }}>
          {parameter.explanation}
        </p>
      </div>
    </div>
  );
}
