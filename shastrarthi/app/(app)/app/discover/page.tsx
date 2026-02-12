import SearchTextarea from "@/components/discover/SearchTextarea";
import { fetchTexts } from "@/lib/services/texts";
import Link from "next/link";
import { redirect } from "next/navigation";

const EXAMPLES = [
    "What is the nature of consciousness in Upanishads?",
    "Compare Karma Yoga across Gita and Yoga Sutras",
    "How is Shakti described across Tantra traditions?",
];

export const revalidate = 60;

interface AppDiscoverPageProps {
    searchParams: { q?: string };
}

export default async function AppDiscoverPage({ searchParams }: AppDiscoverPageProps) {
    const quickQuery = searchParams?.q?.trim();
    if (quickQuery) {
        redirect(`/app/discover/${encodeURIComponent(quickQuery)}?depth=deep`);
    }

    const texts = await fetchTexts({ limit: 6 });

    return (
        <div className="max-w-5xl mx-auto pt-8">
            <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-4">Text Discovery</h1>
            <SearchTextarea />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-500">Try searching for:</span>
                {EXAMPLES.map((example) => (
                    <Link
                        key={example}
                        href={`/app/discover/${encodeURIComponent(example)}?depth=deep`}
                        className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                    >
                        {example}
                    </Link>
                ))}
            </div>

            <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">Recently Indexed Texts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {texts.map((text) => (
                        <p key={text.id} className="text-sm text-gray-700">
                            {text.title_en}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}
