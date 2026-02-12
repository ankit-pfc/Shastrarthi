"use client";

import { useState } from "react";

export default function ReferencesPage() {
    const [source, setSource] = useState("Bhagavad Gita 2.47");
    const [style, setStyle] = useState("APA");
    const [citation, setCitation] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const generateCitation = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "reference",
                    payload: { source, style },
                }),
            });
            if (!response.ok) return;
            const payload = await response.json();
            setCitation(payload.data.content ?? "");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 max-w-3xl">
            <h1 className="text-h2 font-serif font-semibold text-gray-900">Reference Generator</h1>
            <p className="text-gray-600">Generate academic and traditional citations for Shastra passages.</p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <input
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Source reference"
                />
                <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option>APA</option>
                    <option>MLA</option>
                    <option>Chicago</option>
                    <option>Traditional (Adhyaya.Pada.Shloka)</option>
                </select>
                <button
                    onClick={() => void generateCitation()}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white"
                >
                    {isLoading ? "Generating..." : "Generate Citation"}
                </button>
                <div className="rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                    {citation || `${style}: ${source} — generated citation preview.`}
                </div>
            </div>
        </div>
    );
}
