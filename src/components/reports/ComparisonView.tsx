"use client";

// ============================================================
// COMPARISON VIEW COMPONENT
// ============================================================

import { useState, useEffect } from "react";
import { ArrowRight, TrendingUp, TrendingDown, Minus, RefreshCw, Bot } from "lucide-react";

interface Parameter {
  name: string;
  numeric_value: number | null;
  unit: string | null;
}

interface ComparisonData {
  name: string;
  earlierValue: number;
  laterValue: number;
  unit: string;
  difference: number;
  direction: "Increased" | "Decreased" | "Stable";
}

interface ComparisonViewProps {
  earlierParams: Parameter[];
  laterParams: Parameter[];
  earlierDate: string;
  laterDate: string;
}

export function ComparisonView({ earlierParams, laterParams, earlierDate, laterDate }: ComparisonViewProps) {
  const [comparisons, setComparisons] = useState<ComparisonData[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Calculate factual comparisons
    const matches: ComparisonData[] = [];

    laterParams.forEach((laterP) => {
      // Find matching parameter by name and unit. Must have numeric values.
      if (laterP.numeric_value === null || !laterP.unit) return;

      const earlierP = earlierParams.find(
        (ep) => ep.name === laterP.name && ep.unit === laterP.unit && ep.numeric_value !== null
      );

      if (earlierP && earlierP.numeric_value !== null) {
        const diff = Number((laterP.numeric_value - earlierP.numeric_value).toFixed(2));
        let direction: "Increased" | "Decreased" | "Stable" = "Stable";
        if (diff > 0) direction = "Increased";
        else if (diff < 0) direction = "Decreased";

        matches.push({
          name: laterP.name,
          earlierValue: earlierP.numeric_value,
          laterValue: laterP.numeric_value,
          unit: laterP.unit,
          difference: diff,
          direction,
        });
      }
    });

    setComparisons(matches);
  }, [earlierParams, laterParams]);

  const generateSummary = async () => {
    if (comparisons.length === 0) return;
    setIsLoadingSummary(true);
    setError(null);

    try {
      const res = await fetch("/api/compare-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comparisonData: comparisons }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiSummary(data.summary);
      } else {
        setError(data.error || "Failed to generate summary.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoadingSummary(false);
    }
  };

  if (comparisons.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", backgroundColor: "var(--color-bg)", borderRadius: "var(--radius-lg)", border: "1px dashed var(--color-border)" }}>
        <p style={{ color: "var(--color-text-muted)" }}>
          No comparable numeric parameters found between these two reports.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Table */}
      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-bg)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "16px", fontSize: "13px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Parameter</th>
                <th style={{ padding: "16px", fontSize: "13px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Earlier ({earlierDate})</th>
                <th style={{ padding: "16px", fontSize: "13px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Later ({laterDate})</th>
                <th style={{ padding: "16px", fontSize: "13px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Difference</th>
                <th style={{ padding: "16px", fontSize: "13px", fontWeight: "600", color: "var(--color-text-muted)", textTransform: "uppercase" }}>Trend</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((c, i) => (
                <tr key={i} style={{ borderBottom: i === comparisons.length - 1 ? "none" : "1px solid var(--color-border)" }}>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500", color: "var(--color-navy)" }}>{c.name}</td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "var(--color-text-body)" }}>{c.earlierValue} <span style={{fontSize:"12px", color:"var(--color-text-muted)"}}>{c.unit}</span></td>
                  <td style={{ padding: "16px", fontSize: "14px", color: "var(--color-text-body)" }}>{c.laterValue} <span style={{fontSize:"12px", color:"var(--color-text-muted)"}}>{c.unit}</span></td>
                  <td style={{ padding: "16px", fontSize: "14px", fontWeight: "500", color: c.difference > 0 ? "var(--color-warning)" : c.difference < 0 ? "var(--color-success)" : "var(--color-text-muted)" }}>
                    {c.difference > 0 ? "+" : ""}{c.difference}
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 8px", borderRadius: "100px", fontSize: "12px", fontWeight: "600", backgroundColor: "var(--color-bg)", color: "var(--color-navy)" }}>
                      {c.direction === "Increased" && <TrendingUp size={14} style={{color: "var(--color-warning)"}} />}
                      {c.direction === "Decreased" && <TrendingDown size={14} style={{color: "var(--color-success)"}} />}
                      {c.direction === "Stable" && <Minus size={14} style={{color: "var(--color-text-muted)"}} />}
                      {c.direction}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Summary Section */}
      <div style={{ backgroundColor: "var(--color-white)", borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: aiSummary || isLoadingSummary ? "16px" : "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Bot size={20} style={{ color: "var(--color-teal)" }} />
            <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--color-navy)" }}>AI Comparison Summary</h3>
          </div>
          {!aiSummary && !isLoadingSummary && (
            <button onClick={generateSummary} className="btn btn-secondary btn-sm">
              Generate Summary
            </button>
          )}
        </div>

        {isLoadingSummary && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--color-text-muted)", fontSize: "14px" }}>
            <RefreshCw size={14} className="spinner" />
            Analyzing differences...
          </div>
        )}

        {error && (
          <p style={{ color: "var(--color-danger)", fontSize: "14px", marginTop: "12px" }}>{error}</p>
        )}

        {aiSummary && (
          <div style={{ backgroundColor: "var(--color-bg)", padding: "16px", borderRadius: "var(--radius-md)", fontSize: "14px", lineHeight: 1.6, color: "var(--color-navy)", whiteSpace: "pre-wrap" }}>
            {aiSummary}
          </div>
        )}
      </div>
    </div>
  );
}
