"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import { BookmarkPlus, Compass, Download } from "lucide-react";
import type { Text } from "@/lib/supabase";

interface AIAnswerProps {
    query: string;
    texts: Text[];
    contextLabel?: ReactNode;
}

export default function AIAnswer({ query, texts, contextLabel }: AIAnswerProps) {
    const topCount = Math.min(texts.length, 5);
    const categories = Array.from(new Set(texts.map((text) => text.category))).slice(0, 3);
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSavePanelOpen, setIsSavePanelOpen] = useState(false);
    const [isSavingToShastraBook, setIsSavingToShastraBook] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    const [availableShastraBooks, setAvailableShastraBooks] = useState<Array<{ id: string; title: string }>>([]);
    const [saveTarget, setSaveTarget] = useState<string>("new");
    const [newShastraBookTitle, setNewShastraBookTitle] = useState("Synthesis Notes");

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

    const loadShastraBooks = async () => {
        const apiResponse = await fetch("/api/shastrabooks");
        if (!apiResponse.ok) {
            throw new Error("Failed to load ShastraBooks");
        }
        const payload = await apiResponse.json();
        const shastraBooks = (payload.data ?? []) as Array<{ id: string; title: string }>;
        setAvailableShastraBooks(shastraBooks);
        if (shastraBooks.length > 0) {
            setSaveTarget((current) => (current === "new" ? shastraBooks[0].id : current));
        } else {
            setSaveTarget("new");
        }
    };

    const buildSynthesisAppendBlock = () => {
        const sourceTexts = texts
            .slice(0, 5)
            .map((text) => text.title_en)
            .join(", ");
        const generatedAt = new Date().toLocaleString();
        return [
            `## Synthesis: ${query}`,
            "",
            response.trim(),
            "",
            `Source texts: ${sourceTexts || "Multiple texts"}`,
            `Generated on: ${generatedAt}`,
        ].join("\n");
    };

    const handleOpenSavePanel = async () => {
        setIsSavePanelOpen((prev) => !prev);
        setSaveError(null);
        setSaveSuccess(null);
        if (!isSavePanelOpen) {
            try {
                await loadShastraBooks();
            } catch (loadError) {
                setSaveError(loadError instanceof Error ? loadError.message : "Unable to load ShastraBooks");
            }
        }
    };

    const handleSaveToShastraBook = async () => {
        if (!response.trim()) {
            setSaveError("No synthesis content available to save.");
            return;
        }

        setIsSavingToShastraBook(true);
        setSaveError(null);
        setSaveSuccess(null);

        try {
            let targetShastraBookId = saveTarget;
            if (saveTarget === "new") {
                const title = newShastraBookTitle.trim() || "Synthesis Notes";
                const createResponse = await fetch("/api/shastrabooks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title, content: "" }),
                });
                if (!createResponse.ok) {
                    throw new Error("Failed to create ShastraBook");
                }
                const createPayload = await createResponse.json();
                targetShastraBookId = (createPayload.data as { id: string }).id;
            }

            const appendResponse = await fetch(`/api/shastrabooks/${targetShastraBookId}/append`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: buildSynthesisAppendBlock(),
                }),
            });
            if (!appendResponse.ok) {
                const appendPayload = await appendResponse.json().catch(() => ({}));
                throw new Error((appendPayload as { error?: string }).error ?? "Failed to save synthesis");
            }

            await loadShastraBooks();
            setSaveSuccess("Saved to ShastraBook");
            setIsSavePanelOpen(false);
        } catch (saveToShastraBookError) {
            setSaveError(saveToShastraBookError instanceof Error ? saveToShastraBookError.message : "Save failed");
        } finally {
            setIsSavingToShastraBook(false);
        }
    };

    return (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-3">
                {contextLabel ?? (
                    <>
                        Answer from top <span className="text-orange-600 font-medium">{topCount} texts</span>
                    </>
                )}
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
                    onClick={() => void handleOpenSavePanel()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50"
                >
                    <BookmarkPlus className="h-4 w-4" />
                    Save to ShastraBook
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
            {isSavePanelOpen ? (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-3">
                    <h3 className="text-sm font-medium text-gray-900">Save synthesis</h3>
                    <label className="block text-xs text-gray-600">
                        Save destination
                        <select
                            value={saveTarget}
                            onChange={(event) => setSaveTarget(event.target.value)}
                            className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700"
                        >
                            {availableShastraBooks.map((shastraBook) => (
                                <option key={shastraBook.id} value={shastraBook.id}>
                                    {shastraBook.title}
                                </option>
                            ))}
                            <option value="new">+ Create new ShastraBook</option>
                        </select>
                    </label>
                    {saveTarget === "new" ? (
                        <label className="block text-xs text-gray-600">
                            New ShastraBook title
                            <input
                                value={newShastraBookTitle}
                                onChange={(event) => setNewShastraBookTitle(event.target.value)}
                                className="mt-1 w-full rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700"
                            />
                        </label>
                    ) : null}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => void handleSaveToShastraBook()}
                            disabled={isSavingToShastraBook}
                            className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
                        >
                            {isSavingToShastraBook ? "Saving..." : "Save now"}
                        </button>
                        <button
                            onClick={() => setIsSavePanelOpen(false)}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                    </div>
                    {saveError ? <p className="text-xs text-red-600">{saveError}</p> : null}
                </div>
            ) : null}
            {saveSuccess ? <p className="mt-3 text-xs text-green-700">{saveSuccess}</p> : null}
        </section>
    );
}
