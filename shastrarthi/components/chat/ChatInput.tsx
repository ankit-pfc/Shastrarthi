"use client";

import { ArrowUp, Link2, Plus } from "lucide-react";
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
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask anything or give follow up task..."
                className="w-full min-h-[88px] rounded-t-2xl px-4 py-3 text-sm resize-none outline-none placeholder:text-gray-400"
            />
            <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                        <Plus className="h-4 w-4" />
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                        Auto
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                        <Link2 className="h-4 w-4" />
                        Connect Apps
                    </button>
                </div>
                <button
                    onClick={submit}
                    className="inline-flex items-center justify-center rounded-md bg-orange-600 hover:bg-orange-700 text-white p-2"
                >
                    <ArrowUp className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
