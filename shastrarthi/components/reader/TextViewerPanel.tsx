"use client";

import { useEffect, useMemo, useState } from "react";
import ReaderControls from "./ReaderControls";
import ProgressBar from "./ProgressBar";
import VerseDisplay from "./VerseDisplay";

interface ReaderVerse {
    id: string;
    ref: string;
    sanskrit: string | null;
    transliteration: string | null;
    translation_en: string;
    order_index: number;
}

interface TextViewerPanelProps {
    textId: string;
    title: string;
    category: string;
    sanskritTitle?: string | null;
    verses: ReaderVerse[];
    onVerseChange?: (verse: ReaderVerse) => void;
}

export default function TextViewerPanel({
    textId,
    title,
    category,
    sanskritTitle,
    verses,
    onVerseChange,
}: TextViewerPanelProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");
    const [isDark, setIsDark] = useState(false);
    const [bookmarkedVerseIds, setBookmarkedVerseIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const storedTheme = localStorage.getItem("reader-theme");
        const storedFontSize = localStorage.getItem("reader-font-size");
        if (storedTheme) {
            setIsDark(storedTheme === "dark");
        }
        if (storedFontSize === "small" || storedFontSize === "medium" || storedFontSize === "large") {
            setFontSize(storedFontSize);
        }
    }, []);

    const currentVerse = verses[currentIndex];
    const nextVerse = () => setCurrentIndex((prev) => Math.min(prev + 1, verses.length - 1));
    const prevVerse = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

    useEffect(() => {
        if (!currentVerse) return;
        onVerseChange?.(currentVerse);
    }, [currentVerse, onVerseChange]);

    useEffect(() => {
        if (!textId || verses.length === 0) return;

        const updateProgress = async () => {
            try {
                await fetch("/api/reading-progress", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        textId,
                        lastVerseIndex: currentIndex + 1,
                        completed: currentIndex + 1 >= verses.length,
                    }),
                });
            } catch (error) {
                console.error("Failed to update reading progress:", error);
            }
        };

        void updateProgress();
    }, [currentIndex, textId, verses.length]);

    useEffect(() => {
        const loadBookmarks = async () => {
            try {
                const response = await fetch("/api/bookmarks");
                if (!response.ok) return;
                const payload = (await response.json()) as { data?: Array<{ verse?: { id?: string } }> };
                const ids = new Set(
                    (payload.data ?? [])
                        .map((item) => item?.verse?.id)
                        .filter((id): id is string => Boolean(id))
                );
                setBookmarkedVerseIds(ids);
            } catch (error) {
                console.error("Failed loading bookmarks:", error);
            }
        };

        void loadBookmarks();
    }, [textId]);

    const fontClass = useMemo(() => {
        if (fontSize === "small") return "text-sm";
        if (fontSize === "large") return "text-lg";
        return "text-base";
    }, [fontSize]);

    return (
        <section className="h-full bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <ReaderControls
                title={title}
                sanskritTitle={sanskritTitle}
                category={category}
                isDark={isDark}
                fontSize={fontSize}
                onThemeToggle={() => setIsDark((prev) => !prev)}
                onFontSizeChange={setFontSize}
            />
            <ProgressBar current={currentIndex + 1} total={Math.max(verses.length, 1)} />

            <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2">
                    <button
                        onClick={prevVerse}
                        disabled={currentIndex <= 0}
                        className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={nextVerse}
                        disabled={currentIndex >= verses.length - 1}
                        className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
                <div className="text-sm text-gray-500">
                    Verse {Math.min(currentIndex + 1, verses.length)} of {verses.length}
                </div>
            </div>

            <div className={`flex-1 overflow-y-auto p-6 ${fontClass}`}>
                <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-1">{title}</h2>
                {sanskritTitle && <p className="text-orange-600 mb-4">{sanskritTitle}</p>}
                <p className="text-sm text-gray-500 mb-3">Select a statement in the text to use in Chat.</p>
                {currentVerse ? (
                    <VerseDisplay
                        verseRef={currentVerse.ref}
                        sanskrit={currentVerse.sanskrit}
                        transliteration={currentVerse.transliteration}
                        translation={currentVerse.translation_en}
                        verseId={currentVerse.id}
                        isInitiallyBookmarked={bookmarkedVerseIds.has(currentVerse.id)}
                        onBookmarkChange={(verseId, isBookmarked) => {
                            setBookmarkedVerseIds((prev) => {
                                const next = new Set(prev);
                                if (isBookmarked) next.add(verseId);
                                else next.delete(verseId);
                                return next;
                            });
                        }}
                    />
                ) : (
                    <p className="text-sm text-gray-500">No verses found for this text.</p>
                )}
            </div>
        </section>
    );
}
