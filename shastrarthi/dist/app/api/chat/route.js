import { NextResponse } from "next/server";
import { generateChatResponse, generateSynthesisResponse, isConfigured, LearnLMError, resolvePrompt } from "@/lib/learnlm";
import { withAuth } from "@/lib/api-utils";
import { buildRateLimitHeaders, checkRateLimit, getClientIp } from "@/lib/rate-limit";
const MAX_CHAT_QUERY_LENGTH = 2000;
const AI_RATE_LIMIT = { windowMs: 60000, maxRequests: 20 };
function sanitizeConversationHistory(history) {
    return history
        .slice(-8)
        .filter((msg) => msg && typeof msg.content === "string")
        .map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content.slice(0, 2000),
    }));
}
const AGENT_PROMPT_CONFIG_IDS = {
    advaita: "agentAdvaita",
    yoga: "agentYoga",
    etymology: "agentEtymology",
    tantra: "agentTantra",
    sanatan: "agentSanatan",
};
export const POST = withAuth(async (request, _context, { supabase, user }) => {
    const encoder = new TextEncoder();
    try {
        // Validate request body
        const body = await request.json();
        const { textId, verseRef, agent, query, conversationHistory = [] } = body;
        if (!query) {
            return NextResponse.json({ error: "Missing required field: query" }, { status: 400 });
        }
        // Validate query length
        if (query.trim().length === 0) {
            return NextResponse.json({ error: "Query cannot be empty" }, { status: 400 });
        }
        if (query.length > MAX_CHAT_QUERY_LENGTH) {
            return NextResponse.json({ error: `Query is too long. Maximum ${MAX_CHAT_QUERY_LENGTH} characters allowed.` }, { status: 400 });
        }
        const ip = getClientIp(request);
        const rateLimitResult = checkRateLimit(`ai:${user.id}:${ip}`, AI_RATE_LIMIT);
        if (!rateLimitResult.allowed) {
            return NextResponse.json({ error: "Rate limit exceeded. Please try again shortly." }, {
                status: 429,
                headers: Object.assign(Object.assign({}, buildRateLimitHeaders(rateLimitResult)), { "Retry-After": String(rateLimitResult.retryAfterSeconds) }),
            });
        }
        // Check if LearnLM is configured
        if (!isConfigured()) {
            return NextResponse.json({ error: "AI service is not configured. Please contact support." }, { status: 503 });
        }
        // Generate AI response with streaming
        const stream = new ReadableStream({
            async start(controller) {
                var _a, _b, _c;
                try {
                    let fullResponse = "";
                    if (textId && verseRef) {
                        // Fetch the text and verse for contextual mode
                        const { data: textData, error: textError } = await supabase
                            .from("texts")
                            .select("title_en, title_sa")
                            .eq("id", textId)
                            .single();
                        const { data: verseData, error: verseError } = await supabase
                            .from("verses")
                            .select("id, ref, sanskrit, transliteration, translation_en, order_index")
                            .eq("id", verseRef)
                            .single();
                        const { data: versesData } = await supabase
                            .from("verses")
                            .select("id, ref, sanskrit, transliteration, translation_en, order_index")
                            .eq("text_id", textId)
                            .order("order_index", { ascending: true });
                        const text = textData;
                        const verse = verseData;
                        const verses = (versesData !== null && versesData !== void 0 ? versesData : []);
                        if (textError || !text || verseError || !verse) {
                            throw new Error("Could not resolve verse context for chat.");
                        }
                        const currentVerseIndex = ((_a = verses === null || verses === void 0 ? void 0 : verses.find((v) => v.id === verseRef)) === null || _a === void 0 ? void 0 : _a.order_index) || 0;
                        const contextVerses = (verses === null || verses === void 0 ? void 0 : verses.filter((v) => Math.abs(v.order_index - currentVerseIndex) <= 3)) || [];
                        const contextString = contextVerses.map((v) => `${v.ref}: ${v.translation_en}`).join("\n");
                        const promptConfig = resolvePrompt((_b = AGENT_PROMPT_CONFIG_IDS[agent !== null && agent !== void 0 ? agent : ""]) !== null && _b !== void 0 ? _b : "readerChat", {
                            text_name: text.title_en,
                            verse_ref: verse.ref,
                            sanskrit: verse.sanskrit || "N/A",
                            transliteration: verse.transliteration || "N/A",
                            translation: verse.translation_en,
                            context_verses: contextString,
                        });
                        fullResponse = await generateChatResponse(promptConfig, query);
                    }
                    else {
                        const history = sanitizeConversationHistory(conversationHistory);
                        const promptConfig = resolvePrompt((_c = AGENT_PROMPT_CONFIG_IDS[agent !== null && agent !== void 0 ? agent : ""]) !== null && _c !== void 0 ? _c : "synthesis");
                        fullResponse = await generateSynthesisResponse(query, "No verse context provided.", promptConfig, history);
                    }
                    // Send response in moderate chunks so UI updates quickly without per-character events.
                    const chunkSize = 100;
                    for (let i = 0; i < fullResponse.length; i += chunkSize) {
                        const chunk = fullResponse.slice(i, i + chunkSize);
                        const chunkData = encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`);
                        controller.enqueue(chunkData);
                    }
                    // Send done signal
                    const doneData = encoder.encode("data: [DONE]\n\n");
                    controller.enqueue(doneData);
                    controller.close();
                }
                catch (error) {
                    console.error("AI generation error:", error);
                    let errorMessage = "Failed to generate AI response";
                    if (error instanceof LearnLMError) {
                        errorMessage = error.message;
                    }
                    const errorData = encoder.encode(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
                    controller.enqueue(errorData);
                    controller.close();
                }
            },
        });
        return new Response(stream, {
            headers: Object.assign({ "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", "Connection": "keep-alive", "X-Accel-Buffering": "no" }, buildRateLimitHeaders(rateLimitResult)),
        });
    }
    catch (error) {
        console.error("Chat API error:", error);
        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
});
