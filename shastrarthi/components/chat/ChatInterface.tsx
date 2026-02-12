"use client";

import { useMemo, useState } from "react";
import { BookmarkPlus, Download, MoreHorizontal, Share2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

interface ChatInterfaceProps {
    initialTitle?: string;
}

export default function ChatInterface({ initialTitle = "Deep Research Into Shastras" }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
        {
            role: "assistant",
            content:
                "I can help with academic and practical Shastra research. Share your topic and I will ask a few clarifying questions before drafting a structured response.",
        },
    ]);

    const title = useMemo(() => initialTitle, [initialTitle]);

    const onSend = (text: string) => {
        setMessages((prev) => [
            ...prev,
            { role: "user", content: text },
            { role: "assistant", content: "Thanks. I will structure this by scope, tradition, key sources, and applied interpretation." },
        ]);
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-104px)] flex flex-col">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-lg font-medium text-gray-900">{title}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                    <button className="p-2 rounded-md hover:bg-gray-100"><Share2 className="h-4 w-4" /></button>
                    <button className="p-2 rounded-md hover:bg-gray-100"><BookmarkPlus className="h-4 w-4" /></button>
                    <button className="p-2 rounded-md hover:bg-gray-100"><Download className="h-4 w-4" /></button>
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
