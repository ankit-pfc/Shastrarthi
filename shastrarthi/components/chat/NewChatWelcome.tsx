"use client";

import { Sparkles, BookOpen, MessageSquare, Zap } from "lucide-react";

interface NewChatWelcomeProps {
    onPromptSelect: (prompt: string) => void;
}

const cards = [
    {
        id: "study",
        icon: BookOpen,
        iconColor: "text-blue-600",
        pill: "border-blue-200 bg-blue-50/60 hover:bg-blue-50 hover:border-blue-300",
        title: "Study Shastras",
        prompt: "Help me study and understand the Bhagavad Gita and its key teachings.",
    },
    {
        id: "simplify",
        icon: Sparkles,
        iconColor: "text-purple-600",
        pill: "border-purple-200 bg-purple-50/60 hover:bg-purple-50 hover:border-purple-300",
        title: "Simplify",
        prompt: "Simplify this passage from the Bhagavad Gita into easy language.",
    },
    {
        id: "extract",
        icon: Zap,
        iconColor: "text-emerald-600",
        pill: "border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-300",
        title: "Extract Insights",
        prompt: "What are the main themes connecting Karma, Dharma, and Moksha?",
    },
    {
        id: "guru",
        icon: MessageSquare,
        iconColor: "text-orange-600",
        pill: "border-orange-200 bg-orange-50/60 hover:bg-orange-50 hover:border-orange-300",
        title: "Ask a Guru",
        prompt: "Explain the concept of Dharma from the perspective of Vedanta.",
    },
];

export default function NewChatWelcome({ onPromptSelect }: NewChatWelcomeProps) {
    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-5">
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    Welcome to Shastrarthi
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Your AI guide to ancient wisdom
                </p>
            </div>

            {/* 2×2 grid — auto-width columns, centered */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 w-fit mx-auto mb-3">
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => onPromptSelect(card.prompt)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 border
                                   rounded-lg hover:shadow-sm hover:-translate-y-px
                                   active:translate-y-0
                                   transition-all duration-150 ${card.pill}`}
                    >
                        <card.icon className={`h-4 w-4 shrink-0 ${card.iconColor}`} />
                        <span className="text-[13px] font-medium text-gray-700 whitespace-nowrap">
                            {card.title}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
