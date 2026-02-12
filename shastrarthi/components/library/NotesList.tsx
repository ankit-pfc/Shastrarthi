"use client";

import Link from "next/link";
import { FileText, Trash2, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface NoteItem {
    id: string;
    verseRef: string;
    verseTranslation: string;
    content: string;
    textSlug: string;
    textTitle: string;
    createdAt: string;
    onRemove: (noteId: string) => Promise<void>;
}

export default function NotesList({ notes, onRemove }: { notes: any[]; onRemove: (noteId: string) => Promise<void> }) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-semibold text-sand-900 dark:text-sand-100 mb-4">
                Notes ({notes.length})
            </h2>

            {notes.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-sand-600 dark:text-sand-400 text-lg">
                        No notes yet
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notes.map((note: any) => (
                        <div
                            key={note.id}
                            className="bg-white dark:bg-sand-800 rounded-lg shadow-sm border border-sand-200 dark:border-sand-700 p-4"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-saffron-600 dark:text-saffron-400" />
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/reader/${note.textSlug}`}
                                            className="group"
                                        >
                                            <h4 className="text-base font-semibold text-sand-900 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors line-clamp-1">
                                                {note.verseRef}
                                            </h4>
                                            <p className="text-sm text-sand-600 dark:text-sand-400 line-clamp-1">
                                                {note.verseTranslation}
                                            </p>
                                        </Link>
                                        <p className="text-xs text-sand-500 dark:text-sand-500 mt-1">
                                            {note.textTitle}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={async () => await onRemove(note.id)}
                                    className="p-2 rounded-md text-sand-500 hover:bg-red-50 dark:text-sand-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
                                    aria-label="Remove note"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Note Content */}
                            <div className="bg-sand-50 dark:bg-sand-900 rounded-md p-3">
                                <p className="text-sm text-sand-700 dark:text-sand-300 leading-relaxed line-clamp-3">
                                    {note.content}
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-sand-500 dark:text-sand-500">
                                <span>
                                    {new Date(note.createdAt).toLocaleDateString()}
                                </span>
                                <Link
                                    href={`/reader/${note.textSlug}`}
                                    className="text-saffron-600 dark:text-saffron-400 hover:underline"
                                >
                                    <Edit3 className="h-4 w-4 inline" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
