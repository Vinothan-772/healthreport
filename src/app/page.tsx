// ============================================================
// LANDING PAGE — AI Health Report Explainer
// ============================================================

import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/navigation/LandingNav";
import {
  CheckCircle2,
  Upload,
  BookOpen,
  ClipboardList,
  ShieldCheck,
  History,
  LayoutDashboard,
  FileText,
  AlignLeft,
  ArrowRight,
  Activity,
} from "lucide-react";

export const metadata: Metadata = {
  title: "AI Health Report Explainer — Understand Your Health Reports",
  description:
    "Turn complex medical report terminology into clear, simple explanations. AI Health Report Explainer helps you understand your health reports better.",
};

// ============================================================
// SAMPLE REPORT CARD (Demo visual)
// ============================================================
function SampleReportCard() {
  return (
    <div
      aria-label="Sample health report preview — demo data only"
      style={{
        backgroundColor: "var(--color-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-xl)",
        padding: "24px",
        boxShadow: "var(--shadow-md)",
        maxWidth: "320px",
        width: "100%",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: "500",
              color: "var(--color-text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              marginBottom: "2px",
            }}
          >
            Sample Report
          </div>
          <div
            style={{ fontSize: "14px", fontWeight: "600", color: "var(--color-navy)" }}
          >
            Blood Test Results
          </div>
        </div>
        <span className="badge badge-teal">Demo</span>
      </div>

      {/* Parameters */}
      {[
        {
          label: "Hemoglobin",
          value: "13.8 g/dL",
          ref: "12 – 16 g/dL",
          status: "Normal",
          statusClass: "badge-success",
        },
        {
          label: "White Blood Cells",
          value: "8.2 K/μL",
          ref: "4.5 – 11 K/μL",
          status: "Normal",
          statusClass: "badge-success",
        },
        {
          label: "Blood Glucose",
          value: "112 mg/dL",
          ref: "70 – 100 mg/dL",
          status: "Elevated",
          statusClass: "badge-warning",
        },
      ].map((item) => (
        <div
          key={item.label}
          style={{
            padding: "12px 0",
            borderTop: "1px solid var(--color-border-light)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "8px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "var(--color-navy)",
                  marginBottom: "2px",
                }}
              >
                {item.label}
              </div>
              <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                Ref: {item.ref}
              </div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "var(--color-navy)",
                  marginBottom: "4px",
                }}
              >
                {item.value}
              </div>
              <span className={`badge ${item.statusClass}`}>{item.status}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Footer note */}
      <div
        style={{
          marginTop: "16px",
          padding: "10px 12px",
          backgroundColor: "var(--color-border-light)",
          borderRadius: "var(--radius-md)",
          fontSize: "12px",
          color: "var(--color-text-muted)",
          lineHeight: "1.5",
        }}
      >
        This is sample data for demonstration purposes only.
      </div>
    </div>
  );
}

