import { ArrowRight, BarChart3, BookOpen, Brain, Building2, Circle, Columns, Eye, FileText, Flame, Flower2, GraduationCap, Heart, Languages, ListChecks, Mountain, PenLine, Search, Sparkles, Sun, TreeDeciduous, } from "lucide-react";
export const INTENT_BUILDER_CONFIG = [
    {
        title: "I WANT TO",
        items: [
            { id: "learn-philosophy", label: "Learn a philosophy", value: "learn-philosophy", icon: BookOpen, iconColor: "text-blue-600" },
            { id: "find-verse", label: "Find a verse", value: "find-verse", icon: Search, iconColor: "text-green-600" },
            { id: "reading-plan", label: "Start a reading plan", value: "reading-plan", icon: ListChecks, iconColor: "text-orange-600" },
            { id: "compare", label: "Compare translations", value: "compare", icon: Columns, iconColor: "text-purple-600" },
            { id: "deity-tradition", label: "Explore a deity tradition", value: "deity-tradition", icon: Building2, iconColor: "text-red-600" },
            { id: "understand-concept", label: "Understand a concept", value: "understand-concept", icon: Brain, iconColor: "text-teal-600" },
            { id: "show-more-goals", label: "Show More", value: "show-more-goals", icon: ArrowRight, iconColor: "text-gray-500", isShowMore: true },
        ],
        expandedItems: [
            { id: "review-text", label: "Review a text", value: "review-text", icon: FileText, iconColor: "text-indigo-600" },
            { id: "write-reflection", label: "Write a reflection", value: "write-reflection", icon: PenLine, iconColor: "text-pink-600" },
            { id: "analyze-data", label: "Analyze data", value: "analyze-data", icon: BarChart3, iconColor: "text-amber-600" },
        ],
    },
    {
        title: "EXPLORE",
        items: [
            { id: "vedas", label: "Vedas", value: "vedas", icon: Flame, iconColor: "text-purple-600" },
            { id: "upanishads", label: "Upanishads", value: "upanishads", icon: Sun, iconColor: "text-blue-600" },
            { id: "gita", label: "Bhagavad Gita", value: "gita", icon: BookOpen, iconColor: "text-orange-600" },
            { id: "yoga-sutras", label: "Yoga Sutras", value: "yoga-sutras", icon: Flower2, iconColor: "text-green-600" },
            { id: "tantra", label: "Tantra", value: "tantra", icon: Sparkles, iconColor: "text-red-600" },
            { id: "puranas", label: "Puranas", value: "puranas", icon: TreeDeciduous, iconColor: "text-pink-600" },
            { id: "show-more-lenses", label: "Show More", value: "show-more-lenses", icon: ArrowRight, iconColor: "text-gray-500", isShowMore: true },
        ],
        expandedItems: [
            { id: "kashmir-shaivism", label: "Kashmir Shaivism", value: "kashmir-shaivism", icon: Mountain, iconColor: "text-indigo-600" },
            { id: "advaita-vedanta", label: "Advaita Vedanta", value: "advaita-vedanta", icon: Eye, iconColor: "text-teal-600" },
            { id: "buddhist-texts", label: "Buddhist Texts", value: "buddhist-texts", icon: Circle, iconColor: "text-amber-600" },
        ],
    },
    {
        title: "START WITH",
        items: [
            { id: "beginner", label: "Beginner essentials", value: "beginner", icon: GraduationCap, iconColor: "text-green-600" },
            { id: "upanishads-starter", label: "Upanishad starter set", value: "upanishads-starter", icon: Sun, iconColor: "text-blue-600" },
            { id: "gita-deep-dive", label: "Gita deep-dive", value: "gita-deep-dive", icon: BookOpen, iconColor: "text-orange-600" },
            { id: "yoga-foundations", label: "Yoga foundations", value: "yoga-foundations", icon: Flower2, iconColor: "text-emerald-600" },
            { id: "advaita-starter", label: "Advaita starter", value: "advaita-starter", icon: Sparkles, iconColor: "text-purple-600" },
            { id: "bhakti-starter", label: "Bhakti starter", value: "bhakti-starter", icon: Heart, iconColor: "text-red-600" },
            { id: "show-more-starts", label: "Show More", value: "show-more-starts", icon: ArrowRight, iconColor: "text-gray-500", isShowMore: true },
        ],
        expandedItems: [
            { id: "tantra-intro", label: "Tantra introduction", value: "tantra-intro", icon: Flame, iconColor: "text-rose-600" },
            { id: "comparative-study", label: "Comparative study", value: "comparative-study", icon: Columns, iconColor: "text-indigo-600" },
            { id: "sanskrit-basics", label: "Sanskrit basics", value: "sanskrit-basics", icon: Languages, iconColor: "text-teal-600" },
        ],
    },
];
