"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

type SearchMode = "texts" | "verses" | "concepts" | "compare" | "practice";

const SEARCH_MODES: SearchMode[] = ["texts", "verses", "concepts", "compare", "practice"];

const MODE_LABELS: Record<SearchMode, string> = {
    texts: "Texts",
    verses: "Verses",
    concepts: "Concepts",
    compare: "Compare",
    practice: "Practice",
};

const MODE_PLACEHOLDERS: Record<SearchMode, string> = {
    texts: "Search texts (e.g., Isha Upanishad)",
    verses: "Find a verse (e.g., Gita 2.47)",
    concepts: "Ask a concept (e.g., Dharma, Atman)",
    compare: "Compare translations/commentaries (e.g., Gita 2.47)",
    practice: "Explore a practice (e.g., pranayama, dhyana)",
};

const MODE_EXAMPLES: Record<SearchMode, string[]> = {
    texts: ["Bhagavad Gita", "Yoga Sutras", "Isha Upanishad"],
    verses: ["Gita 2.47", "Yoga Sutra 1.2", "Isha 1"],
    concepts: ["Dharma", "Atman", "Karma", "Moksha"],
    compare: ["Gita 2.47", "Yoga Sutra 1.2"],
    practice: ["Pranayama", "Dhyana", "Asana", "Mantra"],
};

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [selectedMode, setSelectedMode] = useState<SearchMode>("texts");
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/discover?mode=${selectedMode}&q=${encodeURIComponent(query.trim())}`);
        }
    };

    const handleModeChange = (mode: SearchMode) => {
        setSelectedMode(mode);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            {/* Mode Pills */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {SEARCH_MODES.map((mode) => (
                    <button
                        key={mode}
                        type="button"
                        onClick={() => handleModeChange(mode)}
                        className={`h-10 px-3 rounded-chip text-sm font-medium whitespace-nowrap transition-all ${selectedMode === mode
                            ? "bg-ink-900 text-parchment-50 shadow-md"
                            : "bg-parchment-50 text-neutral-700 border border-stone-300 hover:bg-parchment-100"
                            }`}
                    >
                        {MODE_LABELS[mode]}
                    </button>
                ))}
            </div>

            {/* Search Input - Research Console Style */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={MODE_PLACEHOLDERS[selectedMode]}
                    className="w-full px-5 py-4 pl-12 text-lg rounded-control border border-stone-300 bg-white text-ink-900 placeholder-neutral-700/70 focus:outline-none focus:border-stone-300 shadow-md transition-all"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-ink-900 hover:bg-ink-800 text-parchment-50 rounded-lg font-medium transition-colors"
                >
                    Search
                </button>
            </div>

            {/* Advanced filters link */}
            <div className="mt-2 text-center">
                <span className="text-meta text-neutral-700">
                    Advanced filters
                </span>
            </div>

            {/* Mode-aware Examples */}
            <p className="text-sm text-neutral-700 mt-2 text-center">
                Try: {MODE_EXAMPLES[selectedMode].map((example, i) => (
                    <span key={example}>
                        <button
                            type="button"
                            onClick={() => setQuery(example)}
                            className="text-saffron-500 hover:underline"
                        >
                            "{example}"
                        </button>
                        {i < MODE_EXAMPLES[selectedMode].length - 1 && ", "}
                    </span>
                ))}
            </p>
        </form>
    );
}
