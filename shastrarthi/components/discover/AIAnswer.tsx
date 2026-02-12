import { BookmarkPlus, Compass, Download } from "lucide-react";
import type { Text } from "@/lib/supabase";

interface AIAnswerProps {
    query: string;
    texts: Text[];
}

export default function AIAnswer({ query, texts }: AIAnswerProps) {
    const topCount = Math.min(texts.length, 5);
    const categories = Array.from(new Set(texts.map((text) => text.category))).slice(0, 3);

    return (
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
            <p className="text-sm text-gray-500 mb-3">
                Answer from top <span className="text-orange-600 font-medium">{topCount} texts</span>
            </p>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Synthesis for: {query}
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
                This synthesis prioritizes the most relevant indexed texts for your query and highlights convergences across categories
                while preserving lineage-sensitive nuance for deeper academic and practical study.
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-gray-700 list-disc pl-5">
                <li>Coverage spans: {categories.join(", ") || "multiple categories"}.</li>
                <li>Core thesis with verse-level support and cross-text alignment.</li>
                <li>Actionable study progression for deeper understanding.</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    <BookmarkPlus className="h-4 w-4" />
                    Save to Notebook
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    <Download className="h-4 w-4" />
                    Export
                </button>
                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                    <Compass className="h-4 w-4" />
                    Find Topics
                </button>
            </div>
        </section>
    );
}
