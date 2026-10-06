import { DashboardShell } from "@/components/layout/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PrivacyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If we want this public, we can just render a public layout instead of DashboardShell.
  // The requirements list /privacy and /terms under Public pages.
  // I will make them simple public pages.
  
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--color-bg)", padding: "40px 20px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", backgroundColor: "var(--color-white)", padding: "40px", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}>
        <h1 style={{ fontSize: "32px", fontWeight: "700", color: "var(--color-navy)", marginBottom: "24px" }}>Privacy Information</h1>
        
        <div style={{ color: "var(--color-text-body)", lineHeight: 1.6, fontSize: "15px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "12px" }}>Account Information</h2>
            <p>We store your email address and basic profile information to authenticate your account and securely associate your health reports with you.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "12px" }}>Uploaded Report Storage</h2>
            <p>When you upload a health report, the original file is stored in a private storage bucket. These files are accessible only to you through securely generated short-lived URLs. We do not make your files public.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "12px" }}>AI Processing</h2>
            <p>To provide explanations of your health reports, the text and image content of your uploaded reports are sent securely to Google Gemini (a third-party AI service) for processing. We do not use the AI feature to provide medical diagnoses.</p>
          </section>

          <section>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--color-navy)", marginBottom: "12px" }}>User-Controlled Deletion</h2>
            <p>You have full control over your data. You can delete any uploaded report from your dashboard at any time. Doing so will permanently remove the original file, the extracted parameters, and the AI analysis from our database.</p>
          </section>
          
          <section style={{ padding: "16px", backgroundColor: "var(--color-warning-bg)", borderRadius: "var(--radius-md)", borderLeft: "4px solid var(--color-warning)" }}>
            <p style={{ color: "#92400e", fontWeight: "500", margin: 0 }}>
              <strong>Important:</strong> Please avoid uploading sensitive personal or medical information that you are not comfortable being processed by our secure AI pipeline.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
