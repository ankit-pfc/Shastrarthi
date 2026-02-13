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

export default function IntentBuilder({ compact = false, routePrefix = "/app/discover" }: IntentBuilderProps) {
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
        <section className={cn("bg-gray-50", compact ? "py-8" : "py-16")}>
            <div className="container mx-auto px-4">
                {!compact && (
                    <div className="h-4" /> // Spacing
                )}

                <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1.5">
                            What brings you here today?
                        </h3>
                        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                            Pick a goal and a lens. We&apos;ll take you to a curated starting point.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {INTENT_BUILDER_CONFIG.map((column, columnIndex) => {
                            const keys = ["goals", "lenses", "starts"] as const;
                            const key = keys[columnIndex];
                            const isExpanded = expandedColumns[key];
                            const expandedItems = column.expandedItems || [];
                            const visibleItems = isExpanded ? [...column.items, ...expandedItems] : column.items;

                            return (
                                <div key={column.title} className="space-y-2 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-1">
                                        {column.title}
                                    </h3>
                                    <div className="space-y-1.5">
                                        {visibleItems.map((item) => {
                                            const isSelected = getSelectedState(columnIndex, item.value);
                                            const Icon = item.icon;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleItemClick(columnIndex, item.value, item.isShowMore || false)}
                                                    className={cn(
                                                        "w-full text-left px-3 py-2 rounded-lg transition-all border",
                                                        "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm",
                                                        isSelected && "border-orange-300 bg-orange-50"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2.5">
                                                        <Icon className={cn("h-[18px] w-[18px] shrink-0", item.iconColor)} />
                                                        <span className="text-sm text-gray-700">{item.label}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                        {expandedItems.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => toggleColumnExpansion(columnIndex)}
                                                className="w-full py-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
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
                        <Button type="button" onClick={handleContinue} size="md" className="inline-flex items-center gap-2">
                            Continue
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
