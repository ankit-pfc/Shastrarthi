const SUGGESTED = [
    "Key Concepts",
    "Lineage Interpretation",
    "Difficulty",
    "Related Verses",
    "Commentary Available",
    "Practical Application",
];

export default function CustomColumnPanel() {
    return (
        <aside className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add a Column</h3>
            <button className="w-full px-3 py-2 rounded-md border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 text-sm font-medium mb-4">
                Create new column
            </button>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Suggested columns</p>
            <div className="space-y-2">
                {SUGGESTED.map((item) => (
                    <button key={item} className="w-full text-left px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">
                        + {item}
                    </button>
                ))}
            </div>
        </aside>
    );
}
