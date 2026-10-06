"use client";

// ============================================================
// UPLOAD REPORT PAGE COMPONENT
// Full upload → analyze → redirect workflow
// ============================================================

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Upload, FileSearch, Database, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { UploadDropzone } from "./UploadDropzone";
import { Button } from "@/components/ui/Button";
import { Toast } from "@/components/ui/Toast";

type UploadStep = "select" | "uploading" | "processing" | "done" | "error";

const PROCESSING_STEPS = [
  { id: 1, label: "Uploading securely", icon: Upload },
  { id: 2, label: "Reading report", icon: FileSearch },
  { id: 3, label: "Organizing results", icon: Database },
  { id: 4, label: "Preparing explanation", icon: Sparkles },
];

function generateSafeFileName(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase() ?? "pdf";
  const allowedExts = ["pdf", "jpg", "jpeg", "png"];
  const safeExt = allowedExts.includes(ext) ? ext : "pdf";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}.${safeExt}`;
}

export function UploadReport({ userId }: { userId: string }) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [step, setStep] = useState<UploadStep>("select");
  const [activeProcessingStep, setActiveProcessingStep] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelected = useCallback((file: File) => {
    setSelectedFile(file);
    setError(null);
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile || !consentGiven) return;

    setError(null);
    setStep("uploading");
    setActiveProcessingStep(1);

    try {
      const supabase = createClient() as any;

      // ── Step 1: Upload to Supabase Storage ────────────────
      const safeFileName = generateSafeFileName(selectedFile.name);
      const storagePath = `${userId}/${safeFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("medical-reports")
        .upload(storagePath, selectedFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: selectedFile.type,
        });

      if (uploadError) {
        throw new Error("Failed to upload file. Please try again.");
      }

      // ── Step 2: Create report record ───────────────────────
      setActiveProcessingStep(2);
      const { data: reportRow, error: dbError } = (await supabase
        .from("reports")
        .insert({
          user_id: userId,
          file_name: selectedFile.name,
          file_path: storagePath,
          status: "uploaded",
          uploaded_at: new Date().toISOString(),
        })
        .select("id")
        .single()) as any;

      if (dbError || !reportRow) {
        // Clean up storage if DB insert fails
        await supabase.storage.from("medical-reports").remove([storagePath]);
        throw new Error("Failed to create report record. Please try again.");
      }

      const reportId = reportRow.id;

      // ── Step 3: Start AI analysis ──────────────────────────
      setStep("processing");
      setActiveProcessingStep(3);

      const response = await fetch("/api/analyze-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });

      setActiveProcessingStep(4);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        // Report is now in "failed" state — navigate to reports page
        setError(
          data.error ?? "We couldn't analyze this report. You can retry from My Reports."
        );
        setStep("error");
        setTimeout(() => router.push("/reports"), 3000);
        return;
      }

      // ── Step 4: Success ─────────────────────────────────────
      setStep("done");
      setTimeout(() => router.push(`/reports/${reportId}`), 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setStep("error");
    }
  };

  // ── Processing / Success screen ─────────────────────────────
  if (step === "uploading" || step === "processing" || step === "done") {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 24px",
          maxWidth: "420px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: step === "done" ? "var(--color-success-bg)" : "var(--color-teal-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            {step === "done" ? (
              <CheckCircle2 size={26} style={{ color: "var(--color-success)" }} />
            ) : (
              <svg
                className="spinner"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-teal)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
            )}
          </div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: "600",
              color: "var(--color-navy)",
              marginBottom: "6px",
            }}
          >
            {step === "done" ? "Analysis Complete" : "Analyzing your report"}
          </h2>
          {step !== "done" && (
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
              This typically takes 15–30 seconds. Please don&apos;t close this page.
            </p>
          )}
          {step === "done" && (
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
              Redirecting to your results…
            </p>
          )}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            textAlign: "left",
          }}
        >
          {PROCESSING_STEPS.map((s) => {
            const isDone = s.id < activeProcessingStep || step === "done";
            const isActive = s.id === activeProcessingStep && step !== "done";
            return (
              <div
                key={s.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: isDone
                    ? "var(--color-success-bg)"
                    : isActive
                    ? "var(--color-teal-light)"
                    : "var(--color-border-light)",
                  border: `1px solid ${isDone ? "#86efac" : isActive ? "var(--color-teal-accent)" : "var(--color-border)"}`,
                  transition: "all 0.3s ease",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isDone
                      ? "var(--color-success)"
                      : isActive
                      ? "var(--color-teal)"
                      : "var(--color-border)",
                    flexShrink: 0,
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} color="white" />
                  ) : (
                    <s.icon size={13} color={isActive ? "white" : "var(--color-text-muted)"} />
                  )}
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: isDone || isActive ? "500" : "400",
                    color: isDone
                      ? "var(--color-success)"
                      : isActive
                      ? "var(--color-teal)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Error screen ──────────────────────────────────────────
  if (step === "error") {
    return (
      <div style={{ maxWidth: "480px", margin: "0 auto" }}>
        {error && (
          <Toast
            type="error"
            message={error}
            onDismiss={() => {
              setError(null);
              setStep("select");
              setSelectedFile(null);
              setConsentGiven(false);
            }}
          />
        )}
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginTop: "12px", textAlign: "center" }}>
          Redirecting to My Reports…
        </p>
      </div>
    );
  }

  // ── Select / confirm screen ───────────────────────────────
  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ marginBottom: "28px" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "600",
            color: "var(--color-navy)",
            marginBottom: "6px",
            letterSpacing: "-0.02em",
          }}
        >
          Upload Health Report
        </h1>
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          Upload a PDF or clear image of your health report for an AI-powered plain-language explanation.
        </p>
      </div>

      {/* Dropzone */}
      <div style={{ marginBottom: "24px" }}>
        <UploadDropzone onFileSelected={handleFileSelected} disabled={false} />
      </div>

      {/* AI consent notice */}
      <div
        style={{
          padding: "16px",
          backgroundColor: "var(--color-border-light)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text-body)",
            lineHeight: "1.6",
            marginBottom: "12px",
          }}
        >
          <strong style={{ color: "var(--color-navy)" }}>Privacy notice:</strong> AI analysis
          uses Google Gemini to process the contents of your uploaded report. Do not upload
          information you are not comfortable sending to a third-party AI service.
        </p>
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "var(--color-text-body)",
          }}
        >
          <input
            type="checkbox"
            checked={consentGiven}
            onChange={(e) => setConsentGiven(e.target.checked)}
            style={{ marginTop: "1px", accentColor: "var(--color-teal)", cursor: "pointer" }}
            aria-label="I understand that this report will be processed by an AI service"
          />
          <span>
            I understand that this report will be processed by an AI service.
          </span>
        </label>
      </div>

      {/* Medical disclaimer */}
      <div
        style={{
          padding: "12px 14px",
          backgroundColor: "var(--color-bg)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-md)",
          fontSize: "12px",
          color: "var(--color-text-muted)",
          lineHeight: "1.6",
          marginBottom: "24px",
        }}
      >
        AI Health Report Explainer provides educational explanations only. It is not a substitute
        for professional medical advice, diagnosis, or treatment.
      </div>

      {error && (
        <div style={{ marginBottom: "16px" }}>
          <Toast type="error" message={error} onDismiss={() => setError(null)} />
        </div>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={handleSubmit}
        disabled={!selectedFile || !consentGiven}
        style={{ width: "100%" }}
      >
        <Sparkles size={16} />
        Analyze Report
      </Button>

      <p
        style={{
          marginTop: "12px",
          fontSize: "12px",
          color: "var(--color-text-muted)",
          textAlign: "center",
        }}
      >
        Your file is stored privately. Only you can access it.
      </p>
    </div>
  );
}
