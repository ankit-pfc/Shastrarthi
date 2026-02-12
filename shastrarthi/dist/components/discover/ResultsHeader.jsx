"use client";
import { useRouter, useSearchParams } from "next/navigation";
import DepthToggle from "./DepthToggle";
export default function ResultsHeader({ query, depth }) {
    var _a, _b;
    const router = useRouter();
    const searchParams = useSearchParams();
    const onDepthChange = (nextDepth) => {
        const params = new URLSearchParams((searchParams === null || searchParams === void 0 ? void 0 : searchParams.toString()) || "");
        params.set("depth", nextDepth);
        router.push(`/app/discover/${encodeURIComponent(query)}?${params.toString()}`);
    };
    const mode = (_a = searchParams.get("mode")) !== null && _a !== void 0 ? _a : "all";
    const modeLabel = {
        all: "All",
        texts: "Texts",
        verses: "Verses",
        concepts: "Concepts",
        compare: "Compare",
        practice: "Practice",
    };
    return (<div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
                <h1 className="text-h3 font-serif font-semibold text-gray-900 truncate">
                    Results for &quot;{query}&quot;
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-700 bg-gray-50">
                    {(_b = modeLabel[mode]) !== null && _b !== void 0 ? _b : "All"}
                </span>
            </div>
            <DepthToggle value={depth} onChange={onDepthChange}/>
        </div>);
}
