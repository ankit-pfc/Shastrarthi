import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import VerseDisplay from "@/components/reader/VerseDisplay";
import ReaderControls from "@/components/reader/ReaderControls";
import ProgressBar from "@/components/reader/ProgressBar";
import { AlertTriangle } from "lucide-react";

interface PageProps {
    params: {
        slug: string;
    };
}

async function getText(slug: string) {
    const { data, error } = await supabase
        .from("texts")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) {
        console.error("Error fetching text:", error);
        throw new Error("Failed to load text. Please try again.");
    }

    return data;
}

async function getVerses(textId: string) {
    const { data, error } = await supabase
        .from("verses")
        .select("*")
        .eq("text_id", textId)
        .order("order_index", { ascending: true });

    if (error) {
        console.error("Error fetching verses:", error);
        throw new Error("Failed to load verses. Please try again.");
    }

    return data || [];
}

export default async function ReaderPage({ params }: PageProps) {
    let text = null;
    let verses = [];
    let error = null;

    try {
        text = await getText(params.slug);

        if (!text) {
            notFound();
        }

        verses = await getVerses(text.id);
    } catch (err) {
        error = err instanceof Error ? err.message : "An unexpected error occurred";
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white dark:bg-sand-800 rounded-lg shadow-lg border border-sand-200 dark:border-sand-700 p-8 text-center">
                    <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-sand-900 dark:text-sand-100 mb-2">
                        Error Loading Text
                    </h1>
                    <p className="text-sand-600 dark:text-sand-400 mb-6">
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-saffron-600 hover:bg-saffron-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900">
            <ReaderControls
                title={text.title_en}
                sanskritTitle={text.title_sa}
                category={text.category}
            />

            <ProgressBar current={0} total={verses.length} />

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-100 mb-2">
                        {text.title_en}
                    </h1>
                    {text.title_sa && (
                        <h2 className="text-xl md:text-2xl font-serif text-saffron-600 dark:text-saffron-400 mb-4">
                            {text.title_sa}
                        </h2>
                    )}
                    <p className="text-sand-700 dark:text-sand-300 max-w-2xl mx-auto leading-relaxed">
                        {text.description}
                    </p>
                </div>

                {verses.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sand-200 dark:bg-sand-700 flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-sand-500 dark:text-sand-400" />
                        </div>
                        <p className="text-sand-600 dark:text-sand-400 text-lg">
                            No verses found for this text.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {verses.map((verse) => (
                            <VerseDisplay
                                key={verse.id}
                                ref={verse.ref}
                                sanskrit={verse.sanskrit}
                                transliteration={verse.transliteration}
                                translation={verse.translation_en}
                                verseId={verse.id}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export async function generateMetadata({ params }: PageProps) {
    const text = await getText(params.slug);

    if (!text) {
        return {
            title: "Text Not Found",
        };
    }

    return {
        title: `${text.title_en} - Shastra Platform`,
        description: text.description,
    };
}
