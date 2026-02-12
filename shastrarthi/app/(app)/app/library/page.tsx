import Link from "next/link";

const SAVED_TEXTS = [
    "Bhagavad Gita - Chapter 2",
    "Yoga Sutras",
    "Mandukya Upanishad",
];

export default function AppLibraryPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">My Library</h1>
                <p className="text-gray-600">Collections, saved texts, bookmarks, and recent study activity.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-gray-900 mb-3">Saved Texts</h2>
                    <div className="space-y-2">
                        {SAVED_TEXTS.map((text) => (
                            <Link
                                key={text}
                                href="/app/reader/bhagavad-gita-chapter-2"
                                className="block rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                {text}
                            </Link>
                        ))}
                    </div>
                </section>
                <section className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                    <h2 className="font-semibold text-gray-900 mb-3">Quick Stats</h2>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>Saved Texts: 12</p>
                        <p>Bookmarks: 45</p>
                        <p>Notes: 17</p>
                        <p>Recent Sessions: 6</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
