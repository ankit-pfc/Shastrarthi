"use client";

import Link from "next/link";
import { Bookmark, FileText, Trash2 } from "lucide-react";

interface BookmarkItem {
    id: string;
    verseRef: string;
    verseTranslation: string;
    textSlug: string;
    textTitle: string;
    createdAt: string;
    onRemove: (bookmarkId: string) => Promise<void>;
}

export default function BookmarksList({ bookmarks, onRemove }: { bookmarks: any[]; onRemove: (bookmarkId: string) => Promise<void> }) {
    return (
        <div className="space-y-3">
            <h2 className="text-xl font-semibold text-sand-900 dark:text-sand-100 mb-4">
                Bookmarks ({bookmarks.length})
            </h2>

            {bookmarks.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-sand-600 dark:text-sand-400 text-lg">
                        No bookmarks yet
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {bookmarks.map((bookmark: any) => (
                        <div
                            key={bookmark.id}
                            className="bg-white dark:bg-sand-800 rounded-lg shadow-sm border border-sand-200 dark:border-sand-700 p-4"
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex items-center gap-2">
                                    <Bookmark className="h-5 w-5 text-saffron-600 dark:text-saffron-400" />
                                    <div className="flex-1 min-w-0">
                                        <Link
                                            href={`/app/reader/${bookmark.textSlug}`}
                                            className="group"
                                        >
                                            <h4 className="text-base font-semibold text-sand-900 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors line-clamp-1">
                                                {bookmark.verseRef}
                                            </h4>
                                            <p className="text-sm text-sand-600 dark:text-sand-400 line-clamp-1">
                                                {bookmark.verseTranslation}
                                            </p>
                                        </Link>
                                        <p className="text-xs text-sand-500 dark:text-sand-500">
                                            {bookmark.textTitle}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={async () => await onRemove(bookmark.id)}
                                    className="p-2 rounded-md text-sand-500 hover:bg-red-50 dark:text-sand-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
                                    aria-label="Remove bookmark"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                            <p className="text-xs text-sand-500 dark:text-sand-500">
                                Bookmarked on {new Date(bookmark.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
