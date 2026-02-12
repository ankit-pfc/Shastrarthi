"use client";

import { useEffect, useState } from "react";
import { BookmarkPlus, Download, MoreHorizontal, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

interface ChatInterfaceProps {
    initialTitle?: string;
    initialThreadId?: string;
    agent?: string;
}

export default function ChatInterface({
    initialTitle = "Deep Research Into Shastras",
    initialThreadId,
    agent,
}: ChatInterfaceProps) {
    const router = useRouter();
    const [threadId, setThreadId] = useState<string | null>(initialThreadId ?? null);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
        {
            role: "assistant",
            content:
                "I can help with academic and practical Shastra research. Share your topic and I will ask a few clarifying questions before drafting a structured response.",
        },
    ]);

    useEffect(() => {
        if (!initialThreadId) return;
        const loadThread = async () => {
            try {
                const response = await fetch(`/api/chat/threads/${initialThreadId}`);
                if (!response.ok) return;
                const payload = await response.json();
                const threadTitle = payload.data?.thread?.title as string | undefined;
                if (threadTitle?.trim()) {
                    setTitle(threadTitle);
                }
                const loadedMessages = (payload.data?.messages ?? []).map((msg: any) => ({
                    role: msg.role,
                    content: msg.content,
                }));
                if (loadedMessages.length > 0) {
                    setMessages(loadedMessages);
                }
            } catch (error) {
                console.error("Failed loading thread:", error);
            }
        };

        void loadThread();
    }, [initialThreadId]);

    const ensureThread = async (firstPrompt: string) => {
        if (threadId) return threadId;
        const response = await fetch("/api/chat/threads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: firstPrompt.slice(0, 60),
                agent,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to create thread");
        }
        const payload = await response.json();
        const createdThreadId = payload.data.id as string;
        const createdTitle = payload.data.title as string | undefined;
        setThreadId(createdThreadId);
        if (createdTitle?.trim()) {
            setTitle(createdTitle);
        }
        router.replace(`/app/chat/${createdThreadId}`);
        return createdThreadId;
    };

    const persistMessage = async (currentThreadId: string, role: "user" | "assistant", content: string) => {
        await fetch(`/api/chat/threads/${currentThreadId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role, content }),
        });
    };

    const onSend = (text: string) => {
        const send = async () => {
            if (isLoading) return;
            setIsLoading(true);

            try {
                const currentThreadId = await ensureThread(text);
                await persistMessage(currentThreadId, "user", text);

                setMessages((prev) => [...prev, { role: "user", content: text }, { role: "assistant", content: "" }]);

                const response = await fetch("/api/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        agent,
                        query: text,
                        conversationHistory: messages.slice(-8),
                    }),
                });

                if (!response.ok || !response.body) {
                    throw new Error("Failed to generate response");
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let fullAssistantReply = "";
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
                            fullAssistantReply += parsed.content;
                            setMessages((prev) => {
                                const next = [...prev];
                                const last = next.length - 1;
                                if (last >= 0 && next[last].role === "assistant") {
                                    next[last] = { role: "assistant", content: `${next[last].content}${parsed.content}` };
                                }
                                return next;
                            });
                        }
                    }
                }

                if (fullAssistantReply.trim()) {
                    await persistMessage(currentThreadId, "assistant", fullAssistantReply);
                }
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content:
                            error instanceof Error ? `Unable to answer right now: ${error.message}` : "Unable to answer right now.",
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        void send();
    };

    const downloadChatAsMarkdown = () => {
        const lines = [`# ${title}`, "", `Thread ID: ${threadId ?? "not-saved-yet"}`, "", "---", ""];
        for (const message of messages) {
            const label = message.role === "user" ? "User" : "Assistant";
            lines.push(`## ${label}`);
            lines.push("");
            lines.push(message.content || "_(empty)_");
            lines.push("");
        }
        const markdown = lines.join("\n");
        const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
        const blobUrl = URL.createObjectURL(blob);
        const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "chat-thread";
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = `${safeTitle}.md`;
        anchor.click();
        URL.revokeObjectURL(blobUrl);
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-104px)] flex flex-col">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-medium text-gray-900">{title}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                    <button className="p-2 rounded-md hover:bg-gray-100" title="Share (coming soon)">
                        <Share2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100" title="Bookmark (coming soon)">
                        <BookmarkPlus className="h-4 w-4" />
                    </button>
                    <button onClick={downloadChatAsMarkdown} className="p-2 rounded-md hover:bg-gray-100" title="Download">
                        <Download className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pb-4">
                {messages.map((message, idx) => (
                    <MessageBubble key={`${message.role}-${idx}`} role={message.role} content={message.content} />
                ))}
            </div>

            <ChatInput onSend={onSend} />
        </div>
    );
}
