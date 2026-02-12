import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
const MAX_SHASTRABOOK_CONTENT_LENGTH = 50000;
export const POST = withAuth(async (request, { params }, { supabase, user }) => {
    var _a;
    try {
        const body = await request.json().catch(() => ({}));
        const contentToAppend = (_a = body === null || body === void 0 ? void 0 : body.content) === null || _a === void 0 ? void 0 : _a.trim();
        if (!contentToAppend) {
            return NextResponse.json({ error: "Missing content to append" }, { status: 400 });
        }
        const { data: existingShastraBook, error: fetchError } = await supabase
            .from("notebooks")
            .select("id, title, content, created_at, updated_at")
            .eq("id", params.id)
            .eq("user_id", user.id)
            .single();
        if (fetchError || !existingShastraBook) {
            return NextResponse.json({ error: "ShastraBook not found" }, { status: 404 });
        }
        const appendedContent = existingShastraBook.content
            ? `${existingShastraBook.content.trimEnd()}\n\n---\n\n${contentToAppend}`
            : contentToAppend;
        if (appendedContent.length > MAX_SHASTRABOOK_CONTENT_LENGTH) {
            return NextResponse.json({ error: `Content is too long. Maximum ${MAX_SHASTRABOOK_CONTENT_LENGTH} characters allowed.` }, { status: 400 });
        }
        const { data, error: updateError } = await supabase
            .from("notebooks")
            .update({ content: appendedContent })
            .eq("id", params.id)
            .eq("user_id", user.id)
            .select("id, title, content, created_at, updated_at")
            .single();
        if (updateError) {
            console.error("POST /api/shastrabooks/[id]/append failed:", updateError);
            return NextResponse.json({ error: "Failed to append ShastraBook content" }, { status: 500 });
        }
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("POST /api/shastrabooks/[id]/append unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
