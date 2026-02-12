import { NextRequest, NextResponse } from "next/server";
import { generateSynthesisResponse, isConfigured } from "@/lib/learnlm";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json().catch(() => ({}));
        const mode = body?.mode as string | undefined;
        const payload = body?.payload ?? {};

        if (!mode) {
            return NextResponse.json({ error: "Missing mode" }, { status: 400 });
        }

        if (!isConfigured()) {
            return NextResponse.json({ error: "AI service is not configured." }, { status: 503 });
        }

        let prompt = "";
        let context = "";

        if (mode === "writer_draft") {
            prompt = `Write a structured draft titled "${payload.title ?? "Untitled"}".`;
            context = `Topic/body notes:\n${payload.body ?? ""}`;
        } else if (mode === "writer_citations") {
            prompt = "Insert verse-style citations into the given draft where appropriate.";
            context = payload.body ?? "";
        } else if (mode === "simplify") {
            prompt = "Simplify the given passage into clear modern language while preserving philosophical meaning.";
            context = payload.input ?? "";
        } else if (mode === "extract") {
            prompt = `Extract concise insights and verse-like references relevant to this question: ${payload.question ?? ""}`;
            context = payload.context ?? "";
        } else if (mode === "reference") {
            prompt = `Generate citation output in ${payload.style ?? "APA"} style for source: ${payload.source ?? ""}`;
            context = "Return only the final citation line.";
        } else {
            return NextResponse.json({ error: "Unsupported mode" }, { status: 400 });
        }

        const content = await generateSynthesisResponse(prompt, context);
        return NextResponse.json({ data: { content } });
    } catch (error) {
        console.error("POST /api/tools failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
