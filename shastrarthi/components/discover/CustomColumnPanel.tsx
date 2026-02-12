type SearchMode = "texts" | "verses" | "concepts" | "compare" | "practice" | "all";

const SUGGESTED_BY_MODE: Record<SearchMode, string[]> = {
    all: [
        "Key Concepts",
        "Lineage Interpretation",
        "Difficulty",
        "Related Verses",
        "Commentary Available",
        "Practical Application",
    ],
    texts: ["Key Concepts", "Lineage Interpretation", "Difficulty", "Related Verses", "Commentary Available"],
    verses: ["Related Verses", "Text Context", "Grammar / Parsing", "Commentary Available", "Practice Notes"],
    concepts: ["Definition", "Related Terms", "Key Verses", "Tradition Views", "Study Path"],
    compare: ["Comparison Table", "Key Verses (A)", "Key Verses (B)", "Tradition Context", "Verdict / Summary"],
    practice: ["Practice Steps", "Obstacles", "Related Sutras/Verses", "Tradition Guidance", "Daily Plan"],
};

interface CustomColumnPanelProps {
    mode?: SearchMode;
}

export default function CustomColumnPanel({ mode = "all" }: CustomColumnPanelProps) {
    const suggested = SUGGESTED_BY_MODE[mode] ?? SUGGESTED_BY_MODE.all;
    return (
        <aside className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add a Column</h3>
            <button className="w-full px-3 py-2 rounded-md border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 text-sm font-medium mb-4">
                Create new column
            </button>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Suggested columns</p>
            <div className="space-y-2">
                {suggested.map((item) => (
                    <button key={item} className="w-full text-left px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                        + {item}
                    </button>
                ))}
            </div>
        </aside>
    );
}
