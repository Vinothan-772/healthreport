"use client";

// ============================================================
// TOAST / NOTIFICATION COMPONENT
// A lightweight inline alert for success/error/info messages
// ============================================================

import { CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type: ToastType;
  message: string;
  onDismiss?: () => void;
}

const toastConfig: Record<
  ToastType,
  {
    bgColor: string;
    textColor: string;
    borderColor: string;
    Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  }
> = {
  success: {
    bgColor: "var(--color-success-bg)",
    textColor: "var(--color-success)",
    borderColor: "#86efac",
    Icon: CheckCircle2,
  },
  error: {
    bgColor: "var(--color-danger-bg)",
    textColor: "var(--color-danger)",
    borderColor: "#fca5a5",
    Icon: XCircle,
  },
  warning: {
    bgColor: "var(--color-warning-bg)",
    textColor: "var(--color-warning)",
    borderColor: "#fcd34d",
    Icon: AlertCircle,
  },
  info: {
    bgColor: "#eff6ff",
    textColor: "#1d4ed8",
    borderColor: "#bfdbfe",
    Icon: AlertCircle,
  },
};

export function Toast({ type, message, onDismiss }: ToastProps) {
  const { bgColor, textColor, borderColor, Icon } = toastConfig[type];

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        padding: "12px 14px",
        borderRadius: "var(--radius-md)",
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        fontSize: "14px",
        color: textColor,
        lineHeight: "1.5",
      }}
      className="animate-fade-in"
    >
      <Icon size={16} style={{ flexShrink: 0, marginTop: "1px" }} />
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss notification"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: textColor,
            opacity: 0.7,
            padding: "0",
            display: "flex",
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
