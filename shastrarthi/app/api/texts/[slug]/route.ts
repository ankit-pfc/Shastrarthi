import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface RouteContext {
    params: { slug: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
    try {
        const slug = decodeURIComponent(params.slug);

        const { data: text, error: textError } = await supabase
            .from("texts")
            .select("*")
            .eq("slug", slug)
            .single();

        if (textError || !text) {
            return NextResponse.json({ error: "Text not found" }, { status: 404 });
        }

        const { data: verses, error: versesError } = await supabase
            .from("verses")
            .select("*")
            .eq("text_id", text.id)
            .order("order_index", { ascending: true });

        if (versesError) {
            console.error("GET /api/texts/[slug] verses error:", versesError);
            return NextResponse.json({ error: "Failed to fetch verses" }, { status: 500 });
        }

        return NextResponse.json({
            data: {
                ...text,
                verses: verses ?? [],
            },
        });
    } catch (error) {
        console.error("GET /api/texts/[slug] failed:", error);
        return NextResponse.json({ error: "Failed to fetch text details" }, { status: 500 });
    }
}
