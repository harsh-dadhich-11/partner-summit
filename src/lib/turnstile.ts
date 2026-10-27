import type { NextRequest } from "next/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResult = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

export async function validateTurnstile(token: string, request: NextRequest): Promise<{ success: boolean; configured: boolean }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: false, configured: false };
  if (!token || token.length > 2048) return { success: false, configured: true };

  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip");
  if (ip) body.set("remoteip", ip);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const result = (await response.json()) as TurnstileResult;
    const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME || "partner-summit-26.botconsulting.io";
    const hostnameMatches = result.hostname === expectedHostname;
    return { success: response.ok && result.success === true && hostnameMatches, configured: true };
  } catch {
    return { success: false, configured: true };
  }
}
