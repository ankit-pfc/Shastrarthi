"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { GURU_PERSONAS } from "@/lib/config/prompts";

interface GuruSelectorProps {
    selectedPersona: string;
    onPersonaChange: (persona: string) => void;
}

export default function GuruSelector({ selectedPersona, onPersonaChange }: GuruSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedPersonaData = GURU_PERSONAS[selectedPersona as keyof typeof GURU_PERSONAS] || GURU_PERSONAS.default;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleEscape);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                    transition-all duration-150 border
                    ${isOpen
                        ? "bg-orange-100 border-orange-200 text-orange-700"
                        : "bg-orange-50 border-orange-100 text-orange-700 hover:bg-orange-100 hover:border-orange-200"}
                `}
                aria-label="Select guru persona"
                aria-expanded={isOpen}
            >
                <span className="text-sm leading-none">{selectedPersonaData.icon}</span>
                <span>{selectedPersonaData.name}</span>
                <ChevronDown className={`h-3 w-3 opacity-60 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 origin-bottom-left">
                    {Object.values(GURU_PERSONAS).map((persona) => (
                        <button
                            key={persona.key}
                            onClick={() => {
                                onPersonaChange(persona.key);
                                setIsOpen(false);
                            }}
                            className={`
                                w-full flex items-center gap-2.5 px-3 py-2.5 text-left
                                rounded-lg transition-colors text-sm
                                ${selectedPersona === persona.key
                                    ? "bg-orange-50 font-medium text-orange-800"
                                    : "text-gray-700 hover:bg-gray-50"}
                            `}
                        >
                            <span className="text-base leading-none">{persona.icon}</span>
                            <span>{persona.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
