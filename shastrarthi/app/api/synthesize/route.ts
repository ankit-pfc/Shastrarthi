import { NextRequest, NextResponse } from "next/server";
import { generateSynthesisResponse, isConfigured, LearnLMError } from "@/lib/learnlm";

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();

    try {
        const body = await request.json();
        const query = body?.query as string | undefined;
        const texts = (body?.texts as Array<{ title_en: string; description: string | null }> | undefined) ?? [];

        if (!query?.trim()) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }

        if (!isConfigured()) {
            return NextResponse.json({ error: "AI service is not configured." }, { status: 503 });
        }

        const textSummaries = texts
            .slice(0, 8)
            .map((text, index) => `${index + 1}. ${text.title_en}: ${text.description ?? "No summary available."}`)
            .join("\n");

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const fullResponse = await generateSynthesisResponse(query, textSummaries);
                    for (const chunk of fullResponse) {
                        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
                        await new Promise((resolve) => setTimeout(resolve, 8));
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (error) {
                    const message =
                        error instanceof LearnLMError ? error.message : "Failed to generate synthesis response";
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("POST /api/synthesize failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
