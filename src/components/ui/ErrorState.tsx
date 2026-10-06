// ============================================================
// ERROR STATE COMPONENT
// ============================================================

import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  action?: React.ReactNode;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  action,
}: ErrorStateProps) {
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
          backgroundColor: "var(--color-danger-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <AlertCircle size={24} style={{ color: "var(--color-danger)" }} />
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
        {message}
      </p>
      {action}
    </div>
  );
}
