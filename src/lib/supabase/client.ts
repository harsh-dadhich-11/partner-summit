/**
 * Note: Direct browser-side Supabase client is disabled to keep all database credentials
 * strictly on the server side. All database transactions, capacity checks, and roster queries
 * run through Next.js App Router server endpoints (/api/...).
 */
export const isClientDirectAccessDisabled = true;
