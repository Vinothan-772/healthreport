// ============================================================
// REPORTS PAGE — /reports
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { ReportsList } from "@/components/reports/ReportsList";

export const metadata: Metadata = {
  title: "My Reports",
};

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <DashboardShell profile={profile} userEmail={user.email ?? ""}>
      <ReportsList />
    </DashboardShell>
  );
}
