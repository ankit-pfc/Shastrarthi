import Link from "next/link";
import { BookOpen, Tag, Sparkles, Scroll, Flower2, TreeDeciduous, MessageSquare, Flame, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface TextCardProps {
    id: string;
    slug: string;
    title: string;
    sanskritTitle?: string | null;
    category: string;
    difficulty: string;
    description?: string | null;
    verseCount: number;
}

export default function TextCard({
    id,
    slug,
    title,
    sanskritTitle,
    category,
    difficulty,
    description,
    verseCount,
}: TextCardProps) {
    const getDifficultyColor = () => {
        switch (difficulty) {
            case "beginner":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
            case "intermediate":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
            case "advanced":
                return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
            case "scholar":
                return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
            default:
                return "bg-sand-100 text-sand-700 dark:bg-sand-700 dark:text-sand-300";
        }
    };

    const getCategoryColor = () => {
        switch (category) {
            case "Veda":
                return "text-purple-600 dark:text-purple-400";
            case "Upanishad":
                return "text-blue-600 dark:text-blue-400";
            case "Tantra":
                return "text-red-600 dark:text-red-400";
            case "Yoga":
                return "text-green-600 dark:text-green-400";
            case "Itihasa":
                return "text-orange-600 dark:text-orange-400";
            case "Purana":
                return "text-pink-600 dark:text-pink-400";
            default:
                return "text-sand-600 dark:text-sand-400";
        }
    };

    const getCategoryIcon = () => {
        switch (category) {
            case "Veda":
                return Flame;
            case "Upanishad":
                return Sun;
            case "Tantra":
                return Sparkles;
            case "Yoga":
                return Flower2;
            case "Itihasa":
                return Scroll;
            case "Purana":
                return TreeDeciduous;
            default:
                return BookOpen;
        }
    };

    const getCategoryBgColor = () => {
        switch (category) {
            case "Veda":
                return "bg-purple-50 dark:bg-purple-900/20";
            case "Upanishad":
                return "bg-blue-50 dark:bg-blue-900/20";
            case "Tantra":
                return "bg-red-50 dark:bg-red-900/20";
            case "Yoga":
                return "bg-green-50 dark:bg-green-900/20";
            case "Itihasa":
                return "bg-orange-50 dark:bg-orange-900/20";
            case "Purana":
                return "bg-pink-50 dark:bg-pink-900/20";
            default:
                return "bg-sand-50 dark:bg-sand-700/20";
        }
    };

    const CategoryIcon = getCategoryIcon();

    return (
        <Link
            href={`/reader/${slug}`}
            className={cn(
                "group block bg-white dark:bg-sand-800 rounded-xl shadow-sm border border-sand-200 dark:border-sand-700",
                "hover:shadow-lg hover:border-saffron-400 dark:hover:border-saffron-500 hover:-translate-y-1",
                "transition-all duration-300 ease-out"
            )}
        >
            <div className="p-5">
                {/* Category Icon Header */}
                <div className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-xl mb-4",
                    getCategoryBgColor()
                )}>
                    <CategoryIcon className={cn("h-6 w-6", getCategoryColor())} />
                </div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <span
                            className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                                getCategoryBgColor(),
                                getCategoryColor()
                            )}
                        >
                            <Tag className="h-3 w-3" />
                            {category}
                        </span>
                        <h3 className="text-lg font-semibold text-sand-900 dark:text-sand-100 line-clamp-1 group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors mt-2">
                            {title}
                        </h3>
                        {sanskritTitle && (
                            <p className="text-sm font-serif text-saffron-600 dark:text-saffron-400 line-clamp-1">
                                {sanskritTitle}
                            </p>
                        )}
                    </div>
                    <div
                        className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium",
                            getDifficultyColor()
                        )}
                    >
                        {difficulty}
                    </div>
                </div>

                {/* Description */}
                {description && (
                    <p className="text-sm text-sand-600 dark:text-sand-400 line-clamp-2 mb-4 leading-relaxed">
                        {description}
                    </p>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-sand-500 dark:text-sand-500 pt-3 border-t border-sand-100 dark:border-sand-700">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        <span>{verseCount} verses</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-saffron-600 dark:text-saffron-400 font-medium group-hover:gap-2 transition-all">
                        <span>Read</span>
                        <MessageSquare className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
