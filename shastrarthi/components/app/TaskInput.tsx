"use client";

import { useState } from "react";
import { ArrowUp, Link2, Plus } from "lucide-react";
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
                className="w-full px-4 py-3 rounded-t-xl min-h-[80px] resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400"
                placeholder="Give me any task to work on..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <button className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[13px] text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <Plus className="h-3.5 w-3.5" />
                        Add
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[13px] text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        Auto
                    </button>
                    <button className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[13px] text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                        <Link2 className="h-3.5 w-3.5" />
                        Connect Apps
                    </button>
                </div>
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
