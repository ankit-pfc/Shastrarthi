import { ComparisonTable } from "@/components/marketing/ComparisonTable";
// import { Button } from "@/components/ui/Button"; // Commented out to avoid issues if component doesn't match expected interface, using standard links instead
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Check } from "lucide-react";

export const metadata = {
    title: "Shastrarthi vs ChatGPT - Best AI for Hindu Scriptures",
    description: "Stop getting hallucinated verses. See why serious seekers choose Shastrarthi over generic AI tools for studying the Bhagavad Gita, Upanishads, and more.",
};

// Comparison Data Section
const COMPARISON_DATA = [
    {
        feature: "Training Source",
        generic: "The entire internet (Reddit, Blogs, Tweets)",
        shastrarthi: "Authorized Shastras & Commentaries",
    },
    {
        feature: "Understanding Lineage",
        generic: "Confuses Advaita with Dvaita",
        shastrarthi: "Distinct Personas (e.g. Shankara vs Ramanuja)",
    },
    {
        feature: "Sanskrit Precision",
        generic: "Often hallucinates verses",
        shastrarthi: "Verified against dictionaries",
    },
    {
        feature: "Tone of Voice",
        generic: "Clinical, robot-like",
        shastrarthi: "Reverent, scholarly, grounded",
    },
    {
        feature: "Citations",
        generic: "Makes up book chapters",
        shastrarthi: "Real, clickable verse references",
    },
];

export default function ComparePage() {
    return (
        <div className="bg-parchment-50 min-h-screen">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Built for Seekers, not Scrapers</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-ink-900 tracking-tight mb-6 leading-tight">
                    Stop getting <span className="text-saffron-600 italic">hallucinated</span> verses. <br className="hidden md:block" />
                    Study Shastras with precision.
                </h1>

                <p className="text-lg sm:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Generic AI tools treat sacred texts like any other data. Shastrarthi is built to respect lineage, context, and meaning.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/app"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-ink-900 rounded-lg hover:bg-ink-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200"
                    >
                        Start Free Chat
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                    <Link
                        href="/about"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors"
                    >
                        Read Our Manifesto
                    </Link>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-serif font-bold text-ink-900 mb-4">The Shastrarthi Difference</h2>
                    <p className="text-stone-600">Why thousands of students trust specific tools over general ones.</p>
                </div>

                <ComparisonTable competitorName="ChatGPT / Claude" rows={COMPARISON_DATA} />
            </section>

            {/* Deep Dive / Explainers */}
            <section className="py-20 bg-white border-t border-stone-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="order-2 md:order-1">
                            <div className="bg-stone-100 rounded-xl p-8 h-80 flex items-center justify-center border border-stone-200 shadow-inner">
                                {/* Placeholder for visual/screenshot */}
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🕉️</div>
                                    <span className="text-stone-500 font-serif italic text-lg">&quot;Satyam Jnanam Anantam Brahma&quot;</span>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="inline-block p-2 bg-saffron-100 rounded-lg text-saffron-800 mb-4">
                                <BookOpen className="w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-ink-900 mb-4">Speak to the Tradition, not the Tech</h3>
                            <p className="text-lg text-stone-600 mb-6 leading-relaxed">
                                Asking a generic AI about &quot;Dharma&quot; gets you a Wikipedia summary. It&apos;s information without soul.
                                <br /><br />
                                <strong>Shastrarthi</strong> is different. Whether you need the rigorous logic of <em>Adi Shankara</em> or the devotional depth of a <em>Vaishnava</em>, our personas speak from within the tradition—respecting the nuance that serious students demand.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "No more 'As an AI language model' lectures",
                                    "Strict boundaries against making up verses",
                                    "Grounded in the specific commentary you are studying"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center text-stone-700 font-medium">
                                        <Check className="w-5 h-5 text-saffron-600 mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-ink-900 text-parchment-50 text-center px-4">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-6">Ready to study seriously?</h2>
                <p className="text-stone-300 max-w-2xl mx-auto mb-10 text-lg">
                    Join a community of seekers using technology to deepen their connection to wisdom.
                </p>
                <Link
                    href="/app"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-ink-900 bg-saffron-500 rounded-lg hover:bg-saffron-400 transition-colors shadow-xl"
                >
                    Start Your Practice
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </section>
        </div >
    );
}
