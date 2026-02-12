"use client";

import { useState } from "react";

export default function AppNotebooksPage() {
    const [content, setContent] = useState("## Study Notebook\n\nWrite notes, verse links, and comparisons here.");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Study Notebooks</h1>
                <p className="text-gray-600">Structured notebooks for research and reflection.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
                <aside className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-gray-900 mb-3">Notebook List</h2>
                    <div className="space-y-2">
                        {["Advaita Research", "Gita Reflections", "Tantra Vocabulary"].map((name) => (
                            <button key={name} className="w-full text-left rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                {name}
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-900">Editor</h2>
                        <span className="text-xs text-gray-500">Tiptap-ready editable area</span>
                    </div>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full min-h-[420px] rounded-lg border border-gray-200 p-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono"
                    />
                </section>
            </div>
        </div>
    );
}
