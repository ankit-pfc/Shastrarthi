import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";

export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
        const db = supabase as any;

        const { data, error } = await db
            .from("reading_progress")
            .select(`
                text_id,
                last_verse_index,
                completed_at,
                texts (
                    id,
                    title_en,
                    slug,
                    category
                )
            `)
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(5);

        if (error) {
            console.error("GET /api/reading-progress/all failed:", error);
            return NextResponse.json({ error: "Failed to fetch reading progress" }, { status: 500 });
        }

        const formattedData = (data ?? []).map((item: any) => ({
            textId: item.text_id,
            lastVerseIndex: Math.max(0, Number(item.last_verse_index ?? 0) - 1),
            completed: Boolean(item.completed_at),
            text: item.texts,
        }));

        return NextResponse.json({ data: formattedData });
    } catch (error) {
        console.error("GET /api/reading-progress/all unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
