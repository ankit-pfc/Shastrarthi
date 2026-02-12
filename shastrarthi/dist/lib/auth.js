import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
/**
 * Create a Supabase client for server-side operations
 * Uses cookies to maintain session
 */
export async function createClient(request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name) {
                var _a;
                return (_a = request.cookies.get(name)) === null || _a === void 0 ? void 0 : _a.value;
            },
            set(name, value, options) {
                request.cookies.set(Object.assign({ name,
                    value }, options));
                response.cookies.set(Object.assign({ name,
                    value }, options));
            },
            remove(name, options) {
                request.cookies.delete(name);
                response.cookies.set(name, "", Object.assign(Object.assign({}, options), { maxAge: 0 }));
            },
        },
    });
    return supabase;
}
/**
 * Get the current user from the session
 */
export async function getCurrentUser(request) {
    const supabase = await createClient(request);
    const { data: { user }, } = await supabase.auth.getUser();
    return user;
}
/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(request) {
    const user = await getCurrentUser(request);
    return !!user;
}
