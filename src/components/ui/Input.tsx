"use client";

// ============================================================
// INPUT COMPONENT
// ============================================================

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, rightElement, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="form-group">
        {label && (
          <label className="form-label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <div style={{ position: "relative" }}>
          <input
            ref={ref}
            id={inputId}
            className={`form-input ${error ? "error" : ""} ${className}`}
            style={rightElement ? { paddingRight: "44px" } : {}}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${inputId}-error`
                : hint
                  ? `${inputId}-hint`
                  : undefined
            }
            {...props}
          />
          {rightElement && (
            <div
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="form-error" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="form-hint">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
