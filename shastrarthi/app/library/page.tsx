"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";
import SavedTexts from "@/components/library/SavedTexts";
import BookmarksList from "@/components/library/BookmarksList";
import NotesList from "@/components/library/NotesList";
import { Loader2, BookOpen, Bookmark, FileText } from "lucide-react";

interface SavedText {
    id: string;
    slug: string;
    title_en: string;
    title_sa: string | null;
    category: string;
    verse_count: number;
}

interface Bookmark {
    id: string;
    verse_id: string;
    verse_ref: string;
    translation_en: string;
    text_id: string;
    text_title_en: string;
    text_title_sa: string | null;
    text_slug: string;
    created_at: string;
}

interface Note {
    id: string;
    verse_id: string;
    verse_ref: string;
    translation_en: string;
    text_id: string;
    text_title_en: string;
    text_title_sa: string | null;
    text_slug: string;
    content: string;
    created_at: string;
}

type TabType = "saved" | "bookmarks" | "notes";

export default function LibraryPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>("saved");
    const [savedTexts, setSavedTexts] = useState<SavedText[]>([]);
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login?redirect=/library");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchLibraryData();
        }
    }, [user]);

    const fetchLibraryData = async () => {
        if (!user) return;

        setLoading(true);
        setError("");

        try {
            const [savedTextsData, bookmarksData, notesData] = await Promise.all([
                fetchSavedTexts(user.id),
                fetchBookmarks(user.id),
                fetchNotes(user.id),
            ]);

            setSavedTexts(savedTextsData);
            setBookmarks(bookmarksData);
            setNotes(notesData);
        } catch (err: any) {
            console.error("Error fetching library data:", err);
            setError("Failed to load your library. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedTexts = async (userId: string): Promise<SavedText[]> => {
        const { data, error } = await supabase
            .from("user_texts")
            .select(`
                texts!inner(id, slug, title_en, title_sa, category, verse_count)
            `)
            .eq("user_id", userId);

        if (error) throw error;

        return data?.map((ut: any) => ({
            id: ut.texts.id,
            slug: ut.texts.slug,
            title_en: ut.texts.title_en,
            title_sa: ut.texts.title_sa,
            category: ut.texts.category,
            verse_count: ut.texts.verse_count,
        })) || [];
    };

    const fetchBookmarks = async (userId: string): Promise<Bookmark[]> => {
        const { data, error } = await supabase
            .from("bookmarks")
            .select(`
                id,
                verse_id,
                created_at,
                verses!inner(verse_ref, translation_en, id, text_id),
                texts!inner(title_en, title_sa, slug, id)
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data?.map((b: any) => ({
            id: b.id,
            verse_id: b.verse_id,
            verse_ref: b.verses.verse_ref,
            translation_en: b.verses.translation_en,
            text_id: b.verses.text_id,
            text_title_en: b.texts.title_en,
            text_title_sa: b.texts.title_sa,
            text_slug: b.texts.slug,
            created_at: b.created_at,
        })) || [];
    };

    const fetchNotes = async (userId: string): Promise<Note[]> => {
        const { data, error } = await supabase
            .from("notes")
            .select(`
                id,
                verse_id,
                content,
                created_at,
                verses!inner(verse_ref, translation_en, id, text_id),
                texts!inner(title_en, title_sa, slug, id)
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw error;

        return data?.map((n: any) => ({
            id: n.id,
            verse_id: n.verse_id,
            verse_ref: n.verses.verse_ref,
            translation_en: n.verses.translation_en,
            text_id: n.verses.text_id,
            text_title_en: n.texts.title_en,
            text_title_sa: n.texts.title_sa,
            text_slug: n.texts.slug,
            content: n.content,
            created_at: n.created_at,
        })) || [];
    };

    const handleRemoveSavedText = async (textId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from("user_texts")
                .delete()
                .eq("user_id", user.id)
                .eq("text_id", textId);

            if (error) throw error;

            setSavedTexts(prev => prev.filter(t => t.id !== textId));
        } catch (err) {
            console.error("Error removing saved text:", err);
            setError("Failed to remove text. Please try again.");
        }
    };

    const handleRemoveBookmark = async (bookmarkId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from("bookmarks")
                .delete()
                .eq("id", bookmarkId);

            if (error) throw error;

            setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
        } catch (err) {
            console.error("Error removing bookmark:", err);
            setError("Failed to remove bookmark. Please try again.");
        }
    };

    const handleRemoveNote = async (noteId: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from("notes")
                .delete()
                .eq("id", noteId);

            if (error) throw error;

            setNotes(prev => prev.filter(n => n.id !== noteId));
        } catch (err) {
            console.error("Error removing note:", err);
            setError("Failed to remove note. Please try again.");
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-saffron-600 dark:text-saffron-400 mx-auto mb-4" />
                    <p className="text-sand-600 dark:text-sand-400">Loading your library...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900">
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-100 mb-2">
                        My Library
                    </h1>
                    <p className="text-sand-600 dark:text-sand-400 max-w-2xl">
                        Your saved texts, bookmarks, and notes all in one place.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300">
                        {error}
                        <button
                            onClick={fetchLibraryData}
                            className="ml-4 underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div className="border-b border-sand-200 dark:border-sand-700 mb-6">
                    <div className="flex gap-6">
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === "saved"
                                    ? "border-saffron-600 dark:border-saffron-400 text-saffron-600 dark:text-saffron-400"
                                    : "border-transparent text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100"
                                }`}
                        >
                            <BookOpen className="inline h-4 w-4 mr-1" />
                            Saved Texts ({savedTexts.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("bookmarks")}
                            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === "bookmarks"
                                    ? "border-saffron-600 dark:border-saffron-400 text-saffron-600 dark:text-saffron-400"
                                    : "border-transparent text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100"
                                }`}
                        >
                            <Bookmark className="inline h-4 w-4 mr-1" />
                            Bookmarks ({bookmarks.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("notes")}
                            className={`pb-3 border-b-2 font-medium transition-colors ${activeTab === "notes"
                                    ? "border-saffron-600 dark:border-saffron-400 text-saffron-600 dark:text-saffron-400"
                                    : "border-transparent text-sand-600 dark:text-sand-400 hover:text-sand-900 dark:hover:text-sand-100"
                                }`}
                        >
                            <FileText className="inline h-4 w-4 mr-1" />
                            Notes ({notes.length})
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {activeTab === "saved" && (
                        <SavedTexts
                            texts={savedTexts}
                            onRemove={handleRemoveSavedText}
                        />
                    )}
                    {activeTab === "bookmarks" && (
                        <BookmarksList
                            bookmarks={bookmarks}
                            onRemove={handleRemoveBookmark}
                        />
                    )}
                    {activeTab === "notes" && (
                        <NotesList
                            notes={notes}
                            onRemove={handleRemoveNote}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
