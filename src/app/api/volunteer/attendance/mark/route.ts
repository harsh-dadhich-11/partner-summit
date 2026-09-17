import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { markAttendanceSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/volunteer/attendance/mark
 * Marks an attendee present/absent on site or records a walk-in attendee.
 */
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = markAttendanceSchema.safeParse(body);

    if (!validation.success) {
      const firstError = validation.error.issues?.[0]?.message || "Invalid input";
      return NextResponse.json(
        { success: false, error: firstError },
        { status: 400 }
      );
    }

    const { sessionId, registrationId, isPresent, isWalkIn, volunteerId, notes } = validation.data;

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 503 }
      );
    }

    // Check if attendance record exists
    const { data: existing, error: findErr } = await supabaseAdmin
      .from("session_attendance")
      .select("*")
      .eq("session_id", sessionId)
      .eq("registration_id", registrationId)
      .maybeSingle();

    if (findErr) {
      return NextResponse.json({ success: false, error: findErr.message }, { status: 500 });
    }

    let result;
    if (existing) {
      // Update existing check-in record
      const { data, error } = await supabaseAdmin
        .from("session_attendance")
        .update({
          is_present: isPresent,
          marked_at: isPresent ? new Date().toISOString() : null,
          marked_by_volunteer_id: volunteerId,
          notes: notes !== undefined ? notes : existing.notes,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      result = data;
    } else if (isWalkIn) {
      // Handle walk-in attendee
      const { data: sessionData } = await supabaseAdmin
        .from("sessions")
        .select("slot_id, theatre_id")
        .eq("id", sessionId)
        .single();

      const { data, error } = await supabaseAdmin
        .from("session_attendance")
        .insert({
          session_id: sessionId,
          slot_id: sessionData?.slot_id || "slot-1",
          theatre_id: sessionData?.theatre_id || "theatre-1",
          registration_id: registrationId,
          attendee_name: body.attendeeName || "Walk-In Attendee",
          attendee_email: body.attendeeEmail || "walkin@botconsulting.io",
          is_present: true,
          is_walk_in: true,
          marked_at: new Date().toISOString(),
          marked_by_volunteer_id: volunteerId,
          notes: notes || "On-site walk-in",
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }
      result = data;
    } else {
      return NextResponse.json(
        { success: false, error: "Attendee not found on registration list for this session." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isPresent ? "Attendee marked present." : "Attendee marked absent.",
      attendance: result,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in attendance check-in route:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
