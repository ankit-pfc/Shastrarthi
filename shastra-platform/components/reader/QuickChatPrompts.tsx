import { cn } from "@/lib/utils";
import { Lightbulb, BookOpen, MessageCircle, Sparkles } from "lucide-react";

interface QuickChatPromptsProps {
    onAction: (prompt: string) => void;
}

const QUICK_ACTIONS = [
    {
        id: 1,
        label: "Explain this verse",
        prompt: "Explain the meaning of this verse",
        icon: Lightbulb,
    },
    {
        id: 2,
        label: "What's the context?",
        prompt: "What is the context of this verse?",
        icon: MessageCircle,
    },
    {
        id: 3,
        label: "Relate to modern life",
        prompt: "How does this verse relate to modern life and everyday experiences?",
        icon: BookOpen,
    },
    {
        id: 4,
        label: "Key teachings",
        prompt: "Summarize the key teachings and insights from this verse",
        icon: Sparkles,
    },
];

export default function QuickChatPrompts({ onAction }: QuickChatPromptsProps) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium text-sand-700 dark:text-sand-300 mb-3">
                Quick questions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action) => (
                    <button
                        key={action.id}
                        onClick={() => onAction(action.prompt)}
                        className={cn(
                            "flex items-center gap-2 p-3 rounded-lg border border-sand-200 dark:border-sand-700",
                            "bg-white dark:bg-sand-800 hover:border-saffron-300 dark:hover:border-saffron-700",
                            "transition-all duration-200 text-left"
                        )}
                    >
                        <action.icon className="h-4 w-4 text-sand-600 dark:text-sand-400" />
                        <span className="text-sm text-sand-700 dark:text-sand-300">
                            {action.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
