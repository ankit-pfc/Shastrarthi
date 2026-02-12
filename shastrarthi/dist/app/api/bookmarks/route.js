import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const { data, error } = await db
            .from("bookmarks")
            .select("id, created_at, verse:verses(id, ref, translation_en, text_id, text:texts(slug, title_en))")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
        if (error) {
            console.error("GET /api/bookmarks failed:", error);
            return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
        }
        return NextResponse.json({ data: data !== null && data !== void 0 ? data : [] });
    }
    catch (error) {
        console.error("GET /api/bookmarks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const POST = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const body = await request.json();
        const verseId = body === null || body === void 0 ? void 0 : body.verseId;
        if (!verseId) {
            return NextResponse.json({ error: "Missing verseId" }, { status: 400 });
        }
        const { data, error } = await db
            .from("bookmarks")
            .insert({ user_id: user.id, verse_id: verseId })
            .select("id, verse_id")
            .single();
        if (error) {
            console.error("POST /api/bookmarks failed:", error);
            return NextResponse.json({ error: "Failed to create bookmark" }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("POST /api/bookmarks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const DELETE = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const body = await request.json().catch(() => ({}));
        const bookmarkId = body === null || body === void 0 ? void 0 : body.bookmarkId;
        const verseId = body === null || body === void 0 ? void 0 : body.verseId;
        if (!bookmarkId && !verseId) {
            return NextResponse.json({ error: "Missing bookmarkId or verseId" }, { status: 400 });
        }
        let query = db.from("bookmarks").delete().eq("user_id", user.id);
        if (bookmarkId) {
            query = query.eq("id", bookmarkId);
        }
        if (verseId) {
            query = query.eq("verse_id", verseId);
        }
        const { error } = await query;
        if (error) {
            console.error("DELETE /api/bookmarks failed:", error);
            return NextResponse.json({ error: "Failed to delete bookmark" }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }
    catch (error) {
        console.error("DELETE /api/bookmarks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
