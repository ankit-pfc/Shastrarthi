import { describe, expect, it, vi, beforeEach } from "vitest";

const { authContext } = vi.hoisted(() => ({
    authContext: {
        supabase: null as any,
        user: { id: "user-1" },
    },
}));

vi.mock("@/lib/api-utils", () => ({
    withAuth: (handler: any) => {
        return (request: Request, context: unknown = {}) => handler(request, context, authContext);
    },
}));

function makeJsonRequest(url: string, method: string, body?: unknown): Request {
    return new Request(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
}

describe("protected API routes", () => {
    beforeEach(() => {
        authContext.user = { id: "user-1" };
        authContext.supabase = null;
    });

    it("returns bookmarks for authenticated user", async () => {
        const order = vi.fn().mockResolvedValue({ data: [{ id: "b1" }], error: null });
        const eq = vi.fn(() => ({ order }));
        const select = vi.fn(() => ({ eq }));
        authContext.supabase = { from: vi.fn(() => ({ select })) };

        const route = await import("@/app/api/bookmarks/route");
        const response = await route.GET(makeJsonRequest("http://localhost/api/bookmarks", "GET"));
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload).toEqual({ data: [{ id: "b1" }] });
    });

    it("validates bookmarks POST payload", async () => {
        authContext.supabase = { from: vi.fn() };
        const route = await import("@/app/api/bookmarks/route");
        const response = await route.POST(makeJsonRequest("http://localhost/api/bookmarks", "POST", {}));

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: "Missing verseId" });
    });

    it("returns 400 for invalid reading progress payload", async () => {
        authContext.supabase = { from: vi.fn() };
        const route = await import("@/app/api/reading-progress/route");
        const response = await route.POST(
            makeJsonRequest("http://localhost/api/reading-progress", "POST", { textId: "", lastVerseIndex: "x" })
        );

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: "Invalid payload" });
    });

    it("returns library aggregate data", async () => {
        const savedOrder = vi.fn().mockResolvedValue({
            data: [{ text: { id: "t1", title_en: "Gita" } }],
            error: null,
        });
        const bookmarksOrder = vi.fn().mockResolvedValue({
            data: [{ id: "b1", created_at: "now", verse: { ref: "2.47", translation_en: "Karma", text: { slug: "gita", title_en: "Gita" } } }],
            error: null,
        });
        const notesOrder = vi.fn().mockResolvedValue({
            data: [{ id: "n1", content: "note", created_at: "now", verse: { ref: "2.47", translation_en: "Karma", text: { slug: "gita", title_en: "Gita" } } }],
            error: null,
        });

        authContext.supabase = {
            from: vi.fn((table: string) => {
                const order = table === "user_texts" ? savedOrder : table === "bookmarks" ? bookmarksOrder : notesOrder;
                return {
                    select: vi.fn(() => ({
                        eq: vi.fn(() => ({
                            order,
                        })),
                    })),
                };
            }),
        };

        const route = await import("@/app/api/library/route");
        const response = await route.GET(makeJsonRequest("http://localhost/api/library", "GET"));
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload.data.savedTexts).toHaveLength(1);
        expect(payload.data.bookmarks[0].verseRef).toBe("2.47");
        expect(payload.data.notes[0].content).toBe("note");
    });

    it("returns 404 when ShastraBook is not found", async () => {
        const single = vi.fn().mockResolvedValue({ data: null, error: { message: "not found" } });
        const select = vi.fn(() => ({ eq: vi.fn(() => ({ eq: vi.fn(() => ({ single })) })) }));
        authContext.supabase = { from: vi.fn(() => ({ select })) };

        const route = await import("@/app/api/shastrabooks/[id]/route");
        const response = await route.GET(makeJsonRequest("http://localhost/api/shastrabooks/abc", "GET"), {
            params: { id: "abc" },
        });

        expect(response.status).toBe(404);
        await expect(response.json()).resolves.toEqual({ error: "ShastraBook not found" });
    });

    it("validates append payload for ShastraBook content", async () => {
        authContext.supabase = { from: vi.fn() };
        const route = await import("@/app/api/shastrabooks/[id]/append/route");
        const response = await route.POST(makeJsonRequest("http://localhost/api/shastrabooks/abc/append", "POST", {}), {
            params: { id: "abc" },
        });

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: "Missing content to append" });
    });

    it("appends content to ShastraBook", async () => {
        const fetchSingle = vi.fn().mockResolvedValue({
            data: { id: "nb1", content: "Existing content", title: "My Book" },
            error: null,
        });
        const updateSingle = vi.fn().mockResolvedValue({
            data: { id: "nb1", content: "Existing content\n\n---\n\nNew block", title: "My Book" },
            error: null,
        });

        const selectQuery = { eq: vi.fn() as any };
        selectQuery.eq.mockImplementationOnce(() => ({
            eq: vi.fn(() => ({ single: fetchSingle })),
        }));

        const updateQuery = { eq: vi.fn() as any };
        updateQuery.eq.mockImplementationOnce(() => ({
            eq: vi.fn(() => ({
                select: vi.fn(() => ({ single: updateSingle })),
            })),
        }));

        authContext.supabase = {
            from: vi.fn(() => ({
                select: vi.fn(() => selectQuery),
                update: vi.fn(() => updateQuery),
            })),
        };

        const route = await import("@/app/api/shastrabooks/[id]/append/route");
        const response = await route.POST(
            makeJsonRequest("http://localhost/api/shastrabooks/nb1/append", "POST", { content: "New block" }),
            { params: { id: "nb1" } }
        );
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload.data.content).toContain("New block");
    });

    it("creates chat thread message with valid payload", async () => {
        const single = vi.fn().mockResolvedValue({ data: { id: "m1", role: "user", content: "Hi" }, error: null });
        const insert = vi.fn(() => ({ select: vi.fn(() => ({ single })) }));
        const updateEq: any = {};
        updateEq.eq = vi.fn(() => updateEq);
        authContext.supabase = {
            from: vi.fn((table: string) =>
                table === "chat_messages"
                    ? { insert }
                    : { update: vi.fn(() => updateEq) }
            ),
        };

        const route = await import("@/app/api/chat/threads/[id]/route");
        const response = await route.POST(
            makeJsonRequest("http://localhost/api/chat/threads/thread-1", "POST", { role: "user", content: "Hi" }),
            { params: { id: "thread-1" } }
        );
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload.data.id).toBe("m1");
    });

    it("renames chat thread with valid payload", async () => {
        const single = vi.fn().mockResolvedValue({
            data: { id: "thread-1", title: "Renamed thread", agent: null },
            error: null,
        });
        const updateQuery: any = {};
        updateQuery.eq = vi.fn(() => updateQuery);
        updateQuery.select = vi.fn(() => ({ single }));

        authContext.supabase = {
            from: vi.fn(() => ({
                update: vi.fn(() => updateQuery),
            })),
        };

        const route = await import("@/app/api/chat/threads/[id]/route");
        const response = await route.PATCH(
            makeJsonRequest("http://localhost/api/chat/threads/thread-1", "PATCH", { title: "Renamed thread" }),
            { params: { id: "thread-1" } }
        );
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload.data.title).toBe("Renamed thread");
    });

    it("deletes chat thread with valid payload", async () => {
        const eqQuery: any = {};
        eqQuery.eq = vi.fn(() => eqQuery);

        authContext.supabase = {
            from: vi.fn(() => ({
                delete: vi.fn(() => eqQuery),
            })),
        };

        const route = await import("@/app/api/chat/threads/[id]/route");
        const response = await route.DELETE(makeJsonRequest("http://localhost/api/chat/threads/thread-1", "DELETE"), {
            params: { id: "thread-1" },
        });
        const payload = await response.json();

        expect(response.status).toBe(200);
        expect(payload).toEqual({ ok: true });
    });
});
