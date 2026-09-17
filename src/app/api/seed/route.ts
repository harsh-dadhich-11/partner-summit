import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { DEFAULT_BREAKOUT_SESSIONS } from "@/lib/supabase/helpers";

export const dynamic = "force-dynamic";

/**
 * POST /api/seed
 * Seeds or resets the 9 breakout sessions in the Supabase database.
 * Optional reset query parameter: ?reset=true
 */
export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { success: false, error: "Database not configured in environment variables." },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reset = searchParams.get("reset") === "true";

    if (reset) {
      // Clear existing attendance and registrations for testing/demo
      await supabaseAdmin.from("session_attendance").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabaseAdmin.from("registrations").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabaseAdmin.from("sessions").delete().neq("id", "");
    }

    const { data, error } = await supabaseAdmin
      .from("sessions")
      .upsert(
        DEFAULT_BREAKOUT_SESSIONS.map((s) => ({
          id: s.id,
          slot_id: s.slot_id,
          slot_time: s.slot_time,
          theatre_id: s.theatre_id,
          theatre_name: s.theatre_name,
          track: s.track,
          title: s.title,
          description: s.description,
          speaker_name: s.speaker_name,
          speaker_role: s.speaker_role,
          speaker_company: s.speaker_company,
          capacity: s.capacity,
          booked_seats: reset ? 0 : s.booked_seats,
          is_active: true,
        })),
        { onConflict: "id" }
      )
      .select();

    if (error) {
      console.error("Error seeding sessions:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${data?.length || 0} breakout sessions into Supabase.`,
      sessions: data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in /api/seed:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
