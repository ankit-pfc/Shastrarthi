"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TaskInput() {
    const [value, setValue] = useState("");
    const router = useRouter();

    const submit = () => {
        const query = value.trim();
        if (!query) return;
        router.push(`/app/discover?q=${encodeURIComponent(query)}`);
    };

    return (
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm">
            <textarea
                className="w-full px-4 py-3 rounded-xl min-h-[80px] resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Ask anything about Shastras..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submit();
                    }
                }}
            />
            <div className="px-3 py-2 flex items-center justify-end">
                <button
                    onClick={submit}
                    className="inline-flex items-center justify-center rounded-lg bg-orange-600 hover:bg-orange-700 text-white p-1.5"
                    aria-label="Submit task"
                >
                    <ArrowUp className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
