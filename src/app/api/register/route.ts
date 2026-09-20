import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { registerBreakoutSchema } from "@/lib/validators";
import { sendPassEmail } from "@/lib/email/sendPassEmail";

export const dynamic = "force-dynamic";

/**
 * POST /api/register
 * Atomically registers an attendee for their 3 chosen breakout sessions.
 * Enforces:
 *   - Strictly @botconsulting.io email addresses.
 *   - Exactly 1 session per slot.
 *   - Atomic capacity checks via PostgreSQL stored procedure (zero overbooking).
 *   - Generates attendance records for volunteers.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Zod Validation (including @botconsulting.io regex)
    const validationResult = registerBreakoutSchema.safeParse(body);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues?.[0]?.message || "Validation failed";
      return NextResponse.json(
        {
          success: false,
          error: firstError,
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const {
      registrationId,
      attendeeName,
      attendeeEmail,
      slot1SessionId,
      slot2SessionId,
      slot3SessionId,
    } = validationResult.data;

    // 2. Check Database Configuration
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Supabase database is not configured. Please add SUPABASE_URL and SUPABASE_SECRET_KEY to your environment.",
        },
        { status: 503 }
      );
    }

    // 3. Call PostgreSQL Atomic Stored Procedure
    const { data, error } = await supabaseAdmin.rpc("register_breakout_sessions", {
      p_registration_id: registrationId,
      p_attendee_name: attendeeName,
      p_attendee_email: attendeeEmail,
      p_slot1_session_id: slot1SessionId,
      p_slot2_session_id: slot2SessionId,
      p_slot3_session_id: slot3SessionId,
    });

    if (error) {
      console.error("RPC Error in register_breakout_sessions:", error);
      const isCapacityError = error.message.includes("is full");
      const isDuplicateError = error.message.includes("already registered");
      const isDomainError = error.message.includes("@botconsulting.io");

      const statusCode = isDomainError || isCapacityError || isDuplicateError ? 400 : 500;
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: statusCode }
      );
    }

    // 4. Trigger Email with QR Pass (Non-blocking / Handled gracefully)
    if (data?.registrationId) {
      sendPassEmail({
        attendeeName,
        attendeeEmail,
        registrationId: data.registrationId,
        selections: data.selections || {},
      }).catch((emailErr) => {
        console.warn("Pass email dispatch warning:", emailErr);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully.",
      data,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    console.error("Unhandled error in /api/register:", err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
