import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedTimelines } from "@/lib/services/history";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "History Timelines",
    description: "Explore curated historical timelines across ancient Indian history.",
    alternates: { canonical: "/history/timelines" },
};

export default async function HistoryTimelinesPage() {
    const timelines = await getPublishedTimelines();

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-12">
                <nav className="mb-4 text-sm text-gray-500">
                    <Link href="/history" className="hover:text-gray-700">
                        History
                    </Link>
                    {" / "}
                    <span>Timelines</span>
                </nav>

                <h1 className="mb-2 text-3xl font-bold text-gray-900">Timelines</h1>
                <p className="mb-8 text-gray-600">Curated chronology views connecting related historical entities.</p>

                {timelines.length ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {timelines.map((timeline) => (
                            <Link
                                key={timeline.id}
                                href={`/history/timelines/${timeline.slug}`}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-orange-300"
                            >
                                <h2 className="font-semibold text-gray-900">{timeline.title}</h2>
                                {timeline.description ? (
                                    <p className="mt-1 text-sm text-gray-600">{timeline.description}</p>
                                ) : null}
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-600">
                        No timelines are published yet.
                    </div>
                )}
            </div>
        </main>
    );
}
