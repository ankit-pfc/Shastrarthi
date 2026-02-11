"use client";

import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterBarProps {
    category: string | null;
    difficulty: string | null;
    onCategoryChange: (category: string | null) => void;
    onDifficultyChange: (difficulty: string | null) => void;
    onClearFilters: () => void;
}

const CATEGORIES = [
    { value: "Veda", label: "Veda" },
    { value: "Upanishad", label: "Upanishad" },
    { value: "Tantra", label: "Tantra" },
    { value: "Yoga", label: "Yoga" },
    { value: "Itihasa", label: "Itihasa" },
    { value: "Purana", label: "Purana" },
];

const DIFFICULTIES = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
    { value: "scholar", label: "Scholar" },
];

export default function FilterBar({
    category,
    difficulty,
    onCategoryChange,
    onDifficultyChange,
    onClearFilters,
}: FilterBarProps) {
    const hasActiveFilters = category || difficulty;

    return (
        <div className="bg-white dark:bg-sand-800 rounded-lg shadow-sm border border-sand-200 dark:border-sand-700 p-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-sand-500" />
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onCategoryChange(null)}
                            className={cn(
                                "px-3 py-1.5 text-sm rounded-md transition-colors",
                                !category
                                    ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300"
                                    : "text-sand-600 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700"
                            )}
                        >
                            All
                        </button>
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat.value}
                                onClick={() => onCategoryChange(cat.value)}
                                className={cn(
                                    "px-3 py-1.5 text-sm rounded-md transition-colors",
                                    category === cat.value
                                        ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300"
                                        : "text-sand-600 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700"
                                )}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Difficulty Filter */}
                <div className="flex items-center gap-2">
                    <div className="w-px h-4 bg-sand-300 dark:bg-sand-600" />
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onDifficultyChange(null)}
                            className={cn(
                                "px-3 py-1.5 text-sm rounded-md transition-colors",
                                !difficulty
                                    ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300"
                                    : "text-sand-600 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700"
                            )}
                        >
                            All
                        </button>
                        {DIFFICULTIES.map((diff) => (
                            <button
                                key={diff.value}
                                onClick={() => onDifficultyChange(diff.value)}
                                className={cn(
                                    "px-3 py-1.5 text-sm rounded-md transition-colors",
                                    difficulty === diff.value
                                        ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300"
                                        : "text-sand-600 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700"
                                )}
                            >
                                {diff.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-sand-600 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700 transition-colors"
                    >
                        <X className="h-4 w-4" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}
