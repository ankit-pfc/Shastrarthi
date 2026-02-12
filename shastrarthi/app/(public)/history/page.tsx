import type { Metadata } from "next";
import Link from "next/link";
import PageSEO from "@/components/seo/PageSEO";
import EntityCard from "@/components/history/EntityCard";
import { getPublishedHistoryEntities, getPublishedHistoryTypes, getPublishedTimelines } from "@/lib/services/history";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Ancient Indian History",
    description:
        "Explore empires, kingdoms, temples, gurus, events, literature, and timelines with evidence-linked historical context.",
    alternates: { canonical: "/history" },
};

export default async function HistoryLandingPage() {
    const [entities, types, timelines] = await Promise.all([
        getPublishedHistoryEntities(),
        getPublishedHistoryTypes(),
        getPublishedTimelines(),
    ]);

    const featured = entities.slice(0, 9);
    const siteUrl = getSiteUrl();
    const itemList = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "History Collections",
        itemListElement: types.map((type, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: type.replace(/_/g, " "),
            item: `${siteUrl}/history/${type}`,
        })),
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <PageSEO schemas={[itemList]} />
            <div className="container mx-auto px-4 py-12">
                <h1 className="mb-3 text-3xl font-bold text-gray-900 md:text-4xl">Ancient Indian History</h1>
                <p className="mb-8 max-w-3xl text-gray-600">
                    A public knowledge base covering empires, kingdoms, temples, gurus, events, literature, and curated timelines.
                </p>

                <section className="mb-10">
                    <h2 className="mb-4 text-xl font-semibold text-gray-900">Browse by type</h2>
                    <div className="flex flex-wrap gap-2">
                        {types.map((type) => (
                            <Link
                                key={type}
                                href={`/history/${type}`}
                                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 hover:border-orange-300"
                            >
                                {type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="mb-10">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-gray-900">Featured entries</h2>
                        <span className="text-sm text-gray-500">{entities.length} total published entries</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {featured.map((entity) => (
                            <EntityCard key={entity.id} entity={entity} />
                        ))}
                    </div>
                </section>

                {timelines.length ? (
                    <section>
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Timelines</h2>
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {timelines.slice(0, 8).map((timeline) => (
                                <Link
                                    key={timeline.id}
                                    href={`/history/timelines/${timeline.slug}`}
                                    className="rounded-xl border border-gray-200 bg-white p-4 hover:border-orange-300"
                                >
                                    <p className="font-semibold text-gray-900">{timeline.title}</p>
                                    {timeline.description ? (
                                        <p className="mt-1 text-sm text-gray-600">{timeline.description}</p>
                                    ) : null}
                                </Link>
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </main>
    );
}
