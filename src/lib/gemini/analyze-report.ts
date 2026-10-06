// ============================================================
// GEMINI REPORT ANALYSIS — Orchestration
// Server-side only. Never import in client components.
// ============================================================

import { getGeminiClient, getGeminiModel } from "./client";
import { buildSystemInstruction, buildReportPrompt } from "./report-prompt";
import {
  GEMINI_RESPONSE_SCHEMA,
  validateGeminiResponse,
} from "./report-schema";
import type { GeminiReportResult } from "@/types/database";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

/**
 * Validates that a file buffer is within size limits and has an allowed type.
 */
export function validateFileForGemini(
  fileBuffer: ArrayBuffer,
  mimeType: string
): void {
  if (fileBuffer.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File exceeds the maximum allowed size of 10 MB (${(fileBuffer.byteLength / 1024 / 1024).toFixed(1)} MB uploaded).`
    );
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
    throw new Error(
      "Unsupported file type. Please upload a PDF, JPG, JPEG, or PNG file."
    );
  }
}

/**
 * Analyze a health report file using Gemini.
 *
 * @param fileBuffer  - The file contents as an ArrayBuffer (from Supabase Storage)
 * @param mimeType    - The MIME type of the file
 * @returns           - Validated GeminiReportResult
 */
export async function analyzeReportWithGemini(
  fileBuffer: ArrayBuffer,
  mimeType: string
): Promise<GeminiReportResult> {
  const client = getGeminiClient();
  const modelName = getGeminiModel();

  // Convert ArrayBuffer to Base64 for inline data
  const base64Data = Buffer.from(fileBuffer).toString("base64");

  const model = client.models;

  const response = await model.generateContent({
    model: modelName,
    config: {
      systemInstruction: buildSystemInstruction(),
      responseMimeType: "application/json",
      responseSchema: GEMINI_RESPONSE_SCHEMA as Parameters<typeof model.generateContent>[0]["config"] extends { responseSchema?: infer S } ? S : never,
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
          {
            text: buildReportPrompt(),
          },
        ],
      },
    ],
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error(
      "Gemini returned an empty response. The report may not contain readable content."
    );
  }

  // Validate and parse
  const validated = validateGeminiResponse(rawText);
  return validated;
}
