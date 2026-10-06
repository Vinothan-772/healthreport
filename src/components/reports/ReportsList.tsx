"use client";

// ============================================================
// MY REPORTS PAGE — /reports
// Real data from Supabase with search + status filter
// ============================================================

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Search,
  Upload,
  RefreshCw,
  ChevronRight,
  Filter,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Toast } from "@/components/ui/Toast";
import { formatDateShort } from "@/lib/utils";
import type { Report } from "@/types/database";

type FilterStatus = "all" | "uploaded" | "processing" | "completed" | "failed";

const STATUS_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "completed", label: "Completed" },
  { value: "processing", label: "Processing" },
  { value: "uploaded", label: "Uploaded" },
  { value: "failed", label: "Failed" },
];

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string }> = {
  completed: { label: "Completed", badgeClass: "badge-success" },
  processing: { label: "Processing", badgeClass: "badge-warning" },
  failed: { label: "Failed", badgeClass: "badge-danger" },
  uploaded: { label: "Uploaded", badgeClass: "badge-neutral" },
};

export function ReportsList() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  
  // Deletion state
  const [reportToDelete, setReportToDelete] = useState<Report | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadReports = useCallback(async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });
      setReports((data as Report[]) ?? []);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleRetry = async (report: Report) => {
    setRetryingId(report.id);
    try {
      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.id }),
      });

      if (response.ok) {
        setToastMessage({ type: "success", message: "Re-analysis started successfully." });
        // Refresh reports
        await loadReports();
        const { id } = await response.json();
        // Poll for completion or navigate
        router.push(`/reports/${report.id}`);
      } else {
        const data = await response.json().catch(() => ({}));
        setToastMessage({
          type: "error",
          message: data.error ?? "Could not retry analysis. Please try again.",
        });
        await loadReports();
      }
    } catch {
      setToastMessage({ type: "error", message: "Something went wrong. Please try again." });
    } finally {
      setRetryingId(null);
    }
  };

  // Client-side filter
  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      r.file_name.toLowerCase().includes(query) ||
      (r.report_type ?? "").toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const handleDeleteConfirm = async () => {
    if (!reportToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/reports/${reportToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setToastMessage({ type: "success", message: "Report deleted successfully." });
        await loadReports();
      } else {
        const data = await res.json().catch(() => ({}));
        setToastMessage({ type: "error", message: data.error || "Failed to delete report." });
      }
    } catch {
      setToastMessage({ type: "error", message: "An unexpected error occurred." });
    } finally {
      setIsDeleting(false);
      setReportToDelete(null);
    }
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "28px",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "var(--color-navy)",
              marginBottom: "4px",
              letterSpacing: "-0.02em",
            }}
          >
            My Reports
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            {reports.length} report{reports.length !== 1 ? "s" : ""} uploaded
          </p>
        </div>
        <Link href="/reports/upload" className="btn btn-primary btn-sm">
          <Upload size={14} />
          Upload Report
        </Link>
      </div>

      {toastMessage && (
        <div style={{ marginBottom: "16px" }}>
          <Toast
            type={toastMessage.type}
            message={toastMessage.message}
            onDismiss={() => setToastMessage(null)}
          />
        </div>
      )}

      {/* Search + filter */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            position: "relative",
            flex: 1,
            minWidth: "200px",
          }}
        >
          <Search
            size={15}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search by file name or report type…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "36px" }}
            aria-label="Search reports"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          <Filter size={13} style={{ color: "var(--color-text-muted)", marginRight: "6px" }} />
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              style={{
                padding: "6px 12px",
                fontSize: "13px",
                borderRadius: "var(--radius-md)",
                border: "1px solid transparent",
                cursor: "pointer",
                fontFamily: "inherit",
                fontWeight: statusFilter === opt.value ? "500" : "400",
                backgroundColor:
                  statusFilter === opt.value
                    ? "var(--color-navy)"
                    : "var(--color-white)",
                color:
                  statusFilter === opt.value
                    ? "white"
                    : "var(--color-text-muted)",
                borderColor:
                  statusFilter === opt.value
                    ? "var(--color-navy)"
                    : "var(--color-border)",
                transition: "all 0.15s ease",
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports list */}
      {isLoading ? (
        <LoadingSpinner message="Loading reports…" fullPage />
      ) : filteredReports.length === 0 ? (
        <div
          style={{
            backgroundColor: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
          }}
        >
          <EmptyState
            icon={FileText}
            title={searchQuery || statusFilter !== "all" ? "No matching reports" : "No reports yet"}
            description={
              searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter."
                : "Upload your first health report to see it here."
            }
            action={
              !searchQuery && statusFilter === "all" ? (
                <Link href="/reports/upload" className="btn btn-primary btn-sm">
                  <Upload size={13} />
                  Upload Report
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div
          style={{
            backgroundColor: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {filteredReports.map((report, i) => {
            const statusConf = STATUS_CONFIG[report.status] ?? {
              label: report.status,
              badgeClass: "badge-neutral",
            };
            const isRetrying = retryingId === report.id;

            return (
              <div
                key={report.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
                  gap: "16px",
                }}
                className="report-row"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    flex: 1,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      backgroundColor: "var(--color-border-light)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={16} style={{ color: "var(--color-text-muted)" }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "500",
                        color: "var(--color-navy)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        marginBottom: "2px",
                      }}
                    >
                      {report.file_name}
                    </p>
                    <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                      {report.report_type ?? "Health Report"} · Uploaded{" "}
                      {formatDateShort(report.created_at)}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    flexShrink: 0,
                  }}
                >
                  <span className={`badge ${statusConf.badgeClass}`}>
                    {statusConf.label}
                  </span>

                  {report.status === "completed" && (
                    <Link
                      href={`/reports/${report.id}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "13px",
                        color: "var(--color-teal)",
                        textDecoration: "none",
                        fontWeight: "500",
                      }}
                      aria-label={`View report ${report.file_name}`}
                    >
                      View
                      <ChevronRight size={14} />
                    </Link>
                  )}

                  {report.status === "failed" && (
                    <button
                      onClick={() => handleRetry(report)}
                      disabled={isRetrying}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                        fontSize: "13px",
                        color: "var(--color-teal)",
                        background: "none",
                        border: "1px solid var(--color-teal-accent)",
                        borderRadius: "var(--radius-md)",
                        padding: "5px 10px",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontWeight: "500",
                      }}
                      aria-label={`Retry analysis for ${report.file_name}`}
                    >
                      <RefreshCw size={12} className={isRetrying ? "spinner" : ""} />
                      {isRetrying ? "Retrying…" : "Retry"}
                    </button>
                  )}

                  <button
                    onClick={() => setReportToDelete(report)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--color-text-muted)",
                      cursor: "pointer",
                      padding: "6px",
                      borderRadius: "var(--radius-sm)",
                    }}
                    className="hover:text-red-600 hover:bg-red-50"
                    aria-label={`Delete report ${report.file_name}`}
                  >
                    <Trash2 size={15} />
                  </button>

                  {report.status === "processing" && (
                    <span
                      style={{
                        fontSize: "12px",
                        color: "var(--color-text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <svg
                        className="spinner"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Analyzing
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reportToDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "var(--color-white)",
              borderRadius: "var(--radius-lg)",
              padding: "24px",
              maxWidth: "400px",
              width: "100%",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <AlertTriangle size={20} style={{ color: "var(--color-danger)" }} />
              <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--color-navy)" }}>
                Delete this report?
              </h3>
            </div>
            <p style={{ fontSize: "14px", color: "var(--color-text-body)", marginBottom: "24px", lineHeight: 1.5 }}>
              This will permanently remove <strong>{reportToDelete.file_name}</strong> and its analysis from your account. This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
              <button
                onClick={() => setReportToDelete(null)}
                className="btn btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn btn-primary"
                style={{ backgroundColor: "var(--color-danger)", borderColor: "var(--color-danger)" }}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .report-row:hover {
          background-color: var(--color-bg);
        }
      `}</style>
    </div>
  );
}
