// ============================================================
// POST /api/compare-reports
// Generates an educational summary of factual differences
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getGeminiClient, getGeminiModel } from "@/lib/gemini/client";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const { comparisonData } = await request.json();

    if (!comparisonData || !Array.isArray(comparisonData)) {
      return NextResponse.json({ error: "Invalid comparison data." }, { status: 400 });
    }

    // Build strict context prompt
    const systemPrompt = `
You are a helpful, empathetic, and highly accurate assistant embedded in the 'AI Health Report Explainer' app.
You are given a list of factual comparisons between two health reports.

RULES:
1. Turn this factual comparison into a plain-language educational summary.
2. You must not state "This improvement means you are healthier" or "This proves the treatment worked".
3. Use neutral, conservative, educational language.
4. Keep the summary concise (max 2-3 short paragraphs).
5. ALWAYS suggest discussing concerning findings or significant changes with a qualified healthcare professional.
6. Do not diagnose.
7. Note that reference ranges can differ between laboratories.

--- FACTUAL COMPARISON DATA ---
${comparisonData.map(c => `- ${c.name}: Changed from ${c.earlierValue} to ${c.laterValue} ${c.unit}. Direction: ${c.direction}.`).join('\n')}
----------------------
    `;

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: getGeminiModel(),
      contents: systemPrompt,
    });
    const geminiResponse = response.text;

    return NextResponse.json({ success: true, summary: geminiResponse });
  } catch (err) {
    console.error("[compare-reports] Unexpected error:", err);
    return NextResponse.json({ error: "Failed to generate comparison summary." }, { status: 500 });
  }
}