// ============================================================
// HERO SECTION
// ============================================================
function HeroSection() {
  return (
    <section
      id="home"
      style={{
        padding: "80px 0 72px",
        backgroundColor: "var(--color-white)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container-content">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "center",
          }}
          className="hero-grid"
        >
          {/* Left: copy */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-md)",
                fontSize: "12px",
                fontWeight: "500",
                color: "var(--color-teal)",
                backgroundColor: "var(--color-teal-light)",
                marginBottom: "28px",
              }}
            >
              <Activity size={12} />
              Phase 1 — Health Report Understanding Tool
            </div>

            <h1 className="text-display" style={{ marginBottom: "20px" }}>
              Understand Your Health Report,{" "}
              <span style={{ color: "var(--color-teal)" }}>Clearly.</span>
            </h1>

            <p
              style={{
                fontSize: "17px",
                lineHeight: "1.7",
                color: "var(--color-text-muted)",
                marginBottom: "36px",
                maxWidth: "480px",
              }}
            >
              Medical reports contain complex terminology and reference ranges
              that can be difficult to interpret. AI Health Report Explainer
              organizes your report data into simple, clear language you can
              actually understand.
            </p>

            <div
              style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
            >
              <Link href="/signup" className="btn btn-primary btn-lg">
                Get Started
                <ArrowRight size={16} />
              </Link>
              <a href="#how-it-works" className="btn btn-secondary btn-lg">
                How It Works
              </a>
            </div>

            <p
              style={{
                marginTop: "24px",
                fontSize: "13px",
                color: "var(--color-text-muted)",
              }}
            >
              Free to get started. No credit card required.
            </p>
          </div>

          {/* Right: demo card */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            className="hero-visual"
          >
            <SampleReportCard />
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// TRUST STRIP
// ============================================================
function TrustStrip() {
  const items = [
    { text: "Easy to understand" },
    { text: "Secure report handling" },
    { text: "Clear explanations" },
    { text: "Designed with privacy in mind" },
    { text: "No medical claims" },
  ];

  return (
    <section
      style={{
        padding: "20px 0",
        backgroundColor: "var(--color-border-light)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container-content">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0",
            overflowX: "auto",
            justifyContent: "center",
            flexWrap: "wrap",
            rowGap: "8px",
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2
                  size={14}
                  style={{ color: "var(--color-teal)", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--color-text-body)",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.text}
                </span>
              </div>
              {index < items.length - 1 && (
                <span
                  style={{
                    color: "var(--color-border)",
                    margin: "0 12px",
                    fontSize: "16px",
                  }}
                >
                  ·
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// HOW IT WORKS SECTION
// ============================================================
function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Upload",
      description:
        "Upload your health report file securely. Your data is stored privately and is only accessible to you.",
      Icon: Upload,
    },
    {
      number: "02",
      title: "Understand",
      description:
        "Key report values are organized and explained. Reference ranges, terminology, and findings are presented clearly.",
      Icon: BookOpen,
    },
    {
      number: "03",
      title: "Review",
      description:
        "Read a straightforward summary of your report. Revisit previous reports at any time from your dashboard.",
      Icon: ClipboardList,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="section-spacing"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container-content">
        {/* Section header */}
        <div style={{ marginBottom: "56px", maxWidth: "520px" }}>
          <p className="text-label" style={{ marginBottom: "8px" }}>
            How It Works
          </p>
          <h2 className="text-h1" style={{ marginBottom: "16px" }}>
            Three simple steps
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--color-text-muted)",
              lineHeight: "1.7",
            }}
          >
            Designed to be intuitive for anyone — no medical background or
            technical expertise required.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            backgroundColor: "var(--color-border)",
          }}
          className="steps-grid"
        >
          {steps.map((step, index) => (
            <div
              key={step.number}
              style={{
                backgroundColor: "var(--color-white)",
                padding: "36px 32px",
                position: "relative",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  fontWeight: "700",
                  color: "var(--color-border)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  marginBottom: "20px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {step.number}
              </div>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "var(--color-teal-light)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <step.Icon size={18} style={{ color: "var(--color-teal)" }} />
              </div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: "600",
                  color: "var(--color-navy)",
                  marginBottom: "10px",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-text-muted)",
                  lineHeight: "1.65",
                }}
              >
                {step.description}
              </p>
              {index < steps.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    right: "-1px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 1,
                  }}
                  className="step-arrow-indicator"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FEATURES SECTION
// ============================================================
function FeaturesSection() {
  const features = [
    {
      Icon: AlignLeft,
      title: "Simple Explanations",
      description:
        "Medical jargon and complex terminology are translated into plain language that anyone can understand.",
    },
    {
      Icon: ClipboardList,
      title: "Organized Report Values",
      description:
        "Your health parameters are structured clearly, with reference ranges and status indicators displayed consistently.",
    },
    {
      Icon: History,
      title: "Report History",
      description:
        "Access all your previously uploaded reports from a single dashboard. Track your submissions over time.",
    },
    {
      Icon: ShieldCheck,
      title: "Secure Account",
      description:
        "Your account is protected with secure authentication. Medical report files are stored privately and not shared.",
    },
    {
      Icon: LayoutDashboard,
      title: "Responsive Dashboard",
      description:
        "Access your reports from any device — desktop, tablet, or mobile — with a consistent, professional experience.",
    },
    {
      Icon: FileText,
      title: "Easy-to-Read Summaries",
      description:
        "Each report generates a structured, readable summary so you can understand the key information at a glance.",
    },
  ];

  return (
    <section
      id="features"
      className="section-spacing"
      style={{
        backgroundColor: "var(--color-white)",
        borderTop: "1px solid var(--color-border)",
        borderBottom: "1px solid var(--color-border)",
      }}
    >
      <div className="container-content">
        <div style={{ marginBottom: "56px", maxWidth: "520px" }}>
          <p className="text-label" style={{ marginBottom: "8px" }}>
            Features
          </p>
          <h2 className="text-h1" style={{ marginBottom: "16px" }}>
            Built for clarity and privacy
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--color-text-muted)",
              lineHeight: "1.7",
            }}
          >
            Every feature is designed to make understanding your health
            information easier, while keeping your data secure and private.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-xl)",
            overflow: "hidden",
            backgroundColor: "var(--color-border)",
          }}
          className="features-grid"
        >
          {features.map((feature) => (
            <div
              key={feature.title}
              style={{
                backgroundColor: "var(--color-white)",
                padding: "28px 24px",
                transition: "background-color 0.15s ease",
              }}
              className="feature-item"
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  backgroundColor: "var(--color-bg)",
                  borderRadius: "var(--radius-md)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "14px",
                  border: "1px solid var(--color-border)",
                }}
              >
                <feature.Icon
                  size={16}
                  style={{ color: "var(--color-teal)" }}
                />
              </div>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "var(--color-navy)",
                  marginBottom: "8px",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--color-text-muted)",
                  lineHeight: "1.65",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SAFETY / DISCLAIMER SECTION
