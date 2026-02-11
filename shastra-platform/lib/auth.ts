import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { Database } from "./supabase";

/**
 * Create a Supabase client for server-side operations
 * Uses cookies to maintain session
 */
export async function createClient(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
        cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                request.cookies.set({
                    name,
                    value,
                    ...options,
                });
                response.cookies.set({
                    name,
                    value,
                    ...options,
                });
            },
            remove(name: string, options: CookieOptions) {
                request.cookies.delete(name);
                response.cookies.set(name, "", { ...options, maxAge: 0 });
            },
        },
    });

    return supabase;
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser(request: NextRequest) {
    const supabase = await createClient(request);
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(request: NextRequest) {
    const user = await getCurrentUser(request);
    return !!user;
}
