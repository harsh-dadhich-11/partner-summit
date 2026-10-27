import { NextRequest, NextResponse } from "next/server";
import { createRecapAccessToken, RECAP_ACCESS_COOKIE, RECAP_ACCESS_SESSION_SECONDS } from "@/lib/recapAccess";
import { hashValue, normalizeEmail, OTP_MAX_ATTEMPTS } from "@/lib/otp";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";
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
    const code = String(body.code ?? "").trim();

    if (!/^\S+@\S+\.\S+$/.test(email) || !/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, error: "Enter the six-digit code from your email." }, { status: 400 });
    }
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, error: "Access verification is temporarily unavailable." }, { status: 503 });
    }
    if (!(await isEmailAllowed(email))) {
      return NextResponse.json({ success: false, error: "This email address is not authorised to view the recap." }, { status: 403 });
    }

    const { data: otp, error: readError } = await supabaseAdmin
      .from("recap_access_otps")
      .select("code_hash, expires_at, attempts")
      .eq("email", email)
      .maybeSingle();
    if (readError) throw readError;
    if (!otp) {
      return NextResponse.json({ success: false, error: "Request a verification code first." }, { status: 400 });
    }
    if (otp.attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json({ success: false, error: "Too many incorrect attempts. Request a new code." }, { status: 429 });
    }
    if (new Date(otp.expires_at).getTime() <= Date.now()) {
      return NextResponse.json({ success: false, error: "This code has expired. Request a new one." }, { status: 400 });
    }
    if (hashValue(`${email}:${code}`) !== otp.code_hash) {
      const attempts = otp.attempts + 1;
      await supabaseAdmin.from("recap_access_otps").update({ attempts }).eq("email", email);
      const remaining = OTP_MAX_ATTEMPTS - attempts;
      return NextResponse.json(
        { success: false, error: remaining > 0 ? `Incorrect code. ${remaining} attempt${remaining === 1 ? "" : "s"} left.` : "Too many incorrect attempts. Request a new code." },
        { status: 400 }
      );
    }

    const { error: consumeError } = await supabaseAdmin
      .from("recap_access_otps")
      .update({ attempts: OTP_MAX_ATTEMPTS })
      .eq("email", email);
    if (consumeError) throw consumeError;

    const response = NextResponse.json({ success: true });
    response.cookies.set({
      name: RECAP_ACCESS_COOKIE,
      value: await createRecapAccessToken(email),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: RECAP_ACCESS_SESSION_SECONDS,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Recap OTP verification failed:", error);
    return NextResponse.json({ success: false, error: "Access verification is temporarily unavailable." }, { status: 500 });
  }
}
