// ============================================================
// GEMINI SERVER-ONLY CLIENT
// NEVER import this in browser/client components
// ============================================================

import { GoogleGenAI } from "@google/genai";

let _client: GoogleGenAI | null = null;

/**
 * Returns a singleton Gemini client.
 * Throws a descriptive error if GEMINI_API_KEY is not configured.
 */
export function getGeminiClient(): GoogleGenAI {
  if (_client) return _client;

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. " +
        "Please add your Gemini API key to .env.local as GEMINI_API_KEY=your_key"
    );
  }

  _client = new GoogleGenAI({ apiKey });
  return _client;
}

/**
 * Returns the configured Gemini model name.
 * Defaults to gemini-2.0-flash if GEMINI_MODEL is not set.
 */
export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
}
