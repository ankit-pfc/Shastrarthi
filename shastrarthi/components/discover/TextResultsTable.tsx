"use client";

import { useState } from "react";
import Link from "next/link";
import type { Text } from "@/lib/supabase";

interface TextResultsTableProps {
    rows: Text[];
}

export default function TextResultsTable({ rows }: TextResultsTableProps) {
    const [savingId, setSavingId] = useState<string | null>(null);

    const saveText = async (textId: string) => {
        try {
            setSavingId(textId);
            await fetch("/api/library", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ textId }),
            });
        } catch (error) {
            console.error("Failed saving text:", error);
        } finally {
            setSavingId(null);
        }
    };

    return (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                    <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">Add columns (1)</button>
                    <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">Top texts</button>
                    <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">Filters</button>
                </div>
                <button className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Sort by relevance</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="text-left p-3 font-medium">Texts</th>
                            <th className="text-left p-3 font-medium">Tradition</th>
                            <th className="text-left p-3 font-medium">Date</th>
                            <th className="text-left p-3 font-medium">Verses</th>
                            <th className="text-left p-3 font-medium">Insights</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr key={row.id} className="border-t border-gray-100 align-top">
                                <td className="p-3 min-w-[220px]">
                                    <p className="font-medium text-gray-900">{row.title_en}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Link href={`/app/reader/${row.slug}`} className="text-orange-600 hover:text-orange-700">Read</Link>
                                        <Link href="/app/chat" className="text-orange-600 hover:text-orange-700">Chat</Link>
                                        <button
                                            onClick={() => void saveText(row.id)}
                                            disabled={savingId === row.id}
                                            className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
                                        >
                                            {savingId === row.id ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </td>
                                <td className="p-3 text-gray-700">{row.tradition || "-"}</td>
                                <td className="p-3 text-gray-700">{new Date(row.created_at).getFullYear()}</td>
                                <td className="p-3 text-gray-700">{row.verse_count}</td>
                                <td className="p-3 text-gray-700">{row.description || "Contextual relevance summary available."}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">
                                    No texts matched this query.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
