import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase";

export function createClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        throw new Error("Missing Supabase environment variables for server client.");
    }

    return createSupabaseClient<Database>(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}
