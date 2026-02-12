"use client";

import { useEffect, useMemo, useState } from "react";
import SavedTexts from "@/components/library/SavedTexts";
import BookmarksList from "@/components/library/BookmarksList";
import NotesList from "@/components/library/NotesList";

type LibraryData = {
    savedTexts: any[];
    bookmarks: any[];
    notes: any[];
};

export default function AppLibraryPage() {
    const [activeTab, setActiveTab] = useState<"saved" | "bookmarks" | "notes">("saved");
    const [isLoading, setIsLoading] = useState(true);
    const [libraryData, setLibraryData] = useState<LibraryData>({
        savedTexts: [],
        bookmarks: [],
        notes: [],
    });

    const loadLibrary = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/library");
            if (!response.ok) {
                throw new Error("Could not load library");
            }
            const payload = (await response.json()) as { data: LibraryData };
            setLibraryData(payload.data);
        } catch (error) {
            console.error("Library fetch failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        void loadLibrary();
    }, []);

    const stats = useMemo(
        () => ({
            savedTexts: libraryData.savedTexts.length,
            bookmarks: libraryData.bookmarks.length,
            notes: libraryData.notes.length,
        }),
        [libraryData]
    );

    const removeSavedText = async (textId: string) => {
        await fetch("/api/library", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ textId }),
        });
        await loadLibrary();
    };

    const removeBookmark = async (bookmarkId: string) => {
        await fetch("/api/bookmarks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bookmarkId }),
        });
        await loadLibrary();
    };

    const removeNote = async (noteId: string) => {
        await fetch("/api/notes", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ noteId }),
        });
        await loadLibrary();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">My Library</h1>
                <p className="text-gray-600">Collections, saved texts, bookmarks, and recent study activity.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <div className="mb-4 flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`px-3 py-1.5 rounded-md text-sm ${activeTab === "saved" ? "bg-orange-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        >
                            Saved Texts
                        </button>
                        <button
                            onClick={() => setActiveTab("bookmarks")}
                            className={`px-3 py-1.5 rounded-md text-sm ${activeTab === "bookmarks" ? "bg-orange-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        >
                            Bookmarks
                        </button>
                        <button
                            onClick={() => setActiveTab("notes")}
                            className={`px-3 py-1.5 rounded-md text-sm ${activeTab === "notes" ? "bg-orange-600 text-white" : "border border-gray-200 text-gray-700 hover:bg-gray-50"}`}
                        >
                            Notes
                        </button>
                    </div>

                    {isLoading ? (
                        <p className="text-sm text-gray-500">Loading library...</p>
                    ) : (
                        <>
                            {activeTab === "saved" && (
                                <SavedTexts texts={libraryData.savedTexts} onRemove={removeSavedText} />
                            )}
                            {activeTab === "bookmarks" && (
                                <BookmarksList
                                    bookmarks={libraryData.bookmarks}
                                    onRemove={removeBookmark}
                                />
                            )}
                            {activeTab === "notes" && (
                                <NotesList notes={libraryData.notes} onRemove={removeNote} />
                            )}
                        </>
                    )}
                </section>

                <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-gray-900 mb-3">Quick Stats</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>Saved Texts: {stats.savedTexts}</p>
                        <p>Bookmarks: {stats.bookmarks}</p>
                        <p>Notes: {stats.notes}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
