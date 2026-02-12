import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const next = requestUrl.searchParams.get("next") || "/";

    if (code) {
        try {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
                console.error("Auth callback error:", error);
                // Redirect to login with error
                return NextResponse.redirect(
                    new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
                );
            }
        } catch (error) {
            console.error("Unexpected auth callback error:", error);
            return NextResponse.redirect(
                new URL("/auth/login?error=Authentication+failed", requestUrl.origin)
            );
        }
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(next, requestUrl.origin));
}
