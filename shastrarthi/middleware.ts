import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase";
import {
    getCanonicalRedirect,
    hasSupabaseAuthCookie,
    isLocalhostHost,
    isProtectedAppRoute,
} from "@/lib/routing";

if (process.env.NODE_ENV === "production" && process.env.E2E_AUTH_BYPASS === "1") {
    throw new Error("E2E_AUTH_BYPASS must never be enabled in production.");
}

export async function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const canonical = getCanonicalRedirect(pathname);
    if (canonical) {
        return NextResponse.redirect(new URL(`${canonical}${search}`, request.url));
    }

    const cookieNames = request.cookies.getAll().map((cookie) => cookie.name);
    const host = request.headers.get("host");
    const bypassAuthForE2E =
        process.env.E2E_AUTH_BYPASS === "1" && request.headers.get("x-e2e-auth") === "1";
    const bypassAuthForLocalhost = process.env.NODE_ENV !== "production" && isLocalhostHost(host);
    const hasAuthCookie = hasSupabaseAuthCookie(cookieNames);
    let hasValidSession = false;
    const response = NextResponse.next({ request });

    if (hasAuthCookie) {
        const supabase = createServerClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return request.cookies.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            request.cookies.set(name, value);
                            response.cookies.set(name, value, options);
                        });
                    },
                },
            }
        );

        const {
            data: { user },
        } = await supabase.auth.getUser();
        hasValidSession = Boolean(user);
    }

    const canAccessProtectedApp = hasValidSession || bypassAuthForE2E || bypassAuthForLocalhost;

    if (!canAccessProtectedApp && isProtectedAppRoute(pathname)) {
        const redirectUrl = new URL("/auth/login", request.url);
        redirectUrl.searchParams.set("redirect", `${pathname}${search}`);
        return NextResponse.redirect(redirectUrl);
    }

    if (hasValidSession && (pathname === "/auth/login" || pathname === "/auth/signup")) {
        const redirectUrl = new URL("/app", request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
    ],
};
