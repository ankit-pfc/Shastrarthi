import SearchTextarea from "@/components/discover/SearchTextarea";
import { fetchTexts } from "@/lib/services/texts";
import Link from "next/link";
import { MoveRight } from "lucide-react";

export const revalidate = 60;

const TOPICS = [
    { title: "Vedanta", description: "Philosophy of the Upanishads" },
    { title: "Yoga", description: "Union of individual & universal consciousness" },
    { title: "Tantra", description: "Esoteric traditions & practices" },
    { title: "Bhakti", description: "Devotional path to the divine" },
    { title: "Dharma", description: "Cosmic order & duty" },
    { title: "Nyaya", description: "School of logic & epistemology" },
];

export default async function ShastraDiscoveryPage() {
    const texts = await fetchTexts({ limit: 6 });

    return (
        <div className="max-w-5xl mx-auto pt-8 px-4 md:px-0">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Shastra Discovery</h1>
            <p className="text-gray-600 mb-8 max-w-2xl">
                Explore thousands of sacred texts, translations, and commentaries from various Indian traditions.
            </p>

            <div className="mb-12">
                <SearchTextarea />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {TOPICS.map((topic) => (
                    <Link
                        key={topic.title}
                        href={`/app/discover?q=${topic.title}`}
                        className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between h-32"
                    >
                        <div>
                            <h3 className="font-semibold text-lg text-gray-900 group-hover:text-orange-700 transition-colors">
                                {topic.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{topic.description}</p>
                        </div>
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                            <MoveRight className="h-5 w-5 text-orange-600" />
                        </div>
                    </Link>
                ))}
            </div>

            <div className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Recently Indexed Texts</h2>
                    <Link href="/app/library" className="text-sm text-orange-700 hover:text-orange-800 font-medium flex items-center gap-1">
                        View all <MoveRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {texts.map((text) => (
                        <div key={text.id} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3">
                            <div className="h-8 w-8 rounded bg-orange-100 grid place-items-center text-orange-700 font-serif font-bold text-xs shrink-0">
                                {text.title_en.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {text.title_en}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {text.author || "Unknown Author"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
