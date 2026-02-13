"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Search } from "lucide-react";
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";

interface Note {
    id: string;
    title: string;
    content: string;
    updated_at: string;
    thread_id?: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const response = await fetch("/api/notebooks");
                if (response.ok) {
                    const payload = await response.json();
                    setNotes(payload.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch notes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        void fetchNotes();
    }, []);

    const filteredNotes = notes.filter(
        (note) =>
            note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="h-16 px-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
                <h1 className="text-xl font-semibold text-gray-900">My Notes</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 w-64 transition-all"
                        />
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                            <Plus className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
                        <p className="text-gray-500 max-w-sm">
                            Create notes from your chat conversations to see them here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredNotes.map((note) => (
                            <Link
                                key={note.id}
                                href={`/app/chat/${note.thread_id}`} // Link back to thread for context
                                className="group block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all overflow-hidden h-64 flex flex-col"
                            >
                                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 truncate pr-2 group-hover:text-orange-600 transition-colors">
                                        {note.title}
                                    </h3>
                                    <span className="text-[10px] text-gray-400 shrink-0">
                                        {new Date(note.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="p-4 flex-1 overflow-hidden relative">
                                    <div className="absolute inset-0 p-4 markdown-preview text-xs text-gray-600 line-clamp-[10]">
                                        <MDEditor.Markdown source={note.content} style={{ backgroundColor: 'transparent', color: 'inherit', fontSize: 'inherit' }} />
                                    </div>
                                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
