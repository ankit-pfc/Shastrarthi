"use client";

import Link from "next/link";
import type { VerseSearchRow } from "@/lib/services/verses";

function truncate(text: string, max = 160) {
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1).trimEnd()}…`;
}

interface VerseResultsTableProps {
    rows: VerseSearchRow[];
}

export default function VerseResultsTable({ rows }: VerseResultsTableProps) {
    return (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-gray-900">Matching verses</h2>
                <div className="text-xs text-gray-500">{rows.length} results</div>
            </div>

            <div className="divide-y divide-gray-100">
                {rows.map((row) => {
                    const textTitle = row.text?.title_en ?? "Unknown text";
                    const textSlug = row.text?.slug;
                    return (
                        <div key={row.id} className="p-4">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900">
                                        {row.ref}
                                        <span className="text-gray-400 font-normal"> · </span>
                                        {textSlug ? (
                                            <Link
                                                href={`/app/reader/${textSlug}`}
                                                className="text-orange-600 hover:text-orange-700"
                                            >
                                                {textTitle}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-700">{textTitle}</span>
                                        )}
                                    </p>
                                    {row.transliteration ? (
                                        <p className="mt-1 text-xs text-gray-500">{truncate(row.transliteration, 180)}</p>
                                    ) : null}
                                </div>
                                {row.text?.category ? (
                                    <span className="text-xs px-2 py-1 rounded-full border border-gray-200 text-gray-600 bg-gray-50">
                                        {row.text.category}
                                    </span>
                                ) : null}
                            </div>

                            <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                                {truncate(row.translation_en, 240)}
                            </p>

                            <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                {textSlug ? (
                                    <Link
                                        href={`/app/reader/${textSlug}`}
                                        className="text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        Open in reader
                                    </Link>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={() => navigator.clipboard.writeText(row.ref)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Copy ref
                                </button>
                            </div>
                        </div>
                    );
                })}

                {rows.length === 0 ? (
                    <div className="p-8 text-center text-sm text-gray-500">No verses matched this query.</div>
                ) : null}
            </div>
        </section>
    );
}

