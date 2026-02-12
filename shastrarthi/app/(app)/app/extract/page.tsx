"use client";

import { useState } from "react";

export default function ExtractPage() {
    const [question, setQuestion] = useState("How is detachment explained?");

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
                <button className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white">Run Extraction</button>
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
                        <tr className="border-t border-gray-100">
                            <td className="p-3">Bhagavad Gita</td>
                            <td className="p-3">Action without fruit-attachment is central.</td>
                            <td className="p-3">2.47</td>
                        </tr>
                        <tr className="border-t border-gray-100">
                            <td className="p-3">Yoga Sutras</td>
                            <td className="p-3">Vairagya balances sustained practice.</td>
                            <td className="p-3">1.12</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
