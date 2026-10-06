// ============================================================
// DELETE /api/reports/[id]
// Securely delete a report and all its associated data
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reportId } = await params;

    if (!reportId) {
      return NextResponse.json({ error: "Report ID is required." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    // 1. Fetch report to get file path and verify ownership
    const { data: report, error: fetchError } = (await supabase
      .from("reports")
      .select("file_path")
      .eq("id", reportId)
      .eq("user_id", user.id)
      .single()) as any;

    if (fetchError || !report) {
      return NextResponse.json({ error: "Report not found." }, { status: 404 });
    }

    // 2. Delete file from Storage first
    if (report.file_path) {
      const { error: storageError } = await supabase.storage
        .from("medical-reports")
        .remove([report.file_path]);
      
      if (storageError) {
        console.error("[delete-report] Storage deletion failed:", storageError);
        // We still proceed to delete the DB record even if storage fails, 
        // to avoid zombie records, but log it.
      }
    }

    // 3. Delete report from DB (Cascades will handle summaries, params, etc.)
    const { error: deleteError } = await supabase
      .from("reports")
      .delete()
      .eq("id", reportId)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json({ error: "Failed to delete report." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[delete-report] Unexpected error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
