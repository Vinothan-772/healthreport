import Link from "next/link";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "var(--color-bg)", padding: "20px", textAlign: "center" }}>
      <div style={{ backgroundColor: "var(--color-white)", padding: "40px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", maxWidth: "400px", width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "var(--color-warning-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AlertCircle size={32} style={{ color: "var(--color-warning)" }} />
          </div>
        </div>
        <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "8px" }}>Page Not Found</h1>
        <p style={{ fontSize: "15px", color: "var(--color-text-body)", marginBottom: "32px", lineHeight: 1.5 }}>
          We couldn&apos;t find the page you were looking for. It might have been moved or deleted.
        </p>
        <Link href="/" className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          Return Home
        </Link>
      </div>
    </div>
  );
}
