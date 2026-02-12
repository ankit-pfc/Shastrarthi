"use client";

import { useState } from "react";

export default function ReferencesPage() {
    const [source, setSource] = useState("Bhagavad Gita 2.47");
    const [style, setStyle] = useState("APA");

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
                <div className="rounded-lg border border-gray-200 p-3 text-sm text-gray-700">
                    {style}: {source} — generated citation preview.
                </div>
            </div>
        </div>
    );
}
