"use client";

import { useState } from "react";
import { ArrowRight, RefreshCw, BookOpen, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
// Assuming button variants are available or we use standard tailwind classes
// If specific Button component exists, we should use it, but for now standard tailwind with shastrarthi styling

interface Option {
    id: string;
    text: string;
    path: "karma" | "bhakti" | "jnana" | "raja";
}

interface Question {
    id: number;
    text: string;
    options: Option[];
}

const QUESTIONS: Question[] = [
    {
        id: 1,
        text: "When you feel most connected to the Infinite, what fills your heart?",
        options: [
            { id: "a", text: "The clarity of understanding the Truth behind appearances", path: "jnana" },
            { id: "b", text: "An overwhelming wave of love and surrender to the Divine", path: "bhakti" },
            { id: "c", text: "The quiet satisfaction of serving others selflessly", path: "karma" },
            { id: "d", text: "The deep silence of a still, focused mind", path: "raja" },
        ],
    },
    {
        id: 2,
        text: "Which obstacle do you struggle with the most?",
        options: [
            { id: "a", text: "Confusion and the inability to distinguish real from unreal", path: "jnana" },
            { id: "b", text: "Dryness of heart and a feeling of separation", path: "bhakti" },
            { id: "c", text: "Selfishness and attachment to the results of my work", path: "karma" },
            { id: "d", text: "A restless, wandering mind that won't obey", path: "raja" },
        ],
    },
    {
        id: 3,
        text: "If you could spend a Sunday in any way, what would you choose?",
        options: [
            { id: "a", text: "Studying the Upanishads to pierce through illusion", path: "jnana" },
            { id: "b", text: "Singing Kirtan or sitting in loving contemplation", path: "bhakti" },
            { id: "c", text: "Volunteering your time to help those in need", path: "karma" },
            { id: "d", text: "Withdrawing into deep meditation for hours", path: "raja" },
        ],
    },
    {
        id: 4,
        text: "How do you view the Divine?",
        options: [
            { id: "a", text: "As the Impersonal, Absolute Reality (Brahman)", path: "jnana" },
            { id: "b", text: "As the Beloved Personal Lord (Ishvara)", path: "bhakti" },
            { id: "c", text: "As the unseen force governing cause and effect", path: "karma" },
            { id: "d", text: "As the Inner Witness (Purusha) beyond nature", path: "raja" },
        ],
    },
    {
        id: 5,
        text: "What brings you the greatest peace?",
        options: [
            { id: "a", text: "The 'Aha!' moment of realizing I am not the body", path: "jnana" },
            { id: "b", text: "Tears of gratitude and devotion", path: "bhakti" },
            { id: "c", text: "Acting without anxiety about the future", path: "karma" },
            { id: "d", text: "The suspension of all thought waves", path: "raja" },
        ],
    },
];

const PATH_INFO = {
    jnana: {
        title: "Jnana Yoga",
        subtitle: "The Path of Wisdom",
        description: "Your nature is inquisitive. You do not accept things on blind faith; you want to know. For you, liberation comes through 'Viveka'—discriminating between the eternal Self and the fleeting world.",
        recommendation: "Begin with the Upanishads or ask the 'Advaita Scholar' persona to explain 'Neti Neti' (Not this, not this).",
        color: "bg-blue-50 text-blue-900 border-blue-200",
    },
    bhakti: {
        title: "Bhakti Yoga",
        subtitle: "The Path of Devotion",
        description: "Your heart leads the way. You find freedom not by rejecting the world, but by seeing the Beloved in everything. For you, emotion is not a distraction—it is the fuel for transcendence.",
        recommendation: "Read Chapter 12 of the Bhagavad Gita or ask the 'Sūtradhāra' for stories of the Alvars and Nayanars.",
        color: "bg-pink-50 text-pink-900 border-pink-200",
    },
    karma: {
        title: "Karma Yoga",
        subtitle: "The Path of Selfless Action",
        description: "You are a doer. You realize that you cannot sit still, so you turn work into worship. Your path to freedom is 'Nishkama Karma'—action performed perfectly, without attachment to the outcome.",
        recommendation: "Study Chapter 3 of the Bhagavad Gita or ask the 'Yoga Guide' how to practice Karma Yoga in your daily job.",
        color: "bg-orange-50 text-orange-900 border-orange-200",
    },
    raja: {
        title: "Raja Yoga",
        subtitle: "The Path of Meditation",
        description: "You seek mastery over the instrument of the mind. You understand that a scattered mind cannot see the Truth. Your path involves discipline, breathwork, and the eight limbs of Yoga.",
        recommendation: "Study Patanjali's Yoga Sutras or ask the 'Yoga Guide' about 'Chitta Vritti Nirodha'.",
        color: "bg-purple-50 text-purple-900 border-purple-200",
    },
};

export function QuizInterface() {
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [scores, setScores] = useState({ jnana: 0, bhakti: 0, karma: 0, raja: 0 });
    const [isFinished, setIsFinished] = useState(false);
    const [leadCaptured, setLeadCaptured] = useState(false);

    const handleAnswer = (path: keyof typeof scores) => {
        trackEvent({ action: "message_sent", category: "quiz", label: path }); // Using message_sent as generic interaction or create specific if needed
        const newScores = { ...scores, [path]: scores[path] + 1 };
        setScores(newScores);

        if (currentQuestionIdx < QUESTIONS.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            setIsFinished(true);
            trackEvent({ action: "tool_quiz_completed", width: path });
        }
    };

    const getResult = () => {
        const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
        const winnerKey = sorted[0][0] as keyof typeof PATH_INFO;
        return PATH_INFO[winnerKey];
    };

    const resetQuiz = () => {
        setScores({ jnana: 0, bhakti: 0, karma: 0, raja: 0 });
        setCurrentQuestionIdx(0);
        setIsFinished(false);
        setLeadCaptured(false);
    };

    if (isFinished) {
        const result = getResult();

        return (
            <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-stone-200 animate-in fade-in duration-500">
                <div className="text-center mb-8">
                    <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-stone-500 uppercase bg-stone-100 rounded-full mb-3">
                        Your Result
                    </span>
                    <h2 className="text-3xl font-serif text-ink-900 mb-2">{result.title}</h2>
                    <p className="text-lg text-saffron-700">{result.subtitle}</p>
                </div>

                <div className={cn("p-6 rounded-lg border mb-8", result.color)}>
                    <p className="text-lg leading-relaxed">{result.description}</p>
                </div>

                <div className="bg-stone-50 p-6 rounded-lg mb-8">
                    <h3 className="font-semibold text-ink-900 mb-2 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-saffron-700" />
                        Recommended Next Step
                    </h3>
                    <p className="text-stone-600 mb-4">{result.recommendation}</p>

                    <Link
                        href="/app"
                        className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-saffron-700 rounded-md hover:bg-saffron-800 transition-colors"
                    >
                        Start Studying Now <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>

                <div className="text-center">
                    <button
                        onClick={resetQuiz}
                        className="inline-flex items-center text-sm text-stone-500 hover:text-stone-800 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4 mr-1.5" /> Retake Quiz
                    </button>
                </div>
            </div>
        );
    }

    const question = QUESTIONS[currentQuestionIdx];

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-stone-200 rounded-full mb-8">
                <div
                    className="h-full bg-saffron-500 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentQuestionIdx) / QUESTIONS.length) * 100}%` }}
                />
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-200 min-h-[400px] flex flex-col justify-center">
                <span className="text-sm font-medium text-stone-400 mb-4 block">
                    Question {currentQuestionIdx + 1} of {QUESTIONS.length}
                </span>

                <h2 className="text-2xl font-serif text-ink-900 mb-8 leading-tight">
                    {question.text}
                </h2>

                <div className="space-y-3">
                    {question.options.map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => handleAnswer(opt.path)}
                            className="w-full text-left p-4 rounded-lg border border-stone-200 hover:border-saffron-300 hover:bg-parchment-50 transition-all duration-200 group"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-stone-700 font-medium group-hover:text-ink-900 transition-colors">
                                    {opt.text}
                                </span>
                                <ArrowRight className="w-4 h-4 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
