import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const contents = await readFile(envPath, "utf8");
const env = Object.fromEntries(
  contents
    .split(/\r?\n/)
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => {
      const separator = line.indexOf("=");
      return [line.slice(0, separator), line.slice(separator + 1)];
    })
);

if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be configured in .env.local.");
}

const bucket = "odyssey-2026-gallery";
const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
const { data: existing, error: getError } = await client.storage.getBucket(bucket);
if (getError || !existing) throw getError || new Error(`Storage bucket ${bucket} was not found.`);

const { error: updateError } = await client.storage.updateBucket(bucket, { public: false });
if (updateError) throw updateError;

console.log(`Storage bucket ${bucket} is now private.`);
