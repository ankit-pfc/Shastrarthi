import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/server-supabase";

export async function GET() {
    try {
        const { supabase, user } = await requireUser();
        const { data, error } = await (supabase as any)
            .from("chat_threads")
            .select("id, title, agent, created_at, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        if (error) {
            console.error("GET /api/chat/threads failed:", error);
            return NextResponse.json({ error: "Failed to fetch threads" }, { status: 500 });
        }

        return NextResponse.json({ data: data ?? [] });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("GET /api/chat/threads unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const { supabase, user } = await requireUser();
        const body = await request.json().catch(() => ({}));
        const title = (body?.title as string | undefined)?.trim() || "New chat";
        const agent = (body?.agent as string | undefined)?.trim() || null;

        const { data, error } = await (supabase as any)
            .from("chat_threads")
            .insert({
                user_id: user.id,
                title,
                agent,
            })
            .select("id, title, agent, created_at, updated_at")
            .single();

        if (error) {
            console.error("POST /api/chat/threads failed:", error);
            return NextResponse.json({ error: "Failed to create thread" }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.error("POST /api/chat/threads unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
