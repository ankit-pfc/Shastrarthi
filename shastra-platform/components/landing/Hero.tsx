"use client";

import Link from "next/link";
import SearchBar from "./SearchBar";
import { Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-sand-50 via-ochre-50 to-saffron-600 dark:from-sand-900 dark:to-ochre-900">
            <div className="container mx-auto px-4 py-16 md:py-20">
                <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-sand-800/80 backdrop-blur-sm rounded-full mb-6 shadow-sm">
                        <Sparkles className="h-4 w-4 text-saffron-600 dark:text-saffron-400" />
                        <span className="text-sm font-medium text-sand-700 dark:text-sand-300">
                            AI-Powered Ancient Wisdom
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-sand-900 dark:text-sand-100 mb-4">
                        Ancient Wisdom, Illuminated
                    </h1>
                    <p className="text-lg md:text-xl text-sand-700 dark:text-sand-300 max-w-2xl mx-auto mb-8">
                        Explore the timeless wisdom of the Vedas, Upanishads, and Yoga with AI-powered explanations.
                        Ask questions, take notes, and build your personal library.
                    </p>

                    <div className="mb-10">
                        <SearchBar />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Link
                            href="/discover"
                            className="w-full sm:w-auto px-8 py-4 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg font-medium transition-colors shadow-md text-center"
                        >
                            Browse Texts
                        </Link>
                        <Link
                            href="/auth/signup"
                            className="w-full sm:w-auto px-8 py-4 border border-sand-300 dark:border-sand-700 text-saffron-600 dark:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 rounded-lg font-medium transition-colors shadow-md text-center"
                        >
                            Get Started Free
                        </Link>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 text-sm text-sand-600 dark:text-sand-400">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            10+ Sacred Texts
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            AI Explanations
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Save & Organize
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
