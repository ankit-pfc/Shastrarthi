"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

export interface SearchInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    onClear?: () => void;
    placeholder?: string;
    helperText?: string;
    className?: string;
    showSearchButton?: boolean;
}

export default function SearchInput({
    value: controlledValue,
    onChange,
    onSearch,
    onClear,
    placeholder = "Search texts, concepts, verses...",
    helperText,
    className,
    showSearchButton = true,
}: SearchInputProps) {
    const [uncontrolledValue, setUncontrolledValue] = useState("");
    const value = controlledValue !== undefined ? controlledValue : uncontrolledValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        if (controlledValue === undefined) {
            setUncontrolledValue(newValue);
        }
        onChange?.(newValue);
    };

    const handleClear = () => {
        if (controlledValue === undefined) {
            setUncontrolledValue("");
        }
        onClear?.();
    };

    const handleSearch = () => {
        onSearch?.(value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch?.(value);
        }
    };

    return (
        <div className={cn("w-full max-w-2xl mx-auto", className)}>
            <div className="relative">
                <div className="relative flex items-center bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
                    <Search className="absolute left-5 h-5 w-5 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1 h-16 pl-16 pr-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    />
                    {value && (
                        <button
                            onClick={handleClear}
                            className="absolute right-4 p-1 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    )}
                    {showSearchButton && (
                        <Button
                            onClick={handleSearch}
                            className="ml-2 mr-2 rounded-xl"
                        >
                            Search
                        </Button>
                    )}
                </div>
            </div>
            {helperText && (
                <p className="mt-3 text-sm text-gray-500 text-center">
                    {helperText}
                </p>
            )}
        </div>
    );
}
