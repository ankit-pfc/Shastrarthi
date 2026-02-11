"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sun, Moon, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReaderControlsProps {
    title: string;
    sanskritTitle?: string | null;
    category: string;
}

export default function ReaderControls({
    title,
    sanskritTitle,
    category,
}: ReaderControlsProps) {
    const [isDark, setIsDark] = useState(false);
    const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");

    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle("dark");
        // TODO: Save theme preference to localStorage
    };

    const increaseFontSize = () => {
        if (fontSize === "small") setFontSize("medium");
        else if (fontSize === "medium") setFontSize("large");
    };

    const decreaseFontSize = () => {
        if (fontSize === "large") setFontSize("medium");
        else if (fontSize === "medium") setFontSize("small");
    };

    const getFontSizeClass = () => {
        switch (fontSize) {
            case "small":
                return "text-sm";
            case "large":
                return "text-lg";
            default:
                return "text-base";
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-sand-900/80 backdrop-blur-sm border-b border-sand-200 dark:border-sand-700">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Back Button */}
                    <Link
                        href="/discover"
                        className="flex items-center gap-2 text-sand-700 dark:text-sand-300 hover:text-saffron-600 dark:hover:text-saffron-400 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>

                    {/* Title */}
                    <div className="flex-1 text-center min-w-0">
                        <h1 className={cn("font-semibold truncate", getFontSizeClass())}>
                            {sanskritTitle && <span className="mr-2 font-serif text-saffron-600 dark:text-saffron-400">{sanskritTitle}</span>}
                            {title}
                        </h1>
                        <p className="text-xs text-sand-500 dark:text-sand-400 mt-0.5">
                            {category}
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        {/* Font Size Controls */}
                        <div className="flex items-center border border-sand-200 dark:border-sand-700 rounded-md overflow-hidden">
                            <button
                                onClick={decreaseFontSize}
                                className="p-2 hover:bg-sand-100 dark:hover:bg-sand-700 transition-colors"
                                aria-label="Decrease font size"
                                disabled={fontSize === "small"}
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <div className="w-px h-4 bg-sand-200 dark:bg-sand-700" />
                            <button
                                onClick={increaseFontSize}
                                className="p-2 hover:bg-sand-100 dark:hover:bg-sand-700 transition-colors"
                                aria-label="Increase font size"
                                disabled={fontSize === "large"}
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-md text-sand-700 dark:text-sand-300 hover:bg-sand-100 dark:hover:bg-sand-700 transition-colors"
                            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
