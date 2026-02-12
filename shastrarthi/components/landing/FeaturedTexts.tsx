"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";

interface FeaturedText {
    slug: string;
    title_en: string;
    title_sa: string;
    category: string;
    difficulty: string;
    description: string;
    verse_count: number;
    coverImageUrl?: string;
}

const FEATURED_TEXTS: FeaturedText[] = [
    {
        slug: "bhagavad-gita-chapter-2",
        title_en: "Bhagavad Gita - Chapter 2",
        title_sa: "भगवद्गीता - द्वितीय अध्याय: सांख्ययोग",
        category: "Itihasa",
        difficulty: "beginner",
        description: "Introduces concepts of eternal soul (atman) and path of knowledge. Arjuna receives teachings on nature of self and performing one's duty without attachment.",
        verse_count: 7,
    },
    {
        slug: "yoga-sutras",
        title_en: "Yoga Sutras of Patanjali",
        title_sa: "पतञ्जलि योगसूत्र",
        category: "Yoga",
        difficulty: "intermediate",
        description: "The foundational text of Yoga philosophy. It outlines the eight limbs (Ashtanga Yoga) and provides a systematic approach to spiritual liberation.",
        verse_count: 8,
    },
    {
        slug: "mandukya-upanishad",
        title_en: "Mandukya Upanishad",
        title_sa: "माण्डूक्योपनिषत्",
        category: "Upanishad",
        difficulty: "advanced",
        description: "The shortest Upanishad with just 12 verses. Expounds four states of consciousness (waking, dreaming, deep sleep, and turiya) and Om as Brahman.",
        verse_count: 7,
    },
    {
        slug: "isha-upanishad",
        title_en: "Isha Upanishad",
        title_sa: "ईशोपनिषत्",
        category: "Upanishad",
        difficulty: "beginner",
        description: "One of shortest Upanishads with 18 verses. Teaches that Supreme Being pervades everything and to live without attachment.",
        verse_count: 18,
    },
    {
        slug: "hatha-yoga-pradipika",
        title_en: "Hatha Yoga Pradipika",
        title_sa: "हठयोगप्रदीपिका",
        category: "Yoga",
        difficulty: "intermediate",
        description: "A classic manual on Hatha Yoga, covering asanas, pranayama, mudras, and samadhi. Essential for understanding physical yoga practices.",
        verse_count: 10,
    },
    {
        slug: "vivekachudamani",
        title_en: "Vivekachudamani",
        title_sa: "विवेकचूडामणि",
        category: "Vedanta",
        difficulty: "advanced",
        description: "A masterpiece by Adi Shankaracharya on discrimination between real and unreal. A guide to self-realization.",
        verse_count: 12,
    },
];

function getCategoryColor(category: string) {
    switch (category) {
        case "Vedas":
        case "Veda":
            return { text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" };
        case "Upanishad":
            return { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
        case "Yoga":
            return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
        case "Itihasa":
            return { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
        case "Tantra":
            return { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
        case "Vedanta":
            return { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" };
        case "Purana":
            return { text: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" };
        default:
            return { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };
    }
}

export default function FeaturedTexts() {
    return (
        <SectionContainer background="white" padding="lg">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                            Featured Texts
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Start your journey with these popular sacred texts
                        </p>
                    </div>
                    <Link
                        href="/discover"
                        className="hidden sm:flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                    >
                        View All Texts
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FEATURED_TEXTS.map((text) => {
                        const categoryStyle = getCategoryColor(text.category);

                        return (
                            <div
                                key={text.slug}
                                className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all flex flex-col h-full p-4"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                                        {text.category}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">
                                        {text.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    {text.title_en}
                                </h3>
                                <p className="text-sm text-gray-500 font-devanagari mb-2 line-clamp-1">
                                    {text.title_sa}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
                                    {text.description}
                                </p>
                                <Link
                                    href={`/reader/${text.slug}`}
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700"
                                >
                                    Read
                                    <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-6 text-center sm:hidden">
                    <Link
                        href="/discover"
                        className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium"
                    >
                        View All Texts
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </SectionContainer>
    );
}
