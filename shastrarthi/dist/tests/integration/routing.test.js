import { getCanonicalRedirect, hasSupabaseAuthCookie, isProtectedAppRoute, isPublicRoute, } from "@/lib/routing";
describe("routing helpers", () => {
    it("maps legacy routes to canonical app routes", () => {
        expect(getCanonicalRedirect("/discover")).toBe("/app/discover");
        expect(getCanonicalRedirect("/library")).toBe("/app/library");
        expect(getCanonicalRedirect("/lists")).toBe("/app/shastras");
        expect(getCanonicalRedirect("/reader/yoga-sutras")).toBe("/app/reader/yoga-sutras");
    });
    it("classifies app-protected and public routes", () => {
        expect(isProtectedAppRoute("/app")).toBe(true);
        expect(isProtectedAppRoute("/app/discover")).toBe(true);
        expect(isProtectedAppRoute("/discover")).toBe(false);
        expect(isPublicRoute("/")).toBe(true);
        expect(isPublicRoute("/auth/login")).toBe(true);
        expect(isPublicRoute("/app")).toBe(false);
    });
    it("detects supabase auth cookies", () => {
        expect(hasSupabaseAuthCookie(["sb-localhost-auth-token"])).toBe(true);
        expect(hasSupabaseAuthCookie(["sb-access-token"])).toBe(true);
        expect(hasSupabaseAuthCookie(["session"])).toBe(false);
    });
});
