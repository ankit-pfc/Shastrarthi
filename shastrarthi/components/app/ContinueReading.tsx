"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

interface ReadingProgressItem {
    textId: string;
    lastVerseIndex: number;
    completed: boolean;
    text: {
        id: string;
        title_en: string;
        slug: string;
        category: string;
    } | null;
}

export default function ContinueReading() {
    const [items, setItems] = useState<ReadingProgressItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/reading-progress/all");
                if (response.ok) {
                    const json = await response.json();
                    setItems(json.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch reading progress:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <section className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-40 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-100 rounded"></div>
                        <div className="h-16 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-orange-600" />
                    Continue Reading
                </h2>
            </div>
            <div className="space-y-2">
                {items.map((item) => {
                    if (!item.text) return null;
                    return (
                        <Link
                            key={item.textId}
                            href={`/reader/${item.text.slug}`}
                            className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                        {item.text.title_en}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {item.text.category}
                                    </p>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0 mt-0.5" />
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
