"use client";

// ============================================================
// SIGNUP PAGE
// ============================================================

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Activity, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { isValidEmail } from "@/lib/utils";
import type { SignupFormData } from "@/types";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Please enter your full name.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          setServerError(
            "An account with this email already exists. Please sign in instead."
          );
        } else if (error.message.includes("Password should be")) {
          setServerError("Password must be at least 8 characters long.");
        } else {
          setServerError("Something went wrong. Please try again.");
        }
        return;
      }

      // If email confirmation is disabled in Supabase, redirect to dashboard
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // Email confirmation required
      setSuccess(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof SignupFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Success state — email confirmation sent
  if (success) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "420px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              backgroundColor: "var(--color-success-bg)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle2 size={24} style={{ color: "var(--color-success)" }} />
          </div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "600",
              color: "var(--color-navy)",
              marginBottom: "12px",
            }}
          >
            Check your email
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "var(--color-text-muted)",
              lineHeight: "1.7",
              marginBottom: "28px",
            }}
          >
            We&apos;ve sent a verification link to{" "}
            <strong style={{ color: "var(--color-text-body)" }}>
              {formData.email}
            </strong>
            . Click the link in the email to activate your account.
          </p>
          <Link href="/login" className="btn btn-primary">
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--color-border)",
          backgroundColor: "var(--color-white)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
          aria-label="Go to homepage"
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
            }}
          >
            <Activity size={14} color="white" strokeWidth={2.5} />
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
        </Link>
      </div>

      {/* Form area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
        }}
      >
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Heading */}
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
              Create your account
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
              Already have an account?{" "}
              <Link
                href="/login"
                style={{
                  color: "var(--color-teal)",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Server error */}
          {serverError && (
            <div style={{ marginBottom: "20px" }}>
              <Toast
                type="error"
                message={serverError}
                onDismiss={() => setServerError(null)}
              />
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <Input
                label="Full name"
                id="signup-fullname"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                value={formData.fullName}
                onChange={handleChange("fullName")}
                error={errors.fullName}
                aria-required="true"
                disabled={isLoading}
              />

              <Input
                label="Email address"
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange("email")}
                error={errors.email}
                aria-required="true"
                disabled={isLoading}
              />

              <Input
                label="Password"
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={handleChange("password")}
                error={errors.password}
                hint={!errors.password ? "At least 8 characters." : undefined}
                aria-required="true"
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      color: "var(--color-text-muted)",
                      display: "flex",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <Input
                label="Confirm password"
                id="signup-confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={errors.confirmPassword}
                aria-required="true"
                disabled={isLoading}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      color: "var(--color-text-muted)",
                      display: "flex",
                    }}
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              style={{ width: "100%", marginTop: "24px" }}
            >
              {isLoading ? "Creating account…" : "Create Account"}
            </Button>
          </form>

          {/* Disclaimer */}
          <p
            style={{
              marginTop: "24px",
              fontSize: "12px",
              color: "var(--color-text-muted)",
              lineHeight: "1.6",
              textAlign: "center",
            }}
          >
            By creating an account, you acknowledge that AI Health Report
            Explainer is an educational tool and not a substitute for
            professional medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}
