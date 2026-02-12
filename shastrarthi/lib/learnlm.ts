import { PROMPT_CONFIGS, type PromptConfig } from "@/lib/config/prompts";

/**
 * LearnLM / Gemini AI client configuration
 * LearnLM is Google's learning-focused AI model accessed through the Gemini API
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

type ChatHistoryMessage = {
    role: "user" | "assistant";
    content: string;
};

function sanitizeForPrompt(input: string): string {
    return input
        .replace(/\u0000/g, "")
        .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
        .replace(/^\s*(system|assistant|user|model)\s*:/gim, "[role-redacted]:")
        .trim();
}

function buildGeminiHeaders(apiKey: string): Record<string, string> {
    return {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
    };
}

function interpolateTemplate(template: string, variables: Record<string, string>): string {
    return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => variables[key] ?? "");
}

function buildSystemInstruction(promptConfig: PromptConfig): string {
    const boundariesBlock = promptConfig.boundaries.length
        ? `\n\nHard Boundaries:\n${promptConfig.boundaries.map((rule) => `- ${rule}`).join("\n")}`
        : "";
    return `${promptConfig.systemPrompt.trim()}${boundariesBlock}`;
}

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

export function resolvePrompt(configId: string, variables: Record<string, string> = {}): PromptConfig {
    const config = PROMPT_CONFIGS[configId];
    if (!config) {
        throw new LearnLMError(`Unknown prompt config: ${configId}`, "invalid_prompt_config", 400);
    }

    const sanitizedVariables = Object.fromEntries(
        Object.entries(variables).map(([key, value]) => [key, sanitizeForPrompt(String(value ?? ""))])
    );

    return {
        ...config,
        systemPrompt: interpolateTemplate(config.systemPrompt, sanitizedVariables),
        boundaries: config.boundaries.map((boundary) => interpolateTemplate(boundary, sanitizedVariables)),
    };
}

/**
 * Generate a chat response using LearnLM/Gemini API with streaming support
 */
export async function generateChatResponse(
    promptConfig: PromptConfig,
    userQuery: string,
    onChunk?: (chunk: string) => void
): Promise<string> {
    const systemInstruction = buildSystemInstruction(promptConfig);
    const sanitizedUserQuery = sanitizeForPrompt(userQuery);

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
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: buildGeminiHeaders(apiKey!),
                body: JSON.stringify({
                    systemInstruction: {
                        role: "system",
                        parts: [{ text: systemInstruction }],
                    },
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: sanitizedUserQuery }],
                        },
                    ],
                    generationConfig: {
                        temperature: promptConfig.temperature,
                        maxOutputTokens: promptConfig.maxOutputTokens,
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
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: buildGeminiHeaders(apiKey!),
                body: JSON.stringify({
                    systemInstruction: {
                        role: "system",
                        parts: [{ text: systemInstruction }],
                    },
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: sanitizedUserQuery }],
                        },
                    ],
                    generationConfig: {
                        temperature: promptConfig.temperature,
                        maxOutputTokens: promptConfig.maxOutputTokens,
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

export async function generateSynthesisResponse(
    query: string,
    textSummaries: string,
    promptConfig: PromptConfig,
    conversationHistory: ChatHistoryMessage[] = []
): Promise<string> {
    if (!isConfigured()) {
        throw new LearnLMError(
            "LearnLM API key is not configured. Please set GEMINI_API_KEY environment variable.",
            "missing_api_key"
        );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const sanitizedQuery = sanitizeForPrompt(query);
    const sanitizedTextSummaries = sanitizeForPrompt(textSummaries);
    const sanitizedHistory = conversationHistory
        .slice(-8)
        .map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: sanitizeForPrompt(msg.content) }],
        }));

    const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: buildGeminiHeaders(apiKey!),
        body: JSON.stringify({
            systemInstruction: {
                role: "system",
                parts: [
                    {
                        text: buildSystemInstruction(promptConfig),
                    },
                ],
            },
            contents: [
                ...sanitizedHistory,
                {
                    role: "user",
                    parts: [
                        {
                            text: [
                                `User query: ${sanitizedQuery}`,
                                "Candidate texts:",
                                sanitizedTextSummaries,
                            ].join("\n"),
                        },
                    ],
                },
            ],
            generationConfig: {
                temperature: promptConfig.temperature,
                maxOutputTokens: promptConfig.maxOutputTokens,
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
