import type { LucideIcon } from "lucide-react";
import { Bot, Columns, FileSearch, GraduationCap, Languages, Sparkles } from "lucide-react";

export interface PopularTask {
    title: string;
    description: string;
    icon: LucideIcon;
}

export const POPULAR_TASKS: PopularTask[] = [
    {
        title: "Deep Text Research",
        description: "Research a topic across multiple Shastras with structured AI synthesis.",
        icon: FileSearch,
    },
    {
        title: "Verse Commentary",
        description: "Get multi-lineage commentary for any verse with context and citations.",
        icon: Sparkles,
    },
    {
        title: "Concept Comparison",
        description: "Compare how traditions define and interpret one concept.",
        icon: Columns,
    },
    {
        title: "Study Path Creation",
        description: "Generate a staged learning sequence based on your level and goals.",
        icon: GraduationCap,
    },
    {
        title: "Sanskrit Etymology",
        description: "Dive into root words, derivations, and textual usage across texts.",
        icon: Languages,
    },
    {
        title: "Tradition Overview",
        description: "Get a compact academic-practical overview of a selected Sampradaya.",
        icon: Bot,
    },
];
