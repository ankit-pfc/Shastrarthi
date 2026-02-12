import { NextResponse } from "next/server";
import { fetchTexts } from "@/lib/services/texts";
export async function GET(request) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const category = searchParams.get("category");
        const difficulty = searchParams.get("difficulty");
        const search = searchParams.get("search");
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : undefined;
        const texts = await fetchTexts({
            category,
            difficulty,
            search,
            limit: Number.isFinite(limit) ? limit : undefined,
        });
        return NextResponse.json({ data: texts });
    }
    catch (error) {
        console.error("GET /api/texts failed:", error);
        return NextResponse.json({ error: "Failed to fetch texts" }, { status: 500 });
    }
}