// ============================================================
function SafetySection() {
  return (
    <section
      id="about"
      style={{
        padding: "64px 0",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div className="container-content">
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "var(--color-teal-light)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <ShieldCheck size={20} style={{ color: "var(--color-teal)" }} />
          </div>

          <h2 className="text-h2" style={{ marginBottom: "16px" }}>
            An educational tool, not a medical service
          </h2>

          <p
            style={{
              fontSize: "16px",
              color: "var(--color-text-muted)",
              lineHeight: "1.75",
              marginBottom: "24px",
            }}
          >
            AI Health Report Explainer is designed to help you understand
            information contained in your health reports. It explains terminology,
            organizes values, and presents findings in simpler language.
          </p>

          <div
            style={{
              padding: "20px 24px",
              backgroundColor: "var(--color-white)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              fontSize: "14px",
              color: "var(--color-text-body)",
              lineHeight: "1.7",
              textAlign: "left",
            }}
          >
            <strong style={{ color: "var(--color-navy)" }}>
              Important notice:
            </strong>{" "}
            This tool provides educational explanations of information found in
            health reports. It is not a substitute for professional medical
            advice, diagnosis, or treatment. Always consult a qualified healthcare
            professional for medical guidance specific to your situation.
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FINAL CTA SECTION
// ============================================================
function FinalCTASection() {
  return (
    <section
      style={{
        padding: "80px 0",
        backgroundColor: "var(--color-navy)",
      }}
    >
      <div className="container-content" style={{ textAlign: "center" }}>
        <h2
          style={{
            fontSize: "clamp(24px, 3vw, 34px)",
            fontWeight: "600",
            color: "var(--color-white)",
            marginBottom: "16px",
            letterSpacing: "-0.02em",
          }}
        >
          Make your health information easier to understand.
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#94a3b8",
            marginBottom: "36px",
            maxWidth: "480px",
            margin: "0 auto 36px",
            lineHeight: "1.7",
          }}
        >
          Create your account today and take the first step toward understanding
          your health reports more clearly.
        </p>
        <Link
          href="/signup"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 28px",
            backgroundColor: "var(--color-teal-accent)",
            color: "var(--color-white)",
            borderRadius: "var(--radius-md)",
            fontSize: "15px",
            fontWeight: "500",
            textDecoration: "none",
            transition: "background-color 0.15s ease",
            border: "none",
          }}
          className="cta-link"
        >
          Create Your Account
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--color-white)",
        borderTop: "1px solid var(--color-border)",
        padding: "40px 0",
      }}
    >
      <div className="container-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "40px",
            flexWrap: "wrap",
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  backgroundColor: "var(--color-teal)",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Activity size={13} color="white" strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "14px",
                  color: "var(--color-navy)",
                }}
              >
                HealthExplainer
              </span>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--color-text-muted)",
                maxWidth: "240px",
                lineHeight: "1.6",
              }}
            >
              Helping you understand your health reports, clearly.
            </p>
          </div>

          {/* Links */}
          <div
            style={{
              display: "flex",
              gap: "48px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p
                className="text-label"
                style={{ marginBottom: "12px", fontSize: "11px" }}
              >
                Product
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Home", href: "/" },
                  { label: "Features", href: "#features" },
                  { label: "How It Works", href: "#how-it-works" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p
                className="text-label"
                style={{ marginBottom: "12px", fontSize: "11px" }}
              >
                Legal
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { label: "Privacy", href: "/privacy" },
                  { label: "Terms", href: "/terms" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    style={{
                      fontSize: "13px",
                      color: "var(--color-text-muted)",
                      textDecoration: "none",
                      transition: "color 0.15s ease",
                    }}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid var(--color-border)",
            margin: "32px 0 24px",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            © {new Date().getFullYear()} AI Health Report Explainer. All rights
            reserved.
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            Educational tool only. Not medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ============================================================
// PAGE EXPORT
// ============================================================
export default function LandingPage() {
  return (
    <>
      <LandingNav />
      <main>
        <HeroSection />
        <TrustStrip />
        <HowItWorksSection />
        <FeaturesSection />
        <SafetySection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
