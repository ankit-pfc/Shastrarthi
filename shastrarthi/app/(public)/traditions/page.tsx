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
        <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Traditions</h1>
                <p className="text-gray-600 mb-10 max-w-3xl">
                    Explore Vedanta, Yoga, Tantra, Bhakti, and allied lineages with structured context.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {traditions.map((tradition) => (
                        <Link
                            key={tradition.slug}
                            href={`/traditions/${tradition.slug}`}
                            className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-orange-300 transition-colors block"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-gray-900">{tradition.name}</h2>
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                                    Explore
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{tradition.description}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <p className="text-gray-600">
                        Interactive lineage maps and comparative summaries are being rolled out in phases.
                    </p>
                </div>
            </div>
        </div>
    );
}
