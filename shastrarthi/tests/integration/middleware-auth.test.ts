import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { getUserMock } = vi.hoisted(() => ({
    getUserMock: vi.fn(),
}));

vi.mock("@supabase/ssr", () => ({
    createServerClient: vi.fn(() => ({
        auth: {
            getUser: getUserMock,
        },
    })),
}));

describe("middleware auth behavior", () => {
    beforeEach(() => {
        getUserMock.mockReset();
        process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321";
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";
        (process.env as Record<string, string | undefined>).NODE_ENV = "test";
    });

    it("redirects protected route to login without auth cookie", async () => {
        const { middleware } = await import("@/middleware");
        const response = await middleware(new NextRequest("http://localhost/app/library"));

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toBe(
            "http://localhost/auth/login?redirect=%2Fapp%2Flibrary"
        );
    });

    it("redirects to /app for authenticated user visiting login", async () => {
        getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
        const { middleware } = await import("@/middleware");
        const request = new NextRequest("http://localhost/auth/login", {
            headers: { cookie: "sb-local-auth-token=1" },
        });

        const response = await middleware(request);

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toBe("http://localhost/app");
    });

    it("redirects to requested path when authenticated user visits login with redirect param", async () => {
        getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
        const { middleware } = await import("@/middleware");
        const request = new NextRequest("http://localhost/auth/login?redirect=%2Fapp%2Fdiscover", {
            headers: { cookie: "sb-local-auth-token=1" },
        });

        const response = await middleware(request);

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toBe("http://localhost/app/discover");
    });

    it("allows protected route with valid session", async () => {
        getUserMock.mockResolvedValue({ data: { user: { id: "u1" } } });
        const { middleware } = await import("@/middleware");
        const request = new NextRequest("http://localhost/app/discover", {
            headers: { cookie: "sb-local-auth-token=1" },
        });

        const response = await middleware(request);

        expect(response.status).toBe(200);
    });
});
