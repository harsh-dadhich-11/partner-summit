import { NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { computeSessionAvailability, groupSessionsBySlot, DEFAULT_BREAKOUT_SESSIONS } from "@/lib/supabase/helpers";
import type { DbSession } from "@/types/database";

export const dynamic = "force-dynamic";

/**
 * GET /api/sessions
 * Returns all 9 breakout sessions grouped by time slot, with live dynamic capacity,
 * remaining seats, "15 seats left" warning badges, and occupancy status.
 */
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      // Fallback in case Supabase credentials have not been configured in .env yet
      const computed = DEFAULT_BREAKOUT_SESSIONS.map(computeSessionAvailability);
      return NextResponse.json({
        success: true,
        source: "mock-fallback",
        slots: groupSessionsBySlot(computed),
        allSessions: computed,
      });
    }

    const { data: rawSessions, error } = await supabaseAdmin
      .from("sessions")
      .select("*")
      .eq("is_active", true)
      .order("slot_id", { ascending: true })
      .order("theatre_id", { ascending: true });

    if (error) {
      console.error("Error fetching sessions from Supabase:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    const sessions = (rawSessions as DbSession[]).map(computeSessionAvailability);
    const grouped = groupSessionsBySlot(sessions);

    return NextResponse.json({
      success: true,
      source: "database",
      slots: grouped,
      allSessions: sessions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in /api/sessions:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
