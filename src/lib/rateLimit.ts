import type { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * Fixed-window rate limit backed by the hit_rate_limit() Postgres function,
 * so limits hold across serverless instances. Returns true if the call is allowed.
 * Fails open if the limiter itself errors, so a DB hiccup doesn't block registration.
 */
export async function checkRateLimit(key: string, max: number, windowSeconds: number): Promise<boolean> {
  const { data, error } = await supabaseAdmin.rpc("hit_rate_limit", {
    p_key: key,
    p_max: max,
    p_window_seconds: windowSeconds,
  });
  if (error) {
    console.error("Rate limit check failed:", error);
    return true;
  }
  return data === true;
}

export function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
