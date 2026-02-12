import {
    BookOpen,
    Quote,
    Columns,
    Flower2,
    TreeDeciduous,
    Building2,
    Scroll,
    MessageSquare,
    Sparkles,
    Bookmark,
} from "lucide-react";

// Domain-specific icon set
export const DOMAIN_ICONS = {
    // Texts/Library
    texts: BookOpen,
    library: BookOpen,
    manuscript: Scroll,

    // Verse/Citation
    verse: Quote,
    citation: Quote,

    // Compare
    compare: Columns,
    translations: Columns,

    // Practice
    practice: Flower2,
    meditation: Flower2,
    pranayama: Flower2,

    // Sampradaya/Lineage
    sampradaya: TreeDeciduous,
    lineage: TreeDeciduous,

    // Deity
    deity: Building2,

    // Generic
    ai: Sparkles,
    chat: MessageSquare,
    save: Bookmark,
} as const;

// Re-export icons for convenience
export {
    BookOpen,
    Quote,
    Columns,
    Flower2,
    TreeDeciduous,
    Building2,
    Scroll,
    MessageSquare,
    Sparkles,
    Bookmark,
};
