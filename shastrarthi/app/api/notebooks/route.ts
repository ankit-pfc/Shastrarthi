import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";

export async function GET() {
    try {
        const { supabase, user } = await requireUser();
        const { data, error } = await (supabase as any)
            .from("notebooks")
            .select("id, title, content, created_at, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("GET /api/notebooks failed:", error);
            return NextResponse.json({ error: "Failed to fetch notebooks" }, { status: 500 });
        }

        return NextResponse.json({ data: data ?? [] });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("GET /api/notebooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const body = await request.json().catch(() => ({}));
        const title = (body?.title as string | undefined)?.trim() || "Untitled Notebook";
        const content = (body?.content as string | undefined) ?? "";

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
            console.error("POST /api/notebooks failed:", error);
            return NextResponse.json({ error: "Failed to create notebook" }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("POST /api/notebooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
