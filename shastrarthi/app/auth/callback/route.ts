import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/lib/supabase";

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next");
    const safeNext = next?.startsWith("/") ? next : "/app/discover";

    let response = NextResponse.redirect(new URL(safeNext, requestUrl.origin));

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });

    if (code) {
        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
                console.error("Auth callback error:", error);
                response = NextResponse.redirect(
                    new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
                );
                return response;
            }
        } catch (error) {
            console.error("Unexpected auth callback error:", error);
            response = NextResponse.redirect(
                new URL("/auth/login?error=Authentication+failed", requestUrl.origin)
            );
            return response;
        }
    }

    return response;
}
