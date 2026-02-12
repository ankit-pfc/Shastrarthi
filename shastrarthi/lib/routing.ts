export const LEGACY_REDIRECTS: Record<string, string> = {
    "/discover": "/app/discover",
    "/library": "/app/library",
    "/lists": "/app/shastras",
};

export function getCanonicalRedirect(pathname: string): string | null {
    if (pathname.startsWith("/reader/")) {
        return `/app${pathname}`;
    }

    return LEGACY_REDIRECTS[pathname] ?? null;
}

export function isProtectedAppRoute(pathname: string): boolean {
    return pathname === "/app" || pathname.startsWith("/app/");
}

export function isPublicRoute(pathname: string): boolean {
    const publicExact = new Set([
        "/",
        "/about",
        "/traditions",
        "/pricing",
        "/auth/login",
        "/auth/signup",
        "/auth/callback",
    ]);

    return publicExact.has(pathname);
}

export function hasSupabaseAuthCookie(cookieNames: string[]): boolean {
    return cookieNames.some((name) => {
        const lower = name.toLowerCase();
        return lower.startsWith("sb-") && (lower.includes("auth-token") || lower.includes("access-token"));
    });
}

export function isLocalhostHost(host: string | null | undefined): boolean {
    if (!host) return false;
    const normalized = host.toLowerCase();
    return normalized.startsWith("localhost:") || normalized === "localhost" || normalized.startsWith("127.0.0.1:");
}
