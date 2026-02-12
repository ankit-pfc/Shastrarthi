"use client";
import { useEffect, useState } from "react";
import { Bookmark, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import NoteModal from "./NoteModal";
export default function VerseDisplay({ verseRef, sanskrit, transliteration, translation, verseId, isInitiallyBookmarked = false, onBookmarkChange, existingNote = null, onNoteSaved, openNoteSignal = 0, toggleBookmarkSignal = 0, }) {
    var _a;
    const [showSanskrit, setShowSanskrit] = useState(true);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [isBookmarked, setIsBookmarked] = useState(isInitiallyBookmarked);
    const [isExpanded, setIsExpanded] = useState(false);
    const [note, setNote] = useState(existingNote);
    const toggleBookmark = async () => {
        try {
            if (isBookmarked) {
                const response = await fetch("/api/bookmarks", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ verseId }),
                });
                if (!response.ok) {
                    throw new Error("Failed removing bookmark");
                }
                setIsBookmarked(false);
                onBookmarkChange === null || onBookmarkChange === void 0 ? void 0 : onBookmarkChange(verseId, false);
                return;
            }
            const response = await fetch("/api/bookmarks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ verseId }),
            });
            if (!response.ok) {
                throw new Error("Failed creating bookmark");
            }
            setIsBookmarked(true);
            onBookmarkChange === null || onBookmarkChange === void 0 ? void 0 : onBookmarkChange(verseId, true);
        }
        catch (error) {
            console.error("toggleBookmark failed:", error);
        }
    };
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    useEffect(() => {
        setIsBookmarked(isInitiallyBookmarked);
    }, [isInitiallyBookmarked, verseId]);
    useEffect(() => {
        setNote(existingNote);
    }, [existingNote, verseId]);
    useEffect(() => {
        if (openNoteSignal > 0) {
            setIsNoteModalOpen(true);
        }
    }, [openNoteSignal]);
    useEffect(() => {
        if (toggleBookmarkSignal > 0) {
            void toggleBookmark();
        }
    }, [toggleBookmarkSignal]);
    const toggleNote = () => {
        setIsNoteModalOpen(true);
    };
    const handleSaveNote = async (content) => {
        var _a, _b;
        try {
            const response = await fetch("/api/notes", {
                method: note ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Object.assign(Object.assign({}, (note ? { noteId: note.id } : { verseId })), { content })),
            });
            if (!response.ok) {
                throw new Error("Failed saving note");
            }
            const payload = await response.json();
            const savedNoteId = (_b = (_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.id) !== null && _b !== void 0 ? _b : note === null || note === void 0 ? void 0 : note.id;
            if (savedNoteId) {
                const updatedNote = { id: savedNoteId, content: content.trim() };
                setNote(updatedNote);
                onNoteSaved === null || onNoteSaved === void 0 ? void 0 : onNoteSaved(verseId, updatedNote);
            }
        }
        catch (error) {
            console.error("Saving note failed:", error);
        }
    };
    return (<article className={cn("bg-white dark:bg-sand-800 rounded-lg shadow-sm border border-sand-200 dark:border-sand-700 overflow-hidden", "transition-all duration-200 hover:shadow-md")}>
            {/* Verse Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-sand-50 dark:bg-sand-900 border-b border-sand-200 dark:border-sand-700">
                <span className="text-sm font-semibold text-saffron-600 dark:text-saffron-400">
                    {verseRef}
                </span>
                <div className="flex items-center gap-2">
                    <button onClick={toggleBookmark} className={cn("p-2 rounded-md transition-colors", isBookmarked
            ? "text-saffron-600 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-900/20"
            : "text-sand-500 hover:text-saffron-600 dark:text-sand-400 dark:hover:text-saffron-400 hover:bg-sand-100 dark:hover:bg-sand-700")} aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}>
                        <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")}/>
                    </button>
                    <button onClick={toggleNote} className={cn("p-2 rounded-md transition-colors", note
            ? "text-saffron-600 dark:text-saffron-400 bg-saffron-50 dark:bg-saffron-900/20"
            : "text-sand-500 hover:text-saffron-600 dark:text-sand-400 dark:hover:text-saffron-400 hover:bg-sand-100 dark:hover:bg-sand-700")} aria-label={note ? "Edit note" : "Add note"}>
                        <FileText className={cn("h-4 w-4", note && "fill-current")}/>
                    </button>

                    {/* Note Modal */}
                    <NoteModal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} verseId={verseId} verseRef={verseRef} initialContent={(_a = note === null || note === void 0 ? void 0 : note.content) !== null && _a !== void 0 ? _a : ""} onSave={handleSaveNote}/>
                </div>
            </div>

            {/* Verse Content */}
            <div className="px-6 py-5">
                {/* Sanskrit Text */}
                {sanskrit && showSanskrit && (<div className="mb-4">
                        <p className="font-sanskrit text-lg md:text-xl leading-loose text-sand-900 dark:text-sand-100 text-center">
                            {sanskrit}
                        </p>
                    </div>)}

                {/* Transliteration */}
                {transliteration && showTransliteration && (<div className="mb-4">
                        <p className="italic text-sand-700 dark:text-sand-300 text-center leading-relaxed">
                            {transliteration}
                        </p>
                    </div>)}

                {/* Translation */}
                <div className="mb-4">
                    <p className="text-sand-900 dark:text-sand-100 leading-relaxed text-reading-base">
                        {translation}
                    </p>
                </div>

                {/* Toggle Controls */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-sand-200 dark:border-sand-700">
                    {sanskrit && (<button onClick={() => setShowSanskrit(!showSanskrit)} className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", showSanskrit
                ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300"
                : "text-sand-600 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700")}>
                            Sanskrit
                        </button>)}
                    {transliteration && (<button onClick={() => setShowTransliteration(!showTransliteration)} className={cn("px-3 py-1.5 text-sm rounded-md transition-colors", showTransliteration
                ? "bg-saffron-100 text-saffron-700 dark:bg-saffron-900/30 dark:text-saffron-300"
                : "text-sand-600 hover:bg-sand-100 dark:text-sand-400 dark:hover:bg-sand-700")}>
                            Transliteration
                        </button>)}
                </div>
            </div>
        </article>);
}
