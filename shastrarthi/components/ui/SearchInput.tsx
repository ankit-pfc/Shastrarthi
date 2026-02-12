"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "./Button";

export interface SearchInputProps {
    value?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    placeholder?: string;
    helperText?: string;
    className?: string;
    showSearchButton?: boolean;
}

export default function SearchInput({
    value: controlledValue,
    onChange,
    onSearch,
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
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 flex-shrink-0" />
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        className="flex-1 h-12 pl-12 pr-4 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none"
                    />
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
