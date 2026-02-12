"use client";

import { useState } from "react";
import { ArrowUp, Globe, MessageSquare } from "lucide-react";

const SUGGESTED = [
    "Future works",
    "Related texts",
    "Text summary",
    "Lineage views",
    "Summarise introduction",
    "Results",
];

const ACTIONS = [
    "Explain Verse",
    "Related Texts",
    "Text Summary",
    "Lineage Views",
    "Etymology",
    "Practical Application",
];

interface ChatPanelProps {
    textTitle: string;
}

export default function ChatPanel({ textTitle }: ChatPanelProps) {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
        { role: "assistant", content: `Ask me anything about ${textTitle}. I can explain verses, compare traditions, and suggest related readings.` },
    ]);

    const send = () => {
        if (!value.trim()) return;
        const input = value.trim();
        setMessages((prev) => [
            ...prev,
            { role: "user", content: input },
            { role: "assistant", content: "I will analyze this in context and respond with verse-level references." },
        ]);
        setValue("");
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
                {ACTIONS.map((action) => (
                    <button key={action} className="px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-50">
                        {action}
                    </button>
                ))}
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
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED.map((prompt) => (
                        <button key={prompt} className="px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-500 hover:bg-gray-50">
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <div className="flex items-end gap-2">
                    <textarea
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Ask any question..."
                        className="w-full min-h-[68px] rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    />
                    <button
                        onClick={send}
                        className="inline-flex items-center justify-center rounded-md bg-orange-600 hover:bg-orange-700 text-white p-2.5"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}
