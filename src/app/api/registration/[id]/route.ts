import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/registration/[id]
 * Looks up confirmed registration by registration_id (e.g. "REG-123456") or attendee email.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const decodedIdentifier = decodeURIComponent(id).trim().toLowerCase();

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 503 }
      );
    }

    // Query registrations with joined sessions for all 3 slots
    const { data, error } = await supabaseAdmin
      .from("registrations")
      .select(`
        id,
        registration_id,
        attendee_name,
        attendee_email,
        status,
        registered_at,
        slot_1:sessions!registrations_slot_1_session_id_fkey(*),
        slot_2:sessions!registrations_slot_2_session_id_fkey(*),
        slot_3:sessions!registrations_slot_3_session_id_fkey(*)
      `)
      .or(`attendee_email.eq.${decodedIdentifier},registration_id.eq.${id.trim()}`)
      .maybeSingle();

    if (error) {
      console.error("Error querying registration:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Registration not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in /api/registration/[id]:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
