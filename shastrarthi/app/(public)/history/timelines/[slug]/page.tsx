import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageSEO from "@/components/seo/PageSEO";
import TimelineView from "@/components/history/TimelineView";
import { getEntitiesByIds, getPublishedTimelines, getTimelineBySlug } from "@/lib/services/history";
import { getTimelineStructuredData } from "@/lib/seo/structured-data";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

interface TimelineDetailPageProps {
    params: { slug: string };
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
    const timelines = await getPublishedTimelines();
    return timelines.map((timeline) => ({ slug: timeline.slug }));
}

export async function generateMetadata({ params }: TimelineDetailPageProps): Promise<Metadata> {
    const timeline = await getTimelineBySlug(params.slug);
    const canonical = `/history/timelines/${params.slug}`;
    if (!timeline) {
        return { title: "Timeline Not Found", alternates: { canonical }, robots: { index: false, follow: false } };
    }

    const description = timeline.description || `Explore the ${timeline.title} timeline.`;
    return {
        title: `${timeline.title} | History Timelines`,
        description,
        alternates: { canonical },
        openGraph: {
            title: `${timeline.title} | History Timelines`,
            description,
            url: canonical,
            type: "article",
        },
    };
}

export default async function TimelineDetailPage({ params }: TimelineDetailPageProps) {
    const timeline = await getTimelineBySlug(params.slug);
    if (!timeline) notFound();

    const entityIds = timeline.entity_ids ?? [];
    const entities = await getEntitiesByIds(entityIds);
    const yearMap = new Map(entities.map((entity) => [entity.id, entity.period_start_year]));
    const ordered = entityIds
        .map((id) => entities.find((entity) => entity.id === id))
        .filter((entity): entity is (typeof entities)[number] => Boolean(entity))
        .map((entity) => ({ entity, year: yearMap.get(entity.id) ?? null }));

    const schemas = Object.values(getTimelineStructuredData(timeline, entities, getSiteUrl()));

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <PageSEO schemas={schemas} />
            <div className="container mx-auto px-4 py-12">
                <nav className="mb-4 text-sm text-gray-500">
                    <Link href="/history" className="hover:text-gray-700">
                        History
                    </Link>
                    {" / "}
                    <Link href="/history/timelines" className="hover:text-gray-700">
                        Timelines
                    </Link>
                    {" / "}
                    <span>{timeline.title}</span>
                </nav>

                <h1 className="mb-2 text-3xl font-bold text-gray-900">{timeline.title}</h1>
                {timeline.description ? <p className="mb-8 text-gray-600">{timeline.description}</p> : null}

                <TimelineView items={ordered} />
            </div>
        </main>
    );
}
