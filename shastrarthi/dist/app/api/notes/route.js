import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
const MAX_NOTE_CONTENT_LENGTH = 10000;
export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const { data, error } = await db
            .from("notes")
            .select("id, content, created_at, updated_at, verse:verses(id, ref, translation_en, text:texts(slug, title_en))")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });
        if (error) {
            console.error("GET /api/notes failed:", error);
            return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
        }
        return NextResponse.json({ data: data !== null && data !== void 0 ? data : [] });
    }
    catch (error) {
        console.error("GET /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const POST = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const body = await request.json();
        const verseId = body === null || body === void 0 ? void 0 : body.verseId;
        const content = body === null || body === void 0 ? void 0 : body.content;
        if (!verseId || !(content === null || content === void 0 ? void 0 : content.trim())) {
            return NextResponse.json({ error: "Missing verseId or content" }, { status: 400 });
        }
        if (content.length > MAX_NOTE_CONTENT_LENGTH) {
            return NextResponse.json({ error: `Content is too long. Maximum ${MAX_NOTE_CONTENT_LENGTH} characters allowed.` }, { status: 400 });
        }
        const { data, error } = await db
            .from("notes")
            .insert({
            user_id: user.id,
            verse_id: verseId,
            content: content.trim(),
        })
            .select("id, content, verse_id")
            .single();
        if (error) {
            console.error("POST /api/notes failed:", error);
            return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("POST /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const PUT = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const body = await request.json();
        const noteId = body === null || body === void 0 ? void 0 : body.noteId;
        const content = body === null || body === void 0 ? void 0 : body.content;
        if (!noteId || !(content === null || content === void 0 ? void 0 : content.trim())) {
            return NextResponse.json({ error: "Missing noteId or content" }, { status: 400 });
        }
        if (content.length > MAX_NOTE_CONTENT_LENGTH) {
            return NextResponse.json({ error: `Content is too long. Maximum ${MAX_NOTE_CONTENT_LENGTH} characters allowed.` }, { status: 400 });
        }
        const { data, error } = await db
            .from("notes")
            .update({ content: content.trim() })
            .eq("id", noteId)
            .eq("user_id", user.id)
            .select("id, content, updated_at")
            .single();
        if (error) {
            console.error("PUT /api/notes failed:", error);
            return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("PUT /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const DELETE = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const db = supabase;
        const body = await request.json().catch(() => ({}));
        const noteId = body === null || body === void 0 ? void 0 : body.noteId;
        if (!noteId) {
            return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
        }
        const { error } = await db.from("notes").delete().eq("id", noteId).eq("user_id", user.id);
        if (error) {
            console.error("DELETE /api/notes failed:", error);
            return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }
    catch (error) {
        console.error("DELETE /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
