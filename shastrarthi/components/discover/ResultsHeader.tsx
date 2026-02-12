"use client";

import { useRouter, useSearchParams } from "next/navigation";
import DepthToggle from "./DepthToggle";

type DepthMode = "standard" | "high" | "deep";

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

    return (
        <div className="flex items-center justify-between">
            <h1 className="text-h3 font-serif font-semibold text-gray-900">
                Results for &quot;{query}&quot;
            </h1>
            <DepthToggle value={depth} onChange={onDepthChange} />
        </div>
    );
}
