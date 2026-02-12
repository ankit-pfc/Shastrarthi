"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
    {
        q: "What is Shastrarthi?",
        a: "Shastrarthi is a research and study platform for ancient Sanskrit texts. It gives you verse-by-verse reading (Sanskrit, transliteration, English) with AI-powered explanations that respect tradition boundaries. You can study the Vedas, Upanishads, Bhagavad Gita, Yoga Sutras, and more in one place.",
    },
    {
        q: "Can I study the Bhagavad Gita verse by verse?",
        a: "Yes. Every text on Shastrarthi is presented verse by verse with the original Sanskrit, transliteration, and English translation side by side. You can select any verse and ask the AI to explain its meaning, historical context, or practical application.",
    },
    {
        q: "Does Shastrarthi explain verses from multiple traditions?",
        a: "Yes. When you ask about a verse, the AI can show you how Advaita, Shaiva, Shakta, Bhakti, and other lineages interpret it differently. This is one of the things that makes Shastrarthi different from single-tradition platforms.",
    },
    {
        q: "Is Shastrarthi free?",
        a: "Core features are free forever, with no credit card required. You can read all texts, ask the AI questions, save texts to your library, and bookmark verses at no cost.",
    },
    {
        q: "Is this for beginners or advanced students?",
        a: "Both. Texts are tagged by difficulty level (beginner through scholar), and the AI adjusts its explanations based on your questions. Whether you're reading the Isha Upanishad for the first time or cross-referencing Tantra commentaries, Shastrarthi works for your level.",
    },
    {
        q: "Can I use this for academic research?",
        a: "Yes. You can create structured notebooks, take notes on specific verses, track your reading progress, and organize research across multiple texts. The AI provides citations and tradition-specific sourcing to support scholarly work.",
    },
];

export default function FAQ() {
    const [open, setOpen] = useState<number>(0);

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Frequently Asked Questions</h2>
                    <p className="text-gray-600">What people ask before they start studying.</p>
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
