import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Shield, Trash2, Download } from "lucide-react";

export const metadata: Metadata = {
  title: "Settings",
};

export default async function SettingsPage() {
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
      <div style={{ maxWidth: "640px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "6px" }}>
            Settings & Privacy
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Manage your data, privacy preferences, and account settings.
          </p>
        </div>

        {/* Privacy Section */}
        <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "32px" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
            <Shield size={20} style={{ color: "var(--color-teal)" }} />
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-navy)" }}>Privacy Controls</h2>
          </div>
          <div style={{ padding: "24px" }}>
            <p style={{ fontSize: "14px", color: "var(--color-text-body)", lineHeight: 1.6, marginBottom: "16px" }}>
              Your uploaded reports are stored privately and securely. When you request an explanation, the report text is sent to Google Gemini (our AI provider) solely for processing that request. We do not use your private medical data to train public AI models.
            </p>
            <p style={{ fontSize: "14px", color: "var(--color-text-body)", lineHeight: 1.6 }}>
              You retain full control over your data. Deleting a report from the "My Reports" page permanently removes both the analysis and the original file from our secure storage.
            </p>
          </div>
        </div>

        {/* Data Management Section */}
        <div style={{ backgroundColor: "var(--color-white)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-navy)" }}>Data Management</h2>
          </div>
          
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-navy)" }}>Download My Data</h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "2px" }}>Export a copy of your report summaries and parameters.</p>
              </div>
              <button className="btn btn-secondary btn-sm" disabled>
                <Download size={14} style={{ marginRight: "6px" }} />
                Export Data
              </button>
            </div>
            
            <div style={{ padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-danger)" }}>Delete Account</h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                  Permanently delete your account and all associated data.
                </p>
              </div>
              <button className="btn btn-primary" style={{ backgroundColor: "var(--color-danger)", borderColor: "var(--color-danger)" }} disabled>
                <Trash2 size={14} style={{ marginRight: "6px" }} />
                Delete Account
              </button>
            </div>
            
            <div style={{ padding: "16px 24px", backgroundColor: "var(--color-bg)", fontSize: "13px", color: "var(--color-text-muted)" }}>
              Note: Account deletion requires administrative configuration in the Supabase backend and is currently disabled in this demo environment. To remove your data, please manually delete your individual reports from the "My Reports" page.
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
