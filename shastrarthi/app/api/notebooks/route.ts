import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";

const MAX_NOTEBOOK_TITLE_LENGTH = 200;
const MAX_NOTEBOOK_CONTENT_LENGTH = 50_000;

export const GET = withAuth(async (request, _context, { supabase, user }) => {
    try {
        const { searchParams } = new URL(request.url);
        const threadId = searchParams.get("thread_id");

        let query = (supabase as any)
            .from("notebooks")
            .select("id, title, content, created_at, updated_at, thread_id")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (threadId) {
            query = query.eq("thread_id", threadId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("GET /api/notebooks failed:", error);
            return NextResponse.json({ error: "Failed to fetch notebooks" }, { status: 500 });
        }

        return NextResponse.json({ data: data ?? [] });
    } catch (error) {
        console.error("GET /api/notebooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});

export const POST = withAuth(async (request: NextRequest, _context, { supabase, user }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const title = (body?.title as string | undefined)?.trim() || "Untitled Notebook";
        const content = (body?.content as string | undefined) ?? "";
        const threadId = body?.thread_id as string | undefined;

        if (title.length > MAX_NOTEBOOK_TITLE_LENGTH) {
            return NextResponse.json(
                { error: `Title is too long. Maximum ${MAX_NOTEBOOK_TITLE_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }
        if (content.length > MAX_NOTEBOOK_CONTENT_LENGTH) {
            return NextResponse.json(
                { error: `Content is too long. Maximum ${MAX_NOTEBOOK_CONTENT_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }

        const { data, error } = await (supabase as any)
            .from("notebooks")
            .insert({
                user_id: user.id,
                title,
                content,
                thread_id: threadId || null,
            })
            .select("id, title, content, created_at, updated_at, thread_id")
            .single();

        if (error) {
            console.error("POST /api/notebooks failed:", error);
            return NextResponse.json({ error: "Failed to create notebook" }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("POST /api/notebooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
