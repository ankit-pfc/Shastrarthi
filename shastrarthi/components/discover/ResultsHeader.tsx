"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DepthToggle from "./DepthToggle";

type DepthMode = "standard" | "high" | "deep";
type SearchMode = "texts" | "verses" | "concepts" | "compare" | "practice" | "all";

interface ResultsHeaderProps {
    query: string;
    depth: DepthMode;
}

export default function ResultsHeader({ query, depth }: ResultsHeaderProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const onDepthChange = (nextDepth: DepthMode) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set("depth", nextDepth);
        router.push(`/app/discover/${encodeURIComponent(query)}?${params.toString()}`);
    };

    const mode = (searchParams.get("mode") as SearchMode | null) ?? "all";
    const modeLabel: Record<SearchMode, string> = {
        all: "All",
        texts: "Texts",
        verses: "Verses",
        concepts: "Concepts",
        compare: "Compare",
        practice: "Practice",
    };

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-h3 font-serif font-semibold text-gray-900 truncate">
                    Results for &quot;{query}&quot;
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50">
                    {modeLabel[mode] ?? "All"}
                </span>
            </div>
            <DepthToggle value={depth} onChange={onDepthChange} />
        </div>
    );
}
