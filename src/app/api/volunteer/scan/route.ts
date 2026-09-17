import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/**
 * POST /api/volunteer/scan
 * Scans an attendee's QR code at the door of a theatre.
 * Checks if the attendee belongs to this theatre/session:
 *   - If MATCH: Automatically ticks them as Present in session_attendance.
 *   - If WRONG THEATRE: Returns the correct theatre name so the volunteer can redirect them.
 *   - If NOT FOUND: Returns error with option to record as walk-in.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qrData, currentSessionId, volunteerId = "qr-scanner" } = body;

    if (!qrData || !currentSessionId) {
      return NextResponse.json(
        { success: false, error: "qrData and currentSessionId are required." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 503 }
      );
    }

    // 1. Parse QR payload
    let regId = "";
    let scannedEmail = "";

    try {
      if (qrData.startsWith("{")) {
        const parsed = JSON.parse(qrData);
        regId = parsed.regId || parsed.registrationId || "";
        scannedEmail = parsed.email || parsed.attendeeEmail || "";
      } else if (qrData.startsWith("ODYSSEY|")) {
        const parts = qrData.split("|");
        regId = parts[1] || "";
      } else {
        // Plain registration ID or email
        regId = qrData.trim();
      }
    } catch {
      regId = qrData.trim();
    }

    if (!regId && !scannedEmail) {
      return NextResponse.json(
        { success: false, error: "Invalid QR code format." },
        { status: 400 }
      );
    }

    // 2. Fetch current session details
    const { data: currentSession, error: sessionErr } = await supabaseAdmin
      .from("sessions")
      .select("id, slot_id, theatre_id, theatre_name, title")
      .eq("id", currentSessionId)
      .single();

    if (sessionErr || !currentSession) {
      return NextResponse.json(
        { success: false, error: "Current session not found." },
        { status: 404 }
      );
    }

    // 3. Look up attendee registration
    let query = supabaseAdmin
      .from("registrations")
      .select(`
        id,
        registration_id,
        attendee_name,
        attendee_email,
        slot_1_session_id,
        slot_2_session_id,
        slot_3_session_id,
        slot_1:sessions!registrations_slot_1_session_id_fkey(id, theatre_name, title),
        slot_2:sessions!registrations_slot_2_session_id_fkey(id, theatre_name, title),
        slot_3:sessions!registrations_slot_3_session_id_fkey(id, theatre_name, title)
      `);

    if (regId.startsWith("REG-") || regId.startsWith("WALK-")) {
      query = query.eq("registration_id", regId);
    } else if (scannedEmail) {
      query = query.eq("attendee_email", scannedEmail.toLowerCase());
    } else {
      query = query.or(`registration_id.eq.${regId},attendee_email.eq.${regId.toLowerCase()}`);
    }

    const { data: registration, error: regErr } = await query.maybeSingle();

    if (regErr || !registration) {
      return NextResponse.json({
        success: false,
        status: "NOT_FOUND",
        error: `No registration found for "${regId || scannedEmail}".`,
      });
    }

    interface SessionInfo {
      id: string;
      theatre_name: string;
      title: string;
    }

    const extractSession = (val: unknown): SessionInfo | null => {
      if (!val) return null;
      if (Array.isArray(val)) return (val[0] as SessionInfo) || null;
      return val as SessionInfo;
    };

    let bookedSessionId = "";
    let bookedSessionInfo: SessionInfo | null = null;

    if (currentSession.slot_id === "slot-1") {
      bookedSessionId = registration.slot_1_session_id;
      bookedSessionInfo = extractSession(registration.slot_1);
    } else if (currentSession.slot_id === "slot-2") {
      bookedSessionId = registration.slot_2_session_id;
      bookedSessionInfo = extractSession(registration.slot_2);
    } else if (currentSession.slot_id === "slot-3") {
      bookedSessionId = registration.slot_3_session_id;
      bookedSessionInfo = extractSession(registration.slot_3);
    }

    // 5. Check if it's the correct theatre
    if (bookedSessionId !== currentSessionId) {
      return NextResponse.json({
        success: false,
        status: "WRONG_THEATRE",
        attendeeName: registration.attendee_name,
        registrationId: registration.registration_id,
        correctTheatreName: bookedSessionInfo?.theatre_name || "Another Theatre",
        correctSessionTitle: bookedSessionInfo?.title || "Different Session",
        currentTheatreName: currentSession.theatre_name,
        message: `Wrong theatre! ${registration.attendee_name} is registered for ${bookedSessionInfo?.theatre_name}.`,
      });
    }

    // 6. Correct theatre: Check attendee in
    const { data: updatedAttendance, error: updateErr } = await supabaseAdmin
      .from("session_attendance")
      .upsert(
        {
          session_id: currentSessionId,
          slot_id: currentSession.slot_id,
          theatre_id: currentSession.theatre_id,
          registration_id: registration.registration_id,
          attendee_name: registration.attendee_name,
          attendee_email: registration.attendee_email,
          is_present: true,
          is_walk_in: false,
          marked_at: new Date().toISOString(),
          marked_by_volunteer_id: volunteerId,
        },
        { onConflict: "session_id,registration_id" }
      )
      .select()
      .single();

    if (updateErr) {
      console.error("Error checking in attendee:", updateErr);
      return NextResponse.json({ success: false, error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      status: "CHECKED_IN",
      attendeeName: registration.attendee_name,
      attendeeEmail: registration.attendee_email,
      registrationId: registration.registration_id,
      theatreName: currentSession.theatre_name,
      sessionTitle: currentSession.title,
      attendance: updatedAttendance,
      message: `✓ Checked in: ${registration.attendee_name}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in QR scan route:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
