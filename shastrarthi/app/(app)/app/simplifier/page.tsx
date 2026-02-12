"use client";

import { useState } from "react";

export default function SimplifierPage() {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("Simplified output will appear here.");
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="space-y-4">
            <h1 className="text-h2 font-serif font-semibold text-gray-900">Simplifier</h1>
            <p className="text-gray-600">Convert dense text into clear modern explanations.</p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <section className="bg-white border border-gray-200 rounded-xl p-4">
                    <h2 className="font-semibold text-gray-900 mb-2">Input</h2>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="w-full min-h-[240px] rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Paste Sanskrit or philosophical text..."
                    />
                </section>
                <section className="bg-white border border-gray-200 rounded-xl p-4">
                    <h2 className="font-semibold text-gray-900 mb-2">Output</h2>
                    <div className="min-h-[240px] rounded-lg border border-gray-200 p-3 text-sm text-gray-700">{output}</div>
                </section>
            </div>
            <button
                onClick={async () => {
                    try {
                        setIsLoading(true);
                        const response = await fetch("/api/tools", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                mode: "simplify",
                                payload: { input },
                            }),
                        });
                        if (!response.ok) return;
                        const payload = await response.json();
                        setOutput(payload.data.content ?? output);
                    } finally {
                        setIsLoading(false);
                    }
                }}
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white"
            >
                {isLoading ? "Simplifying..." : "Simplify"}
            </button>
        </div>
    );
}
