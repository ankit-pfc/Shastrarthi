import Link from "next/link";
import { ArrowRight, Landmark, Clock } from "lucide-react";

export default function HistorySpotlight() {
    return (
        <section className="bg-gray-50 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-50 mb-4">
                            <Landmark className="h-6 w-6 text-orange-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-1.5">
                            Explore Ancient Indian History
                        </h2>
                        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                            Discover the rich tapestry of Indian history through timelines, entities, and paths.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Link
                            href="/history"
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-100 mb-3 group-hover:border-orange-100 transition-colors">
                                <Clock className="h-5 w-5 text-orange-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Timelines</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Explore chronological journeys through different eras and dynasties.
                            </p>
                        </Link>
                        <Link
                            href="/history"
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-100 mb-3 group-hover:border-orange-100 transition-colors">
                                <Landmark className="h-5 w-5 text-orange-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Entities</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Discover kings, sages, and historical figures with detailed biographies.
                            </p>
                        </Link>
                        <Link
                            href="/history"
                            className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all text-center group"
                        >
                            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white border border-gray-100 mb-3 group-hover:border-orange-100 transition-colors">
                                <ArrowRight className="h-5 w-5 text-orange-600" />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Paths</h3>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Follow curated learning paths through interconnected historical narratives.
                            </p>
                        </Link>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/history"
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                            Explore History
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
