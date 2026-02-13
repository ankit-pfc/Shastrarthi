"use client";

import { BookmarkPlus, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageBubbleProps {
    role: "user" | "assistant";
    content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);
    const isUser = role === "user";

    const handleCopy = async () => {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    const handleSaveToNotes = () => {
        // TODO: Implement save to notes functionality
        console.log("Save to notes:", content);
    };

    if (!content) return null;

    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[80%] md:max-w-lg bg-gray-900 text-white rounded-2xl rounded-br-md px-4 py-2.5 text-sm leading-relaxed">
                    <p className="whitespace-pre-wrap">{content}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-start">
            <div className="max-w-[90%] md:max-w-2xl">
                {/* Assistant text */}
                <div className="text-sm text-gray-800 leading-relaxed">
                    <div className="prose prose-sm prose-gray max-w-none">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>,
                                li: ({ children }) => <li className="text-gray-700">{children}</li>,
                                strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                                em: ({ children }) => <em className="italic">{children}</em>,
                                code: ({ children }) => (
                                    <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                                ),
                                pre: ({ children }) => (
                                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto text-xs font-mono mb-3">{children}</pre>
                                ),
                                blockquote: ({ children }) => (
                                    <blockquote className="border-l-3 border-orange-300 bg-orange-50/50 pl-4 pr-3 py-2 rounded-r-lg italic mb-3 text-gray-700">{children}</blockquote>
                                ),
                                h1: ({ children }) => <h1 className="text-lg font-bold text-gray-900 mb-2 mt-4 first:mt-0">{children}</h1>,
                                h2: ({ children }) => <h2 className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h2>,
                                h3: ({ children }) => <h3 className="text-sm font-semibold text-gray-900 mb-1.5 mt-3 first:mt-0">{children}</h3>,
                                a: ({ children, href }) => (
                                    <a href={href} className="text-orange-600 hover:text-orange-700 underline decoration-orange-300" target="_blank" rel="noopener noreferrer">{children}</a>
                                ),
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Action bar */}
                <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleCopy}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-md transition-colors"
                        title="Copy"
                    >
                        {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                        <span>{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <button
                        onClick={handleSaveToNotes}
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded-md transition-colors"
                        title="Save to Notes"
                    >
                        <BookmarkPlus className="h-3 w-3" />
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
