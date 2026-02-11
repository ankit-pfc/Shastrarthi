"use client";

import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, X, Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import QuickChatPrompts from "./QuickChatPrompts";


interface ChatPanelProps {
    textId: string;
    verseId: string;
    verseRef: string;
    verseSanskrit: string | null;
    verseTranslation: string;
}

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}


export default function ChatPanel({
    textId,
    verseId,
    verseRef,
    verseSanskrit,
    verseTranslation,
}: ChatPanelProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showQuickActions, setShowQuickActions] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when new messages arrive
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);
        setShowQuickActions(false);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    textId,
                    verseRef,
                    query: input,
                    conversationHistory: messages.slice(-5), // Send last 5 messages for context
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Failed to get response" }));
                throw new Error(errorData.error || "Failed to get response");
            }

            // Read the SSE streaming response
            const reader = response.body?.getReader();
            let assistantMessage = "";
            let assistantMessageId = Date.now().toString();

            if (reader) {
                const decoder = new TextDecoder();
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || ""; // Keep incomplete line in buffer

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6);
                            if (data === "[DONE]") {
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.error) {
                                    throw new Error(parsed.error);
                                }
                                if (parsed.content) {
                                    assistantMessage += parsed.content;
                                    setMessages((prev) => {
                                        const lastMessage = prev[prev.length - 1];
                                        if (lastMessage && lastMessage.role === "assistant") {
                                            // Update the last assistant message
                                            return [
                                                ...prev.slice(0, -1),
                                                { ...lastMessage, content: assistantMessage },
                                            ];
                                        } else {
                                            // Add new assistant message
                                            return [
                                                ...prev,
                                                {
                                                    id: assistantMessageId,
                                                    role: "assistant",
                                                    content: assistantMessage,
                                                    timestamp: new Date(),
                                                },
                                            ];
                                        }
                                    });
                                }
                            } catch (e) {
                                console.error("Error parsing SSE data:", e);
                            }
                        }
                    }
                }
            }
        } catch (error: any) {
            console.error("Chat error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now().toString(),
                    role: "assistant",
                    content: error?.message || "Sorry, I encountered an error. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickAction = (prompt: string) => {
        setInput(prompt);
        setShowQuickActions(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div
            className={cn(
                "fixed right-0 top-0 h-full w-96 bg-white dark:bg-sand-800 border-l border-sand-200 dark:border-sand-700 shadow-lg",
                "flex flex-col transition-all duration-300",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-sand-200 dark:border-sand-700">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-saffron-600 dark:text-saffron-400" />
                    <h3 className="font-semibold text-sand-900 dark:text-sand-100">
                        AI Assistant
                    </h3>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-md text-sand-500 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700 transition-colors"
                    aria-label={isOpen ? "Minimize chat" : "Maximize chat"}
                >
                    {isOpen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && showQuickActions && (
                    <QuickChatPrompts onAction={handleQuickAction} />

                )}
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        role={message.role}
                        content={message.content}
                        timestamp={message.timestamp}
                    />
                ))}
                {isLoading && (
                    <div className="flex items-center gap-2 text-sand-500 dark:text-sand-400">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-sand-300 dark:border-sand-600 border-t-saffron-600" />
                        <span>Thinking...</span>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-sand-200 dark:border-sand-700">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Ask a question about this verse..."
                        disabled={isLoading}
                        className={cn(
                            "flex-1 px-4 py-2.5 rounded-lg border border-sand-300 dark:border-sand-600",
                            "bg-sand-50 dark:bg-sand-900",
                            "text-sand-900 dark:text-sand-100 placeholder:text-sand-400 dark:placeholder:text-sand-500",
                            "focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-all"
                        )}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className={cn(
                            "p-2.5 rounded-lg",
                            "bg-saffron-600 hover:bg-saffron-700 text-white",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-colors"
                        )}
                        aria-label="Send message"
                    >
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
