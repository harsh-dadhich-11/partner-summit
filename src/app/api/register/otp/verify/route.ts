import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { generateToken, hashValue, normalizeEmail, OTP_MAX_ATTEMPTS } from "@/lib/otp";

export const dynamic = "force-dynamic";

/**
 * POST /api/register/otp/verify
 * Checks the emailed 6-digit code. On success returns a single-use verification token
 * that /api/register requires before it will book seats.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = normalizeEmail(body.email);
    const code = String(body.code ?? "").trim();

    if (!email || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, error: "Enter the 6-digit code from your email." }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Database not configured." }, { status: 503 });
    }

    const { data: otpRow, error } = await supabaseAdmin
      .from("email_otps")
      .select("code_hash, expires_at, attempts")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      console.error("Error reading OTP:", error);
      return NextResponse.json({ success: false, error: "Could not verify code. Please try again." }, { status: 500 });
    }

    if (!otpRow) {
      return NextResponse.json({ success: false, error: "No code found for this email. Please request a new one." }, { status: 400 });
    }

    if (otpRow.attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ success: false, error: "Too many incorrect attempts. Please request a new code." }, { status: 429 });
    }

    if (new Date(otpRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: "This code has expired. Please request a new one." }, { status: 400 });
    }

    if (hashValue(`${email}:${code}`) !== otpRow.code_hash) {
      const attempts = otpRow.attempts + 1;
      await supabaseAdmin.from("email_otps").update({ attempts }).eq("email", email);
      const remaining = OTP_MAX_ATTEMPTS - attempts;
      return NextResponse.json(
        {
          success: false,
          error:
            remaining > 0
              ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} left.`
              : "Too many incorrect attempts. Please request a new code.",
        },
        { status: 400 }
      );
    }

    // Correct code: burn it (attempts maxed) and issue the verification token
    const verificationToken = generateToken();
    const { error: updateErr } = await supabaseAdmin
      .from("email_otps")
      .update({
        attempts: OTP_MAX_ATTEMPTS,
        verification_token_hash: hashValue(verificationToken),
        verified_at: new Date().toISOString(),
      })
      .eq("email", email);

    if (updateErr) {
      console.error("Error saving verification:", updateErr);
      return NextResponse.json({ success: false, error: "Could not verify code. Please try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true, verificationToken });
  } catch (err: unknown) {
    console.error("Unhandled error in /api/register/otp/verify:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
