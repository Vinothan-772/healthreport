-- ============================================================
-- AI HEALTH REPORT EXPLAINER — PHASE 2 SQL SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Extend existing reports table (safe alter)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='processing_started_at') THEN
    ALTER TABLE public.reports ADD COLUMN processing_started_at TIMESTAMPTZ NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='processing_completed_at') THEN
    ALTER TABLE public.reports ADD COLUMN processing_completed_at TIMESTAMPTZ NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='error_message') THEN
    ALTER TABLE public.reports ADD COLUMN error_message TEXT NULL;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reports' AND column_name='analyzed_at') THEN
    ALTER TABLE public.reports ADD COLUMN analyzed_at TIMESTAMPTZ NULL;
  END IF;
END $$;


-- 2. Report Summaries Table
CREATE TABLE IF NOT EXISTS public.report_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL UNIQUE REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  summary TEXT NOT NULL,
  report_type TEXT NULL,
  overall_note TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Health Parameters Table
CREATE TABLE IF NOT EXISTS public.health_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value_text TEXT NULL,
  numeric_value NUMERIC NULL,
  unit TEXT NULL,
  reference_range TEXT NULL,
  status TEXT NOT NULL CHECK (status IN ('normal', 'high', 'low', 'critical', 'unknown')),
  explanation TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Report Metadata Table
CREATE TABLE IF NOT EXISTS public.report_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL UNIQUE REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_name TEXT NULL,
  report_date TEXT NULL,
  laboratory_name TEXT NULL,
  report_type TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. AI Analysis Results Table (Raw JSON storage)
CREATE TABLE IF NOT EXISTS public.ai_analysis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL UNIQUE REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  model_name TEXT NOT NULL,
  analysis_version TEXT NOT NULL,
  raw_result JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_reports_user_id ON public.reports(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at);

CREATE INDEX IF NOT EXISTS idx_report_summaries_user_id ON public.report_summaries(user_id);
CREATE INDEX IF NOT EXISTS idx_health_parameters_report_id ON public.health_parameters(report_id);
CREATE INDEX IF NOT EXISTS idx_health_parameters_user_id ON public.health_parameters(user_id);
CREATE INDEX IF NOT EXISTS idx_report_metadata_user_id ON public.report_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_results_user_id ON public.ai_analysis_results(user_id);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.report_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_results ENABLE ROW LEVEL SECURITY;

-- Report Summaries Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own report summaries') THEN
    CREATE POLICY "Users can view their own report summaries" ON public.report_summaries FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own report summaries') THEN
    CREATE POLICY "Users can insert their own report summaries" ON public.report_summaries FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own report summaries') THEN
    CREATE POLICY "Users can update their own report summaries" ON public.report_summaries FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Health Parameters Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own health parameters') THEN
    CREATE POLICY "Users can view their own health parameters" ON public.health_parameters FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own health parameters') THEN
    CREATE POLICY "Users can insert their own health parameters" ON public.health_parameters FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own health parameters') THEN
    CREATE POLICY "Users can delete their own health parameters" ON public.health_parameters FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Report Metadata Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own report metadata') THEN
    CREATE POLICY "Users can view their own report metadata" ON public.report_metadata FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own report metadata') THEN
    CREATE POLICY "Users can insert their own report metadata" ON public.report_metadata FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own report metadata') THEN
    CREATE POLICY "Users can update their own report metadata" ON public.report_metadata FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- AI Analysis Results Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own AI analysis results') THEN
    CREATE POLICY "Users can view their own AI analysis results" ON public.ai_analysis_results FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own AI analysis results') THEN
    CREATE POLICY "Users can insert their own AI analysis results" ON public.ai_analysis_results FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own AI analysis results') THEN
    CREATE POLICY "Users can update their own AI analysis results" ON public.ai_analysis_results FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;
