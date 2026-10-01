import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { enrichSessionWithSpeaker } from "@/lib/supabase/helpers";
import type { DbSession } from "@/types/database";
import { REGISTRATION_ID_REGEX } from "@/lib/validators";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

/**
 * GET /api/registration/[id]
 * Looks up a confirmed registration by registration_id only (e.g. "REG-123456").
 * Email lookup was removed so knowing someone's email isn't enough to view their pass.
 * Rate-limited per IP to slow down ID guessing.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const registrationId = decodeURIComponent(id).trim().toUpperCase();

    if (!REGISTRATION_ID_REGEX.test(registrationId)) {
      return NextResponse.json(
        { success: false, error: "Enter a valid Registration ID, e.g. REG-123456." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured." },
        { status: 503 }
      );
    }

    const isAllowed = await checkRateLimit(`pass-lookup:ip:${getClientIp(req)}`, 10, 600);
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: "Too many lookups. Please wait a few minutes and try again." },
        { status: 429 }
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
      .eq("registration_id", registrationId)
      .maybeSingle();

    if (error) {
      console.error("Error querying registration:", error);
      return NextResponse.json({ success: false, error: "Lookup failed. Please try again." }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Registration not found." },
        { status: 404 }
      );
    }

    const parseJoinedSession = (slotData: unknown): DbSession | null => {
      if (!slotData) return null;
      const sessionObj = Array.isArray(slotData) ? slotData[0] : slotData;
      return sessionObj ? enrichSessionWithSpeaker(sessionObj as DbSession) : null;
    };

    const registrationWithSpeakers = {
      ...data,
      slot_1: parseJoinedSession(data.slot_1),
      slot_2: parseJoinedSession(data.slot_2),
      slot_3: parseJoinedSession(data.slot_3),
    };

    return NextResponse.json({
      success: true,
      registration: registrationWithSpeakers,
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
