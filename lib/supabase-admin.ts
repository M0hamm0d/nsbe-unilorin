import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getCleanSupabaseUrl(): string | undefined {
  const raw = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return undefined;
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export function getSupabaseKey(): string | undefined {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** Checks whether valid, non-placeholder Supabase credentials exist in the environment. */
export function isSupabaseConfigured(): boolean {
  const url = getCleanSupabaseUrl();
  const key = getSupabaseKey();
  return Boolean(
    url &&
    key &&
    !url.includes("YOUR-PROJECT") &&
    !key.includes("your-service-role-key") &&
    !key.includes("your-anon-key")
  );
}

/** Server-side client with the service role key or fallback key. Never import this in a client component. */
export function supabaseAdmin() {
  if (!client) {
    const url = getCleanSupabaseUrl();
    const key = getSupabaseKey();
    if (!url || !key || !isSupabaseConfigured()) {
      throw new Error("Missing or invalid Supabase environment variables in environment");
    }
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}
