/**
 * LearnLM / Gemini AI client configuration
 * LearnLM is Google's learning-focused AI model accessed through the Gemini API
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

/**
 * Custom error class for LearnLM-related errors
 */
export class LearnLMError extends Error {
    constructor(
        message: string,
        public code?: string,
        public statusCode?: number
    ) {
        super(message);
        this.name = "LearnLMError";
    }
}

/**
 * Check if LearnLM API key is configured
 */
export function isConfigured(): boolean {
    return !!process.env.GEMINI_API_KEY;
}

/**
 * System prompt for the AI chat assistant
 */
export const SYSTEM_PROMPT = `You are a learned Sanskrit scholar helping students understand ancient texts.

Context:
- Current text: {text_name}
- Current verse: {verse_ref}
- Verse content: {sanskrit} | {transliteration} | {translation}
- Neighboring verses: {context_verses}

Guidelines:
1. Always cite specific verses when making claims (e.g., "BG 2.47")
2. Explain Sanskrit terms with transliteration and root meanings
3. Use simple, clear language
4. Connect to practical application when appropriate
5. Never fabricate information - only use provided context
6. If uncertain, say so clearly

User's question: {user_query}`;

/**
 * Generate a chat response using LearnLM/Gemini API with streaming support
 */
export async function generateChatResponse(
    textName: string,
    verseRef: string,
    sanskrit: string | null,
    transliteration: string | null,
    translation: string,
    contextVerses: string,
    userQuery: string,
    onChunk?: (chunk: string) => void
): Promise<string> {
    const prompt = SYSTEM_PROMPT
        .replace("{text_name}", textName)
        .replace("{verse_ref}", verseRef)
        .replace("{sanskrit}", sanskrit || "N/A")
        .replace("{transliteration}", transliteration || "N/A")
        .replace("{translation}", translation)
        .replace("{context_verses}", contextVerses)
        .replace("{user_query}", userQuery);

    // Check if API is configured
    if (!isConfigured()) {
        throw new LearnLMError(
            "LearnLM API key is not configured. Please set GEMINI_API_KEY environment variable.",
            "missing_api_key"
        );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    try {
        if (onChunk) {
            // Streaming response
            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt + "\n\n" + userQuery }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new LearnLMError(
                    errorData.error?.message || "Failed to generate AI response",
                    errorData.error?.code,
                    response.status
                );
            }

            const data = await response.json();
            const fullResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            // Simulate streaming by sending chunks
            const chunkSize = 5;
            for (let i = 0; i < fullResponse.length; i += chunkSize) {
                const chunk = fullResponse.slice(i, i + chunkSize);
                onChunk(chunk);
                await new Promise(resolve => setTimeout(resolve, 10));
            }

            return fullResponse;
        } else {
            // Non-streaming response
            const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: prompt + "\n\n" + userQuery }],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        maxOutputTokens: 1000,
                    },
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new LearnLMError(
                    errorData.error?.message || "Failed to generate AI response",
                    errorData.error?.code,
                    response.status
                );
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
        }
    } catch (error: any) {
        console.error("LearnLM API error:", error);

        // Handle specific error types
        if (error instanceof LearnLMError) {
            throw error;
        }

        if (error?.statusCode === 401) {
            throw new LearnLMError(
                "Invalid API key. Please check your GEMINI_API_KEY.",
                "invalid_api_key",
                401
            );
        }

        if (error?.statusCode === 429) {
            throw new LearnLMError(
                "Rate limit exceeded. Please try again later.",
                "rate_limit_exceeded",
                429
            );
        }

        if (error?.statusCode === 500) {
            throw new LearnLMError(
                "LearnLM service error. Please try again later.",
                "service_error",
                500
            );
        }

        // Generic error
        throw new LearnLMError(
            error?.message || "Failed to generate AI response. Please try again.",
            error?.code,
            error?.statusCode
        );
    }
}

export async function generateSynthesisResponse(query: string, textSummaries: string): Promise<string> {
    if (!isConfigured()) {
        throw new LearnLMError(
            "LearnLM API key is not configured. Please set GEMINI_API_KEY environment variable.",
            "missing_api_key"
        );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const prompt = [
        "You are a Sanskrit research assistant.",
        "Generate a concise synthesis in markdown.",
        `User query: ${query}`,
        "Candidate texts:",
        textSummaries,
        "Output format:",
        "- One short overview paragraph",
        "- 3 bullet points with cross-text insights",
        "- One suggested next step for study",
    ].join("\n");

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [{ text: prompt }],
                },
            ],
            generationConfig: {
                temperature: 0.5,
                maxOutputTokens: 900,
            },
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new LearnLMError(
            errorData.error?.message || "Failed to generate synthesis",
            errorData.error?.code,
            response.status
        );
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

const learnlm = {
    generateChatResponse,
    generateSynthesisResponse,
    isConfigured,
    LearnLMError,
};

export default learnlm;
