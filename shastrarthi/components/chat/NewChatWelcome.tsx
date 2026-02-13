"use client";

import { Sparkles, BookOpen, MessageSquare, Search, Compass } from "lucide-react";

interface NewChatWelcomeProps {
    onPromptSelect: (prompt: string) => void;
}

const useCaseCards = [
    {
        id: "study-shastras",
        icon: BookOpen,
        iconColor: "text-blue-600",
        bgColor: "bg-blue-50",
        title: "Study Shastras",
        description: "Deep-dive into ancient texts",
        prompt: "Help me study and understand the Bhagavad Gita, Upanishads, and other sacred texts. What are the key concepts and teachings I should know about?",
    },
    {
        id: "simplify-translate",
        icon: Sparkles,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50",
        title: "Simplify & Translate",
        description: "Simplify concepts or translate passages",
        prompt: "Simplify this passage from the Bhagavad Gita into easy-to-understand language, and translate it to Hindi.",
    },
    {
        id: "extract-insights",
        icon: MessageSquare,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
        title: "Extract Insights",
        description: "Extract themes and relationships",
        prompt: "What are the main themes and relationships between the concepts of Karma, Dharma, and Moksha in the Bhagavad Gita?",
    },
    {
        id: "ask-guru",
        icon: Compass,
        iconColor: "text-orange-600",
        bgColor: "bg-orange-50",
        title: "Ask a Guru",
        description: "Chat with a specialized guru persona",
        prompt: "Explain the concept of Dharma from the perspective of Vedanta philosophy.",
    },
    {
        id: "search-texts",
        icon: Search,
        iconColor: "text-indigo-600",
        bgColor: "bg-indigo-50",
        title: "Search Texts",
        description: "Search across the Shastra corpus",
        prompt: "Find verses about meditation and mindfulness from the Yoga Sutras and Bhagavad Gita.",
    },
    {
        id: "explore-topics",
        icon: Compass,
        iconColor: "text-pink-600",
        bgColor: "bg-pink-50",
        title: "Explore Topics",
        description: "Browse traditions and concepts",
        prompt: "What are the key concepts and practices in the path of Bhakti Yoga?",
    },
];

export default function NewChatWelcome({ onPromptSelect }: NewChatWelcomeProps) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-8">
            <div className="max-w-2xl w-full">
                {/* Hero Section */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Welcome to Shastrarthi
                    </h1>
                    <p className="text-sm text-gray-600 mb-4">
                        Your personal AI guide through ancient wisdom. Start a conversation or explore below.
                    </p>
                </div>

                {/* Use Case Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {useCaseCards.map((card) => (
                        <button
                            key={card.id}
                            onClick={() => onPromptSelect(card.prompt)}
                            className={`
                                group flex items-center gap-3 p-4 rounded-lg
                                border border-gray-200 bg-white hover:border-gray-300
                                hover:shadow-sm transition-all duration-200
                                text-left
                                ${card.bgColor} hover:bg-opacity-80
                            `}
                        >
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${card.bgColor} flex-shrink-0`}>
                                <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`text-sm font-semibold text-gray-900 mb-0.5 ${card.iconColor}`}>
                                    {card.title}
                                </h3>
                                <p className="text-xs text-gray-600">
                                    {card.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Quick Prompt Input */}
                <div className="text-center text-xs text-gray-500">
                    <p>Or type your question below to start chatting</p>
                </div>
            </div>
        </div>
    );
}
