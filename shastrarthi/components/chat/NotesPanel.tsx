"use client";

import { useEffect, useState, useCallback } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import { Plus, X, Save, FileText, ChevronLeft, Loader2 } from "lucide-react";

interface Note {
    id: string;
    title: string;
    content: string;
    updated_at: string;
    thread_id?: string;
}

interface NotesPanelProps {
    threadId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function NotesPanel({ threadId, isOpen, onClose }: NotesPanelProps) {
    const [notes, setNotes] = useState<Note[]>([]);
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [view, setView] = useState<"list" | "edit">("list");

    const fetchNotes = useCallback(async () => {
        if (!threadId) {
            setNotes([]);
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch(`/api/notebooks?thread_id=${threadId}`);
            if (response.ok) {
                const payload = await response.json();
                setNotes(payload.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch notes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [threadId]);

    useEffect(() => {
        if (isOpen && threadId) {
            void fetchNotes();
        }
    }, [isOpen, threadId, fetchNotes]);

    const handleNewNote = () => {
        setActiveNote(null);
        setTitle("");
        setContent("");
        setView("edit");
    };

    const handleEditNote = (note: Note) => {
        setActiveNote(note);
        setTitle(note.title);
        setContent(note.content);
        setView("edit");
    };

    const handleSave = async () => {
        if (!title.trim() && !content.trim()) return;
        setIsSaving(true);
        try {
            const payload = {
                title: title.trim() || "Untitled Note",
                content,
                thread_id: threadId,
            };

            let response;
            if (activeNote) {
                response = await fetch(`/api/notebooks/${activeNote.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            } else {
                response = await fetch("/api/notebooks", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
            }

            if (response.ok) {
                const { data } = await response.json();
                if (activeNote) {
                    setNotes((prev) => prev.map((n) => (n.id === data.id ? data : n)));
                } else {
                    setNotes((prev) => [data, ...prev]);
                }
                setActiveNote(data);
                // Stay in edit mode or go back? Let's stay in edit mode to allow further edits.
            }
        } catch (error) {
            console.error("Failed to save note:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleBackToList = () => {
        setView("list");
        setActiveNote(null);
    };

    if (!isOpen) return null;

    return (
        <div className="w-80 md:w-96 border-r border-gray-200 bg-white flex flex-col h-full shrink-0 transition-all duration-300">
            {/* Header */}
            <div className="h-14 px-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
                <h2 className="font-medium text-gray-900">
                    {view === "list" ? "Thread Notes" : activeNote ? "Edit Note" : "New Note"}
                </h2>
                <div className="flex items-center gap-1">
                    {view === "edit" ? (
                        <button
                            onClick={handleBackToList}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                            title="Back to List"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleNewNote}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                            title="New Note"
                        >
                            <Plus className="h-4 w-4" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-md"
                        title="Close Panel"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* List View */}
            {view === "list" && (
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="flex justify-center py-8 text-gray-400">
                            <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-sm">
                            <p className="mb-2">No notes for this thread yet.</p>
                            <button
                                onClick={handleNewNote}
                                className="text-orange-600 hover:text-orange-700 font-medium"
                            >
                                Create your first note
                            </button>
                        </div>
                    ) : (
                        notes.map((note) => (
                            <button
                                key={note.id}
                                onClick={() => handleEditNote(note)}
                                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all bg-white group"
                            >
                                <div className="flex items-start gap-3">
                                    <FileText className="h-4 w-4 text-gray-400 mt-0.5 shrink-0 group-hover:text-orange-500 transition-colors" />
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-sm text-gray-900 truncate mb-1">
                                            {note.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">
                                            {note.content || "No content"}
                                        </p>
                                        <p className="text-[10px] text-gray-400 mt-2">
                                            {new Date(note.updated_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}

            {/* Edit View */}
            {view === "edit" && (
                <div className="flex-1 flex flex-col min-h-0 bg-white">
                    <div className="p-4 border-b border-gray-100 space-y-3">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title"
                            className="w-full text-lg font-medium placeholder:text-gray-400 border-none outline-none bg-transparent px-0"
                        />
                    </div>
                    <div className="flex-1 overflow-hidden relative" data-color-mode="light">
                        <div className="absolute inset-0">
                            <MDEditor
                                value={content}
                                onChange={(val) => setContent(val || "")}
                                preview="edit"
                                height="100%"
                                className="border-none shadow-none !bg-white"
                                visibleDragbar={false}
                                hideToolbar={true}
                                textareaProps={{
                                    placeholder: "Start writing...",
                                }}
                            />
                        </div>
                    </div>
                    <div className="p-3 border-t border-gray-100 flex justify-end bg-white z-10">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50 text-sm font-medium transition-colors"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            Save Note
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
