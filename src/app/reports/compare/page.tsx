// ============================================================
// COMPARE REPORTS PAGE
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { formatDateShort } from "@/lib/utils";
import { ComparisonView } from "@/components/reports/ComparisonView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Compare Reports",
};

export default async function CompareReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch all completed reports for selection
  const { data: reports } = (await supabase
    .from("reports")
    .select("id, file_name, report_type, created_at")
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("created_at", { ascending: false })) as any;

  const resolvedParams = await searchParams;
  const reportAId = resolvedParams.a;
  const reportBId = resolvedParams.b;

  let reportA, reportB;
  let paramsA = [], paramsB = [];

  if (reportAId && reportBId) {
    const [{ data: aData }, { data: bData }] = (await Promise.all([
      supabase.from("reports").select("*").eq("id", reportAId).eq("user_id", user.id).single(),
      supabase.from("reports").select("*").eq("id", reportBId).eq("user_id", user.id).single(),
    ])) as any;
    
    reportA = aData;
    reportB = bData;

    if (reportA && reportB) {
      // Sort so A is earlier, B is later for logical flow
      const dateA = new Date(reportA.created_at).getTime();
      const dateB = new Date(reportB.created_at).getTime();
      
      if (dateA > dateB) {
        // Swap if needed
        const temp = reportA; reportA = reportB; reportB = temp;
      }

      const [{ data: pA }, { data: pB }] = (await Promise.all([
        supabase.from("health_parameters").select("name, numeric_value, unit").eq("report_id", reportA.id),
        supabase.from("health_parameters").select("name, numeric_value, unit").eq("report_id", reportB.id),
      ])) as any;

      paramsA = pA || [];
      paramsB = pB || [];
    }
  }

  return (
    <DashboardShell profile={profile} userEmail={user.email ?? ""}>
      <div style={{ maxWidth: "900px" }}>
        <div style={{ marginBottom: "24px" }}>
          <Link
            href="/reports"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              color: "var(--color-text-muted)",
              textDecoration: "none",
            }}
            className="hover:text-[var(--color-navy)]"
          >
            <ArrowLeft size={16} />
            Back to My Reports
          </Link>
        </div>

        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "6px" }}>
            Compare Reports
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Select two completed reports to compare numeric parameters.
          </p>
        </div>

        {/* Selection UI */}
        <div style={{ backgroundColor: "var(--color-white)", padding: "24px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", marginBottom: "32px" }}>
          <form method="get" style={{ display: "flex", gap: "16px", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--color-navy)", marginBottom: "8px" }}>
                Select First Report
              </label>
              <select name="a" defaultValue={reportAId || ""} style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }} required>
                <option value="" disabled>Choose a report...</option>
                {reports?.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.file_name} ({formatDateShort(r.created_at)})</option>
                ))}
              </select>
            </div>
            
            <div style={{ flex: 1, minWidth: "200px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "500", color: "var(--color-navy)", marginBottom: "8px" }}>
                Select Second Report
              </label>
              <select name="b" defaultValue={reportBId || ""} style={{ width: "100%", padding: "10px", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }} required>
                <option value="" disabled>Choose a report...</option>
                {reports?.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.file_name} ({formatDateShort(r.created_at)})</option>
                ))}
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" style={{ height: "42px" }}>
              Compare
            </button>
          </form>
        </div>

        {/* Results */}
        {reportA && reportB && (
          <ComparisonView 
            earlierParams={paramsA} 
            laterParams={paramsB} 
            earlierDate={formatDateShort(reportA.created_at)}
            laterDate={formatDateShort(reportB.created_at)}
          />
        )}
      </div>
    </DashboardShell>
  );
}
