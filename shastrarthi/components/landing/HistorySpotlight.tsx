import Link from "next/link";
import { ArrowRight, Landmark, Clock } from "lucide-react";

export default function HistorySpotlight() {
    return (
        <section className="bg-gradient-to-br from-orange-50 to-amber-50 py-16">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 mb-4">
                            <Landmark className="h-6 w-6 text-orange-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            Explore Ancient Indian History
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Discover the rich tapestry of Indian history through timelines, entities, and paths.
                            Explore dynasties, traditions, and historical figures with detailed context.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Link
                            href="/history"
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100"
                        >
                            <Clock className="h-8 w-8 text-orange-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Timelines</h3>
                            <p className="text-sm text-gray-600">
                                Explore chronological journeys through different eras and dynasties.
                            </p>
                        </Link>
                        <Link
                            href="/history"
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100"
                        >
                            <Landmark className="h-8 w-8 text-orange-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Entities</h3>
                            <p className="text-sm text-gray-600">
                                Discover kings, sages, and historical figures with detailed biographies.
                            </p>
                        </Link>
                        <Link
                            href="/history"
                            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-orange-100"
                        >
                            <ArrowRight className="h-8 w-8 text-orange-600 mb-3" />
                            <h3 className="font-semibold text-gray-900 mb-2">Paths</h3>
                            <p className="text-sm text-gray-600">
                                Follow curated learning paths through interconnected historical narratives.
                            </p>
                        </Link>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/history"
                            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
