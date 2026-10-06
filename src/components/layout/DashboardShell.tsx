"use client";

// ============================================================
// DASHBOARD SIDEBAR + SHELL LAYOUT
// ============================================================

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Menu,
  X,
  Upload,
  GitCompare,
  Settings,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";

interface NavItem {
  label: string;
  href: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", Icon: LayoutDashboard },
  { label: "My Reports", href: "/reports", Icon: FileText },
  { label: "Compare Reports", href: "/reports/compare", Icon: GitCompare },
  { label: "Profile", href: "/profile", Icon: User },
  { label: "Settings", href: "/settings", Icon: Settings },
];

interface DashboardShellProps {
  children: React.ReactNode;
  profile: Profile | null;
  userEmail: string;
}

export function DashboardShell({
  children,
  profile,
  userEmail,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const displayName = profile?.full_name || userEmail.split("@")[0] || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const SidebarContent = () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "0",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "var(--color-teal)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Activity size={14} color="white" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontWeight: "600",
              fontSize: "14px",
              color: "var(--color-navy)",
              letterSpacing: "-0.01em",
            }}
          >
            HealthExplainer
          </span>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 8px" }} aria-label="Dashboard navigation">
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map(({ label, href, Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 12px",
                  borderRadius: "var(--radius-md)",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: isActive ? "500" : "400",
                  color: isActive
                    ? "var(--color-teal)"
                    : "var(--color-text-body)",
                  backgroundColor: isActive
                    ? "var(--color-teal-light)"
                    : "transparent",
                  transition: "background-color 0.15s ease, color 0.15s ease",
                }}
                className={!isActive ? "nav-item-hover" : ""}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Upload shortcut */}
        <div style={{ padding: "12px 0 0" }}>
          <Link
            href="/reports/upload"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 12px",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              color: "var(--color-teal)",
              border: "1px solid var(--color-teal-light)",
              backgroundColor: "var(--color-teal-light)",
              transition: "all 0.15s ease",
            }}
          >
            <Upload size={15} />
            Upload Report
          </Link>
        </div>
      </nav>

      {/* User info + logout */}
      <div
        style={{
          padding: "12px 8px",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 12px",
            borderRadius: "var(--radius-md)",
            marginBottom: "4px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              backgroundColor: "var(--color-teal)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{ fontSize: "12px", fontWeight: "600", color: "white" }}
            >
              {initials}
            </span>
          </div>
          <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "500",
                color: "var(--color-navy)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {displayName}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "var(--color-text-muted)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {userEmail}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "9px 12px",
            borderRadius: "var(--radius-md)",
            fontSize: "14px",
            color: "var(--color-text-muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "background-color 0.15s ease, color 0.15s ease",
          }}
          className="nav-item-hover"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          {isLoggingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
      }}
    >
      {/* Desktop Sidebar */}
      <aside
        style={{
          width: "220px",
          flexShrink: 0,
          backgroundColor: "var(--color-white)",
          borderRight: "1px solid var(--color-border)",
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 20,
        }}
        className="desktop-sidebar"
      >
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 30,
          }}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: mobileOpen ? 0 : "-240px",
          width: "220px",
          height: "100vh",
          backgroundColor: "var(--color-white)",
          borderRight: "1px solid var(--color-border)",
          zIndex: 40,
          transition: "left 0.25s ease",
          overflowY: "auto",
        }}
        className="mobile-sidebar"
        aria-label="Mobile navigation"
      >
        <SidebarContent />
      </aside>

      {/* Main content area */}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column" }}
        className="main-content"
      >
        {/* Mobile header */}
        <header
          style={{
            backgroundColor: "var(--color-white)",
            borderBottom: "1px solid var(--color-border)",
            padding: "0 16px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
          className="mobile-header"
        >
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "var(--radius-md)",
              color: "var(--color-text-body)",
              display: "flex",
            }}
          >
            <Menu size={20} />
          </button>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: "var(--color-teal)",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Activity size={12} color="white" strokeWidth={2.5} />
            </div>
            <span
              style={{
                fontWeight: "600",
                fontSize: "13px",
                color: "var(--color-navy)",
              }}
            >
              HealthExplainer
            </span>
          </Link>
          <Link
            href="/reports/upload"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 12px",
              backgroundColor: "var(--color-teal)",
              color: "white",
              borderRadius: "var(--radius-md)",
              fontSize: "13px",
              fontWeight: "500",
              textDecoration: "none",
            }}
          >
            <Upload size={13} />
            Upload
          </Link>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: "32px 32px" }} className="page-content">
          {children}
        </main>
      </div>

      <style jsx>{`
        .desktop-sidebar {
          display: flex !important;
        }
        .mobile-sidebar {
          display: none !important;
        }
        .mobile-header {
          display: none !important;
        }
        .main-content {
          margin-left: 220px;
        }
        .page-content {
          padding: 32px !important;
        }

        .nav-item-hover:hover {
          background-color: var(--color-border-light) !important;
          color: var(--color-navy) !important;
        }

        @media (max-width: 768px) {
          .desktop-sidebar {
            display: none !important;
          }
          .mobile-sidebar {
            display: flex !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .main-content {
            margin-left: 0 !important;
          }
          .page-content {
            padding: 20px 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
