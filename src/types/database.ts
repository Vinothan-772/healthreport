// ============================================================
// SUPABASE DATABASE TYPES — Phase 1 + Phase 2
// ============================================================

export type UserRole = "user";

export type ReportStatus = "uploaded" | "processing" | "completed" | "failed";

export type ParameterStatus = "normal" | "high" | "low" | "critical" | "unknown";

// ── Phase 1 Tables ──────────────────────────────────────────

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  report_type: string | null;
  status: ReportStatus;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
  // Phase 2 extensions
  processing_started_at: string | null;
  processing_completed_at: string | null;
  error_message: string | null;
  analyzed_at: string | null;
}

// ── Phase 2 Tables ──────────────────────────────────────────

export interface ReportSummary {
  id: string;
  report_id: string;
  user_id: string;
  summary: string;
  report_type: string | null;
  overall_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface HealthParameter {
  id: string;
  report_id: string;
  user_id: string;
  name: string;
  value_text: string | null;
  numeric_value: number | null;
  unit: string | null;
  reference_range: string | null;
  status: ParameterStatus;
  explanation: string;
  created_at: string;
}

export interface ReportMetadata {
  id: string;
  report_id: string;
  user_id: string;
  patient_name: string | null;
  report_date: string | null;
  laboratory_name: string | null;
  report_type: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIAnalysisResult {
  id: string;
  report_id: string;
  user_id: string;
  model_name: string;
  analysis_version: string;
  raw_result: GeminiReportResult;
  created_at: string;
}

// ── Phase 3 Tables ──────────────────────────────────────────

export interface ReportChatMessage {
  id: string;
  report_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

// ── Gemini Structured Output Types ──────────────────────────

export interface GeminiReportInfo {
  reportType: string;
  reportDate: string | null;
  laboratoryName: string | null;
  patientName: string | null;
}

export interface GeminiSummary {
  title: string;
  overview: string;
  overallNote: string;
}

export interface GeminiParameter {
  name: string;
  valueText: string;
  numericValue: number | null;
  unit: string | null;
  referenceRange: string | null;
  status: ParameterStatus;
  explanation: string;
}

export interface GeminiReportResult {
  report: GeminiReportInfo;
  summary: GeminiSummary;
  parameters: GeminiParameter[];
  importantObservations: string[];
  limitations: string[];
}

// ── Supabase Database Type Map ───────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Report, "id" | "user_id" | "created_at">>;
      };
      report_summaries: {
        Row: ReportSummary;
        Insert: Omit<ReportSummary, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ReportSummary, "id" | "created_at">>;
      };
      health_parameters: {
        Row: HealthParameter;
        Insert: Omit<HealthParameter, "id" | "created_at">;
        Update: Partial<Omit<HealthParameter, "id" | "created_at">>;
      };
      report_metadata: {
        Row: ReportMetadata;
        Insert: Omit<ReportMetadata, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ReportMetadata, "id" | "created_at">>;
      };
      ai_analysis_results: {
        Row: AIAnalysisResult;
        Insert: Omit<AIAnalysisResult, "id" | "created_at">;
        Update: Partial<Omit<AIAnalysisResult, "id" | "created_at">>;
      };
      report_chat_messages: {
        Row: ReportChatMessage;
        Insert: Omit<ReportChatMessage, "id" | "created_at">;
        Update: Partial<Omit<ReportChatMessage, "id" | "created_at">>;
      };
    };
  };
}
