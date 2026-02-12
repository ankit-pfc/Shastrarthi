import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";

export const POST = withAuth(async (request: NextRequest, _context, { supabase, user }) => {
    try {
        const db = supabase as any;
        const body = await request.json();
        const textId = body?.textId as string | undefined;
        const lastVerseIndex = Number(body?.lastVerseIndex ?? 0);
        const completed = Boolean(body?.completed);

        if (!textId || Number.isNaN(lastVerseIndex)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const { error } = await db.from("reading_progress").upsert(
            {
                user_id: user.id,
                text_id: textId,
                last_verse_index: Math.max(0, lastVerseIndex),
                completed_at: completed ? new Date().toISOString() : null,
            },
            { onConflict: "user_id,text_id" }
        );

        if (error) {
            console.error("POST /api/reading-progress failed:", error);
            return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("POST /api/reading-progress unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
