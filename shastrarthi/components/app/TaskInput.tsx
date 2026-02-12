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
        <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
            <textarea
                className="w-full px-4 py-3 rounded-t-2xl min-h-[90px] resize-none outline-none text-gray-800 placeholder:text-gray-400"
                placeholder="Give me any task to work on..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
                        <Plus className="h-4 w-4" />
                        Add
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
                    aria-label="Submit task"
                >
                    <ArrowUp className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
