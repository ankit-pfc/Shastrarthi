import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateChatResponse, generateSynthesisResponse, isConfigured, LearnLMError } from "@/lib/learnlm";

interface ChatRequestBody {
    textId?: string;
    verseRef?: string;
    query: string;
    conversationHistory?: Array<{ role: string; content: string }>;
}

export async function POST(request: NextRequest) {
    const encoder = new TextEncoder();

    try {
        // Validate request body
        const body: ChatRequestBody = await request.json();
        const { textId, verseRef, query, conversationHistory = [] } = body;

        if (!query) {
            return NextResponse.json(
                { error: "Missing required field: query" },
                { status: 400 }
            );
        }

        // Validate query length
        if (query.trim().length === 0) {
            return NextResponse.json(
                { error: "Query cannot be empty" },
                { status: 400 }
            );
        }

        if (query.length > 1000) {
            return NextResponse.json(
                { error: "Query is too long. Maximum 1000 characters allowed." },
                { status: 400 }
            );
        }

        // Check if LearnLM is configured
        if (!isConfigured()) {
            return NextResponse.json(
                { error: "AI service is not configured. Please contact support." },
                { status: 503 }
            );
        }

        // Generate AI response with streaming
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    let fullResponse = "";

                    if (textId && verseRef) {
                        // Fetch the text and verse for contextual mode
                        const { data: text, error: textError } = await supabase
                            .from("texts")
                            .select("title_en, title_sa")
                            .eq("id", textId)
                            .single();
                        const { data: verse, error: verseError } = await supabase
                            .from("verses")
                            .select("id, ref, sanskrit, transliteration, translation_en, order_index")
                            .eq("id", verseRef)
                            .single();
                        const { data: verses } = await supabase
                            .from("verses")
                            .select("id, ref, sanskrit, transliteration, translation_en, order_index")
                            .eq("text_id", textId)
                            .order("order_index", { ascending: true });

                        if (textError || !text || verseError || !verse) {
                            throw new Error("Could not resolve verse context for chat.");
                        }

                        const currentVerseIndex = verses?.find((v: any) => v.id === verseRef)?.order_index || 0;
                        const contextVerses =
                            verses?.filter((v: any) => Math.abs(v.order_index - currentVerseIndex) <= 3) || [];
                        const contextString = contextVerses.map((v) => `${v.ref}: ${v.translation_en}`).join("\n");

                        fullResponse = await generateChatResponse(
                            text.title_en,
                            verse.ref,
                            verse.sanskrit,
                            verse.transliteration,
                            verse.translation_en,
                            contextString,
                            query
                        );
                    } else {
                        const history = conversationHistory
                            .slice(-8)
                            .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
                            .join("\n");
                        fullResponse = await generateSynthesisResponse(query, history || "No prior context.");
                    }

                    // Send the full response in chunks with SSE format
                    for (const chunk of fullResponse) {
                        const chunkData = encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`);
                        controller.enqueue(chunkData);
                        // Small delay to simulate streaming
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }

                    // Send done signal
                    const doneData = encoder.encode("data: [DONE]\n\n");
                    controller.enqueue(doneData);
                    controller.close();
                } catch (error) {
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
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no", // Disable nginx buffering
            },
        });
    } catch (error) {
        console.error("Chat API error:", error);

        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return NextResponse.json(
                { error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
