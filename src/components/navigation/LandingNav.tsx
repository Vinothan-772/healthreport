"use client";

// ============================================================
// LANDING PAGE NAVIGATION
// ============================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Activity } from "lucide-react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "About", href: "#about" },
];

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: scrolled ? "rgba(255,255,255,0.97)" : "var(--color-white)",
        borderBottom: "1px solid var(--color-border)",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: scrolled ? "var(--shadow-sm)" : "none",
      }}
      aria-label="Main navigation"
    >
      <div
        className="container-content"
        style={{
          display: "flex",
          alignItems: "center",
          height: "60px",
          gap: "32px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
            flexShrink: 0,
          }}
          aria-label="AI Health Report Explainer - Home"
        >
          <div
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "var(--color-teal)",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Activity size={16} color="white" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontWeight: "600",
              fontSize: "15px",
              color: "var(--color-navy)",
              letterSpacing: "-0.01em",
            }}
          >
            HealthExplainer
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flex: 1,
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              style={{
                fontSize: "14px",
                color: "var(--color-text-muted)",
                textDecoration: "none",
                padding: "6px 12px",
                borderRadius: "var(--radius-md)",
                transition: "color 0.15s ease, background-color 0.15s ease",
              }}
              className="nav-link"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}
          className="desktop-nav"
        >
          <Link
            href="/login"
            className="btn btn-ghost btn-sm"
            style={{ color: "var(--color-text-body)" }}
          >
            Sign In
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text-body)",
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            borderTop: "1px solid var(--color-border)",
            backgroundColor: "var(--color-white)",
            padding: "12px 16px 20px",
          }}
          className="mobile-menu"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "15px",
                  color: "var(--color-text-body)",
                  textDecoration: "none",
                  padding: "10px 12px",
                  borderRadius: "var(--radius-md)",
                  transition: "background-color 0.15s ease",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
          <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "12px 0" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link
              href="/login"
              className="btn btn-secondary"
              onClick={() => setMobileOpen(false)}
              style={{ justifyContent: "center" }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary"
              onClick={() => setMobileOpen(false)}
              style={{ justifyContent: "center" }}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-menu-btn {
          display: none;
        }
        .mobile-menu {
          display: none;
        }
        .nav-link:hover {
          color: var(--color-navy) !important;
          background-color: var(--color-border-light);
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
          .mobile-menu {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
