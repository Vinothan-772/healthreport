// ============================================================
// DASHBOARD PAGE — /dashboard
// Server component: fetches real user data from Supabase
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, Upload, CheckCircle2, Clock, CalendarDays } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { HealthOverview, TrendPreview } from "@/components/dashboard/DashboardWidgets";
import { getGreeting, formatDateShort } from "@/lib/utils";
import type { Report } from "@/types/database";

export const metadata: Metadata = {
  title: "Dashboard",
};

function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", fontWeight: "500" }}>
          {label}
        </p>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-md)",
            backgroundColor: accent ? "var(--color-teal-light)" : "var(--color-border-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={15} style={{ color: accent ? "var(--color-teal)" : "var(--color-text-muted)" } as React.CSSProperties} />
        </div>
      </div>
      <p
        style={{
          fontSize: "26px",
          fontWeight: "600",
          color: "var(--color-navy)",
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; badgeClass: string }> = {
    completed: { label: "Completed", badgeClass: "badge-success" },
    processing: { label: "Processing", badgeClass: "badge-warning" },
    failed: { label: "Failed", badgeClass: "badge-danger" },
    uploaded: { label: "Uploaded", badgeClass: "badge-neutral" },
  };
  const { label, badgeClass } = config[status] ?? { label: status, badgeClass: "badge-neutral" };
  return <span className={`badge ${badgeClass}`}>{label}</span>;
}

export default async function DashboardPage() {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch reports summary stats
  const { data: reports } = (await supabase
    .from("reports")
    .select("id, file_name, report_type, status, uploaded_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20)) as any;

  const allReports = (reports ?? []) as Pick<Report, "id" | "file_name" | "report_type" | "status" | "uploaded_at" | "created_at">[];

  const totalReports = allReports.length;
  const completedReports = allReports.filter((r) => r.status === "completed").length;
  const processingReports = allReports.filter((r) => r.status === "processing").length;
  const recentReports = allReports.slice(0, 5);

  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const reportsThisMonth = allReports.filter((r) => {
    const d = new Date(r.created_at);
    return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  }).length;

  // Fetch health parameters for Overview & Trends
  const { data: parameters } = (await supabase
    .from("health_parameters")
    .select("name, status, numeric_value, unit, created_at, report_id")
    .order("created_at", { ascending: true })) as any;

  let parametersReviewed = 0;
  let withinRange = 0;
  let aboveRange = 0;
  let belowRange = 0;
  const trendMap = new Map<string, { unit: string; values: number[] }>();

  if (parameters) {
    parametersReviewed = parameters.length;
    parameters.forEach((p: any) => {
      if (p.status === "normal") withinRange++;
      if (p.status === "high") aboveRange++;
      if (p.status === "low") belowRange++;

      // Build trends for numeric values with valid units
      if (p.numeric_value !== null && p.unit) {
        const key = p.name;
        if (!trendMap.has(key)) {
          trendMap.set(key, { unit: p.unit, values: [] });
        }
        trendMap.get(key)!.values.push(p.numeric_value);
      }
    });
  }

  // Filter trends to only those with >1 value, limit to top 3
  const validTrends = Array.from(trendMap.entries())
    .filter(([_, data]) => data.values.length > 1)
    .slice(0, 3)
    .map(([name, data]) => ({ name, unit: data.unit, values: data.values }));

  const greeting = getGreeting();
  const firstName = profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "there";

  return (
    <DashboardShell profile={profile} userEmail={user.email ?? ""}>
      <div style={{ maxWidth: "900px" }}>
        {/* Page header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "600",
              color: "var(--color-navy)",
              marginBottom: "6px",
              letterSpacing: "-0.02em",
            }}
          >
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Review your health reports and understand your information more clearly.
          </p>
        </div>

        {/* Stats grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "32px",
          }}
          className="stats-grid"
        >
          <StatCard label="Total Reports" value={totalReports} icon={FileText} />
          <StatCard label="Completed" value={completedReports} icon={CheckCircle2} accent />
          <StatCard label="Reports This Month" value={reportsThisMonth} icon={CalendarDays} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "24px",
            marginBottom: "32px",
          }}
          className="dashboard-columns"
        >
          {/* Health Overview & Trends */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <HealthOverview
              parametersReviewed={parametersReviewed}
              withinRange={withinRange}
              aboveRange={aboveRange}
              belowRange={belowRange}
            />
            <TrendPreview trends={validTrends} />
          </div>

          {/* Recent Reports List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {totalReports === 0 ? (
              <div
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "40px",
                  textAlign: "center",
                }}
              >
            <div
              style={{
                width: "48px",
                height: "48px",
                backgroundColor: "var(--color-teal-light)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <Upload size={22} style={{ color: "var(--color-teal)" }} />
            </div>
            <h2
              style={{
                fontSize: "17px",
                fontWeight: "600",
                color: "var(--color-navy)",
                marginBottom: "8px",
              }}
            >
              Upload your first health report
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-muted)",
                marginBottom: "20px",
                maxWidth: "360px",
                margin: "0 auto 20px",
              }}
            >
              Upload a PDF or image of a health report to receive a clear, organized explanation.
            </p>
              <Link href="/reports/upload" className="btn btn-primary">
                <Upload size={14} />
                Upload Report
              </Link>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <h2
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "var(--color-navy)",
                  }}
                >
                  Recent Reports
                </h2>
                <Link
                  href="/reports"
                  style={{
                    fontSize: "13px",
                    color: "var(--color-teal)",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  View all →
                </Link>
              </div>

              <div
                style={{
                  backgroundColor: "var(--color-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                }}
              >
                {recentReports.map((report, i) => (
                  <div
                    key={report.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      borderTop: i === 0 ? "none" : "1px solid var(--color-border)",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: "var(--color-border-light)",
                          borderRadius: "var(--radius-md)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <FileText size={15} style={{ color: "var(--color-text-muted)" }} />
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
                          }}
                        >
                          {report.file_name}
                        </p>
                        <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                          {report.report_type ?? "Health Report"} · {formatDateShort(report.created_at)}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                      <StatusBadge status={report.status} />
                      {report.status === "completed" && (
                        <Link
                          href={`/reports/${report.id}`}
                          style={{
                            fontSize: "13px",
                            color: "var(--color-teal)",
                            textDecoration: "none",
                            fontWeight: "500",
                          }}
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: "16px", textAlign: "center" }}>
                <Link href="/reports/upload" className="btn btn-secondary btn-sm">
                  <Upload size={13} />
                  Upload New Report
                </Link>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
