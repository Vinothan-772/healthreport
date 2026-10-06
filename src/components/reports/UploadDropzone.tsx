"use client";

// ============================================================
// UPLOAD DROPZONE COMPONENT
// Drag-and-drop + click-to-browse with validation
// ============================================================

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, X, AlertCircle } from "lucide-react";

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXT_LABELS = "PDF, JPG, JPEG, PNG";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UploadDropzoneProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadDropzone({ onFileSelected, disabled }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported file type "${file.type || "unknown"}". Please upload a PDF, JPG, JPEG, or PNG file.`;
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `File is too large (${formatBytes(file.size)}). Maximum allowed size is ${MAX_SIZE_MB} MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setFileError(error);
        setSelectedFile(null);
        return;
      }
      setFileError(null);
      setSelectedFile(file);
      onFileSelected(file);
    },
    [validateFile, onFileSelected]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFileError(null);
  };

  if (selectedFile) {
    return (
      <div
        style={{
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "20px",
          backgroundColor: "var(--color-white)",
          display: "flex",
          alignItems: "center",
          gap: "14px",
        }}
      >
        <div
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-teal-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <FileText size={20} style={{ color: "var(--color-teal)" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "var(--color-navy)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {selectedFile.name}
          </p>
          <p style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
            {formatBytes(selectedFile.size)} · {selectedFile.type === "application/pdf" ? "PDF" : selectedFile.type.split("/")[1].toUpperCase()}
          </p>
        </div>
        {!disabled && (
          <button
            type="button"
            onClick={clearFile}
            aria-label="Remove selected file"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-muted)",
              display: "flex",
              transition: "color 0.15s ease",
            }}
          >
            <X size={18} />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload health report — click or drag and drop"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        style={{
          border: `2px dashed ${isDragging ? "var(--color-teal)" : fileError ? "var(--color-danger)" : "var(--color-border)"}`,
          borderRadius: "var(--radius-lg)",
          padding: "48px 24px",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          backgroundColor: isDragging
            ? "var(--color-teal-light)"
            : "var(--color-bg)",
          opacity: disabled ? 0.6 : 1,
          transition: "border-color 0.2s ease, background-color 0.2s ease",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "var(--radius-lg)",
            backgroundColor: isDragging
              ? "var(--color-white)"
              : "var(--color-white)",
            border: "1px solid var(--color-border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <Upload
            size={20}
            style={{ color: isDragging ? "var(--color-teal)" : "var(--color-text-muted)" }}
          />
        </div>
        <p
          style={{
            fontSize: "15px",
            fontWeight: "500",
            color: "var(--color-navy)",
            marginBottom: "6px",
          }}
        >
          {isDragging ? "Drop your file here" : "Drop your report here"}
        </p>
        <p style={{ fontSize: "13px", color: "var(--color-text-muted)", marginBottom: "16px" }}>
          or
        </p>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 18px",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--color-text-body)",
            backgroundColor: "var(--color-white)",
          }}
        >
          Browse files
        </div>
        <p
          style={{
            marginTop: "16px",
            fontSize: "12px",
            color: "var(--color-text-muted)",
          }}
        >
          Accepted: {ALLOWED_EXT_LABELS} · Max {MAX_SIZE_MB} MB
        </p>
      </div>

      {fileError && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            marginTop: "12px",
            padding: "10px 12px",
            backgroundColor: "var(--color-danger-bg)",
            border: "1px solid #fca5a5",
            borderRadius: "var(--radius-md)",
            fontSize: "13px",
            color: "var(--color-danger)",
          }}
          role="alert"
        >
          <AlertCircle size={14} style={{ flexShrink: 0, marginTop: "1px" }} />
          {fileError}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        onChange={handleInputChange}
        style={{ display: "none" }}
        disabled={disabled}
        aria-label="Select health report file"
      />
    </div>
  );
}
