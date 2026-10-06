// ============================================================
// GEMINI REPORT SCHEMA — Zod validation + TypeScript types
// ============================================================

import { z } from "zod";
import type { GeminiReportResult } from "@/types/database";

// ── Zod Schemas ─────────────────────────────────────────────

const ParameterStatusSchema = z.enum([
  "normal",
  "high",
  "low",
  "critical",
  "unknown",
]);

const GeminiParameterSchema = z.object({
  name: z.string().min(1).max(200),
  valueText: z.string().max(200),
  numericValue: z.number().nullable(),
  unit: z.string().max(50).nullable(),
  referenceRange: z.string().max(100).nullable(),
  status: ParameterStatusSchema,
  explanation: z.string().min(1).max(1000),
});

const GeminiReportInfoSchema = z.object({
  reportType: z.string().min(1).max(200),
  reportDate: z.string().max(50).nullable(),
  laboratoryName: z.string().max(200).nullable(),
  patientName: z.string().max(200).nullable(),
});

const GeminiSummarySchema = z.object({
  title: z.string().min(1).max(200),
  overview: z.string().min(1).max(2000),
  overallNote: z.string().min(1).max(500),
});

export const GeminiReportResultSchema = z.object({
  report: GeminiReportInfoSchema,
  summary: GeminiSummarySchema,
  parameters: z.array(GeminiParameterSchema).max(100),
  importantObservations: z.array(z.string().max(500)).max(10),
  limitations: z.array(z.string().max(500)).max(10),
});

// ── JSON Schema for Gemini structured output ─────────────────

export const GEMINI_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    report: {
      type: "object",
      properties: {
        reportType: { type: "string" },
        reportDate: { type: "string", nullable: true },
        laboratoryName: { type: "string", nullable: true },
        patientName: { type: "string", nullable: true },
      },
      required: ["reportType"],
    },
    summary: {
      type: "object",
      properties: {
        title: { type: "string" },
        overview: { type: "string" },
        overallNote: { type: "string" },
      },
      required: ["title", "overview", "overallNote"],
    },
    parameters: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          valueText: { type: "string" },
          numericValue: { type: "number", nullable: true },
          unit: { type: "string", nullable: true },
          referenceRange: { type: "string", nullable: true },
          status: {
            type: "string",
            enum: ["normal", "high", "low", "critical", "unknown"],
          },
          explanation: { type: "string" },
        },
        required: ["name", "valueText", "status", "explanation"],
      },
    },
    importantObservations: {
      type: "array",
      items: { type: "string" },
    },
    limitations: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["report", "summary", "parameters", "importantObservations", "limitations"],
};

// ── Validation Function ──────────────────────────────────────

/**
 * Parse and validate a raw Gemini response string.
 * Returns the validated GeminiReportResult or throws a ZodError.
 */
export function validateGeminiResponse(raw: unknown): GeminiReportResult {
  // If raw is a string (JSON text), parse it first
  let parsed = raw;
  if (typeof raw === "string") {
    try {
      // Strip markdown code fences if Gemini wraps response
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      throw new Error("Gemini returned invalid JSON that could not be parsed.");
    }
  }

  const result = GeminiReportResultSchema.parse(parsed);
  return result as GeminiReportResult;
}
