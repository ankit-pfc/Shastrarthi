"use client";

import { BookmarkPlus } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
    role: "user" | "assistant";
    content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
    const isUser = role === "user";

    const handleSaveToNotes = () => {
        // TODO: Implement save to notes functionality
        console.log("Save to notes:", content);
    };

    const bubbleClass = isUser
        ? "bg-gray-100 text-gray-900"
        : "bg-white border border-gray-200 text-gray-700";

    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-2xl rounded-xl px-4 py-3 text-sm leading-relaxed ${bubbleClass}`}>
                {isUser ? (
                    <p className="mb-0 whitespace-pre-wrap">{content}</p>
                ) : (
                    <>
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                                    li: ({ children }) => <li>{children}</li>,
                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                    em: ({ children }) => <em className="italic">{children}</em>,
                                    code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                                    pre: ({ children }) => <pre className="bg-gray-50 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2">{children}</pre>,
                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-3 italic mb-2">{children}</blockquote>,
                                    h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-base font-semibold mb-2">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-sm font-semibold mb-2">{children}</h3>,
                                    a: ({ children, href }) => <a href={href} className="text-blue-600 hover:text-blue-700 underline">{children}</a>,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                            <button
                                onClick={handleSaveToNotes}
                                className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors"
                                title="Save to Notes"
                            >
                                <BookmarkPlus className="h-3 w-3" />
                                <span>Save to Notes</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
