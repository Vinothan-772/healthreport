// ============================================================
// GET /api/reports/[id]/signed-url
// Generate a short-lived signed URL for private report files
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required." }, { status: 400 });
    }

    // Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    // Verify report ownership
    const { data: report, error: reportError } = (await supabase
      .from("reports")
      .select("file_path")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single()) as any;

    if (reportError || !report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    // Generate signed URL (60 seconds expiry)
    const { data: signedData, error: signedError } = await supabase.storage
      .from("medical-reports")
      .createSignedUrl(report.file_path, 60);

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json(
        { error: "Could not generate file access link." },
        { status: 500 }
      );
    }

    return NextResponse.json({ signedUrl: signedData.signedUrl });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
