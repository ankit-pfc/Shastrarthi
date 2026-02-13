import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { TRADITIONS } from "@/lib/config/traditions";
import { ArrowRight } from "lucide-react";
import { fetchTexts } from "@/lib/services/texts";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    return TRADITIONS.map((t) => ({
        slug: t.slug,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const tradition = TRADITIONS.find((t) => t.slug === params.slug);
    if (!tradition) return { title: "Tradition Not Found" };

    return {
        title: `${tradition.name} Tradition - Texts and Philosophy`,
        description: `Explore the ${tradition.name} tradition, its key texts, philosophy, and masters on Shastrarthi.`,
    };
}

export default async function TraditionPage({ params }: Props) {
    const tradition = TRADITIONS.find((t) => t.slug === params.slug);

    if (!tradition) {
        notFound();
    }

    // Fetch texts related to this tradition (mapping slug to category for now)
    // Note: This relies on categories in DB matching or containing the slug partially
    // We'll try to fetch by category matching the name
    const allTexts = await fetchTexts({ limit: 100 });
    const relatedTexts = allTexts.filter(text =>
        (text.category?.toLowerCase() || "").includes(tradition.name.toLowerCase()) ||
        (text.tradition?.toLowerCase() || "").includes(tradition.name.toLowerCase())
    );

    return (
        <main className="min-h-screen bg-parchment-50 py-20 px-4">
            <div className="container mx-auto max-w-5xl">
                <Link href="/traditions" className="text-sm font-medium text-stone-500 hover:text-saffron-700 mb-8 inline-flex items-center transition-colors">
                    ← All Traditions
                </Link>

                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-ink-900 mb-6">
                        {tradition.name}
                    </h1>
                    <p className="text-xl md:text-2xl text-stone-600 max-w-3xl leading-relaxed">
                        {tradition.description}
                    </p>
                </div>

                {relatedTexts.length > 0 ? (
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-ink-900 mb-6">Foundational Texts</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {relatedTexts.map((text) => (
                                <Link
                                    key={text.id}
                                    href={`/app/reader/${text.slug}`}
                                    className="group bg-white rounded-xl p-6 border border-stone-200 hover:border-saffron-300 transition-all shadow-sm hover:shadow-md"
                                >
                                    <h3 className="font-serif text-xl font-semibold text-ink-900 group-hover:text-saffron-700 mb-2">
                                        {text.title_en}
                                    </h3>
                                    <p className="text-sm text-stone-500 mb-4 line-clamp-2">
                                        {text.description}
                                    </p>
                                    <div className="flex items-center text-saffron-600 text-sm font-medium">
                                        Begin Study <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="bg-white border border-stone-200 rounded-lg p-8 text-center mb-12 shadow-sm">
                        <p className="text-stone-600 mb-4">Text digitization for this tradition is in progress.</p>
                        <Link href="/app/discover" className="text-saffron-600 font-medium hover:text-saffron-700 inline-block">
                            Browse Library
                        </Link>
                    </div>
                )}

                <section>
                    <h2 className="text-2xl font-bold text-ink-900 mb-6">Explore More</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/app/discover" className="block p-6 bg-white border border-stone-200 rounded-xl hover:border-stone-300 transition-colors">
                            <h3 className="font-semibold text-ink-900 mb-2">Search Concepts</h3>
                            <p className="text-stone-600">Find specific concepts within {tradition.name} texts.</p>
                        </Link>
                        <Link href="/app/chat" className="block p-6 bg-white border border-stone-200 rounded-xl hover:border-stone-300 transition-colors">
                            <h3 className="font-semibold text-ink-900 mb-2">Ask a Master</h3>
                            <p className="text-stone-600">Chat with AI personas trained on {tradition.name} lineage.</p>
                        </Link>
                    </div>
                </section>
            </div>
        </main>
    );
}
