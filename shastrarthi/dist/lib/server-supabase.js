import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
export function createServerSupabase() {
    const cookieStore = cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    return createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return cookieStore.getAll();
            },
            setAll(cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                }
                catch (_a) {
                    // No-op in Server Components where cookies are read-only.
                }
            },
        },
    });
}
export async function requireUser() {
    const supabase = createServerSupabase();
    const { data: { user }, error, } = await supabase.auth.getUser();
    if (error || !user) {
        throw new Error("UNAUTHORIZED");
    }
    return { supabase, user };
}
