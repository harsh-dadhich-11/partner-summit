import { createClient } from "@supabase/supabase-js";

// Server-only environment variables (never exposed to browser)
const supabaseUrl =
  process.env.SUPABASE_URL ||
  "https://placeholder-project.supabase.co";

const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  "placeholder-key";

/**
 * Server-side Supabase client for backend operations (never sent to client bundles).
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export function isSupabaseConfigured(): boolean {
  return (
    Boolean(process.env.SUPABASE_URL) &&
    Boolean(
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY
    )
  );
}
