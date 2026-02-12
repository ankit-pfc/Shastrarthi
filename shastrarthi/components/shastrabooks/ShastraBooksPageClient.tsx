"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import type { ShastraBook } from "@/lib/supabase";

interface ShastraBooksPageClientProps {
    initialShastraBooks: ShastraBook[];
}

export default function ShastraBooksPageClient({ initialShastraBooks }: ShastraBooksPageClientProps) {
    const [shastraBooks, setShastraBooks] = useState<ShastraBook[]>(initialShastraBooks);
    const [activeShastraBookId, setActiveShastraBookId] = useState<string | null>(initialShastraBooks[0]?.id ?? null);
    const [content, setContent] = useState(initialShastraBooks[0]?.content ?? "");
    const [title, setTitle] = useState(initialShastraBooks[0]?.title ?? "Study Shastra");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveState, setSaveState] = useState("Saved");
    const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const filteredShastraBooks = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (!normalizedQuery) return shastraBooks;
        return shastraBooks.filter((shastraBook) =>
            `${shastraBook.title} ${shastraBook.content ?? ""}`.toLowerCase().includes(normalizedQuery)
        );
    }, [searchQuery, shastraBooks]);

    const activeShastraBook = useMemo(
        () => shastraBooks.find((shastraBook) => shastraBook.id === activeShastraBookId) ?? null,
        [activeShastraBookId, shastraBooks]
    );
    const activeShastraBookContent = activeShastraBook?.content ?? "";
    const activeShastraBookTitle = activeShastraBook?.title ?? "Study Shastra";
    const hasUnsavedChanges = title !== activeShastraBookTitle || content !== activeShastraBookContent;

    const loadShastraBooks = async (preferredId?: string | null) => {
        const response = await fetch("/api/shastrabooks");
        if (!response.ok) return;
        const payload = await response.json();
        const rows = payload.data as ShastraBook[];
        setShastraBooks(rows);
        if (rows.length === 0) {
            setActiveShastraBookId(null);
            setTitle("Study Shastra");
            setContent("");
            setSaveState("Saved");
            return;
        }

        const preferredShastraBook =
            (preferredId ? rows.find((shastraBook) => shastraBook.id === preferredId) : undefined) ?? rows[0];
        if (preferredShastraBook) {
            setActiveShastraBookId(preferredShastraBook.id);
            setTitle(preferredShastraBook.title);
            setContent(preferredShastraBook.content ?? "");
            setSaveState("Saved");
        } else {
            setSaveState("Unsaved");
        }
    };

    const createShastraBook = async (shastraBookTitle = "New ShastraBook") => {
        const response = await fetch("/api/shastrabooks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: shastraBookTitle, content: "" }),
        });
        if (!response.ok) return;
        const payload = await response.json();
        const created = payload.data as ShastraBook;
        await loadShastraBooks(created.id);
        setLastSavedAt(new Date());
    };

    const saveShastraBook = async (source: "manual" | "auto" = "manual") => {
        if (!activeShastraBookId) return;
        if (!hasUnsavedChanges) return;

        setIsSaving(true);
        setSaveState(source === "auto" ? "Autosaving..." : "Saving...");
        try {
            const response = await fetch(`/api/shastrabooks/${activeShastraBookId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                setSaveState("Save failed");
                return;
            }

            const payload = await response.json();
            const updated = payload.data as ShastraBook;
            setShastraBooks((prev) =>
                prev.map((shastraBook) =>
                    shastraBook.id === updated.id ? { ...shastraBook, ...updated } : shastraBook
                )
            );
            setSaveState(source === "auto" ? "Auto-saved" : "Saved");
            setLastSavedAt(new Date());
        } catch {
            setSaveState("Save failed");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!activeShastraBookId || !hasUnsavedChanges) return;
        setSaveState("Unsaved changes");
        if (autosaveTimerRef.current) {
            clearTimeout(autosaveTimerRef.current);
        }
        autosaveTimerRef.current = setTimeout(() => {
            void saveShastraBook("auto");
        }, 30_000);

        return () => {
            if (autosaveTimerRef.current) {
                clearTimeout(autosaveTimerRef.current);
            }
        };
    }, [activeShastraBookId, content, hasUnsavedChanges, title]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Study Shastras</h1>
                <p className="text-gray-600">Structured ShastraBooks for research and reflection.</p>
            </div>
            {shastraBooks.length === 0 && (
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4">
                    <p className="text-sm text-gray-700">No ShastraBooks yet. Create your first ShastraBook to begin.</p>
                    <button
                        onClick={() => void createShastraBook()}
                        className="mt-2 inline-flex items-center justify-center rounded-md bg-orange-600 px-3 py-2 text-sm font-medium text-white hover:bg-orange-700"
                    >
                        Create ShastraBook
                    </button>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
                <aside className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold text-gray-900">ShastraBook List</h2>
                        <button
                            onClick={() => void createShastraBook()}
                            className="text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50"
                        >
                            New
                        </button>
                    </div>
                    <input
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        placeholder="Search ShastraBooks..."
                        className="mb-3 w-full rounded-md border border-gray-200 px-2 py-1.5 text-sm text-gray-700"
                    />
                    <div className="space-y-2">
                        {filteredShastraBooks.map((shastraBook) => (
                            <button
                                key={shastraBook.id}
                                onClick={() => {
                                    setActiveShastraBookId(shastraBook.id);
                                    setTitle(shastraBook.title);
                                    setContent(shastraBook.content ?? "");
                                    setSaveState("Saved");
                                }}
                                className={`w-full text-left rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 ${activeShastraBookId === shastraBook.id ? "border-orange-400 text-orange-700" : "border-gray-200 text-gray-700"}`}
                            >
                                {shastraBook.title}
                            </button>
                        ))}
                        {filteredShastraBooks.length === 0 ? (
                            <p className="text-xs text-gray-500">No ShastraBooks match your search.</p>
                        ) : null}
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
                            onClick={() => void saveShastraBook()}
                            disabled={isSaving || !activeShastraBookId}
                            className="text-xs px-3 py-1.5 rounded bg-orange-600 hover:bg-orange-700 text-white"
                        >
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                    <p className="mb-2 text-xs text-gray-500">
                        {saveState}
                        {lastSavedAt ? ` • Last saved ${lastSavedAt.toLocaleTimeString()}` : ""}
                    </p>
                    <MDEditor
                        value={content}
                        onChange={(value) => setContent(value ?? "")}
                        preview="live"
                        height={420}
                    />
                </section>
            </div>
        </div>
    );
}
