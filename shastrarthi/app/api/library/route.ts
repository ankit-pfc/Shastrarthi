import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";

export async function GET() {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;

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
                savedTexts: (savedTexts ?? []).map((row: any) => row.text).filter(Boolean),
                bookmarks: (bookmarks ?? []).map((row: any) => ({
                    id: row.id,
                    verseRef: row.verse?.ref ?? "",
                    verseTranslation: row.verse?.translation_en ?? "",
                    textSlug: row.verse?.text?.slug ?? "",
                    textTitle: row.verse?.text?.title_en ?? "",
                    createdAt: row.created_at,
                })),
                notes: (notes ?? []).map((row: any) => ({
                    id: row.id,
                    content: row.content,
                    verseRef: row.verse?.ref ?? "",
                    verseTranslation: row.verse?.translation_en ?? "",
                    textSlug: row.verse?.text?.slug ?? "",
                    textTitle: row.verse?.text?.title_en ?? "",
                    createdAt: row.created_at,
                })),
            },
        });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("GET /api/library failed:", error);
        return NextResponse.json({ error: "Failed to load library" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const body = await request.json();
        const textId = body?.textId as string | undefined;

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
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("POST /api/library unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const db = supabase as any;
        const body = await request.json().catch(() => ({}));
        const textId = body?.textId as string | undefined;

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
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("DELETE /api/library unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
