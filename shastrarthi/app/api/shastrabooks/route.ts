import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";

const MAX_SHASTRABOOK_TITLE_LENGTH = 200;
const MAX_SHASTRABOOK_CONTENT_LENGTH = 50_000;

export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
        const { data, error } = await (supabase as any)
            .from("notebooks")
            .select("id, title, content, created_at, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("GET /api/shastrabooks failed:", error);
            return NextResponse.json({ error: "Failed to fetch ShastraBooks" }, { status: 500 });
        }

        return NextResponse.json({ data: data ?? [] });
    } catch (error) {
        console.error("GET /api/shastrabooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});

export const POST = withAuth(async (request: NextRequest, _context, { supabase, user }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const title = (body?.title as string | undefined)?.trim() || "Untitled ShastraBook";
        const content = (body?.content as string | undefined) ?? "";

        if (title.length > MAX_SHASTRABOOK_TITLE_LENGTH) {
            return NextResponse.json(
                { error: `Title is too long. Maximum ${MAX_SHASTRABOOK_TITLE_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }
        if (content.length > MAX_SHASTRABOOK_CONTENT_LENGTH) {
            return NextResponse.json(
                { error: `Content is too long. Maximum ${MAX_SHASTRABOOK_CONTENT_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }

        const { data, error } = await (supabase as any)
            .from("notebooks")
            .insert({
                user_id: user.id,
                title,
                content,
            })
            .select("id, title, content, created_at, updated_at")
            .single();

        if (error) {
            console.error("POST /api/shastrabooks failed:", error);
            return NextResponse.json({ error: "Failed to create ShastraBook" }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("POST /api/shastrabooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
