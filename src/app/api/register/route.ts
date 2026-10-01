import { NextRequest, NextResponse, after } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { registerBreakoutSchema, generateRegistrationId } from "@/lib/validators";
import { sendPassEmail } from "@/lib/email/sendPassEmail";
import { hashValue, VERIFICATION_TTL_MS } from "@/lib/otp";

export const dynamic = "force-dynamic";

const MAX_ID_ATTEMPTS = 3;

/**
 * POST /api/register
 * Atomically registers an attendee for their 3 chosen breakout sessions.
 * Enforces:
 *   - Strictly @botconsulting.io email addresses.
 *   - Email ownership proven via the OTP verification token.
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
      attendeeName,
      attendeeEmail,
      slot1SessionId,
      slot2SessionId,
      slot3SessionId,
      verificationToken,
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

    // 3. Confirm the email was verified via OTP in this registration attempt
    const { data: otpRow } = await supabaseAdmin
      .from("email_otps")
      .select("verification_token_hash, verified_at")
      .eq("email", attendeeEmail)
      .maybeSingle();

    const isVerified =
      !!otpRow?.verification_token_hash &&
      !!otpRow.verified_at &&
      otpRow.verification_token_hash === hashValue(verificationToken) &&
      Date.now() - new Date(otpRow.verified_at).getTime() < VERIFICATION_TTL_MS;

    if (!isVerified) {
      return NextResponse.json(
        {
          success: false,
          code: "VERIFICATION_REQUIRED",
          error: "Your email verification has expired. Please verify your email again.",
        },
        { status: 401 }
      );
    }

    // 4. Call PostgreSQL Atomic Stored Procedure (retry if the random registration ID collides)
    let rpcResult: Awaited<ReturnType<typeof callRegisterRpc>> | null = null;
    for (let attempt = 0; attempt < MAX_ID_ATTEMPTS; attempt++) {
      rpcResult = await callRegisterRpc({
        registrationId: generateRegistrationId(),
        attendeeName,
        attendeeEmail,
        slot1SessionId,
        slot2SessionId,
        slot3SessionId,
      });
      if (!rpcResult.error?.message.includes("Registration ID collision")) break;
    }

    const { data, error } = rpcResult!;

    if (error) {
      console.error("RPC Error in register_breakout_sessions:", error);
      const isCapacityError = error.message.includes("is full");
      const isDuplicateError = error.message.includes("already registered");
      const isDomainError = error.message.includes("@botconsulting.io");
      const isInvalidSessionError = error.message.includes("Invalid session");

      if (isDuplicateError) {
        return NextResponse.json(
          {
            success: false,
            code: "ALREADY_REGISTERED",
            error: "You're already registered. Use Find My Pass to view your pass.",
          },
          { status: 409 }
        );
      }

      const statusCode = isDomainError || isCapacityError || isInvalidSessionError ? 400 : 500;
      return NextResponse.json(
        {
          success: false,
          error: statusCode === 500 ? "Registration failed. Please try again." : error.message,
        },
        { status: statusCode }
      );
    }

    // 5. Verification token is single-use
    await supabaseAdmin.from("email_otps").delete().eq("email", attendeeEmail);

    // 6. Send the pass email after the response (after() keeps serverless alive until it finishes)
    if (data?.registrationId) {
      after(async () => {
        const emailResult = await sendPassEmail({
          attendeeName,
          attendeeEmail,
          registrationId: data.registrationId,
          selections: data.selections || {},
        });
        if (!emailResult.success) {
          console.warn("Pass email dispatch warning:", emailResult);
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: "Registration completed successfully.",
      data,
    });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/register:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

function callRegisterRpc(params: {
  registrationId: string;
  attendeeName: string;
  attendeeEmail: string;
  slot1SessionId: string;
  slot2SessionId: string;
  slot3SessionId: string;
}) {
  return supabaseAdmin.rpc("register_breakout_sessions", {
    p_registration_id: params.registrationId,
    p_attendee_name: params.attendeeName,
    p_attendee_email: params.attendeeEmail,
    p_slot1_session_id: params.slot1SessionId,
    p_slot2_session_id: params.slot2SessionId,
    p_slot3_session_id: params.slot3SessionId,
  });
}
