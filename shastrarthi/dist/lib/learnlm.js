import { PROMPT_CONFIGS } from "@/lib/config/prompts";
/**
 * LearnLM / Gemini AI client configuration
 * LearnLM is Google's learning-focused AI model accessed through the Gemini API
 */
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";
function sanitizeForPrompt(input) {
    return input
        .replace(/\u0000/g, "")
        .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, " ")
        .replace(/^\s*(system|assistant|user|model)\s*:/gim, "[role-redacted]:")
        .trim();
}
function buildGeminiHeaders(apiKey) {
    return {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
    };
}
function interpolateTemplate(template, variables) {
    return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key) => { var _a; return (_a = variables[key]) !== null && _a !== void 0 ? _a : ""; });
}
function buildSystemInstruction(promptConfig) {
    const boundariesBlock = promptConfig.boundaries.length
        ? `\n\nHard Boundaries:\n${promptConfig.boundaries.map((rule) => `- ${rule}`).join("\n")}`
        : "";
    return `${promptConfig.systemPrompt.trim()}${boundariesBlock}`;
}
/**
 * Custom error class for LearnLM-related errors
 */
export class LearnLMError extends Error {
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
        this.name = "LearnLMError";
    }
}
/**
 * Check if LearnLM API key is configured
 */
export function isConfigured() {
    return !!process.env.GEMINI_API_KEY;
}
export function resolvePrompt(configId, variables = {}) {
    const config = PROMPT_CONFIGS[configId];
    if (!config) {
        throw new LearnLMError(`Unknown prompt config: ${configId}`, "invalid_prompt_config", 400);
    }
    const sanitizedVariables = Object.fromEntries(Object.entries(variables).map(([key, value]) => [key, sanitizeForPrompt(String(value !== null && value !== void 0 ? value : ""))]));
    return Object.assign(Object.assign({}, config), { systemPrompt: interpolateTemplate(config.systemPrompt, sanitizedVariables), boundaries: config.boundaries.map((boundary) => interpolateTemplate(boundary, sanitizedVariables)) });
}
/**
 * Generate a chat response using LearnLM/Gemini API with streaming support
 */
export async function generateChatResponse(promptConfig, userQuery, onChunk) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    const systemInstruction = buildSystemInstruction(promptConfig);
    const sanitizedUserQuery = sanitizeForPrompt(userQuery);
    // Check if API is configured
    if (!isConfigured()) {
        throw new LearnLMError("LearnLM API key is not configured. Please set GEMINI_API_KEY environment variable.", "missing_api_key");
    }
    const apiKey = process.env.GEMINI_API_KEY;
    try {
        if (onChunk) {
            // Streaming response
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: buildGeminiHeaders(apiKey),
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
                throw new LearnLMError(((_a = errorData.error) === null || _a === void 0 ? void 0 : _a.message) || "Failed to generate AI response", (_b = errorData.error) === null || _b === void 0 ? void 0 : _b.code, response.status);
            }
            const data = await response.json();
            const fullResponse = ((_g = (_f = (_e = (_d = (_c = data.candidates) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.parts) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.text) || "";
            // Simulate streaming by sending chunks
            const chunkSize = 5;
            for (let i = 0; i < fullResponse.length; i += chunkSize) {
                const chunk = fullResponse.slice(i, i + chunkSize);
                onChunk(chunk);
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            return fullResponse;
        }
        else {
            // Non-streaming response
            const response = await fetch(GEMINI_API_URL, {
                method: "POST",
                headers: buildGeminiHeaders(apiKey),
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
                throw new LearnLMError(((_h = errorData.error) === null || _h === void 0 ? void 0 : _h.message) || "Failed to generate AI response", (_j = errorData.error) === null || _j === void 0 ? void 0 : _j.code, response.status);
            }
            const data = await response.json();
            return ((_p = (_o = (_m = (_l = (_k = data.candidates) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.content) === null || _m === void 0 ? void 0 : _m.parts) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.text) || "";
        }
    }
    catch (error) {
        console.error("LearnLM API error:", error);
        // Handle specific error types
        if (error instanceof LearnLMError) {
            throw error;
        }
        if ((error === null || error === void 0 ? void 0 : error.statusCode) === 401) {
            throw new LearnLMError("Invalid API key. Please check your GEMINI_API_KEY.", "invalid_api_key", 401);
        }
        if ((error === null || error === void 0 ? void 0 : error.statusCode) === 429) {
            throw new LearnLMError("Rate limit exceeded. Please try again later.", "rate_limit_exceeded", 429);
        }
        if ((error === null || error === void 0 ? void 0 : error.statusCode) === 500) {
            throw new LearnLMError("LearnLM service error. Please try again later.", "service_error", 500);
        }
        // Generic error
        throw new LearnLMError((error === null || error === void 0 ? void 0 : error.message) || "Failed to generate AI response. Please try again.", error === null || error === void 0 ? void 0 : error.code, error === null || error === void 0 ? void 0 : error.statusCode);
    }
}
export async function generateSynthesisResponse(query, textSummaries, promptConfig, conversationHistory = []) {
    var _a, _b, _c, _d, _e, _f, _g;
    if (!isConfigured()) {
        throw new LearnLMError("LearnLM API key is not configured. Please set GEMINI_API_KEY environment variable.", "missing_api_key");
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
        headers: buildGeminiHeaders(apiKey),
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
                                "Output format:",
                                "- One short overview paragraph",
                                "- 3 bullet points with cross-text insights",
                                "- One suggested next step for study",
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
        throw new LearnLMError(((_a = errorData.error) === null || _a === void 0 ? void 0 : _a.message) || "Failed to generate synthesis", (_b = errorData.error) === null || _b === void 0 ? void 0 : _b.code, response.status);
    }
    const data = await response.json();
    return ((_g = (_f = (_e = (_d = (_c = data.candidates) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.parts) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.text) || "";
}
const learnlm = {
    generateChatResponse,
    generateSynthesisResponse,
    isConfigured,
    LearnLMError,
};
export default learnlm;
