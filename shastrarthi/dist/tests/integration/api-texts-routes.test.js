import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
const { fetchTextsMock, supabaseMock } = vi.hoisted(() => ({
    fetchTextsMock: vi.fn(),
    supabaseMock: {
        from: vi.fn(),
    },
}));
vi.mock("@/lib/services/texts", () => ({
    fetchTexts: fetchTextsMock,
}));
vi.mock("@/lib/supabase", () => ({
    supabase: supabaseMock,
}));
describe("texts API routes", () => {
    beforeEach(() => {
        fetchTextsMock.mockReset();
        supabaseMock.from.mockReset();
    });
    it("passes filters to fetchTexts", async () => {
        fetchTextsMock.mockResolvedValue([{ id: "t1", slug: "gita" }]);
        const route = await import("@/app/api/texts/route");
        const request = new NextRequest("http://localhost/api/texts?category=Itihasa&difficulty=beginner&search=gita&limit=5");
        const response = await route.GET(request);
        const payload = await response.json();
        expect(fetchTextsMock).toHaveBeenCalledWith({
            category: "Itihasa",
            difficulty: "beginner",
            search: "gita",
            limit: 5,
        });
        expect(response.status).toBe(200);
        expect(payload.data).toHaveLength(1);
    });
    it("returns 404 when text slug is missing", async () => {
        supabaseMock.from.mockImplementation(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    single: vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } }),
                })),
            })),
        }));
        const route = await import("@/app/api/texts/[slug]/route");
        const response = await route.GET(new NextRequest("http://localhost/api/texts/missing"), {
            params: { slug: "missing" },
        });
        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ error: "Text not found" });
    });
});
