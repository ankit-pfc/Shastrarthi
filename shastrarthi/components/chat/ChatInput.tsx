"use client";

import { ArrowRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import GuruSelector from "./GuruSelector";

interface ChatInputProps {
    onSend: (text: string) => void;
    isLoading?: boolean;
    selectedPersona: string;
    onPersonaChange: (persona: string) => void;
}

export default function ChatInput({ onSend, isLoading, selectedPersona, onPersonaChange }: ChatInputProps) {
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    }, [value]);

    useEffect(() => { textareaRef.current?.focus(); }, []);

    const handleSend = () => {
        if (!value.trim() || isLoading) return;
        onSend(value.trim());
        setValue("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
    };

    const canSend = value.trim().length > 0 && !isLoading;

    return (
        <div className="bg-white rounded-xl border border-gray-300 shadow-sm transition-all duration-200">
            {/* Textarea Area */}
            <div className="px-3.5 pt-3 pb-1">
                <textarea
                    ref={textareaRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything about the Shastras..."
                    className="block w-full resize-none outline-none bg-transparent
                               text-sm text-gray-900 placeholder:text-gray-400
                               leading-relaxed"
                    rows={2}
                    disabled={isLoading}
                />
            </div>

            {/* Faint Separator Line (Requested "faint line") */}
            <div className="h-px w-full bg-gray-100 mt-2" />

            {/* Bottom Controls Row — Centered vertically in this section */}
            <div className="flex items-center justify-between px-3 py-2 bg-gray-50/30">
                <GuruSelector
                    selectedPersona={selectedPersona}
                    onPersonaChange={onPersonaChange}
                />

                <button
                    onClick={handleSend}
                    disabled={!canSend}
                    style={{ width: 28, height: 28 }}
                    className={`
                        shrink-0 rounded-full flex items-center justify-center transition-all duration-150
                        ${canSend
                            ? "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"}
                    `}
                    aria-label="Send message"
                >
                    <ArrowRight style={{ width: 14, height: 14 }} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
}
