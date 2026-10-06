"use client";

// ============================================================
// LOGIN PAGE
// ============================================================

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Activity } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { isValidEmail } from "@/lib/utils";
import type { LoginFormData } from "@/types";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
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
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("invalid_credentials")
        ) {
          setServerError("Email or password is incorrect. Please try again.");
        } else if (error.message.includes("Email not confirmed")) {
          setServerError(
            "Please verify your email address before signing in."
          );
        } else {
          setServerError("Something went wrong. Please try again.");
        }
        return;
      }

      // Successful login — redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

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
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
          }}
        >
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
              Sign in to your account
            </h1>
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                style={{
                  color: "var(--color-teal)",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Create one
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
                label="Email address"
                id="login-email"
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
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={formData.password}
                onChange={handleChange("password")}
                error={errors.password}
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
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              style={{ width: "100%", marginTop: "24px" }}
            >
              {isLoading ? "Signing in…" : "Sign In"}
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
            By signing in, you agree that this tool provides educational
            explanations only and is not a substitute for professional medical
            advice.
          </p>
        </div>
      </div>
    </div>
  );
}
