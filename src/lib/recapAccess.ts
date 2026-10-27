export const RECAP_ACCESS_COOKIE = "odyssey_recap_access";
export const RECAP_ACCESS_SESSION_SECONDS = 60 * 60 * 24 * 30;

type RecapAccessPayload = {
  email: string;
  exp: number;
};

const encoder = new TextEncoder();

function asBufferSource(value: Uint8Array): BufferSource {
  // TypeScript's DOM definitions distinguish ArrayBuffer from SharedArrayBuffer more narrowly
  // than the Web Crypto runtime does for these freshly created byte arrays.
  return value as unknown as BufferSource;
}

function base64UrlEncode(value: Uint8Array | string): string {
  const bytes = typeof value === "string" ? encoder.encode(value) : value;
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(base64);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

function sessionSecret(): string {
  const secret =
    process.env.RECAP_ACCESS_SESSION_SECRET ||
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_KEY;

  if (!secret) {
    throw new Error("Recap access session signing is not configured.");
  }

  return secret;
}

async function signingKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    asBufferSource(encoder.encode(sessionSecret())),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

async function sign(value: string): Promise<string> {
  const signature = await crypto.subtle.sign("HMAC", await signingKey(), asBufferSource(encoder.encode(value)));
  return base64UrlEncode(new Uint8Array(signature));
}

export async function createRecapAccessToken(email: string): Promise<string> {
  const payload: RecapAccessPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + RECAP_ACCESS_SESSION_SECONDS,
  };
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${await sign(encodedPayload)}`;
}

export async function verifyRecapAccessToken(token: string | undefined): Promise<RecapAccessPayload | null> {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  try {
    const signatureIsValid = await crypto.subtle.verify(
      "HMAC",
      await signingKey(),
      asBufferSource(base64UrlDecode(signature)),
      asBufferSource(encoder.encode(encodedPayload))
    );
    if (!signatureIsValid) return null;

    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(encodedPayload))) as RecapAccessPayload;
    if (!payload.email || !Number.isFinite(payload.exp) || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function isSafeRecapDestination(value: string | null | undefined): value is string {
  return Boolean(
    value &&
      value.startsWith("/") &&
      !value.startsWith("//") &&
      ["/recap", "/highlights", "/insights", "/gallery", "/resources/session-summaries"].some(
        (prefix) => value === prefix || value.startsWith(`${prefix}/`) || value.startsWith(`${prefix}?`)
      )
  );
}
