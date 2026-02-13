"use client";

import { useEffect, useState } from "react";
import { Download, StickyNote } from "lucide-react";
import { useRouter } from "next/navigation";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import NewChatWelcome from "./NewChatWelcome";
import GuruSelector from "./GuruSelector";
import NotesPanel from "./NotesPanel";
import { GURU_PERSONAS } from "@/lib/config/prompts";
import { cn } from "@/lib/utils";

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
    const [selectedPersona, setSelectedPersona] = useState<string>(agent || "default");
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>(
        initialThreadId ? [] : []
    );

    useEffect(() => {
        if (!initialThreadId) {
            setMessages([]);
            return;
        }
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
                agent: selectedPersona,
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
                        agent: selectedPersona,
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

    const handlePromptSelect = (prompt: string) => {
        onSend(prompt);
    };

    const handlePersonaChange = (persona: string) => {
        setSelectedPersona(persona);
    };

    // Show welcome screen when there are no messages
    const showWelcome = messages.length === 0;

    return (
        <div className="flex-1 flex h-[100dvh]">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-full min-w-0">
                {/* Header - Only show when not in welcome mode */}
                {!showWelcome && (
                    <div className="h-14 px-4 md:px-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0 z-10 w-full">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <h1 className="text-sm font-medium text-gray-900 truncate max-w-[150px] md:max-w-[200px]">{title}</h1>
                            <div className="h-4 w-px bg-gray-200" />
                            <GuruSelector
                                selectedPersona={selectedPersona}
                                onPersonaChange={handlePersonaChange}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                            <button
                                onClick={downloadChatAsMarkdown}
                                className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                title="Download Chat"
                            >
                                <Download className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setIsNotesOpen(!isNotesOpen)}
                                className={cn(
                                    "p-1.5 rounded-md hover:bg-gray-100 transition-colors",
                                    isNotesOpen && "bg-gray-100 text-gray-900"
                                )}
                                title="Toggle Notes"
                            >
                                <StickyNote className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col relative w-full">
                    {showWelcome ? (
                        <div className="flex-1 overflow-y-auto w-full">
                            <div className="min-h-full flex flex-col justify-center">
                                <NewChatWelcome onPromptSelect={handlePromptSelect} />
                                <div className="w-full max-w-2xl mx-auto px-6 pb-12">
                                    <ChatInput onSend={onSend} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scroll-smooth w-full">
                                <div className="max-w-3xl mx-auto space-y-6">
                                    {messages.map((message, idx) => (
                                        <MessageBubble
                                            key={`${message.role}-${idx}`}
                                            role={message.role}
                                            content={message.content}
                                        />
                                    ))}
                                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                                        <div className="flex justify-start">
                                            <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-500">
                                                Thinking...
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Input Area */}
                            <div className="flex-shrink-0 px-4 md:px-6 pb-6 pt-2 bg-white/80 backdrop-blur-sm z-10 w-full">
                                <div className="max-w-3xl mx-auto">
                                    <ChatInput onSend={onSend} />
                                    <div className="mt-2 text-center">
                                        <p className="text-[10px] text-gray-400">
                                            AI can make mistakes. Please verify important information from original texts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Notes Panel (Right Side Split) */}
            {isNotesOpen && (
                <NotesPanel
                    threadId={threadId}
                    isOpen={isNotesOpen}
                    onClose={() => setIsNotesOpen(false)}
                />
            )}
        </div>
    );
}
