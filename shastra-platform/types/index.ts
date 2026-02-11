/**
 * Shared types for the application
 */

export interface UserPreferences {
    theme: "light" | "dark";
    fontSize: "small" | "medium" | "large";
    showSanskrit: boolean;
    showTransliteration: boolean;
}

export interface ChatMessage {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

export interface VerseContext {
    textId: string;
    verseId: string;
    verseRef: string;
    sanskrit: string | null;
    transliteration: string | null;
    translation: string;
}

export interface QuickAction {
    id: string;
    label: string;
    prompt: string;
    icon: string;
}

export interface FilterOptions {
    category?: string;
    difficulty?: string;
    tradition?: string;
    search?: string;
}

export interface TextCardProps {
    id: string;
    slug: string;
    title: string;
    sanskritTitle?: string | null;
    category: string;
    difficulty: string;
    description?: string | null;
    verseCount: number;
}

export interface ReaderState {
    showSanskrit: boolean;
    showTransliteration: boolean;
    fontSize: "small" | "medium" | "large";
    theme: "light" | "dark";
}
