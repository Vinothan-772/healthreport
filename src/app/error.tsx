"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", error);
  }, [error]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--color-bg)", padding: "20px", textAlign: "center" }}>
      <div style={{ backgroundColor: "var(--color-white)", padding: "40px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "400px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--color-danger-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertTriangle size={32} style={{ color: "var(--color-danger)" }} />
          </div>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "8px" }}>Something went wrong</h1>
        <p style={{ fontSize: "15px", color: "var(--color-text-body)", marginBottom: "32px", lineHeight: 1.5 }}>
          An unexpected error occurred while processing your request. Please try again.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button onClick={() => reset()} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
            Try Again
          </button>
          <Link href="/dashboard" className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
