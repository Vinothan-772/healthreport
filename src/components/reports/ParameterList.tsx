// ============================================================
// PARAMETER LIST COMPONENT
// ============================================================

import { Activity } from "lucide-react";
import { ParameterCard } from "./ParameterCard";
import type { HealthParameter } from "@/types/database";

interface ParameterListProps {
  parameters: HealthParameter[];
}

export function ParameterList({ parameters }: ParameterListProps) {
  if (!parameters || parameters.length === 0) return null;

  return (
    <section>
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-teal-light)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Activity size={18} style={{ color: "var(--color-teal)" }} />
        </div>
        <h2
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "var(--color-navy)",
          }}
        >
          Test Results ({parameters.length})
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        {parameters.map((param) => (
          <ParameterCard key={param.id} parameter={param} />
        ))}
      </div>
    </section>
  );
}
