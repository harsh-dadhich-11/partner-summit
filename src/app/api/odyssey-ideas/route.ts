import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const BUCKET = "odyssey-2027-suggestions";
const MAX_IDEAS_PER_WINDOW = 5;
const WINDOW_MS = 15 * 60 * 1000;
const submissionsByIp = new Map<string, number[]>();

function normalizeText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function canSubmit(ip: string) {
  const now = Date.now();
  const recent = (submissionsByIp.get(ip) || []).filter((timestamp) => now - timestamp < WINDOW_MS);
  if (recent.length >= MAX_IDEAS_PER_WINDOW) return false;
  submissionsByIp.set(ip, [...recent, now]);
  return true;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Suggestions are temporarily unavailable. Please try again later." }, { status: 503 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  if (!canSubmit(ip)) {
    return NextResponse.json({ error: "Please wait a little before sending another idea." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const name = normalizeText(body.name, 100);
    const idea = normalizeText(body.idea, 1500);
    if (!name) {
      return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
    }
    if (idea.length < 3) {
      return NextResponse.json({ error: "Please share a little more about your idea." }, { status: 400 });
    }

    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw listError;
    if (!buckets.some((bucket) => bucket.name === BUCKET)) {
      const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET, { public: false });
      if (createError && !createError.message.toLowerCase().includes("already exists")) throw createError;
    }

    const submittedAt = new Date().toISOString();
    const filename = `submissions/${submittedAt.replace(/[:.]/g, "-")}-${crypto.randomUUID()}.json`;
    const { error: uploadError } = await supabaseAdmin.storage.from(BUCKET).upload(
      filename,
      JSON.stringify({ name, idea, submittedAt }),
      { contentType: "application/json", upsert: false }
    );
    if (uploadError) throw uploadError;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unable to save Odyssey 2027 idea:", error);
    return NextResponse.json({ error: "We could not save your idea. Please try again." }, { status: 500 });
  }
}
