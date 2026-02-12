import Link from "next/link";
import { BookOpen, Tag, Sparkles, Scroll, Flower2, TreeDeciduous, MessageSquare, Flame, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
export default function TextCard({ id, slug, title, sanskritTitle, category, difficulty, description, verseCount, }) {
    const getDifficultyColor = () => {
        switch (difficulty) {
            case "beginner":
                return "bg-green-100 text-green-700";
            case "intermediate":
                return "bg-yellow-100 text-yellow-700";
            case "advanced":
                return "bg-orange-100 text-orange-700";
            case "scholar":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };
    const getCategoryColor = () => {
        switch (category) {
            case "Veda":
                return "text-purple-600";
            case "Upanishad":
                return "text-blue-600";
            case "Tantra":
                return "text-red-600";
            case "Yoga":
                return "text-green-600";
            case "Itihasa":
                return "text-orange-600";
            case "Purana":
                return "text-pink-600";
            default:
                return "text-gray-600";
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
                return "bg-purple-50";
            case "Upanishad":
                return "bg-blue-50";
            case "Tantra":
                return "bg-red-50";
            case "Yoga":
                return "bg-green-50";
            case "Itihasa":
                return "bg-orange-50";
            case "Purana":
                return "bg-pink-50";
            default:
                return "bg-gray-50";
        }
    };
    const CategoryIcon = getCategoryIcon();
    return (<Link href={`/app/reader/${slug}`} className={cn("group block bg-white rounded-xl shadow-sm border border-gray-200", "hover:shadow-lg hover:border-orange-400 hover:-translate-y-1", "transition-all duration-300 ease-out")}>
            <div className="p-5">
                {/* Category Icon Header */}
                <div className={cn("flex items-center justify-center w-12 h-12 rounded-xl mb-4", getCategoryBgColor())}>
                    <CategoryIcon className={cn("h-6 w-6", getCategoryColor())}/>
                </div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                        <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", getCategoryBgColor(), getCategoryColor())}>
                            <Tag className="h-3 w-3"/>
                            {category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors mt-2">
                            {title}
                        </h3>
                        {sanskritTitle && (<p className="text-sm font-serif text-orange-600 line-clamp-1">
                                {sanskritTitle}
                            </p>)}
                    </div>
                    <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getDifficultyColor())}>
                        {difficulty}
                    </div>
                </div>

                {/* Description */}
                {description && (<p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                        {description}
                    </p>)}

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4"/>
                        <span>{verseCount} verses</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-orange-600 font-medium group-hover:gap-2 transition-all">
                        <span>Read</span>
                        <MessageSquare className="h-4 w-4"/>
                    </div>
                </div>
            </div>
        </Link>);
}
