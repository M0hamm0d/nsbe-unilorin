import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getCleanSupabaseUrl(): string | undefined {
  const raw = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return undefined;
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

/** Checks whether valid, non-placeholder Supabase credentials exist in the environment. */
export function isSupabaseConfigured(): boolean {
  const url = getCleanSupabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes("YOUR-PROJECT") &&
    !key.includes("your-service-role-key")
  );
}

/** Server-side client with the service role key. Never import this in a client component. */
export function supabaseAdmin() {
  if (!client) {
    const url = getCleanSupabaseUrl();
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key || !isSupabaseConfigured()) {
      throw new Error("Missing or invalid Supabase environment variables in .env.local");
    }
    client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  }
  return client;
}
