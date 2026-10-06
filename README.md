# AI Health Report Explainer

A modern, secure web application that allows users to upload medical/health reports and receive easy-to-understand explanations using AI (Google Gemini).

Built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **TypeScript**, and **Supabase**.

## 🚀 Features (Phase 1, 2, & 3 - Final)
- **Secure Authentication**: Supabase SSR Auth (Login & Signup) with route protection.
- **Modern Dashboard**: Responsive shell layout with health overviews and trend previews.
- **Upload Reports**: Secure upload of PDF/Images to private Supabase Storage buckets.
- **AI Analysis**: Server-side processing of reports using Google Gemini.
- **Structured Explanations**: Extracts test parameters, reference ranges, and translates medical jargon into plain language.
- **Report History & Management**: Real-time list of past reports with filtering, retry, and secure deletion functionality.
- **Report Comparison**: Select two completed reports to compare numeric parameters over time, complete with an AI-generated summary of factual differences.
- **AI Follow-up Chat**: Ask specific questions about your uploaded report in a secure, context-limited chat interface.

## 📁 Architecture & Folder Structure

```
src/
├── app/                  # Next.js App Router (Pages & API)
│   ├── api/              # Server-side API Routes (analyze, chat, compare, delete)
│   ├── dashboard/        # Main dashboard view
│   ├── reports/          # Report history, upload, and details
│   │   ├── compare/      # Report comparison view
│   │   ├── upload/       # Upload interface
│   │   └── [id]/         # Detailed report view
│   ├── profile/          # User profile
│   └── settings/         # Privacy and data management
├── components/           # Reusable UI Components
│   ├── chat/             # AI chat interface
│   ├── dashboard/        # Dashboard widgets (trends, stats)
│   ├── layout/           # Global layouts (sidebar, shell)
│   ├── reports/          # Report specific components (summary, parameter list)
│   └── ui/               # Generic UI atoms (buttons, inputs, empty states)
├── lib/                  # Utilities and core logic
│   ├── gemini/           # AI orchestration, prompts, and schemas
│   ├── supabase/         # Supabase client (client & server)
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions (database schema)
supabase/                 # SQL Schemas
├── schema.sql            # Phase 1: Profiles & Auth
├── phase2.sql            # Phase 2: Core report tables
└── phase3.sql            # Phase 3: Chat messages table
```

## 🛠️ Setup Instructions

### 1. Database Setup (Supabase)
1. Navigate to the **SQL Editor** in your Supabase dashboard.
2. Execute the SQL files in this exact order:
   - `supabase/schema.sql` (Phase 1)
   - `supabase/phase2.sql` (Phase 2)
   - `supabase/phase3.sql` (Phase 3)
3. Ensure you have a **Storage Bucket** named `medical-reports` and that it is **PRIVATE**.

### 2. Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and add your keys (never commit this file):
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon public key.
   - `GEMINI_API_KEY`: Your Google Gemini API Key. (Keep this secret!)
   - `GEMINI_MODEL`: `gemini-3.8-flash` (or current flash model).

### 3. Run the Application
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000)

## 🔒 Security & Medical Safety
- **Medical Disclaimer:** This tool provides educational explanations. It is **NOT** a medical diagnosis or a replacement for a doctor. Always consult a qualified healthcare professional.
- **Secret Keys:** The `GEMINI_API_KEY` is NEVER exposed to the client. All AI requests happen strictly server-side.
- **Data Privacy:** Medical report files are stored in a private Supabase bucket, accessible only via short-lived signed URLs.
- **Row Level Security (RLS):** Policies ensure users can only access their own reports, analysis results, and chat messages.

## 🚀 Deployment (Vercel)
This project is ready for Vercel deployment.
1. Push your code to GitHub.
2. Import the repository into Vercel.
3. In Vercel Project Settings > Environment Variables, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL`
4. Deploy!

### Deployment Checklist
- [ ] Create Supabase project & execute SQL schemas (1, 2, 3)
- [ ] Create private Storage bucket
- [ ] Verify Auth settings
- [ ] Create Gemini API key
- [ ] Add Vercel environment variables
- [ ] Deploy and verify end-to-end functionality (Upload, Chat, Compare, Delete)
