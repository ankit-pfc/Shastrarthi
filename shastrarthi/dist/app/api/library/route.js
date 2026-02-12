import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const [{ data: savedTexts }, { data: bookmarks }, { data: notes }] = await Promise.all([
            db
                .from("user_texts")
                .select("saved_at, text:texts(id, slug, title_en, title_sa, category, verse_count)")
                .eq("user_id", user.id)
                .order("saved_at", { ascending: false }),
            db
                .from("bookmarks")
                .select("id, created_at, verse:verses(ref, translation_en, text:texts(slug, title_en))")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false }),
            db
                .from("notes")
                .select("id, content, created_at, verse:verses(ref, translation_en, text:texts(slug, title_en))")
                .eq("user_id", user.id)
                .order("updated_at", { ascending: false }),
        ]);
        return NextResponse.json({
            data: {
                savedTexts: (savedTexts !== null && savedTexts !== void 0 ? savedTexts : []).map((row) => row.text).filter(Boolean),
                bookmarks: (bookmarks !== null && bookmarks !== void 0 ? bookmarks : []).map((row) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return ({
                        id: row.id,
                        verseRef: (_b = (_a = row.verse) === null || _a === void 0 ? void 0 : _a.ref) !== null && _b !== void 0 ? _b : "",
                        verseTranslation: (_d = (_c = row.verse) === null || _c === void 0 ? void 0 : _c.translation_en) !== null && _d !== void 0 ? _d : "",
                        textSlug: (_g = (_f = (_e = row.verse) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f.slug) !== null && _g !== void 0 ? _g : "",
                        textTitle: (_k = (_j = (_h = row.verse) === null || _h === void 0 ? void 0 : _h.text) === null || _j === void 0 ? void 0 : _j.title_en) !== null && _k !== void 0 ? _k : "",
                        createdAt: row.created_at,
                    });
                }),
                notes: (notes !== null && notes !== void 0 ? notes : []).map((row) => {
                    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                    return ({
                        id: row.id,
                        content: row.content,
                        verseRef: (_b = (_a = row.verse) === null || _a === void 0 ? void 0 : _a.ref) !== null && _b !== void 0 ? _b : "",
                        verseTranslation: (_d = (_c = row.verse) === null || _c === void 0 ? void 0 : _c.translation_en) !== null && _d !== void 0 ? _d : "",
                        textSlug: (_g = (_f = (_e = row.verse) === null || _e === void 0 ? void 0 : _e.text) === null || _f === void 0 ? void 0 : _f.slug) !== null && _g !== void 0 ? _g : "",
                        textTitle: (_k = (_j = (_h = row.verse) === null || _h === void 0 ? void 0 : _h.text) === null || _j === void 0 ? void 0 : _j.title_en) !== null && _k !== void 0 ? _k : "",
                        createdAt: row.created_at,
                    });
                }),
            },
        });
    }
    catch (error) {
        console.error("GET /api/library failed:", error);
        return NextResponse.json({ error: "Failed to load library" }, { status: 500 });
    }
});
export const POST = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const body = await request.json();
        const textId = body === null || body === void 0 ? void 0 : body.textId;
        if (!textId) {
            return NextResponse.json({ error: "Missing textId" }, { status: 400 });
        }
        const { data, error } = await db
            .from("user_texts")
            .upsert({ user_id: user.id, text_id: textId }, { onConflict: "user_id,text_id" })
            .select("user_id, text_id")
            .single();
        if (error) {
            console.error("POST /api/library failed:", error);
            return NextResponse.json({ error: "Failed to save text" }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("POST /api/library unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const DELETE = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const body = await request.json().catch(() => ({}));
        const textId = body === null || body === void 0 ? void 0 : body.textId;
        if (!textId) {
            return NextResponse.json({ error: "Missing textId" }, { status: 400 });
        }
        const { error } = await db
            .from("user_texts")
            .delete()
            .eq("user_id", user.id)
            .eq("text_id", textId);
        if (error) {
            console.error("DELETE /api/library failed:", error);
            return NextResponse.json({ error: "Failed to remove saved text" }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }
    catch (error) {
        console.error("DELETE /api/library unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
