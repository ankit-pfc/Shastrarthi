"use client";

import { useState } from "react";

export default function WriterPage() {
    const [title, setTitle] = useState("Comparative Essay on Karma in Gita and Yoga Sutras");
    const [body, setBody] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const generateDraft = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "writer_draft",
                    payload: { title, body },
                }),
            });
            if (!response.ok) return;
            const payload = await response.json();
            setBody(payload.data.content ?? body);
        } finally {
            setIsLoading(false);
        }
    };

    const insertCitations = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "writer_citations",
                    payload: { body },
                }),
            });
            if (!response.ok) return;
            const payload = await response.json();
            setBody(payload.data.content ?? body);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4 max-w-4xl">
            <h1 className="text-h2 font-serif font-semibold text-gray-900">Shastra Writer</h1>
            <p className="text-gray-600">Draft reports, reflections, and research notes with AI support.</p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Start writing..."
                    className="w-full min-h-[380px] rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => void generateDraft()}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white"
                    >
                        Generate Draft
                    </button>
                    <button
                        onClick={() => void insertCitations()}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Insert Citations
                    </button>
                </div>
            </div>
        </div>
    );
}
