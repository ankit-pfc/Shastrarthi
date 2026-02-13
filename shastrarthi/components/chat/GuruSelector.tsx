"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { GURU_PERSONAS } from "@/lib/config/prompts";

interface GuruSelectorProps {
    selectedPersona: string;
    onPersonaChange: (persona: string) => void;
}

export default function GuruSelector({ selectedPersona, onPersonaChange }: GuruSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedPersonaData = GURU_PERSONAS[selectedPersona] || GURU_PERSONAS.default;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200
                    hover:border-gray-300 bg-white transition-colors text-sm
                    ${isOpen ? "border-gray-900" : ""}
                `}
                aria-label="Select guru persona"
            >
                <span className="text-lg">
                    {selectedPersonaData.icon}
                </span>
                <span className="text-sm font-medium text-gray-700">
                    {selectedPersonaData.name}
                </span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="py-1">
                        {Object.values(GURU_PERSONAS).map((persona) => (
                            <button
                                key={persona.key}
                                onClick={() => {
                                    onPersonaChange(persona.key);
                                    setIsOpen(false);
                                }}
                                className={`
                                    w-full flex items-center gap-2 px-3 py-2 text-left
                                    rounded-md transition-colors text-sm
                                    ${selectedPersona === persona.key
                                        ? "bg-gray-100 text-gray-900"
                                        : "hover:bg-gray-50 text-gray-700"}
                                `}
                            >
                                <span className="text-base">
                                    {persona.icon}
                                </span>
                                <span className="font-medium">{persona.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
