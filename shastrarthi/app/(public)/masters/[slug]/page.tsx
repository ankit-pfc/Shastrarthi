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
    const description = persona.masterPrompt.split('\n')[0].replace('You are ', '');

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50 py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <Link href="/app/discover" className="text-sm text-orange-600 hover:text-orange-700 mb-8 inline-block">
                    ← Back to Discovery
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 md:p-12 text-center">
                    <div className="text-6xl mb-6">{persona.icon}</div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                        {persona.name}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                        {description}
                    </p>

                    <div className="flex justify-center">
                        <Link
                            href={`/app/chat?persona=${persona.key}`}
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-full text-lg font-medium transition-colors shadow-lg hover:shadow-orange-200"
                        >
                            <LucideMessageCircle className="w-5 h-5" />
                            Start Dialogue
                        </Link>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">About this Persona</h2>
                    <div className="bg-white/80 rounded-xl p-6 border border-gray-100 max-w-2xl mx-auto text-left">
                        <p className="text-gray-700 mb-4">
                            This interface simulates a dialogue with <strong>{persona.name}</strong> based on their known works and philosophy. It is designed to help you explore their teachings interactively.
                        </p>
                        <p className="text-gray-600 text-sm">
                            System Directive: <br />
                            <code className="bg-gray-50 px-1 py-0.5 rounded text-gray-800">
                                {persona.masterPrompt.split('\n').slice(0, 3).join(' ')}...
                            </code>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
