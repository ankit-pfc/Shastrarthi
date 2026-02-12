import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";

const MAX_CHAT_THREAD_TITLE_LENGTH = 200;
const MAX_CHAT_THREAD_AGENT_LENGTH = 100;

export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
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
        console.error("GET /api/chat/threads unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});

export const POST = withAuth(async (request: NextRequest, _context, { supabase, user }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const title = (body?.title as string | undefined)?.trim() || "New chat";
        const agent = (body?.agent as string | undefined)?.trim() || null;

        if (title.length > MAX_CHAT_THREAD_TITLE_LENGTH) {
            return NextResponse.json(
                { error: `Title is too long. Maximum ${MAX_CHAT_THREAD_TITLE_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }
        if (agent && agent.length > MAX_CHAT_THREAD_AGENT_LENGTH) {
            return NextResponse.json(
                { error: `Agent is too long. Maximum ${MAX_CHAT_THREAD_AGENT_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }

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
        console.error("POST /api/chat/threads unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
