"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { INTENT_BUILDER_CONFIG } from "@/lib/config/intents";

interface IntentBuilderProps {
    compact?: boolean;
    routePrefix?: string;
}

export default function IntentBuilder({ compact = false, routePrefix = "/discover" }: IntentBuilderProps) {
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
        const query = params.toString();
        router.push(query ? `${routePrefix}?${query}` : routePrefix);
    };

    const getSelectedState = (columnIndex: number, itemValue: string) => {
        return (
            (columnIndex === 0 && selectedGoal === itemValue) ||
            (columnIndex === 1 && selectedLens === itemValue) ||
            (columnIndex === 2 && selectedStart === itemValue)
        );
    };

    return (
        <section className={cn("bg-gray-50", compact ? "py-10" : "py-20")}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-h3 font-semibold text-gray-900 mb-2">
                        Build your Shastra task
                    </h2>
                    <p className="text-gray-500 text-base">
                        Select your intent, lens, and starting point.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                            What brings you here today?
                        </h3>
                        <p className="text-body/md text-gray-600 max-w-2xl mx-auto">
                            Pick a goal and a lens. We'll take you to a curated starting point.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                        {INTENT_BUILDER_CONFIG.map((column, columnIndex) => {
                            const keys = ["goals", "lenses", "starts"] as const;
                            const key = keys[columnIndex];
                            const isExpanded = expandedColumns[key];
                            const expandedItems = column.expandedItems || [];
                            const visibleItems = isExpanded ? [...column.items, ...expandedItems] : column.items;

                            return (
                                <div key={column.title} className="space-y-3 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                                        {column.title}
                                    </h3>
                                    <div className="space-y-2">
                                        {visibleItems.map((item) => {
                                            const isSelected = getSelectedState(columnIndex, item.value);
                                            const Icon = item.icon;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleItemClick(columnIndex, item.value, item.isShowMore || false)}
                                                    className={cn(
                                                        "w-full text-left px-4 py-3 rounded-xl transition-all min-h-12 border",
                                                        "bg-white border-gray-100 hover:shadow-sm",
                                                        isSelected && "border-orange-300 bg-orange-50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Icon className={cn("h-4 w-4", item.iconColor)} />
                                                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        {expandedItems.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => toggleColumnExpansion(columnIndex)}
                                                className="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                            >
                                                {isExpanded ? "Show Less" : "Show More"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center">
                        <Button type="button" onClick={handleContinue} size="lg" className="inline-flex items-center gap-2">
                            Continue
                            <ArrowRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
