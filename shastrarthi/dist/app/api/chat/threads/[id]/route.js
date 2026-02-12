import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
const MAX_CHAT_MESSAGE_LENGTH = 2000;
const MAX_CHAT_THREAD_TITLE_LENGTH = 200;
export const GET = withAuth(async (_request, { params }, { supabase, user }) => {
    try {
        const threadId = params.id;
        const { data: thread } = await supabase
            .from("chat_threads")
            .select("id, title, agent, created_at, updated_at")
            .eq("id", threadId)
            .eq("user_id", user.id)
            .single();
        if (!thread) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }
        const { data: messages, error } = await supabase
            .from("chat_messages")
            .select("id, role, content, created_at")
            .eq("thread_id", threadId)
            .eq("user_id", user.id)
            .order("created_at", { ascending: true });
        if (error) {
            console.error("GET /api/chat/threads/[id] failed:", error);
            return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
        }
        return NextResponse.json({ data: { thread, messages: messages !== null && messages !== void 0 ? messages : [] } });
    }
    catch (error) {
        console.error("GET /api/chat/threads/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const POST = withAuth(async (request, { params }, { supabase, user }) => {
    try {
        const threadId = params.id;
        const body = await request.json();
        const role = body === null || body === void 0 ? void 0 : body.role;
        const content = body === null || body === void 0 ? void 0 : body.content;
        if (!role || !(content === null || content === void 0 ? void 0 : content.trim())) {
            return NextResponse.json({ error: "Missing role or content" }, { status: 400 });
        }
        if (role !== "user" && role !== "assistant") {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }
        if (content.length > MAX_CHAT_MESSAGE_LENGTH) {
            return NextResponse.json({ error: `Content is too long. Maximum ${MAX_CHAT_MESSAGE_LENGTH} characters allowed.` }, { status: 400 });
        }
        const { data, error } = await supabase
            .from("chat_messages")
            .insert({
            thread_id: threadId,
            user_id: user.id,
            role,
            content: content.trim(),
        })
            .select("id, role, content, created_at")
            .single();
        if (error) {
            console.error("POST /api/chat/threads/[id] failed:", error);
            return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
        }
        await supabase
            .from("chat_threads")
            .update({ updated_at: new Date().toISOString() })
            .eq("id", threadId)
            .eq("user_id", user.id);
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("POST /api/chat/threads/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const PATCH = withAuth(async (request, { params }, { supabase, user }) => {
    var _a;
    try {
        const body = await request.json().catch(() => ({}));
        const title = (_a = body === null || body === void 0 ? void 0 : body.title) === null || _a === void 0 ? void 0 : _a.trim();
        if (!title) {
            return NextResponse.json({ error: "Missing title" }, { status: 400 });
        }
        if (title.length > MAX_CHAT_THREAD_TITLE_LENGTH) {
            return NextResponse.json({ error: `Title is too long. Maximum ${MAX_CHAT_THREAD_TITLE_LENGTH} characters allowed.` }, { status: 400 });
        }
        const { data, error } = await supabase
            .from("chat_threads")
            .update({ title })
            .eq("id", params.id)
            .eq("user_id", user.id)
            .select("id, title, agent, created_at, updated_at")
            .single();
        if (error || !data) {
            return NextResponse.json({ error: "Thread not found" }, { status: 404 });
        }
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("PATCH /api/chat/threads/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const DELETE = withAuth(async (_request, { params }, { supabase, user }) => {
    try {
        const { error } = await supabase
            .from("chat_threads")
            .delete()
            .eq("id", params.id)
            .eq("user_id", user.id);
        if (error) {
            console.error("DELETE /api/chat/threads/[id] failed:", error);
            return NextResponse.json({ error: "Failed to delete thread" }, { status: 500 });
        }
        return NextResponse.json({ ok: true });
    }
    catch (error) {
        console.error("DELETE /api/chat/threads/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
