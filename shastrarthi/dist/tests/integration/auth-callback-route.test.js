import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
const { exchangeCodeForSessionMock } = vi.hoisted(() => ({
    exchangeCodeForSessionMock: vi.fn(),
}));
vi.mock("@supabase/ssr", () => ({
    createServerClient: vi.fn(() => ({
        auth: {
            exchangeCodeForSession: exchangeCodeForSessionMock,
        },
    })),
}));
describe("auth callback route", () => {
    beforeEach(() => {
        exchangeCodeForSessionMock.mockReset();
    });
    it("redirects to safe next path on successful code exchange", async () => {
        exchangeCodeForSessionMock.mockResolvedValue({ error: null });
        const route = await import("@/app/auth/callback/route");
        const request = new NextRequest("http://localhost/auth/callback?code=abc&next=/app/library");
        const response = await route.GET(request);
        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toBe("http://localhost/app/library");
    });
    it("redirects to login with error when exchange fails", async () => {
        exchangeCodeForSessionMock.mockResolvedValue({ error: { message: "bad code" } });
        const route = await import("@/app/auth/callback/route");
        const request = new NextRequest("http://localhost/auth/callback?code=bad");
        const response = await route.GET(request);
        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toContain("/auth/login?error=bad%20code");
    });
});
