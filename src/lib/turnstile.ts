import type { NextRequest } from "next/server";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

type TurnstileResult = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

export type TurnstileValidation = {
  success: boolean;
  configured: boolean;
  reason?: "missing-token" | "verification-failed" | "hostname-mismatch" | "verification-unavailable";
};

function expectedHostnames(): string[] {
  const configuredHosts = process.env.TURNSTILE_EXPECTED_HOSTNAMES || process.env.TURNSTILE_EXPECTED_HOSTNAME;
  return (configuredHosts || "partner-summit-26.botconsulting.io")
    .split(",")
    .map((hostname) => hostname.trim())
    .filter(Boolean);
}

export async function validateTurnstile(token: string, request: NextRequest): Promise<TurnstileValidation> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { success: false, configured: false };
  if (!token || token.length > 2048) return { success: false, configured: true, reason: "missing-token" };

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
    const hostnameMatches = expectedHostnames().includes(result.hostname || "");
    if (result.success !== true || !response.ok) {
      return { success: false, configured: true, reason: "verification-failed" };
    }
    if (!hostnameMatches) {
      return { success: false, configured: true, reason: "hostname-mismatch" };
    }
    return { success: true, configured: true };
  } catch {
    return { success: false, configured: true, reason: "verification-unavailable" };
  }
}
