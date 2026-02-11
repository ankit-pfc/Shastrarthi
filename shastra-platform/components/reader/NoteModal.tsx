"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    verseId: string;
    verseRef: string;
    onSave?: (content: string) => void;
}

export default function NoteModal({
    isOpen,
    onClose,
    verseId,
    verseRef,
    onSave,
}: NoteModalProps) {
    const [content, setContent] = useState("");

    const handleSave = () => {
        if (content.trim()) {
            onSave?.(content);
            setContent("");
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSave();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className={cn(
                    "relative bg-white dark:bg-sand-800 rounded-lg shadow-xl w-full max-w-lg",
                    "animate-in fade-in zoom-in duration-200"
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="note-modal-title"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-sand-200 dark:border-sand-700">
                    <div>
                        <h2
                            id="note-modal-title"
                            className="text-lg font-semibold text-sand-900 dark:text-sand-100"
                        >
                            Add Note
                        </h2>
                        <p className="text-sm text-sand-600 dark:text-sand-400">
                            Verse {verseRef}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-md text-sand-500 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your note here..."
                        className={cn(
                            "w-full min-h-[150px] p-4 rounded-lg border border-sand-300 dark:border-sand-600",
                            "bg-sand-50 dark:bg-sand-900",
                            "text-sand-900 dark:text-sand-100 placeholder:text-sand-400 dark:placeholder:text-sand-500",
                            "focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent",
                            "resize-none transition-all"
                        )}
                        autoFocus
                    />
                    <p className="mt-2 text-xs text-sand-500 dark:text-sand-400">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-sand-200 dark:bg-sand-700 font-mono">Cmd/Ctrl + Enter</kbd> to save
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-sand-200 dark:border-sand-700 bg-sand-50 dark:bg-sand-900/50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-sand-700 dark:text-sand-300 hover:text-sand-900 dark:hover:text-sand-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!content.trim()}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md",
                            "bg-saffron-600 text-white hover:bg-saffron-700",
                            "disabled:opacity-50 disabled:cursor-not-allowed",
                            "transition-colors"
                        )}
                    >
                        <Save className="h-4 w-4" />
                        Save Note
                    </button>
                </div>
            </div>
        </div>
    );
}
