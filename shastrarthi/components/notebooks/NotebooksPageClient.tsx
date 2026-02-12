"use client";

import { useState } from "react";
import type { Notebook } from "@/lib/supabase";

interface NotebooksPageClientProps {
    initialNotebooks: Notebook[];
}

export default function NotebooksPageClient({ initialNotebooks }: NotebooksPageClientProps) {
    const [notebooks, setNotebooks] = useState<Notebook[]>(initialNotebooks);
    const [activeNotebookId, setActiveNotebookId] = useState<string | null>(initialNotebooks[0]?.id ?? null);
    const [content, setContent] = useState(initialNotebooks[0]?.content ?? "");
    const [title, setTitle] = useState(initialNotebooks[0]?.title ?? "Study Notebook");

    const loadNotebooks = async () => {
        const response = await fetch("/api/notebooks");
        if (!response.ok) return;
        const payload = await response.json();
        const rows = payload.data as Notebook[];
        setNotebooks(rows);
        if (rows.length > 0) {
            const current = rows[0];
            setActiveNotebookId(current.id);
            setTitle(current.title);
            setContent(current.content ?? "");
        } else {
            setActiveNotebookId(null);
            setTitle("Study Notebook");
            setContent("");
        }
    };

    const createNotebook = async () => {
        const response = await fetch("/api/notebooks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "New Notebook", content: "" }),
        });
        if (!response.ok) return;
        await loadNotebooks();
    };

    const saveNotebook = async () => {
        if (!activeNotebookId) return;
        await fetch(`/api/notebooks/${activeNotebookId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
        });
        await loadNotebooks();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Study Notebooks</h1>
                <p className="text-gray-600">Structured notebooks for research and reflection.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
                <aside className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-900">Notebook List</h2>
                        <button
                            onClick={() => void createNotebook()}
                            className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                        >
                            New
                        </button>
                    </div>
                    <div className="space-y-2">
                        {notebooks.map((notebook) => (
                            <button
                                key={notebook.id}
                                onClick={() => {
                                    setActiveNotebookId(notebook.id);
                                    setTitle(notebook.title);
                                    setContent(notebook.content ?? "");
                                }}
                                className={`w-full text-left rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 ${activeNotebookId === notebook.id ? "border-orange-400 text-orange-700" : "border-gray-200 text-gray-700"}`}
                            >
                                {notebook.title}
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <input
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            className="font-semibold text-gray-900 border border-gray-200 rounded px-2 py-1"
                        />
                        <button
                            onClick={() => void saveNotebook()}
                            className="text-xs px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            Save
                        </button>
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
