import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * GET /api/volunteer/sessions/[sessionId]/sheet
 * Returns the full registered attendee roster and check-in sheet for volunteers at a given theatre.
 * Automatically synchronizes with registrations table so no registered attendee is ever missed.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 503 }
      );
    }

    // 1. Fetch session info
    const { data: sessionData, error: sessionErr } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (sessionErr || !sessionData) {
      return NextResponse.json(
        { success: false, error: "Session not found." },
        { status: 404 }
      );
    }

    // 2. Fetch attendee roster from session_attendance
    const { data: initialAttendees, error: attendeesErr } = await supabaseAdmin
      .from("session_attendance")
      .select("*")
      .eq("session_id", sessionId)
      .order("attendee_name", { ascending: true });

    let attendees = initialAttendees;

    if (attendeesErr) {
      console.error("Error fetching attendance sheet:", attendeesErr);
    }

    // 3. Fallback sync: Check if any attendees in registrations table picked this session
    // but don't have a row in session_attendance yet
    const { data: directRegistrations } = await supabaseAdmin
      .from("registrations")
      .select("registration_id, attendee_name, attendee_email, slot_1_session_id, slot_2_session_id, slot_3_session_id")
      .or(`slot_1_session_id.eq.${sessionId},slot_2_session_id.eq.${sessionId},slot_3_session_id.eq.${sessionId}`);

    if (directRegistrations && directRegistrations.length > 0) {
      const existingRegIds = new Set((attendees || []).map((a) => a.registration_id));
      const missingRecords = directRegistrations
        .filter((r) => !existingRegIds.has(r.registration_id))
        .map((r) => ({
          session_id: sessionId,
          slot_id: sessionData.slot_id,
          theatre_id: sessionData.theatre_id,
          registration_id: r.registration_id,
          attendee_name: r.attendee_name,
          attendee_email: r.attendee_email,
          is_present: false,
          is_walk_in: false,
        }));

      if (missingRecords.length > 0) {
        const { data: inserted } = await supabaseAdmin
          .from("session_attendance")
          .upsert(missingRecords, { onConflict: "session_id,registration_id" })
          .select();

        if (inserted) {
          attendees = [...(attendees || []), ...inserted].sort((a, b) =>
            (a.attendee_name || "").localeCompare(b.attendee_name || "")
          );
        }
      }
    }

    const attendeeList = attendees || [];
    const totalRegistered = attendeeList.length;
    const totalPresent = attendeeList.filter((a) => a.is_present).length;
    const totalWalkIns = attendeeList.filter((a) => a.is_walk_in).length;

    return NextResponse.json({
      success: true,
      session: sessionData,
      summary: {
        capacity: sessionData.capacity,
        totalRegistered,
        totalPresent,
        totalWalkIns,
        occupancyPercentage:
          sessionData.capacity > 0
            ? Math.round((totalPresent / sessionData.capacity) * 100)
            : 0,
      },
      attendees: attendeeList,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in attendance sheet route:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
