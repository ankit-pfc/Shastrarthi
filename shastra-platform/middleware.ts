import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/signup",
    "/auth/callback",
    "/api/auth",
];

export async function middleware(request: NextRequest) {
    const res = NextResponse.next();
    const isPublicRoute = publicRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );

    // Check for auth cookie
    const authCookie = request.cookies.get("sb-access-token");
    const hasAuth = !!authCookie;

    // If user is not signed in and trying to access protected route, redirect to login
    if (!hasAuth && !isPublicRoute) {
        const redirectUrl = new URL("/auth/login", request.url);
        return NextResponse.redirect(redirectUrl);
    }

    // If user is signed in and trying to access auth pages, redirect to home
    if (hasAuth && isPublicRoute && request.nextUrl.pathname.startsWith("/auth")) {
        const redirectUrl = new URL("/", request.url);
        return NextResponse.redirect(redirectUrl);
    }

    return res;
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
