-- ============================================================
-- AI HEALTH REPORT EXPLAINER — PHASE 3 SQL SCHEMA
-- Run this in Supabase SQL Editor AFTER schema.sql and phase2.sql
-- ============================================================

-- 1. Report Chat Messages Table
CREATE TABLE IF NOT EXISTS public.report_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- INDEXES FOR PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_chat_messages_report_id ON public.report_chat_messages(report_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.report_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.report_chat_messages(created_at);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

ALTER TABLE public.report_chat_messages ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own chat messages') THEN
    CREATE POLICY "Users can view their own chat messages" ON public.report_chat_messages FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own chat messages') THEN
    CREATE POLICY "Users can insert their own chat messages" ON public.report_chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own chat messages') THEN
    CREATE POLICY "Users can delete their own chat messages" ON public.report_chat_messages FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;
