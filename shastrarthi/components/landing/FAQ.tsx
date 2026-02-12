"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
    {
        q: "What is Shastrarthi?",
        a: "Shastrarthi is an AI-assisted research and learning platform for Shastras, built for both academic study and practical spiritual exploration.",
    },
    {
        q: "Can I research across multiple traditions?",
        a: "Yes. You can compare interpretations across traditions like Advaita, Shaiva, Shakta, and Bhakti streams.",
    },
    {
        q: "Does it support verse-level analysis?",
        a: "Yes. You can ask targeted questions per verse and get context-aware explanations and related references.",
    },
    {
        q: "Can I save my work?",
        a: "You can save texts, bookmark verses, and maintain structured notes in your personal workspace.",
    },
    {
        q: "Who is this for?",
        a: "Shastrarthi is for students, practitioners, teachers, and researchers who want structured access to Shastra wisdom.",
    },
    {
        q: "How does AI quality differ by mode?",
        a: "Standard mode is fast, High Quality adds depth, and Deep Review provides comprehensive multi-text synthesis.",
    },
];

export default function FAQ() {
    const [open, setOpen] = useState<number>(0);

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-h2 font-serif font-semibold text-gray-900 mb-2">FAQ</h2>
                    <p className="text-gray-600">Common questions about Shastrarthi.</p>
                </div>

                <div className="max-w-3xl mx-auto space-y-3">
                    {FAQ_ITEMS.map((item, idx) => {
                        const isOpen = open === idx;
                        return (
                            <div key={item.q} className="bg-white border border-gray-200 rounded-xl shadow-sm">
                                <button
                                    onClick={() => setOpen(isOpen ? -1 : idx)}
                                    className="w-full px-5 py-4 flex items-center justify-between text-left"
                                >
                                    <span className="font-medium text-gray-900">{item.q}</span>
                                    <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", isOpen && "rotate-180")} />
                                </button>
                                {isOpen && (
                                    <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                                        {item.a}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
