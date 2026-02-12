import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/api-utils";

interface RouteContext {
    params: { id: string };
}

const MAX_DATASET_NAME_LENGTH = 200;
const MAX_DATASET_SIZE_KB = 1024; // 1MB

export const GET = withAuth(async (_request: NextRequest, { params }: RouteContext, { supabase, user }) => {
    try {
        const { data: dataset, error } = await (supabase as any)
            .from("extract_datasets")
            .select("id, name, data, created_at, updated_at")
            .eq("id", params.id)
            .eq("user_id", user.id)
            .single();

        if (error || !dataset) {
            return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
        }

        return NextResponse.json({ data: dataset });
    } catch (error) {
        console.error("GET /api/extract-datasets/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});

export const PUT = withAuth(async (request: NextRequest, { params }: RouteContext, { supabase, user }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const name = (body?.name as string | undefined)?.trim();
        const data = body?.data; // JSONB data

        const updatePayload: Record<string, unknown> = {};

        if (typeof name === "string") {
            if (name.length > MAX_DATASET_NAME_LENGTH) {
                return NextResponse.json(
                    { error: `Dataset name is too long. Maximum ${MAX_DATASET_NAME_LENGTH} characters allowed.` },
                    { status: 400 }
                );
            }
            updatePayload.name = name;
        }

        if (data !== undefined) {
            if (typeof data !== "object" || !Array.isArray(data)) {
                return NextResponse.json({ error: "Dataset data must be an array of objects" }, { status: 400 });
            }
            const dataSize = Buffer.byteLength(JSON.stringify(data), 'utf8');
            if (dataSize > MAX_DATASET_SIZE_KB * 1024) {
                return NextResponse.json(
                    { error: `Dataset size exceeds limit of ${MAX_DATASET_SIZE_KB}KB.` },
                    { status: 400 }
                );
            }
            updatePayload.data = data;
        }

        if (Object.keys(updatePayload).length === 0) {
            return NextResponse.json({ error: "No fields to update" }, { status: 400 });
        }

        const { data: updatedDataset, error } = await (supabase as any)
            .from("extract_datasets")
            .update(updatePayload)
            .eq("id", params.id)
            .eq("user_id", user.id)
            .select("id, name, created_at, updated_at")
            .single();

        if (error) {
            console.error("PUT /api/extract-datasets/[id] failed:", error);
            return NextResponse.json({ error: "Failed to update dataset" }, { status: 500 });
        }

        return NextResponse.json({ data: updatedDataset });
    } catch (error) {
        console.error("PUT /api/extract-datasets/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});

export const DELETE = withAuth(async (_request: NextRequest, { params }: RouteContext, { supabase, user }) => {
    try {
        const { error } = await (supabase as any)
            .from("extract_datasets")
            .delete()
            .eq("id", params.id)
            .eq("user_id", user.id);

        if (error) {
            console.error("DELETE /api/extract-datasets/[id] failed:", error);
            return NextResponse.json({ error: "Failed to delete dataset" }, { status: 500 });
        }

        return NextResponse.json({ ok: true });
    } catch (error) {
        console.error("DELETE /api/extract-datasets/[id] unexpected error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
