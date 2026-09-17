import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { updateCapacitySchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/sessions/[id]/capacity
 * Dynamically updates the seating capacity of a specific theatre breakout session.
 * Recomputes remaining seats and full status on the fly.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;

    // Optional admin key check
    const adminKey = req.headers.get("x-admin-key");
    const configuredKey = process.env.ADMIN_API_KEY;
    if (configuredKey && adminKey !== configuredKey) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid admin API key." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = updateCapacitySchema.safeParse(body);
    if (!validation.success) {
      const firstError = validation.error.issues?.[0]?.message || "Invalid input";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { newCapacity } = validation.data;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 503 }
      );
    }

    const { data, error } = await supabaseAdmin.rpc("update_session_capacity", {
      p_session_id: sessionId,
      p_new_capacity: newCapacity,
    });

    if (error) {
      console.error("Error updating session capacity:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Session capacity updated to ${newCapacity}.`,
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in capacity update:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
