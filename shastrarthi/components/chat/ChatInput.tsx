"use client";

import { ArrowUp } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
    onSend: (text: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
    const [value, setValue] = useState("");

    const submit = () => {
        if (!value.trim()) return;
        onSend(value.trim());
        setValue("");
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                    }
                }}
                placeholder="Ask anything..."
                className="w-full min-h-[60px] rounded-t-xl px-4 py-3 text-sm resize-none outline-none placeholder:text-gray-400"
                rows={1}
            />
            <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-end">
                <button
                    onClick={submit}
                    className="inline-flex items-center justify-center rounded-lg bg-gray-900 hover:bg-gray-800 text-white p-2.5"
                    title="Send message"
                >
                    <ArrowUp className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
