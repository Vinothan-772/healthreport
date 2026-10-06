// ============================================================
// UPLOAD PAGE — /reports/upload
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { UploadReport } from "@/components/reports/UploadReport";

export const metadata: Metadata = {
  title: "Upload Report",
};

export default async function UploadPage() {
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
      <UploadReport userId={user.id} />
    </DashboardShell>
  );
}
