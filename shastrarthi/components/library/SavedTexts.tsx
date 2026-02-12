"use client";

import Link from "next/link";
import { BookOpen, Trash2 } from "lucide-react";

interface SavedTextsProps {
    texts: any[];
    onRemove: (textId: string) => Promise<void>;
}

export default function SavedTexts({ texts, onRemove }: SavedTextsProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-sand-900 dark:text-sand-100 mb-4">
                Saved Texts ({texts.length})
            </h2>

            {texts.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-sand-600 dark:text-sand-400 text-lg">
                        You haven&apos;t saved any texts yet.
                    </p>
                    <Link
                        href="/app/discover"
                        className="inline-flex items-center gap-2 text-saffron-600 dark:text-saffron-400 hover:text-saffron-700 dark:hover:text-saffron-300 transition-colors"
                    >
                        <BookOpen className="h-5 w-5" />
                        <span>Browse texts</span>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {texts.map((text: any) => (
                        <div
                            key={text.id}
                            className="bg-white dark:bg-sand-800 rounded-lg shadow-sm border border-sand-200 dark:border-sand-700 p-4 hover:shadow-md transition-all"
                        >
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/app/reader/${text.slug}`}
                                        className="group"
                                    >
                                        <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors line-clamp-1">
                                            {text.title_en}
                                        </h3>
                                        {text.title_sa && (
                                            <p className="text-sm font-serif text-saffron-600 dark:text-saffron-400 line-clamp-1">
                                                {text.title_sa}
                                            </p>
                                        )}
                                    </Link>
                                    <p className="text-xs text-sand-500 dark:text-sand-500 mt-1">
                                        {text.category} • {text.verse_count} verses
                                    </p>
                                </div>
                                <button
                                    onClick={async () => await onRemove(text.id)}
                                    className="p-2 rounded-md text-sand-500 hover:bg-red-50 dark:text-sand-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 transition-colors"
                                    aria-label="Remove from saved texts"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
