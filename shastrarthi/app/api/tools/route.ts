import { NextRequest, NextResponse } from "next/server";
import { generateSynthesisResponse, isConfigured } from "@/lib/learnlm";
import { withAuth } from "@/lib/api-utils";
import { buildRateLimitHeaders, checkRateLimit, getClientIp } from "@/lib/rate-limit";

const MAX_TOOL_FIELD_LENGTH = 5000;
const MAX_TOOL_STYLE_LENGTH = 100;
const AI_RATE_LIMIT = { windowMs: 60_000, maxRequests: 20 } as const;

function readBoundedString(
    payload: Record<string, unknown>,
    key: string,
    maxLength: number
): { ok: true; value: string } | { ok: false } {
    const value = payload[key];
    if (value == null) return { ok: true, value: "" };
    if (typeof value !== "string") return { ok: false };
    if (value.length > maxLength) return { ok: false };
    return { ok: true, value };
}

export const POST = withAuth(async (request: NextRequest, _context, { user }) => {
    try {
        const body = await request.json().catch(() => ({}));
        const mode = body?.mode as string | undefined;
        const payload = (body?.payload ?? {}) as Record<string, unknown>;

        if (!mode) {
            return NextResponse.json({ error: "Missing mode" }, { status: 400 });
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

        let prompt = "";
        let context = "";

        if (mode === "writer_draft") {
            const title = readBoundedString(payload, "title", MAX_TOOL_FIELD_LENGTH);
            const bodyText = readBoundedString(payload, "body", MAX_TOOL_FIELD_LENGTH);
            if (!title.ok || !bodyText.ok) {
                return NextResponse.json(
                    { error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` },
                    { status: 400 }
                );
            }
            prompt = `Write a structured draft titled "${title.value || "Untitled"}".`;
            context = `Topic/body notes:\n${bodyText.value}`;
        } else if (mode === "writer_citations") {
            const bodyText = readBoundedString(payload, "body", MAX_TOOL_FIELD_LENGTH);
            if (!bodyText.ok) {
                return NextResponse.json(
                    { error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` },
                    { status: 400 }
                );
            }
            prompt = "Insert verse-style citations into the given draft where appropriate.";
            context = bodyText.value;
        } else if (mode === "simplify") {
            const inputText = readBoundedString(payload, "input", MAX_TOOL_FIELD_LENGTH);
            if (!inputText.ok) {
                return NextResponse.json(
                    { error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` },
                    { status: 400 }
                );
            }
            prompt = "Simplify the given passage into clear modern language while preserving philosophical meaning.";
            context = inputText.value;
        } else if (mode === "extract") {
            const question = readBoundedString(payload, "question", MAX_TOOL_FIELD_LENGTH);
            const contextText = readBoundedString(payload, "context", MAX_TOOL_FIELD_LENGTH);
            if (!question.ok || !contextText.ok) {
                return NextResponse.json(
                    { error: `Payload fields must be strings up to ${MAX_TOOL_FIELD_LENGTH} characters.` },
                    { status: 400 }
                );
            }
            prompt = `Extract concise insights and verse-like references relevant to this question: ${question.value}`;
            context = contextText.value;
        } else if (mode === "reference") {
            const style = readBoundedString(payload, "style", MAX_TOOL_STYLE_LENGTH);
            const source = readBoundedString(payload, "source", MAX_TOOL_FIELD_LENGTH);
            if (!style.ok || !source.ok) {
                return NextResponse.json(
                    { error: `Payload fields must be strings and respect length limits.` },
                    { status: 400 }
                );
            }
            prompt = `Generate citation output in ${style.value || "APA"} style for source: ${source.value}`;
            context = "Return only the final citation line.";
        } else {
            return NextResponse.json({ error: "Unsupported mode" }, { status: 400 });
        }

        const content = await generateSynthesisResponse(prompt, context);
        return NextResponse.json(
            { data: { content } },
            {
                headers: {
                    ...buildRateLimitHeaders(rateLimitResult),
                },
            }
        );
    } catch (error) {
        console.error("POST /api/tools failed:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
