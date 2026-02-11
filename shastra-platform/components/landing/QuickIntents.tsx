"use client";

import Link from "next/link";
import { Lightbulb, Search, Compass, Activity, ArrowRight } from "lucide-react";

const INTENTS = [
    {
        id: 1,
        title: "I want to learn about...",
        description: "Philosophy, concepts, and teachings from ancient wisdom",
        icon: Lightbulb,
        action: "Explore Teachings",
        href: "/discover?category=Upanishads",
    },
    {
        id: 2,
        title: "I'm looking for...",
        description: "Specific texts, topics, or verses to study",
        icon: Search,
        action: "Find Texts",
        href: "/discover",
    },
    {
        id: 3,
        title: "I want to explore...",
        description: "Different categories and traditions of sacred texts",
        icon: Compass,
        action: "Browse Categories",
        href: "/discover",
    },
    {
        id: 4,
        title: "I want to practice...",
        description: "Yoga, meditation techniques, and spiritual practices",
        icon: Activity,
        action: "Start Practicing",
        href: "/discover?category=Yoga",
    },
];

export default function QuickIntents() {
    return (
        <div className="bg-parchment-50">
            <div className="container mx-auto px-4">
                <div className="bg-white border border-stone-200 rounded-card p-8 shadow-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-h3 font-semibold text-ink-900 mb-3">
                            What brings you here today?
                        </h2>
                        <p className="text-body/md text-neutral-700 max-w-2xl mx-auto">
                            Choose your intent and we'll guide you to the perfect starting point
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {INTENTS.map((intent) => {
                            const Icon = intent.icon;
                            return (
                                <Link
                                    key={intent.id}
                                    href={intent.href}
                                    className="group relative bg-parchment-50 rounded-xl p-6 hover:shadow-lg hover:border-stone-300 border border border-transparent transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 p-3 rounded-lg bg-parchment-100 border border-stone-200">
                                            <Icon className="h-6 w-6 text-ink-900" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-ink-900 mb-2">
                                                {intent.title}
                                            </h3>
                                            <p className="text-sm text-neutral-700 mb-3">
                                                {intent.description}
                                            </p>
                                            <span className="inline-flex items-center gap-1 text-sm font-medium text-saffron-500 group-hover:gap-2 transition-all">
                                                {intent.action}
                                                <ArrowRight className="h-4 w-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
