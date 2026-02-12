import { NextRequest, NextResponse } from "next/server";
import { generateSynthesisResponse, isConfigured, LearnLMError, resolvePrompt } from "@/lib/learnlm";
import { withAuth } from "@/lib/api-utils";
import { buildRateLimitHeaders, checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_SYNTH_QUERY_LENGTH = 2000;
const MAX_TEXT_TITLE_LENGTH = 300;
const MAX_TEXT_DESCRIPTION_LENGTH = 5000;
const AI_RATE_LIMIT = { windowMs: 60_000, maxRequests: 20 } as const;

export const POST = withAuth(async (request: NextRequest, _context, { user }) => {
    const encoder = new TextEncoder();

    try {
        const body = await request.json();
        const query = body?.query as string | undefined;
        const texts = (body?.texts as Array<{ title_en: string; description: string | null }> | undefined) ?? [];

        if (!query?.trim()) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }

        if (query.length > MAX_SYNTH_QUERY_LENGTH) {
            return NextResponse.json(
                { error: `Query is too long. Maximum ${MAX_SYNTH_QUERY_LENGTH} characters allowed.` },
                { status: 400 }
            );
        }

        const ip = getClientIp(request);
        const rateLimitResult = checkRateLimit(`ai:${user.id}:${ip}`, AI_RATE_LIMIT);
        if (!rateLimitResult.allowed) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Please try again shortly." },
                {
                    status: 429,
                    headers: {
                        ...buildRateLimitHeaders(rateLimitResult),
                        "Retry-After": String(rateLimitResult.retryAfterSeconds),
                    },
                }
            );
        }

        if (!isConfigured()) {
            return NextResponse.json({ error: "AI service is not configured." }, { status: 503 });
        }

        const textSummaries = texts
            .slice(0, 8)
            .map((text, index) => {
                const title = (text.title_en ?? "").slice(0, MAX_TEXT_TITLE_LENGTH);
                const description = (text.description ?? "No summary available.").slice(0, MAX_TEXT_DESCRIPTION_LENGTH);
                return `${index + 1}. ${title}: ${description}`;
            })
            .join("\n");

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const promptConfig = resolvePrompt("synthesis");
                    const fullResponse = await generateSynthesisResponse(query, textSummaries, promptConfig);
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
                ...buildRateLimitHeaders(rateLimitResult),
            },
        });
    } catch (error) {
        console.error("POST /api/synthesize failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
