"use client";

import { useEffect, useMemo, useState } from "react";
import { BookmarkPlus, Compass, Download } from "lucide-react";
import type { Text } from "@/lib/supabase";

interface AIAnswerProps {
    query: string;
    texts: Text[];
}

export default function AIAnswer({ query, texts }: AIAnswerProps) {
    const topCount = Math.min(texts.length, 5);
    const categories = Array.from(new Set(texts.map((text) => text.category))).slice(0, 3);
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const requestPayload = useMemo(
        () => ({
            query,
            texts: texts.slice(0, 8).map((text) => ({
                title_en: text.title_en,
                description: text.description,
            })),
        }),
        [query, texts]
    );

    useEffect(() => {
        let isCancelled = false;

        const generateSynthesis = async () => {
            setIsLoading(true);
            setResponse("");
            setError(null);

            try {
                const apiResponse = await fetch("/api/synthesize", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestPayload),
                });

                if (!apiResponse.ok || !apiResponse.body) {
                    throw new Error("Failed to generate synthesis");
                }

                const reader = apiResponse.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let done = false;

                while (!done && !isCancelled) {
                    const readResult = await reader.read();
                    done = readResult.done;
                    buffer += decoder.decode(readResult.value ?? new Uint8Array(), { stream: true });
                    const chunks = buffer.split("\n\n");
                    buffer = chunks.pop() ?? "";

                    for (const chunk of chunks) {
                        const line = chunk.trim();
                        if (!line.startsWith("data:")) continue;
                        const data = line.replace(/^data:\s*/, "");
                        if (data === "[DONE]") {
                            done = true;
                            break;
                        }

                        const parsed = JSON.parse(data) as { content?: string; error?: string };
                        if (parsed.error) {
                            throw new Error(parsed.error);
                        }
                        if (parsed.content) {
                            setResponse((prev) => prev + parsed.content);
                        }
                    }
                }
            } catch (err) {
                if (!isCancelled) {
                    setError(err instanceof Error ? err.message : "Failed to synthesize results");
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        void generateSynthesis();
        return () => {
            isCancelled = true;
        };
    }, [requestPayload]);

    return (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-3">
                Answer from top <span className="text-orange-600 font-medium">{topCount} texts</span>
            </p>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Synthesis for: {query}
            </h2>
            {isLoading && !response ? (
                <p className="text-sm text-gray-600">Generating synthesis...</p>
            ) : null}
            {error ? (
                <p className="text-sm text-red-600">{error}</p>
            ) : (
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {response || "No synthesis response generated."}
                </div>
            )}
            <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                <li>Coverage spans: {categories.join(", ") || "multiple categories"}.</li>
                <li>Core thesis with verse-level support and cross-text alignment.</li>
                <li>Actionable study progression for deeper understanding.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
                <button
                    onClick={() => alert("Notebook integration is available in the Notebooks page workflow.")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                >
                    <BookmarkPlus className="h-4 w-4" />
                    Save to Notebook
                </button>
                <button
                    onClick={() => navigator.clipboard.writeText(response || "")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                >
                    <Download className="h-4 w-4" />
                    Export
                </button>
                <button
                    onClick={() => {
                        const firstCategory = categories[0];
                        if (firstCategory) {
                            window.location.href = `/app/discover?q=${encodeURIComponent(firstCategory)}`;
                        }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                >
                    <Compass className="h-4 w-4" />
                    Find Topics
                </button>
            </div>
        </section>
    );
}
