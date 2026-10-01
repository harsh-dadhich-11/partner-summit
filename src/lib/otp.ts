import { randomBytes, randomInt, createHash } from "crypto";

export const OTP_TTL_MS = 10 * 60 * 1000; // code valid for 10 minutes
export const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export const VERIFICATION_TTL_MS = 45 * 60 * 1000; // time allowed to finish picking sessions

/** 6-digit numeric one-time code. */
export function generateOtp(): string {
  return String(randomInt(100000, 1000000));
}

/** Opaque token handed to the browser once the email is verified. */
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashValue(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function normalizeEmail(email: unknown): string {
  return String(email ?? "").trim().toLowerCase();
}
