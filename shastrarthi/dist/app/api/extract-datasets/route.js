import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";
const MAX_DATASET_NAME_LENGTH = 200;
const MAX_DATASET_SIZE_KB = 1024; // 1MB
export const GET = withAuth(async (_request, _context, { supabase, user }) => {
    try {
        const { data, error } = await supabase
            .from("extract_datasets")
            .select("id, name, created_at, updated_at")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });
        if (error) {
            console.error("GET /api/extract-datasets failed:", error);
            return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 });
        }
        return NextResponse.json({ data: data !== null && data !== void 0 ? data : [] });
    }
    catch (error) {
        console.error("GET /api/extract-datasets unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
export const POST = withAuth(async (request, _context, { supabase, user }) => {
    var _a;
    try {
        const body = await request.json().catch(() => ({}));
        const name = (_a = body === null || body === void 0 ? void 0 : body.name) === null || _a === void 0 ? void 0 : _a.trim();
        const data = body === null || body === void 0 ? void 0 : body.data; // JSONB data
        if (!name) {
            return NextResponse.json({ error: "Dataset name is required" }, { status: 400 });
        }
        if (name.length > MAX_DATASET_NAME_LENGTH) {
            return NextResponse.json({ error: `Dataset name is too long. Maximum ${MAX_DATASET_NAME_LENGTH} characters allowed.` }, { status: 400 });
        }
        if (!data || typeof data !== "object" || !Array.isArray(data)) {
            return NextResponse.json({ error: "Dataset data must be an array of objects" }, { status: 400 });
        }
        const dataSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
        if (dataSize > MAX_DATASET_SIZE_KB * 1024) {
            return NextResponse.json({ error: `Dataset size exceeds limit of ${MAX_DATASET_SIZE_KB}KB.` }, { status: 400 });
        }
        const { data: newDataset, error } = await supabase
            .from("extract_datasets")
            .insert({
            user_id: user.id,
            name,
            data,
        })
            .select("id, name, created_at, updated_at")
            .single();
        if (error) {
            console.error("POST /api/extract-datasets failed:", error);
            return NextResponse.json({ error: "Failed to create dataset" }, { status: 500 });
        }
        return NextResponse.json({ data: newDataset });
    }
    catch (error) {
        console.error("POST /api/extract-datasets unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
