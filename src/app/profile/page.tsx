// ============================================================
// PROFILE PAGE — /profile
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { User, Mail, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { formatDateShort } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const supabase = (await createClient()) as any;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()) as any;

  const displayName = profile?.full_name || "Not provided";
  const initials = (profile?.full_name || user.email?.split("@")[0] || "U")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <DashboardShell profile={profile} userEmail={user.email ?? ""}>
      <div style={{ maxWidth: "640px" }}>
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
            Profile Details
          </h1>
          <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
            Manage your account information and preferences.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "var(--color-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {/* Avatar Header */}
          <div
            style={{
              padding: "32px 24px",
              borderBottom: "1px solid var(--color-border)",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                backgroundColor: "var(--color-teal-light)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid var(--color-white)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "var(--color-teal)",
                }}
              >
                {initials}
              </span>
            </div>
            <div>
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "var(--color-navy)",
                  marginBottom: "4px",
                }}
              >
                {profile?.full_name || user.email?.split("@")[0]}
              </h2>
              <span className="badge badge-success">Active Account</span>
            </div>
          </div>

          {/* Details List */}
          <div style={{ padding: "0" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "20px 24px",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <div
                style={{
                  width: "160px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--color-text-muted)",
                }}
              >
                <User size={16} />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Full Name
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-navy)",
                    fontWeight: "500",
                  }}
                >
                  {displayName}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "20px 24px",
                borderBottom: "1px solid var(--color-border-light)",
              }}
            >
              <div
                style={{
                  width: "160px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--color-text-muted)",
                }}
              >
                <Mail size={16} />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Email Address
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-navy)",
                    fontWeight: "500",
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "20px 24px",
              }}
            >
              <div
                style={{
                  width: "160px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--color-text-muted)",
                }}
              >
                <Calendar size={16} />
                <span style={{ fontSize: "14px", fontWeight: "500" }}>
                  Member Since
                </span>
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--color-navy)",
                    fontWeight: "500",
                  }}
                >
                  {formatDateShort(user.created_at)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "32px" }}>
          <div
            style={{
              padding: "16px",
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: "500", color: "var(--color-navy)" }}>
                Update Profile
              </h3>
              <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "2px" }}>
                Feature coming in Phase 3.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" disabled>
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
