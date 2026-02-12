import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";

export async function GET() {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const { data, error } = await db
            .from("notes")
            .select("id, content, created_at, updated_at, verse:verses(id, ref, translation_en, text:texts(slug, title_en))")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("GET /api/notes failed:", error);
            return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
        }

        return NextResponse.json({ data: data ?? [] });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("GET /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const body = await request.json();
        const verseId = body?.verseId as string | undefined;
        const content = body?.content as string | undefined;

        if (!verseId || !content?.trim()) {
            return NextResponse.json({ error: "Missing verseId or content" }, { status: 400 });
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
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("POST /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const body = await request.json();
        const noteId = body?.noteId as string | undefined;
        const content = body?.content as string | undefined;

        if (!noteId || !content?.trim()) {
            return NextResponse.json({ error: "Missing noteId or content" }, { status: 400 });
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
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("PUT /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const body = await request.json().catch(() => ({}));
        const noteId = body?.noteId as string | undefined;

        if (!noteId) {
            return NextResponse.json({ error: "Missing noteId" }, { status: 400 });
        }

        const { error } = await db.from("notes").delete().eq("id", noteId).eq("user_id", user.id);

        if (error) {
            console.error("DELETE /api/notes failed:", error);
            return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("DELETE /api/notes unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
