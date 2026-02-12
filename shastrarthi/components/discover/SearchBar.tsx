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
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    value={localValue}
                    onChange={handleChange}
                    placeholder="Search texts, concepts, verses..."
                    className={cn(
                        "w-full h-16 pl-14 pr-10 rounded-2xl border border-gray-200",
                        "bg-white shadow-xl",
                        "text-gray-900 placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                        "transition-all"
                    )}
                />
                {localValue && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
