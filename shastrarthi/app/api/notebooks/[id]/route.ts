import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";

const MAX_NOTEBOOK_TITLE_LENGTH = 200;
const MAX_NOTEBOOK_CONTENT_LENGTH = 50_000;

interface RouteContext {
    params: { id: string };
}

export const GET = withAuth(async (_request: NextRequest, { params }: RouteContext, { supabase, user }) => {
    try {
        const { data, error } = await (supabase as any)
            .from("notebooks")
            .select("id, title, content, created_at, updated_at")
            .eq("id", params.id)
            .eq("user_id", user.id)
            .single();

        if (error || !data) {
            return NextResponse.json({ error: "Notebook not found" }, { status: 404 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("GET /api/notebooks/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});

export const PUT = withAuth(async (request: NextRequest, { params }: RouteContext, { supabase, user }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const title = (body?.title as string | undefined)?.trim();
        const content = body?.content as string | undefined;

        if (typeof title === "string" && title.length > MAX_NOTEBOOK_TITLE_LENGTH) {
            return NextResponse.json(
                { error: `Title is too long. Maximum ${MAX_NOTEBOOK_TITLE_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }
        if (typeof content === "string" && content.length > MAX_NOTEBOOK_CONTENT_LENGTH) {
            return NextResponse.json(
                { error: `Content is too long. Maximum ${MAX_NOTEBOOK_CONTENT_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }

        const updatePayload: Record<string, unknown> = {};
        if (typeof title === "string") updatePayload.title = title;
        if (typeof content === "string") updatePayload.content = content;

        const { data, error } = await (supabase as any)
            .from("notebooks")
            .update(updatePayload)
            .eq("id", params.id)
            .eq("user_id", user.id)
            .select("id, title, content, created_at, updated_at")
            .single();

        if (error) {
            console.error("PUT /api/notebooks/[id] failed:", error);
            return NextResponse.json({ error: "Failed to update notebook" }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        console.error("PUT /api/notebooks/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});

export const DELETE = withAuth(async (_request: NextRequest, { params }: RouteContext, { supabase, user }) => {
    try {
        const { error } = await (supabase as any)
            .from("notebooks")
            .delete()
            .eq("id", params.id)
            .eq("user_id", user.id);

        if (error) {
            console.error("DELETE /api/notebooks/[id] failed:", error);
            return NextResponse.json({ error: "Failed to delete notebook" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("DELETE /api/notebooks/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
