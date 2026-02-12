"use client";
import { Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
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
export default function FilterBar({ category, difficulty, onCategoryChange, onDifficultyChange, onClearFilters, }) {
    const hasActiveFilters = category || difficulty;
    return (<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500"/>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => onCategoryChange(null)} className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", !category
            ? "bg-orange-100 text-orange-700"
            : "text-gray-600 hover:bg-gray-100")}>
                            All
                        </button>
                        {CATEGORIES.map((cat) => (<button key={cat.value} onClick={() => onCategoryChange(cat.value)} className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", category === cat.value
                ? "bg-orange-100 text-orange-700"
                : "text-gray-600 hover:bg-gray-100")}>
                                {cat.label}
                            </button>))}
                    </div>
                </div>

                {/* Difficulty Filter */}
                <div className="flex items-center gap-2">
                    <div className="w-px h-4 bg-gray-300"/>
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => onDifficultyChange(null)} className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", !difficulty
            ? "bg-orange-100 text-orange-700"
            : "text-gray-600 hover:bg-gray-100")}>
                            All
                        </button>
                        {DIFFICULTIES.map((diff) => (<button key={diff.value} onClick={() => onDifficultyChange(diff.value)} className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", difficulty === diff.value
                ? "bg-orange-100 text-orange-700"
                : "text-gray-600 hover:bg-gray-100")}>
                                {diff.label}
                            </button>))}
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (<button onClick={onClearFilters} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                        <X className="h-4 w-4"/>
                        Clear
                    </button>)}
            </div>
        </div>);
}
