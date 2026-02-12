import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatMessageProps {
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export default function ChatMessage({ role, content, timestamp }: ChatMessageProps) {
    const isUser = role === "user";

    return (
        <div
            className={cn(
                "flex gap-3 max-w-[85%]",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            {/* Avatar */}
            <div
                className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    isUser
                        ? "bg-saffron-600 text-white"
                        : "bg-sand-200 dark:bg-sand-700 text-sand-700 dark:text-sand-300"
                )}
            >
                {isUser ? (
                    <User className="h-5 w-5" />
                ) : (
                    <Bot className="h-5 w-5 text-sand-600 dark:text-sand-400" />
                )}
            </div>

            {/* Message Content */}
            <div
                className={cn(
                    "flex-1 rounded-2xl px-4 py-3",
                    isUser
                        ? "bg-saffron-100 dark:bg-saffron-900/30 text-sand-900 dark:text-sand-100"
                        : "bg-sand-100 dark:bg-sand-800 text-sand-900 dark:text-sand-100"
                )}
            >
                <p className="leading-relaxed whitespace-pre-wrap break-words">
                    {content}
                </p>
                <p className="text-xs text-sand-500 dark:text-sand-500 mt-1">
                    {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
            </div>
        </div>
    );
}
