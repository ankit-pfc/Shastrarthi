import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageSEO from "@/components/seo/PageSEO";
import RelatedEntities from "@/components/history/RelatedEntities";
import { getHistoryEntityBySlug, getPublishedHistoryEntities } from "@/lib/services/history";
import { getHistoryEntityStructuredData } from "@/lib/seo/structured-data";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

interface HistoryDetailPageProps {
    params: { type: string; slug: string };
}

function typeLabel(type: string): string {
    return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateStaticParams(): Promise<Array<{ type: string; slug: string }>> {
    const entities = await getPublishedHistoryEntities();
    return entities.map((entity) => ({ type: entity.entity_type, slug: entity.slug }));
}

export async function generateMetadata({ params }: HistoryDetailPageProps): Promise<Metadata> {
    const entity = await getHistoryEntityBySlug(params.type, params.slug);
    const canonical = `/history/${params.type}/${params.slug}`;
    if (!entity) {
        return { title: "History Entry Not Found", alternates: { canonical }, robots: { index: false, follow: false } };
    }

    const description = entity.meta_description || entity.summary || `Learn about ${entity.title} in ancient Indian history.`;
    return {
        title: `${entity.title} | Ancient Indian History`,
        description,
        alternates: { canonical },
        openGraph: {
            title: `${entity.title} | Ancient Indian History`,
            description,
            url: canonical,
            type: "article",
            images: entity.featured_image_url ? [{ url: entity.featured_image_url }] : undefined,
        },
        twitter: {
            title: `${entity.title} | Ancient Indian History`,
            description,
            images: entity.featured_image_url ? [entity.featured_image_url] : undefined,
        },
    };
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
    const entity = await getHistoryEntityBySlug(params.type, params.slug);
    if (!entity) notFound();

    const related = (await getPublishedHistoryEntities(params.type))
        .filter((item) => item.id !== entity.id)
        .slice(0, 6);

    const schemas = Object.values(getHistoryEntityStructuredData(entity, getSiteUrl()));
    const typeName = typeLabel(entity.entity_type);

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <PageSEO schemas={schemas} />
            <div className="container mx-auto px-4 py-12">
                <nav className="mb-4 text-sm text-gray-500">
                    <Link href="/history" className="hover:text-gray-700">
                        History
                    </Link>
                    {" / "}
                    <Link href={`/history/${entity.entity_type}`} className="hover:text-gray-700">
                        {typeName}
                    </Link>
                    {" / "}
                    <span>{entity.title}</span>
                </nav>

                <article className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
                    <div className="mb-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-800">{typeName}</span>
                        {entity.period_label ? (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">{entity.period_label}</span>
                        ) : null}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">{entity.title}</h1>
                    {entity.subtitle ? <p className="mt-2 text-lg text-gray-700">{entity.subtitle}</p> : null}
                    {entity.summary ? <p className="mt-4 text-gray-700">{entity.summary}</p> : null}

                    <div className="mt-6 space-y-3 text-sm text-gray-700">
                        {entity.geography ? <p><strong>Geography:</strong> {entity.geography}</p> : null}
                        {entity.tags?.length ? <p><strong>Tags:</strong> {entity.tags.join(", ")}</p> : null}
                        {entity.evidence_sources?.length ? (
                            <p><strong>Evidence Sources:</strong> {entity.evidence_sources.join(", ")}</p>
                        ) : null}
                    </div>

                    {entity.content_md ? (
                        <section className="prose prose-gray mt-8 max-w-none whitespace-pre-wrap text-gray-800">
                            {entity.content_md}
                        </section>
                    ) : null}
                </article>

                <RelatedEntities entities={related} title={`Related ${typeName}`} />
            </div>
        </main>
    );
}
