import { describe, expect, it, vi, beforeEach } from "vitest";
const { authContext } = vi.hoisted(() => ({
    authContext: {
        supabase: null,
        user: { id: "user-1" },
    },
}));
vi.mock("@/lib/api-utils", () => ({
    withAuth: (handler) => {
        return (request, context = {}) => handler(request, context, authContext);
    },
}));
const mockGenerateSynthesisResponse = vi.fn();
const mockResolvePrompt = vi.fn();
vi.mock("@/lib/learnlm", () => ({
    generateSynthesisResponse: (...args) => mockGenerateSynthesisResponse(...args),
    resolvePrompt: (id) => mockResolvePrompt(id),
    isConfigured: () => true,
}));
vi.mock("@/lib/rate-limit", () => ({
    getClientIp: () => "127.0.0.1",
    checkRateLimit: () => ({ allowed: true }),
    buildRateLimitHeaders: () => ({}),
}));
function makeJsonRequest(url, method, body) {
    return new Request(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
    });
}
describe("POST /api/tools (simplify & translate, pSEO)", () => {
    beforeEach(() => {
        authContext.user = { id: "user-1" };
        authContext.supabase = null;
        mockResolvePrompt.mockReturnValue({
            id: "simplify",
            systemPrompt: "Simplify.",
            temperature: 0.4,
            maxOutputTokens: 1000,
            boundaries: [],
        });
    });
    it("returns 400 when mode is missing", async () => {
        authContext.supabase = { from: vi.fn() };
        const route = await import("@/app/api/tools/route");
        const response = await route.POST(makeJsonRequest("http://localhost/api/tools", "POST", {}));
        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: "Missing mode" });
    });
    it("returns 400 for unsupported mode", async () => {
        authContext.supabase = { from: vi.fn() };
        const route = await import("@/app/api/tools/route");
        const response = await route.POST(makeJsonRequest("http://localhost/api/tools", "POST", {
            mode: "invalid_mode",
            payload: {},
        }));
        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({ error: "Unsupported mode" });
    });
    it("returns 200 with content and no publicPage when content is too short (quality gate)", async () => {
        mockGenerateSynthesisResponse.mockResolvedValue("Short.");
        authContext.supabase = { from: vi.fn() };
        const route = await import("@/app/api/tools/route");
        const response = await route.POST(makeJsonRequest("http://localhost/api/tools", "POST", {
            mode: "simplify",
            payload: { input: "karmany evadhikaras te", targetLanguage: "English", level: "Simple" },
        }));
        const payload = await response.json();
        expect(response.status).toBe(200);
        expect(payload.data.content).toBe("Short.");
        expect(payload.data.publicPage).toBeNull();
    });
    it("returns 200 with content and publicPage when content passes quality gate and insert succeeds", async () => {
        const longContent = "A".repeat(400);
        mockGenerateSynthesisResponse.mockResolvedValue(longContent);
        const insertSelectSingle = vi.fn().mockResolvedValue({
            data: { slug: "karmany-evadhikaras-te-meaning-english", title: "Karmany evadhikaras te Simplified Meaning in English" },
            error: null,
        });
        const selectEqEqOrderLimit = vi.fn().mockResolvedValue({ data: [], error: null });
        const from = vi.fn((table) => {
            if (table !== "public_pages")
                return {};
            return {
                select: vi.fn((cols) => {
                    if (cols.includes("source_query")) {
                        return {
                            eq: vi.fn(() => ({
                                eq: vi.fn(() => ({
                                    order: vi.fn(() => ({ limit: vi.fn(() => selectEqEqOrderLimit()) })),
                                })),
                            })),
                        };
                    }
                    return {};
                }),
                insert: vi.fn(() => ({ select: vi.fn(() => ({ single: insertSelectSingle })) })),
            };
        });
        authContext.supabase = { from };
        const route = await import("@/app/api/tools/route");
        const response = await route.POST(makeJsonRequest("http://localhost/api/tools", "POST", {
            mode: "simplify",
            payload: { input: "karmany evadhikaras te", targetLanguage: "English", level: "Simple" },
        }));
        const payload = await response.json();
        expect(response.status).toBe(200);
        expect(payload.data.content).toBe(longContent);
        expect(payload.data.publicPage).not.toBeNull();
        expect(payload.data.publicPage.slug).toBe("karmany-evadhikaras-te-meaning-english");
        expect(payload.data.publicPage.url).toContain("/explore/");
    });
    it("returns 200 for translate with valid payload", async () => {
        const longContent = "Translation in Hindi with enough content to pass the minimum length gate. " + "x".repeat(250);
        mockGenerateSynthesisResponse.mockResolvedValue(longContent);
        mockResolvePrompt.mockReturnValue({
            id: "translate",
            systemPrompt: "Translate.",
            temperature: 0.3,
            maxOutputTokens: 1000,
            boundaries: [],
        });
        const insertSelectSingle = vi.fn().mockResolvedValue({
            data: { slug: "gita-2-47-translation-hindi", title: "Gita 2.47 Translation in Hindi" },
            error: null,
        });
        const selectEqEqOrderLimit = vi.fn().mockResolvedValue({ data: [], error: null });
        const from = vi.fn((table) => {
            if (table !== "public_pages")
                return {};
            return {
                select: vi.fn((cols) => {
                    if (cols.includes("source_query")) {
                        return {
                            eq: vi.fn(() => ({
                                eq: vi.fn(() => ({
                                    order: vi.fn(() => ({ limit: vi.fn(() => selectEqEqOrderLimit()) })),
                                })),
                            })),
                        };
                    }
                    return {};
                }),
                insert: vi.fn(() => ({ select: vi.fn(() => ({ single: insertSelectSingle })) })),
            };
        });
        authContext.supabase = { from };
        const route = await import("@/app/api/tools/route");
        const response = await route.POST(makeJsonRequest("http://localhost/api/tools", "POST", {
            mode: "translate",
            payload: { input: "Bhagavad Gita 2.47", targetLanguage: "Hindi" },
        }));
        const payload = await response.json();
        expect(response.status).toBe(200);
        expect(payload.data.content).toBe(longContent);
        expect(payload.data.publicPage).not.toBeNull();
        expect(payload.data.publicPage.slug).toBe("gita-2-47-translation-hindi");
    });
});
