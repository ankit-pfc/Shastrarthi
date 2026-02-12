"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import ReaderControls from "./ReaderControls";
import ProgressBar from "./ProgressBar";
import VerseDisplay from "./VerseDisplay";
export default function TextViewerPanel({ textId, title, category, sanskritTitle, verses, onVerseChange, }) {
    var _a;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [fontSize, setFontSize] = useState("medium");
    const [isDark, setIsDark] = useState(false);
    const [bookmarkedVerseIds, setBookmarkedVerseIds] = useState(new Set());
    const [notesByVerseId, setNotesByVerseId] = useState({});
    const [openNoteSignal, setOpenNoteSignal] = useState(0);
    const [toggleBookmarkSignal, setToggleBookmarkSignal] = useState(0);
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
    const nextVerse = useCallback(() => setCurrentIndex((prev) => Math.min(prev + 1, verses.length - 1)), [verses.length]);
    const prevVerse = useCallback(() => setCurrentIndex((prev) => Math.max(prev - 1, 0)), []);
    const verseIdSet = useMemo(() => new Set(verses.map((verse) => verse.id)), [verses]);
    useEffect(() => {
        if (!currentVerse)
            return;
        onVerseChange === null || onVerseChange === void 0 ? void 0 : onVerseChange(currentVerse);
    }, [currentVerse, onVerseChange]);
    useEffect(() => {
        const loadSavedProgress = async () => {
            var _a, _b;
            try {
                const response = await fetch(`/api/reading-progress?textId=${encodeURIComponent(textId)}`);
                if (!response.ok)
                    return;
                const payload = (await response.json());
                const rawIndex = Number((_b = (_a = payload.data) === null || _a === void 0 ? void 0 : _a.lastVerseIndex) !== null && _b !== void 0 ? _b : 0);
                if (Number.isNaN(rawIndex))
                    return;
                const clampedIndex = Math.min(Math.max(rawIndex, 0), Math.max(verses.length - 1, 0));
                setCurrentIndex(clampedIndex);
            }
            catch (error) {
                console.error("Failed to restore reading progress:", error);
            }
        };
        if (textId && verses.length > 0) {
            void loadSavedProgress();
        }
    }, [textId, verses.length]);
    useEffect(() => {
        if (!textId || verses.length === 0)
            return;
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
            }
            catch (error) {
                console.error("Failed to update reading progress:", error);
            }
        };
        void updateProgress();
    }, [currentIndex, textId, verses.length]);
    useEffect(() => {
        const loadBookmarks = async () => {
            var _a;
            try {
                const response = await fetch("/api/bookmarks");
                if (!response.ok)
                    return;
                const payload = (await response.json());
                const ids = new Set(((_a = payload.data) !== null && _a !== void 0 ? _a : [])
                    .map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.verse) === null || _a === void 0 ? void 0 : _a.id; })
                    .filter((id) => Boolean(id)));
                setBookmarkedVerseIds(ids);
            }
            catch (error) {
                console.error("Failed loading bookmarks:", error);
            }
        };
        void loadBookmarks();
    }, [textId]);
    useEffect(() => {
        const loadNotesForText = async () => {
            var _a, _b;
            try {
                const response = await fetch("/api/notes");
                if (!response.ok)
                    return;
                const payload = (await response.json());
                const byVerseId = {};
                for (const item of (_a = payload.data) !== null && _a !== void 0 ? _a : []) {
                    const verseId = (_b = item.verse) === null || _b === void 0 ? void 0 : _b.id;
                    if (!verseId || !verseIdSet.has(verseId) || !item.id || typeof item.content !== "string")
                        continue;
                    byVerseId[verseId] = { id: item.id, content: item.content };
                }
                setNotesByVerseId(byVerseId);
            }
            catch (error) {
                console.error("Failed loading notes:", error);
            }
        };
        if (verseIdSet.size > 0) {
            void loadNotesForText();
        }
    }, [textId, verseIdSet]);
    useEffect(() => {
        const isEditableTarget = (target) => {
            const element = target;
            if (!element)
                return false;
            return (element.tagName === "INPUT" ||
                element.tagName === "TEXTAREA" ||
                element.tagName === "SELECT" ||
                element.isContentEditable);
        };
        const onKeyDown = (event) => {
            if (isEditableTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) {
                return;
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                nextVerse();
                return;
            }
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                prevVerse();
                return;
            }
            if (event.key.toLowerCase() === "b") {
                event.preventDefault();
                setToggleBookmarkSignal((prev) => prev + 1);
                return;
            }
            if (event.key.toLowerCase() === "n") {
                event.preventDefault();
                setOpenNoteSignal((prev) => prev + 1);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [nextVerse, prevVerse]);
    const fontClass = useMemo(() => {
        if (fontSize === "small")
            return "text-sm";
        if (fontSize === "large")
            return "text-lg";
        return "text-base";
    }, [fontSize]);
    return (<section className="h-full bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
            <ReaderControls title={title} sanskritTitle={sanskritTitle} category={category} isDark={isDark} fontSize={fontSize} onThemeToggle={() => setIsDark((prev) => !prev)} onFontSizeChange={setFontSize}/>
            <ProgressBar current={currentIndex + 1} total={Math.max(verses.length, 1)}/>

            <div className="px-4 py-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2">
                    <button onClick={prevVerse} disabled={currentIndex <= 0} className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                        Previous
                    </button>
                    <button onClick={nextVerse} disabled={currentIndex >= verses.length - 1} className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
                        Next
                    </button>
                </div>
                <div className="text-sm text-gray-500">
                    Verse {Math.min(currentIndex + 1, verses.length)} of {verses.length}
                </div>
                <label className="inline-flex items-center gap-2 text-sm text-gray-500">
                    Jump to
                    <select value={currentIndex} onChange={(event) => setCurrentIndex(Number(event.target.value))} className="rounded-md border border-gray-200 px-2 py-1 text-sm text-gray-700">
                        {verses.map((verse, index) => (<option key={verse.id} value={index}>
                                {verse.ref}
                            </option>))}
                    </select>
                </label>
            </div>

            <div className={`flex-1 overflow-y-auto p-6 ${fontClass}`}>
                <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-1">{title}</h2>
                {sanskritTitle && <p className="text-orange-600 mb-4">{sanskritTitle}</p>}
                <p className="text-sm text-gray-500 mb-3">Select a statement in the text to use in Chat.</p>
                {currentVerse ? (<VerseDisplay verseRef={currentVerse.ref} sanskrit={currentVerse.sanskrit} transliteration={currentVerse.transliteration} translation={currentVerse.translation_en} verseId={currentVerse.id} isInitiallyBookmarked={bookmarkedVerseIds.has(currentVerse.id)} existingNote={(_a = notesByVerseId[currentVerse.id]) !== null && _a !== void 0 ? _a : null} openNoteSignal={openNoteSignal} toggleBookmarkSignal={toggleBookmarkSignal} onBookmarkChange={(verseId, isBookmarked) => {
                setBookmarkedVerseIds((prev) => {
                    const next = new Set(prev);
                    if (isBookmarked)
                        next.add(verseId);
                    else
                        next.delete(verseId);
                    return next;
                });
            }} onNoteSaved={(verseId, note) => {
                setNotesByVerseId((prev) => (Object.assign(Object.assign({}, prev), { [verseId]: note })));
            }}/>) : (<p className="text-sm text-gray-500">No verses found for this text.</p>)}
            </div>
        </section>);
}
