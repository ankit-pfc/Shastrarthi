export const LEGACY_REDIRECTS = {
    "/discover": "/app/discover",
    "/library": "/app/library",
    "/lists": "/app/shastras",
};
export function getCanonicalRedirect(pathname) {
    var _a;
    if (pathname.startsWith("/reader/")) {
        return `/app${pathname}`;
    }
    return (_a = LEGACY_REDIRECTS[pathname]) !== null && _a !== void 0 ? _a : null;
}
export function isProtectedAppRoute(pathname) {
    return pathname === "/app" || pathname.startsWith("/app/");
}
export function isPublicRoute(pathname) {
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
export function hasSupabaseAuthCookie(cookieNames) {
    return cookieNames.some((name) => {
        const lower = name.toLowerCase();
        return lower.startsWith("sb-") && (lower.includes("auth-token") || lower.includes("access-token"));
    });
}
export function isLocalhostHost(host) {
    if (!host)
        return false;
    const normalized = host.toLowerCase();
    return normalized.startsWith("localhost:") || normalized === "localhost" || normalized.startsWith("127.0.0.1:");
}
