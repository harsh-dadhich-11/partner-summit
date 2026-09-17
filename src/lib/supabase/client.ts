import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
// Supports both new naming (PUBLISHABLE_KEY) and legacy (ANON_KEY)
const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-publishable-key";

/**
 * Public client for client-side queries or Supabase Realtime subscriptions.
 */
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
