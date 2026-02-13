import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GURU_PERSONAS } from "@/lib/config/prompts";
import { LucideMessageCircle } from "lucide-react";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateStaticParams() {
    return Object.values(GURU_PERSONAS).map((persona) => ({
        slug: persona.key,
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const persona = GURU_PERSONAS[params.slug];
    if (!persona) return { title: "Master Not Found" };

    return {
        title: `Learn from ${persona.name} AI - Shastrarthi`,
        description: `Chat with an AI trained on the teachings of ${persona.name}. Ask questions about Shastras, philosophy, and sadhana.`,
        openGraph: {
            title: `Chat with ${persona.name} AI`,
            description: `Receive guidance based on the lineage and teachings of ${persona.name}.`,
        },
    };
}

export default function MasterPage({ params }: Props) {
    const persona = GURU_PERSONAS[params.slug];

    if (!persona) {
        notFound();
    }

    // Extract a bio from the masterPrompt for display, or better yet, we should add a 'bio' field to the config.
    // For now, we'll use a generic bio derived from the system prompt to avoid unauthorized content exposure.
    // Actually, looking at the config, 'masterPrompt' is safe to show as a description of the persona.
    const description = persona.bio;

    return (
        <main className="min-h-screen bg-parchment-50 py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <Link href="/app/discover" className="text-sm font-medium text-stone-500 hover:text-saffron-700 mb-8 inline-flex items-center transition-colors">
                    ← Back to Discovery
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-7xl mb-6">{persona.icon}</div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink-900 mb-4">
                        {persona.name}
                    </h1>
                    <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed font-serif italic">
                        &quot;{description}&quot;
                    </p>

                    <div className="flex justify-center">
                        <Link
                            href={`/app/chat?persona=${persona.key}`}
                            className="inline-flex items-center gap-2 bg-saffron-600 hover:bg-saffron-700 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg hover:shadow-saffron-200/50 transform hover:-translate-y-0.5"
                        >
                            <LucideMessageCircle className="w-5 h-5" />
                            Seek Guidance
                        </Link>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-serif font-bold text-ink-900 mb-6">The Teaching Style</h2>
                    <div className="bg-white rounded-xl p-8 border border-stone-100 max-w-2xl mx-auto text-left shadow-sm">
                        <p className="text-lg text-stone-700 mb-6 leading-relaxed">
                            When you speak with <strong>{persona.name}</strong>, you are engaging with a lineage-specific perspective. The answers are grounded in their commentaries (Bhashyas) and the mood (Bhava) of their tradition.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-stone-50 rounded-lg">
                                <h3 className="font-bold text-stone-900 mb-1">Focus</h3>
                                <p className="text-sm text-stone-600">Authentic scriptural interpretation</p>
                            </div>
                            <div className="p-4 bg-stone-50 rounded-lg">
                                <h3 className="font-bold text-stone-900 mb-1">Boundaries</h3>
                                <p className="text-sm text-stone-600">Won&apos;t fabricate verses or mix traditions</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
