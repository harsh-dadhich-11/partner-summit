import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { BOTCONSULTING_EMAIL_REGEX } from "@/lib/validators";
import { generateOtp, hashValue, normalizeEmail, OTP_RESEND_COOLDOWN_MS, OTP_TTL_MS } from "@/lib/otp";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { sendOtpEmail } from "@/lib/email/sendOtpEmail";

export const dynamic = "force-dynamic";

/**
 * POST /api/register/otp/send
 * Step 1 of registration: rejects already-registered emails up front, then emails a 6-digit code.
 * Enforces a 60s resend cooldown plus per-email and per-IP hourly limits.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body.email);

    if (!BOTCONSULTING_EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Only @botconsulting.io email addresses are permitted to register." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Database not configured." }, { status: 503 });
    }

    // 1. Already registered? Stop here instead of at the final step.
    const { data: existing, error: existingErr } = await supabaseAdmin
      .from("registrations")
      .select("id")
      .eq("attendee_email", email)
      .maybeSingle();

    if (existingErr) {
      console.error("Error checking existing registration:", existingErr);
      return NextResponse.json({ success: false, error: "Could not verify email. Please try again." }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          code: "ALREADY_REGISTERED",
          error: "You're already registered. Use Find My Pass to view your pass.",
        },
        { status: 409 }
      );
    }

    // 2. Resend cooldown
    const { data: otpRow } = await supabaseAdmin
      .from("email_otps")
      .select("last_sent_at")
      .eq("email", email)
      .maybeSingle();

    if (otpRow?.last_sent_at) {
      const elapsedMs = Date.now() - new Date(otpRow.last_sent_at).getTime();
      if (elapsedMs < OTP_RESEND_COOLDOWN_MS) {
        const retryAfter = Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsedMs) / 1000);
        return NextResponse.json(
          { success: false, error: `Please wait ${retryAfter}s before requesting a new code.`, retryAfter },
          { status: 429 }
        );
      }
    }

    // 3. Hourly limits (per email and per IP)
    const ip = getClientIp(req);
    const [emailAllowed, ipAllowed] = await Promise.all([
      checkRateLimit(`otp-send:email:${email}`, 5, 3600),
      checkRateLimit(`otp-send:ip:${ip}`, 20, 3600),
    ]);
    if (!emailAllowed || !ipAllowed) {
      return NextResponse.json(
        { success: false, error: "Too many code requests. Please try again later." },
        { status: 429 }
      );
    }

    // 4. Store a fresh code (replaces any previous code and verification)
    const code = generateOtp();
    const now = new Date();
    const { error: upsertErr } = await supabaseAdmin.from("email_otps").upsert(
      {
        email,
        code_hash: hashValue(`${email}:${code}`),
        expires_at: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
        attempts: 0,
        last_sent_at: now.toISOString(),
        verification_token_hash: null,
        verified_at: null,
      },
      { onConflict: "email" }
    );

    if (upsertErr) {
      console.error("Error storing OTP:", upsertErr);
      return NextResponse.json({ success: false, error: "Could not send code. Please try again." }, { status: 500 });
    }

    // 5. Send it — surface failures so the user isn't left waiting for an email that never comes
    const sendResult = await sendOtpEmail(email, code);
    if (!sendResult.success) {
      return NextResponse.json(
        { success: false, error: "We couldn't send the verification email. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Verification code sent." });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/register/otp/send:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
