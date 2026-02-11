"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

interface IntentItem {
    id: string;
    label: string;
    value: string;
    isShowMore?: boolean;
}

interface IntentColumn {
    title: string;
    items: IntentItem[];
    expandedItems?: IntentItem[];
}

const INTENT_BUILDER: IntentColumn[] = [
    {
        title: "I WANT TO",
        items: [
            { id: "learn-philosophy", label: "Learn a philosophy", value: "learn-philosophy" },
            { id: "find-verse", label: "Find a verse", value: "find-verse" },
            { id: "reading-plan", label: "Start a reading plan", value: "reading-plan" },
            { id: "compare", label: "Compare translations", value: "compare" },
            { id: "deity-tradition", label: "Explore a deity tradition", value: "deity-tradition" },
            { id: "understand-concept", label: "Understand a concept", value: "understand-concept" },
            { id: "show-more-goals", label: "Show more", value: "show-more", isShowMore: true },
        ],
    },
    {
        title: "EXPLORE",
        items: [
            { id: "philosophy", label: "Philosophy (Darshanas)", value: "philosophy" },
            { id: "sampradaya", label: "Sampradaya", value: "sampradaya" },
            { id: "deity", label: "Deity", value: "deity" },
            { id: "era", label: "Era", value: "era" },
            { id: "civilization", label: "Civilization/Region", value: "civilization" },
            { id: "text-type", label: "Text type", value: "text-type" },
            { id: "show-more-lenses", label: "Show more", value: "show-more", isShowMore: true },
        ],
        expandedItems: [
            { id: "vedanta", label: "Vedanta", value: "vedanta" },
            { id: "samkhya", label: "Samkhya", value: "samkhya" },
            { id: "yoga-darshana", label: "Yoga", value: "yoga-darshana" },
            { id: "nyaya", label: "Nyaya", value: "nyaya" },
            { id: "vaisheshika", label: "Vaisheshika", value: "vaisheshika" },
            { id: "mimamsa", label: "Mimamsa", value: "mimamsa" },
            { id: "advaita", label: "Advaita", value: "advaita" },
            { id: "vishishtadvaita", label: "Vishishtadvaita", value: "vishishtadvaita" },
            { id: "dvaita", label: "Dvaita", value: "dvaita" },
            { id: "shaiva", label: "Shaiva", value: "shaiva" },
            { id: "shakta", label: "Shakta", value: "shakta" },
            { id: "vaishnava", label: "Vaishnava", value: "vaishnava" },
            { id: "shiva", label: "Shiva", value: "shiva" },
            { id: "vishnu", label: "Vishnu", value: "vishnu" },
            { id: "devi", label: "Devi", value: "devi" },
            { id: "ganesha", label: "Ganesha", value: "ganesha" },
            { id: "vedic", label: "Vedic", value: "vedic" },
            { id: "epic", label: "Epic", value: "epic" },
            { id: "classical", label: "Classical", value: "classical" },
            { id: "medieval", label: "Medieval", value: "medieval" },
        ],
    },
    {
        title: "START WITH",
        items: [
            { id: "beginner", label: "Beginner essentials", value: "beginner" },
            { id: "upanishads", label: "Upanishads starter set", value: "upanishads" },
            { id: "gita", label: "Gita deep-dive", value: "gita" },
            { id: "yoga", label: "Yoga foundations", value: "yoga" },
            { id: "advaita-start", label: "Advaita starter set", value: "advaita-start" },
            { id: "bhakti", label: "Bhakti starter set", value: "bhakti" },
            { id: "show-more-starts", label: "Show more", value: "show-more", isShowMore: true },
        ],
    },
];

export default function IntentBuilder() {
    const router = useRouter();
    const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
    const [selectedLens, setSelectedLens] = useState<string | null>(null);
    const [selectedStart, setSelectedStart] = useState<string | null>(null);
    const [expandedColumns, setExpandedColumns] = useState({
        goals: false,
        lenses: false,
        starts: false,
    });

    const toggleColumnExpansion = (columnIndex: number) => {
        const keys = ["goals", "lenses", "starts"] as const;
        const key = keys[columnIndex];
        setExpandedColumns((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleItemClick = (columnIndex: number, itemId: string, isShowMore: boolean) => {
        if (isShowMore) {
            toggleColumnExpansion(columnIndex);
            return;
        }

        const setters = [setSelectedGoal, setSelectedLens, setSelectedStart];
        setters[columnIndex](itemId);
    };

    const handleContinue = () => {
        const params = new URLSearchParams();
        if (selectedGoal) params.set("goal", selectedGoal);
        if (selectedLens) params.set("lens", selectedLens);
        if (selectedStart) params.set("start", selectedStart);
        router.push(`/discover?${params.toString()}`);
    };

    return (
        <div className="bg-parchment-50">
            <div className="container mx-auto px-4">
                <div className="bg-white border border-stone-200 rounded-card p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-h3 font-semibold text-ink-900 mb-3">
                            What brings you here today?
                        </h2>
                        <p className="text-body/md text-neutral-700 max-w-2xl mx-auto">
                            Pick a goal and a lens. We'll take you to a curated starting point.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {INTENT_BUILDER.map((column, columnIndex) => {
                            const keys = ["goals", "lenses", "starts"] as const;
                            const key = keys[columnIndex];
                            const isExpanded = expandedColumns[key];
                            const expandedItems = column.expandedItems || [];

                            return (
                                <div key={column.title} className="space-y-3">
                                    <h3 className="text-label/sm font-semibold text-neutral-700 uppercase tracking-wide">
                                        {column.title}
                                    </h3>
                                    <div className="space-y-2">
                                        {column.items.map((item) => {
                                            const isSelected =
                                                (columnIndex === 0 && selectedGoal === item.value) ||
                                                (columnIndex === 1 && selectedLens === item.value) ||
                                                (columnIndex === 2 && selectedStart === item.value);

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleItemClick(columnIndex, item.id, item.isShowMore || false)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg transition-all min-h-12 ${isSelected
                                                        ? "bg-ink-900 text-parchment-50 border-2 border-transparent"
                                                        : "bg-parchment-50 text-neutral-700 border border border-transparent hover:bg-parchment-100"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">{item.label}</span>
                                                        {item.isShowMore && (
                                                            isExpanded ? (
                                                                <ChevronUp className="h-4 w-4 text-neutral-500" />
                                                            ) : (
                                                                <ChevronDown className="h-4 w-4 text-neutral-500" />
                                                            )
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}

                                        {/* Expanded Items */}
                                        {isExpanded && expandedItems.length > 0 && (
                                            <div className="space-y-2 pt-2 border-t border-stone-200">
                                                {expandedItems.map((item) => {
                                                    const isSelected =
                                                        (columnIndex === 1 && selectedLens === item.value);

                                                    return (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => handleItemClick(columnIndex, item.id, false)}
                                                            className={`w-full text-left px-4 py-2 rounded-lg transition-all min-h-12 ${isSelected
                                                                ? "bg-ink-900 text-parchment-50 border-2 border-transparent"
                                                                : "bg-parchment-50 text-neutral-700 border border border-transparent hover:bg-parchment-100"
                                                                }`}
                                                        >
                                                            <span className="text-sm">{item.label}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleContinue}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-ink-900 hover:bg-ink-800 text-parchment-50 rounded-lg font-medium transition-colors shadow-md"
                        >
                            Continue
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
