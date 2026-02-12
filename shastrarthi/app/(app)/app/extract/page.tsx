"use client";

import { useState } from "react";

export default function ExtractPage() {
    const [question, setQuestion] = useState("How is detachment explained?");
    const [rows, setRows] = useState<Array<{ text: string; insight: string; ref: string }>>([
        { text: "Bhagavad Gita", insight: "Action without fruit-attachment is central.", ref: "2.47" },
        { text: "Yoga Sutras", insight: "Vairagya balances sustained practice.", ref: "1.12" },
    ]);
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="space-y-4">
            <h1 className="text-h2 font-serif font-semibold text-gray-900">Extract Insights</h1>
            <p className="text-gray-600">Define custom extraction prompts across selected texts.</p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                    onClick={async () => {
                        try {
                            setIsLoading(true);
                            const response = await fetch("/api/tools", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    mode: "extract",
                                    payload: { question, context: "Shastra comparative extraction" },
                                }),
                            });
                            if (!response.ok) return;
                            const payload = await response.json();
                            const content = payload.data.content as string;
                            const lines = content
                                .split("\n")
                                .filter((line) => line.trim().length > 0)
                                .slice(0, 5);
                            setRows(
                                lines.map((line, index) => ({
                                    text: `Source ${index + 1}`,
                                    insight: line.replace(/^[-*]\s*/, ""),
                                    ref: `R${index + 1}`,
                                }))
                            );
                        } finally {
                            setIsLoading(false);
                        }
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white"
                >
                    {isLoading ? "Running..." : "Run Extraction"}
                </button>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left p-3">Text</th>
                            <th className="text-left p-3">Extracted Insight</th>
                            <th className="text-left p-3">Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={`${row.ref}-${index}`} className="border-t border-gray-100">
                                <td className="p-3">{row.text}</td>
                                <td className="p-3">{row.insight}</td>
                                <td className="p-3">{row.ref}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
