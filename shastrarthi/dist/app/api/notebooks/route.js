import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
const MAX_NOTEBOOK_TITLE_LENGTH = 200;
const MAX_NOTEBOOK_CONTENT_LENGTH = 50000;
export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
        const { data, error } = await supabase
            .from("notebooks")
            .select("id, title, content, created_at, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });
        if (error) {
            console.error("GET /api/notebooks failed:", error);
            return NextResponse.json({ error: "Failed to fetch notebooks" }, { status: 500 });
        }
        return NextResponse.json({ data: data !== null && data !== void 0 ? data : [] });
    }
    catch (error) {
        console.error("GET /api/notebooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const POST = withAuth(async (request, _context, { supabase, user }) => {
    var _a, _b;
    try {
        const body = await request.json().catch(() => ({}));
        const title = ((_a = body === null || body === void 0 ? void 0 : body.title) === null || _a === void 0 ? void 0 : _a.trim()) || "Untitled Notebook";
        const content = (_b = body === null || body === void 0 ? void 0 : body.content) !== null && _b !== void 0 ? _b : "";
        if (title.length > MAX_NOTEBOOK_TITLE_LENGTH) {
            return NextResponse.json({ error: `Title is too long. Maximum ${MAX_NOTEBOOK_TITLE_LENGTH} characters allowed.` }, { status: 400 });
        }
        if (content.length > MAX_NOTEBOOK_CONTENT_LENGTH) {
            return NextResponse.json({ error: `Content is too long. Maximum ${MAX_NOTEBOOK_CONTENT_LENGTH} characters allowed.` }, { status: 400 });
        }
        const { data, error } = await supabase
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
    }
    catch (error) {
        console.error("POST /api/notebooks unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
