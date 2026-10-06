// ============================================================
// EMPTY STATE COMPONENT
// ============================================================

import { FileText } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "64px 24px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "56px",
          height: "56px",
          borderRadius: "12px",
          backgroundColor: "var(--color-border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <Icon size={24} style={{ color: "var(--color-text-muted)" }} />
      </div>
      <h3
        style={{
          fontSize: "16px",
          fontWeight: "600",
          color: "var(--color-navy)",
          marginBottom: "8px",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-muted)",
          maxWidth: "320px",
          lineHeight: "1.6",
          marginBottom: action ? "24px" : "0",
        }}
      >
        {description}
      </p>
      {action}
    </div>
  );
}
