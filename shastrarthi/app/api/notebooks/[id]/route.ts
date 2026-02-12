import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";

interface RouteContext {
    params: { id: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
    try {
        const { supabase, user } = await requireUser();
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
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("GET /api/notebooks/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
    try {
        const { supabase, user } = await requireUser();
        const body = await request.json().catch(() => ({}));
        const title = (body?.title as string | undefined)?.trim();
        const content = body?.content as string | undefined;

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
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("PUT /api/notebooks/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
    try {
        const { supabase, user } = await requireUser();
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
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("DELETE /api/notebooks/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
