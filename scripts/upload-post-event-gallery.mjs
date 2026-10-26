import { createClient } from "@supabase/supabase-js";
import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const envPath = resolve(process.cwd(), ".env.local");
const envContents = await readFile(envPath, "utf8");
const env = Object.fromEntries(
  envContents
    .split(/\r?\n/)
    .filter((line) => /^[A-Za-z_][A-Za-z0-9_]*=/.test(line))
    .map((line) => {
      const equalsAt = line.indexOf("=");
      return [line.slice(0, equalsAt), line.slice(equalsAt + 1)];
    })
);

const renditionDirectory = process.argv[2];
if (!renditionDirectory) {
  throw new Error("Usage: node scripts/upload-post-event-gallery.mjs /absolute/path/to/renditions");
}
if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env.local.");
}

const bucket = "odyssey-2026-gallery";
const client = createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY);
const { data: buckets, error: bucketListError } = await client.storage.listBuckets();
if (bucketListError) throw bucketListError;

if (!buckets.some(({ name }) => name === bucket)) {
  const { error } = await client.storage.createBucket(bucket, {
    public: true,
    fileSizeLimit: "10MB",
    allowedMimeTypes: ["image/jpeg"],
  });
  if (error) throw error;
  console.log(`Created public storage bucket: ${bucket}`);
} else {
  console.log(`Using existing public storage bucket: ${bucket}`);
}

let uploaded = 0;
for (const size of ["medium", "large"]) {
  const directory = join(renditionDirectory, size);
  const filenames = (await readdir(directory)).filter((filename) => filename.endsWith(".jpg"));
  for (const filename of filenames) {
    const body = await readFile(join(directory, filename));
    const { error } = await client.storage.from(bucket).upload(`${size}/${filename}`, body, {
      cacheControl: "31536000",
      contentType: "image/jpeg",
      upsert: true,
    });
    if (error) throw error;
    uploaded += 1;
  }
}

console.log(`Uploaded ${uploaded} optimized gallery renditions.`);
