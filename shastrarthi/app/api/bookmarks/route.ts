import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";

export async function GET() {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const { data, error } = await db
            .from("bookmarks")
            .select("id, created_at, verse:verses(id, ref, translation_en, text_id, text:texts(slug, title_en))")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("GET /api/bookmarks failed:", error);
            return NextResponse.json({ error: "Failed to fetch bookmarks" }, { status: 500 });
        }

        return NextResponse.json({ data: data ?? [] });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("GET /api/bookmarks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const body = await request.json();
        const verseId = body?.verseId as string | undefined;

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
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("POST /api/bookmarks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const body = await request.json().catch(() => ({}));
        const bookmarkId = body?.bookmarkId as string | undefined;
        const verseId = body?.verseId as string | undefined;

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
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("DELETE /api/bookmarks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
