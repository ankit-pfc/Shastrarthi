import { NextResponse } from "next/server";
import { generateSynthesisResponse, isConfigured, LearnLMError, resolvePrompt } from "@/lib/learnlm";
import { withAuth } from "@/lib/api-utils";
import { buildRateLimitHeaders, checkRateLimit, getClientIp } from "@/lib/rate-limit";
const MAX_SYNTH_QUERY_LENGTH = 2000;
const MAX_TEXT_TITLE_LENGTH = 300;
const MAX_TEXT_DESCRIPTION_LENGTH = 5000;
const AI_RATE_LIMIT = { windowMs: 60000, maxRequests: 20 };
export const POST = withAuth(async (request, _context, { user }) => {
    var _a;
    const encoder = new TextEncoder();
    try {
        const body = await request.json();
        const query = body === null || body === void 0 ? void 0 : body.query;
        const texts = (_a = body === null || body === void 0 ? void 0 : body.texts) !== null && _a !== void 0 ? _a : [];
        if (!(query === null || query === void 0 ? void 0 : query.trim())) {
            return NextResponse.json({ error: "Missing query" }, { status: 400 });
        }
        if (query.length > MAX_SYNTH_QUERY_LENGTH) {
            return NextResponse.json({ error: `Query is too long. Maximum ${MAX_SYNTH_QUERY_LENGTH} characters allowed.` }, { status: 400 });
        }
        const ip = getClientIp(request);
        const rateLimitResult = checkRateLimit(`ai:${user.id}:${ip}`, AI_RATE_LIMIT);
        if (!rateLimitResult.allowed) {
            return NextResponse.json({ error: "Rate limit exceeded. Please try again shortly." }, {
                status: 429,
                headers: Object.assign(Object.assign({}, buildRateLimitHeaders(rateLimitResult)), { "Retry-After": String(rateLimitResult.retryAfterSeconds) }),
            });
        }
        if (!isConfigured()) {
            return NextResponse.json({ error: "AI service is not configured." }, { status: 503 });
        }
        const textSummaries = texts
            .slice(0, 8)
            .map((text, index) => {
            var _a, _b;
            const title = ((_a = text.title_en) !== null && _a !== void 0 ? _a : "").slice(0, MAX_TEXT_TITLE_LENGTH);
            const description = ((_b = text.description) !== null && _b !== void 0 ? _b : "No summary available.").slice(0, MAX_TEXT_DESCRIPTION_LENGTH);
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
                }
                catch (error) {
                    const message = error instanceof LearnLMError ? error.message : "Failed to generate synthesis response";
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`));
                    controller.close();
                }
            },
        });
        return new Response(stream, {
            headers: Object.assign({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" }, buildRateLimitHeaders(rateLimitResult)),
        });
    }
    catch (error) {
        console.error("POST /api/synthesize failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
