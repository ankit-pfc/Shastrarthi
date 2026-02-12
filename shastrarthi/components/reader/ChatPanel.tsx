"use client";

import { useMemo, useState } from "react";
import { ArrowUp, Globe, MessageSquare } from "lucide-react";
import QuickActionChips from "./QuickActionChips";
import QuickChatPrompts from "./QuickChatPrompts";

interface ChatPanelProps {
    textId: string;
    textTitle: string;
    activeVerse: {
        id: string;
        ref: string;
        translation_en: string;
    } | null;
}

export default function ChatPanel({ textId, textTitle, activeVerse }: ChatPanelProps) {
    const [value, setValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
        { role: "assistant", content: `Ask me anything about ${textTitle}. I can explain verses, compare traditions, and suggest related readings.` },
    ]);

    const conversationHistory = useMemo(
        () => messages.slice(-10).map((message) => ({ role: message.role, content: message.content })),
        [messages]
    );

    const send = async (inputValue?: string) => {
        const input = (inputValue ?? value).trim();
        if (!input || !activeVerse || isLoading) return;

        const nextMessages = [...messages, { role: "user" as const, content: input }, { role: "assistant" as const, content: "" }];
        setMessages(nextMessages);
        setValue("");
        setIsLoading(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    textId,
                    verseRef: activeVerse.id,
                    query: input,
                    conversationHistory,
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error("Failed to stream AI response.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let done = false;

            while (!done) {
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
                        setMessages((prev) => {
                            const cloned = [...prev];
                            const lastIndex = cloned.length - 1;
                            if (lastIndex >= 0 && cloned[lastIndex].role === "assistant") {
                                cloned[lastIndex] = {
                                    ...cloned[lastIndex],
                                    content: `${cloned[lastIndex].content}${parsed.content}`,
                                };
                            }
                            return cloned;
                        });
                    }
                }
            }
        } catch (error) {
            setMessages((prev) => {
                const cloned = [...prev];
                const lastIndex = cloned.length - 1;
                if (lastIndex >= 0 && cloned[lastIndex].role === "assistant") {
                    cloned[lastIndex] = {
                        role: "assistant",
                        content:
                            error instanceof Error
                                ? `Sorry, I could not process that request: ${error.message}`
                                : "Sorry, I could not process that request.",
                    };
                }
                return cloned;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="h-full bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-gray-900 font-medium">
                    <MessageSquare className="h-4 w-4 text-orange-600" />
                    Chat
                </div>
                <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                    <Globe className="h-4 w-4" />
                    en
                </button>
            </div>

            <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap gap-2">
                <QuickActionChips
                    onSelect={(action) => {
                        if (!activeVerse) return;
                        void send(`${action} for ${activeVerse.ref}: ${activeVerse.translation_en}`);
                    }}
                />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message, idx) => (
                    <div
                        key={`${message.role}-${idx}`}
                        className={`max-w-[90%] px-3 py-2 rounded-lg text-sm leading-relaxed ${message.role === "user" ? "ml-auto bg-gray-100 text-gray-900" : "bg-orange-50 text-gray-700 border border-orange-100"}`}
                    >
                        {message.content}
                    </div>
                ))}
            </div>

            <div className="px-4 pb-2">
                <QuickChatPrompts
                    onAction={(prompt) => {
                        if (!activeVerse) return;
                        void send(`${prompt}\n\nVerse (${activeVerse.ref}): ${activeVerse.translation_en}`);
                    }}
                />
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-end gap-2">
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        disabled={isLoading}
                        placeholder="Ask any question..."
                        className="w-full min-h-[68px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                    <button
                        onClick={() => void send()}
                        disabled={isLoading || !activeVerse}
                        className="inline-flex items-center justify-center rounded-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white p-2.5"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </div>
                {!activeVerse && (
                    <p className="mt-2 text-xs text-gray-500">Select a verse in the reader to ask contextual questions.</p>
                )}
            </div>
        </section>
    );
}
