"use client";

import { BookOpen, Scroll, Sparkles, Bookmark } from "@/components/icons/DomainIcons";

export default function HowItWorks() {
    const steps = [
        {
            icon: <BookOpen className="h-6 w-6 text-ink-900" />,
            title: "Discover Texts",
            description: "Browse our collection of sacred texts from the Vedic tradition.",
        },
        {
            icon: <Scroll className="h-6 w-6 text-ink-900" />,
            title: "Read & Learn",
            description: "Access the text reader with Sanskrit, transliteration, and English translations. Read verses sequentially with AI-powered explanations.",
        },
        {
            icon: <Sparkles className="h-6 w-6 text-ink-900" />,
            title: "Ask AI",
            description: "Get instant answers to your questions about any verse using our AI assistant. Context-aware responses with verse citations.",
        },
        {
            icon: <Bookmark className="h-6 w-6 text-ink-900" />,
            title: "Save & Organize",
            description: "Bookmark verses, take notes, and build your personal library with reading lists.",
        },
    ];

    return (
        <div className="bg-parchment-50">
            <div className="container mx-auto px-4">
                <div className="bg-white border border-stone-200 rounded-card p-8 shadow-sm">
                    <h2 className="text-h2 font-semibold text-ink-900 mb-3">
                        How It Works
                    </h2>
                    <p className="text-body/md text-neutral-700 mb-6">
                        Four simple steps to begin your spiritual journey with ancient wisdom.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                className="bg-parchment-50 border border-stone-200 rounded-lg p-6 hover:shadow-md transition-all min-h-[160px] flex flex-col"
                            >
                                <div className="flex items-start gap-4 mb-3">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-parchment-100 border border-stone-200">
                                            {step.icon}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-ink-900 mb-2">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm text-neutral-700 leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
