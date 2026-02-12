"use client";

import Link from "next/link";
import { BookOpen, Scroll, Sparkles, Activity, Brain, History, ArrowRight, Star, Bookmark, ListPlus, Flame, Sun, Flower2, TreeDeciduous, MessageSquare, Tag } from "lucide-react";

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
        description: "Introduces the concepts of the eternal soul (atman) and the path of knowledge. Arjuna receives teachings on the nature of the self and performing one's duty without attachment.",
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
        description: "The shortest Upanishad with just 12 verses. Expounds the four states of consciousness (waking, dreaming, deep sleep, and turiya) and Om as Brahman.",
        verse_count: 7,
    },
    {
        slug: "isha-upanishad",
        title_en: "Isha Upanishad",
        title_sa: "ईशोपनिषत्",
        category: "Upanishad",
        difficulty: "beginner",
        description: "One of the shortest Upanishads with 18 verses. Teaches that the Supreme Being pervades everything and to live without attachment.",
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
        description: "A masterpiece by Adi Shankaracharya on the discrimination between the real and unreal. A guide to self-realization.",
        verse_count: 12,
    },
];

function getCategoryIcon(category: string) {
    switch (category) {
        case "Vedas":
        case "Veda":
            return Flame;
        case "Upanishad":
            return Sun;
        case "Yoga":
            return Flower2;
        case "Itihasa":
            return Scroll;
        case "Tantra":
            return Sparkles;
        case "Vedanta":
            return Brain;
        case "Purana":
            return TreeDeciduous;
        default:
            return BookOpen;
    }
}

function getCategoryColor(category: string) {
    switch (category) {
        case "Vedas":
        case "Veda":
            return { text: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-900/20" };
        case "Upanishad":
            return { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-900/20" };
        case "Yoga":
            return { text: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20" };
        case "Itihasa":
            return { text: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-900/20" };
        case "Tantra":
            return { text: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20" };
        case "Vedanta":
            return { text: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" };
        case "Purana":
            return { text: "text-pink-600 dark:text-pink-400", bg: "bg-pink-50 dark:bg-pink-900/20" };
        default:
            return { text: "text-sand-600 dark:text-sand-400", bg: "bg-sand-50 dark:bg-sand-700/20" };
    }
}

function getDifficultyColor(difficulty: string) {
    switch (difficulty) {
        case "beginner":
            return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        case "intermediate":
            return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
        case "advanced":
            return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        default:
            return "bg-sand-100 text-sand-700 dark:bg-sand-900/30 dark:text-sand-400";
    }
}

// Generate cover image placeholder based on text slug
const getCoverImage = (text: FeaturedText): string => {
    if (text.coverImageUrl) return text.coverImageUrl;

    // Generate consistent placeholder based on text slug
    const gradients = [
        "from-saffron-500 to-marigold-700",
        "from-ochre-500 to-sand-700",
        "from-sand-500 to-ochre-700",
        "from-marigold-500 to-saffron-700",
        "from-amber-500 to-ochre-700",
        "from-orange-500 to-saffron-700",
    ];
    const gradientIndex = text.slug.length % gradients.length;
    const initials = text.title_en.split(" ").map((w) => w[0]).join("").slice(0, 2);

    // Return a CSS gradient-based placeholder
    return gradients[gradientIndex];
};

export default function FeaturedTexts() {
    return (
        <div className="bg-white dark:bg-sand-800 rounded-xl shadow-sm border border-sand-200 dark:border-sand-700 p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-sand-900 dark:text-sand-100 mb-2">
                        Featured Texts
                    </h2>
                    <p className="text-sand-600 dark:text-sand-400">
                        Start your journey with these popular sacred texts
                    </p>
                </div>
                <Link
                    href="/discover"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-saffron-600 dark:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 rounded-lg transition-colors font-medium"
                >
                    View All Texts
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {FEATURED_TEXTS.map((text) => {
                    const CategoryIcon = getCategoryIcon(text.category);
                    const coverGradient = getCoverImage(text);
                    const initials = text.title_en.split(" ").map((w) => w[0]).join("").slice(0, 2);

                    return (
                        <div
                            key={text.slug}
                            className="group bg-white dark:bg-sand-800 rounded-xl overflow-hidden hover:shadow-lg hover:border-saffron-400 dark:hover:border-saffron-500 hover:-translate-y-1 border-2 border-sand-200 dark:border-sand-700 transition-all duration-300 ease-out flex flex-col h-full"
                        >
                            <div className="flex gap-4 p-5">
                                {/* Cover Image / Thumbnail */}
                                <div
                                    className={`flex-shrink-0 w-24 h-32 rounded-lg bg-gradient-to-br ${coverGradient} flex items-center justify-center text-white text-2xl font-bold shadow-md`}
                                >
                                    {initials}
                                </div>

                                {/* Content */}
                                <div className="flex-1 flex flex-col min-w-0">
                                    {/* Category Icon Header */}
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg mb-2 ${getCategoryColor(text.category).bg}`}>
                                        <CategoryIcon className={`h-5 w-5 ${getCategoryColor(text.category).text}`} />
                                    </div>

                                    {/* Category Badge with Icon */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getCategoryColor(text.category).bg} ${getCategoryColor(text.category).text}`}>
                                            <Tag className="h-3 w-3" />
                                            {text.category}
                                        </span>
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(text.difficulty)}`}>
                                            {text.difficulty.charAt(0).toUpperCase() + text.difficulty.slice(1)}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5 text-xs text-sand-500 dark:text-sand-500">
                                            <BookOpen className="h-3.5 w-3.5" />
                                            <span>{text.verse_count} verses</span>
                                        </div>
                                        <Star className="h-4 w-4 text-amber-400 fill-amber-400 flex-shrink-0" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100 mb-1 truncate group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                                        {text.title_en}
                                    </h3>
                                    <p className="text-sm text-saffron-600 dark:text-saffron-400 mb-2 font-sanskrit truncate">
                                        {text.title_sa}
                                    </p>

                                    <p className="text-sm text-sand-600 dark:text-sand-400 line-clamp-2 mb-3 flex-grow">
                                        {text.description}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-auto pt-3 border-t border-sand-100 dark:border-sand-700">
                                        <Link
                                            href={`/reader/${text.slug}`}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-saffron-600 hover:bg-saffron-700 text-white text-sm font-medium rounded-lg transition-colors group-hover:gap-2"
                                        >
                                            <span>Read</span>
                                            <MessageSquare className="h-3.5 w-3.5" />
                                        </Link>
                                        <button
                                            className="p-1.5 text-sand-600 dark:text-sand-400 hover:text-saffron-600 dark:hover:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 rounded-lg transition-colors"
                                            aria-label="Save"
                                        >
                                            <Bookmark className="h-4 w-4" />
                                        </button>
                                        <button
                                            className="p-1.5 text-sand-600 dark:text-sand-400 hover:text-saffron-600 dark:hover:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 rounded-lg transition-colors"
                                            aria-label="Add to list"
                                        >
                                            <ListPlus className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 text-center sm:hidden">
                <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 px-4 py-2 text-saffron-600 dark:text-saffron-400 hover:bg-saffron-50 dark:hover:bg-saffron-900/20 rounded-lg transition-colors font-medium"
                >
                    View All Texts
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
