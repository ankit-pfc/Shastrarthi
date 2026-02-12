const CHIPS = [
    "Explain Verse",
    "Related Texts",
    "Text Summary",
    "Lineage Views",
    "Etymology",
    "Practical Application",
    "Commentary",
    "Historical Context",
];

interface QuickActionChipsProps {
    onSelect: (prompt: string) => void;
}

export default function QuickActionChips({ onSelect }: QuickActionChipsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {CHIPS.map((chip) => (
                <button
                    key={chip}
                    onClick={() => onSelect(chip)}
                    className="px-2.5 py-1 rounded-full border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                >
                    {chip}
                </button>
            ))}
        </div>
    );
}
