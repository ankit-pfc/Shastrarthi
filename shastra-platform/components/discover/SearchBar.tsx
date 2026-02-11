"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { debounce } from "@/lib/utils";

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onClear: () => void;
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
    const [localValue, setLocalValue] = useState(value);

    const debouncedOnChange = debounce((newValue: string) => {
        onChange(newValue);
    }, 300);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        debouncedOnChange(newValue);
    };

    const handleClear = () => {
        setLocalValue("");
        onClear();
    };

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-sand-400" />
                <input
                    type="text"
                    value={localValue}
                    onChange={handleChange}
                    placeholder="Search texts..."
                    className={cn(
                        "w-full pl-10 pr-10 py-2.5 rounded-lg border border-sand-300 dark:border-sand-600",
                        "bg-sand-50 dark:bg-sand-900",
                        "text-sand-900 dark:text-sand-100 placeholder:text-sand-400 dark:placeholder:text-sand-500",
                        "focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent",
                        "transition-all"
                    )}
                />
                {localValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-sand-400 hover:text-sand-600 dark:text-sand-500 dark:hover:text-sand-300 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}
