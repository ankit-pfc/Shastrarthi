import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
    title: "Traditions",
    description:
        "Explore Vedanta, Yoga, Tantra, Bhakti, and allied lineages with structured context and comparative study.",
    alternates: { canonical: "/traditions" },
};

import { TRADITIONS } from "@/lib/config/traditions";

export default function TraditionsPage() {
    const traditions = TRADITIONS;

    return (
        <div className="min-h-screen bg-parchment-50">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-ink-900 mb-6">Traditions</h1>
                <p className="text-lg text-stone-600 mb-10 max-w-3xl leading-relaxed">
                    Explore the vast landscape of Indian wisdom. From the non-dual heights of Vedanta to the devotional depths of Bhakti, discover the lineage that speaks to your soul.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {traditions.map((tradition) => (
                        <Link
                            key={tradition.slug}
                            href={`/traditions/${tradition.slug}`}
                            className="bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:border-saffron-300 hover:shadow-md transition-all block group"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-xl font-serif font-bold text-ink-900 group-hover:text-saffron-700 transition-colors">{tradition.name}</h2>
                                <span className="text-[10px] font-bold uppercase tracking-wide text-saffron-800 bg-saffron-100 px-2 py-1 rounded-full">
                                    Lineage
                                </span>
                            </div>
                            <p className="text-sm text-stone-600 leading-relaxed">{tradition.description}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 bg-white rounded-xl p-8 border border-stone-200 shadow-sm text-center">
                    <p className="text-stone-600 font-serif italic">
                        &quot;Knowledge is endless, but the time is short. The swan takes the milk and leaves the water.&quot;
                    </p>
                </div>
            </div>
        </div>
    );
}
