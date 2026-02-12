import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for client-side operations
 * Uses the anon key which is safe for public use with RLS policies
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

/**
 * Types for our database tables
 */
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            texts: {
                Row: {
                    id: string;
                    slug: string;
                    title_en: string;
                    title_sa: string | null;
                    category: "Veda" | "Upanishad" | "Tantra" | "Yoga" | "Itihasa" | "Purana";
                    tradition: "Advaita" | "Vishishtadvaita" | "Dvaita" | "Shakta" | "Shaiva" | "Buddhist" | "Jain" | null;
                    difficulty: "beginner" | "intermediate" | "advanced" | "scholar";
                    description: string | null;
                    verse_count: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    slug: string;
                    title_en: string;
                    title_sa?: string | null;
                    category: "Veda" | "Upanishad" | "Tantra" | "Yoga" | "Itihasa" | "Purana";
                    tradition?: "Advaita" | "Vishishtadvaita" | "Dvaita" | "Shakta" | "Shaiva" | "Buddhist" | "Jain" | null;
                    difficulty: "beginner" | "intermediate" | "advanced" | "scholar";
                    description?: string | null;
                    verse_count?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    slug?: string;
                    title_en?: string;
                    title_sa?: string | null;
                    category?: "Veda" | "Upanishad" | "Tantra" | "Yoga" | "Itihasa" | "Purana";
                    tradition?: "Advaita" | "Vishishtadvaita" | "Dvaita" | "Shakta" | "Shaiva" | "Buddhist" | "Jain" | null;
                    difficulty?: "beginner" | "intermediate" | "advanced" | "scholar";
                    description?: string | null;
                    verse_count?: number;
                    created_at?: string;
                };
            };
            verses: {
                Row: {
                    id: string;
                    text_id: string;
                    ref: string;
                    order_index: number;
                    sanskrit: string | null;
                    transliteration: string | null;
                    translation_en: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    text_id: string;
                    ref: string;
                    order_index: number;
                    sanskrit?: string | null;
                    transliteration?: string | null;
                    translation_en: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    text_id?: string;
                    ref?: string;
                    order_index?: number;
                    sanskrit?: string | null;
                    transliteration?: string | null;
                    translation_en?: string;
                    created_at?: string;
                };
            };
            profiles: {
                Row: {
                    id: string;
                    email: string;
                    name: string | null;
                    preferences: Json;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id: string;
                    email: string;
                    name?: string | null;
                    preferences?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    email?: string;
                    name?: string | null;
                    preferences?: Json;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            user_texts: {
                Row: {
                    user_id: string;
                    text_id: string;
                    saved_at: string;
                };
                Insert: {
                    user_id: string;
                    text_id: string;
                    saved_at?: string;
                };
                Update: {
                    user_id?: string;
                    text_id?: string;
                    saved_at?: string;
                };
            };
            bookmarks: {
                Row: {
                    id: string;
                    user_id: string;
                    verse_id: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    verse_id: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    verse_id?: string;
                    created_at?: string;
                };
            };
            notes: {
                Row: {
                    id: string;
                    user_id: string;
                    verse_id: string;
                    content: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    verse_id: string;
                    content: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    verse_id?: string;
                    content?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            chat_threads: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    agent: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    agent?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    agent?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            chat_messages: {
                Row: {
                    id: string;
                    thread_id: string;
                    user_id: string;
                    role: "user" | "assistant";
                    content: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    thread_id: string;
                    user_id: string;
                    role: "user" | "assistant";
                    content: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    thread_id?: string;
                    user_id?: string;
                    role?: "user" | "assistant";
                    content?: string;
                    created_at?: string;
                };
            };
            notebooks: {
                Row: {
                    id: string;
                    user_id: string;
                    title: string;
                    content: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    title: string;
                    content?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    title?: string;
                    content?: string;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            reading_progress: {
                Row: {
                    user_id: string;
                    text_id: string;
                    last_verse_index: number;
                    completed_at: string | null;
                };
                Insert: {
                    user_id: string;
                    text_id: string;
                    last_verse_index?: number;
                    completed_at?: string | null;
                };
                Update: {
                    user_id?: string;
                    text_id?: string;
                    last_verse_index?: number;
                    completed_at?: string | null;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}

export type Tables = Database["public"]["Tables"];
export type Text = Tables["texts"]["Row"];
export type Verse = Tables["verses"]["Row"];
export type Profile = Tables["profiles"]["Row"];
export type Bookmark = Tables["bookmarks"]["Row"];
export type Note = Tables["notes"]["Row"];
export type UserText = Tables["user_texts"]["Row"];
export type ChatThread = Tables["chat_threads"]["Row"];
export type ChatMessage = Tables["chat_messages"]["Row"];
export type Notebook = Tables["notebooks"]["Row"];
export type ReadingProgress = Tables["reading_progress"]["Row"];
