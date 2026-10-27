import { NextRequest, NextResponse } from "next/server";
import { sendRecapAccessOtpEmail } from "@/lib/email/sendRecapAccessOtpEmail";
import { hashValue, generateOtp, normalizeEmail, OTP_RESEND_COOLDOWN_MS, OTP_TTL_MS } from "@/lib/otp";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
import { validateTurnstile } from "@/lib/turnstile";
import { BOTCONSULTING_EMAIL_REGEX } from "@/lib/validators";

export const dynamic = "force-dynamic";

async function isEmailAllowed(email: string): Promise<boolean> {
  if (BOTCONSULTING_EMAIL_REGEX.test(email)) return true;

  const { data, error } = await supabaseAdmin
    .from("recap_access_allowlist")
    .select("email")
    .eq("email", email)
    .eq("is_active", true)
    .maybeSingle();

  if (error) throw error;
  return Boolean(data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = normalizeEmail(body.email);
    const captchaToken = String(body.captchaToken ?? "");

    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
      return NextResponse.json({ success: false, error: "Enter a valid email address." }, { status: 400 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Access verification is temporarily unavailable." }, { status: 503 });
    }

    const ip = getClientIp(request);
    const [emailAllowedByRateLimit, ipAllowedByRateLimit] = await Promise.all([
      checkRateLimit(`recap-otp-send:email:${email}`, 5, 3_600),
      checkRateLimit(`recap-otp-send:ip:${ip}`, 100, 3_600),
    ]);
    if (!emailAllowedByRateLimit || !ipAllowedByRateLimit) {
      return NextResponse.json({ success: false, error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const captcha = await validateTurnstile(captchaToken, request);
    if (!captcha.configured) {
      console.error("Turnstile is not configured for recap access.");
      return NextResponse.json({ success: false, error: "Access verification is temporarily unavailable." }, { status: 503 });
    }
    if (!captcha.success) {
      if (captcha.reason === "hostname-mismatch") {
        return NextResponse.json(
          { success: false, error: "Human verification succeeded, but this website address is not approved for recap access yet." },
          { status: 400 }
        );
      }
      return NextResponse.json({ success: false, error: "Please complete the human verification and try again." }, { status: 400 });
    }

    if (!(await isEmailAllowed(email))) {
      return NextResponse.json(
        { success: false, error: "This email address is not authorised to view the recap." },
        { status: 403 }
      );
    }

    const { data: existing, error: existingError } = await supabaseAdmin
      .from("recap_access_otps")
      .select("last_sent_at")
      .eq("email", email)
      .maybeSingle();
    if (existingError) throw existingError;

    if (existing?.last_sent_at) {
      const waitMs = OTP_RESEND_COOLDOWN_MS - (Date.now() - new Date(existing.last_sent_at).getTime());
      if (waitMs > 0) {
        return NextResponse.json(
          { success: false, error: `Please wait ${Math.ceil(waitMs / 1000)} seconds before requesting another code.` },
          { status: 429 }
        );
      }
    }

    const code = generateOtp();
    const now = new Date();
    const { error: upsertError } = await supabaseAdmin.from("recap_access_otps").upsert(
      {
        email,
        code_hash: hashValue(`${email}:${code}`),
        expires_at: new Date(now.getTime() + OTP_TTL_MS).toISOString(),
        attempts: 0,
        last_sent_at: now.toISOString(),
      },
      { onConflict: "email" }
    );
    if (upsertError) throw upsertError;

    const emailResult = await sendRecapAccessOtpEmail(email, code);
    if (!emailResult.success) {
      return NextResponse.json({ success: false, error: emailResult.error || "We could not send the code." }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "Verification code sent." });
  } catch (error) {
    console.error("Recap OTP send failed:", error);
    return NextResponse.json({ success: false, error: "Access verification is temporarily unavailable." }, { status: 500 });
  }
}
