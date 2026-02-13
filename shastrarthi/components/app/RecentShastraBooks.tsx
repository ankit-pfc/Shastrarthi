"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen, ChevronRight } from "lucide-react";

interface ShastraBook {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
}

export default function RecentShastraBooks() {
    const [books, setBooks] = useState<ShastraBook[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/shastrabooks");
                if (response.ok) {
                    const json = await response.json();
                    setBooks(json.data || []);
                }
            } catch (error) {
                console.error("Failed to fetch ShastraBooks:", error);
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
                    <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-16 bg-gray-100 rounded"></div>
                        <div className="h-16 bg-gray-100 rounded"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (books.length === 0) {
        return null;
    }

    return (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <NotebookPen className="h-5 w-5 text-orange-600" />
                    Recent ShastraBooks
                </h2>
                <Link
                    href="/app/shastras"
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                >
                    View all
                </Link>
            </div>
            <div className="space-y-2">
                {books.slice(0, 5).map((book) => (
                    <Link
                        key={book.id}
                        href={`/app/shastras`}
                        className="block p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-gray-900 truncate group-hover:text-orange-600 transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                                    {book.content.slice(0, 100)}
                                    {book.content.length > 100 ? "..." : ""}
                                </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-orange-600 transition-colors flex-shrink-0 mt-0.5" />
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
