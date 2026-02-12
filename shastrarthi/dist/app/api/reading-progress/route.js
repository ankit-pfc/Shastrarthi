import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
export const GET = withAuth(async (request, _context, { supabase, user }) => {
    var _a, _b;
    try {
        const db = supabase;
        const { searchParams } = new URL(request.url);
        const textId = (_a = searchParams.get("textId")) === null || _a === void 0 ? void 0 : _a.trim();
        if (!textId) {
            return NextResponse.json({ error: "Missing textId" }, { status: 400 });
        }
        const { data, error } = await db
            .from("reading_progress")
            .select("text_id, last_verse_index, completed_at")
            .eq("user_id", user.id)
            .eq("text_id", textId)
            .maybeSingle();
        if (error) {
            console.error("GET /api/reading-progress failed:", error);
            return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
        }
        return NextResponse.json({
            data: {
                textId,
                // Stored value represents a 1-based verse position; convert back to 0-based index for UI state.
                lastVerseIndex: Math.max(0, Number((_b = data === null || data === void 0 ? void 0 : data.last_verse_index) !== null && _b !== void 0 ? _b : 0) - 1),
                completed: Boolean(data === null || data === void 0 ? void 0 : data.completed_at),
            },
        });
    }
    catch (error) {
        console.error("GET /api/reading-progress unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const POST = withAuth(async (request, _context, { supabase, user }) => {
    var _a;
    try {
        const db = supabase;
        const body = await request.json();
        const textId = body === null || body === void 0 ? void 0 : body.textId;
        const lastVerseIndex = Number((_a = body === null || body === void 0 ? void 0 : body.lastVerseIndex) !== null && _a !== void 0 ? _a : 0);
        const completed = Boolean(body === null || body === void 0 ? void 0 : body.completed);
        if (!textId || Number.isNaN(lastVerseIndex)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }
        const { error } = await db.from("reading_progress").upsert({
            user_id: user.id,
            text_id: textId,
            last_verse_index: Math.max(0, lastVerseIndex),
            completed_at: completed ? new Date().toISOString() : null,
        }, { onConflict: "user_id,text_id" });
        if (error) {
            console.error("POST /api/reading-progress failed:", error);
            return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }
    catch (error) {
        console.error("POST /api/reading-progress unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
