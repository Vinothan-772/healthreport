// ============================================================
// LOADING SPINNER COMPONENT
// ============================================================

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({
  size = "md",
  message,
  fullPage = false,
}: LoadingSpinnerProps) {
  const dimensions = { sm: 16, md: 24, lg: 36 }[size];

  const spinner = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
      role="status"
      aria-label={message || "Loading"}
    >
      <svg
        className="spinner"
        width={dimensions}
        height={dimensions}
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--color-teal)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      {message && (
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          {message}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {spinner}
      </div>
    );
  }

  return spinner;
}
