import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageSEO from "@/components/seo/PageSEO";
import EntityCard from "@/components/history/EntityCard";
import { getPublishedHistoryEntities, getPublishedHistoryTypes } from "@/lib/services/history";
import { getHistoryListStructuredData } from "@/lib/seo/structured-data";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

interface HistoryTypePageProps {
    params: { type: string };
}

function label(type: string): string {
    return type.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function generateStaticParams(): Promise<Array<{ type: string }>> {
    const types = await getPublishedHistoryTypes();
    return types.map((type) => ({ type }));
}

export async function generateMetadata({ params }: HistoryTypePageProps): Promise<Metadata> {
    const typeLabel = label(params.type);
    const canonical = `/history/${params.type}`;
    return {
        title: `${typeLabel} | Ancient Indian History`,
        description: `Browse ${typeLabel.toLowerCase()} entries in the Shastrarthi history knowledge base.`,
        alternates: { canonical },
        openGraph: {
            title: `${typeLabel} | Ancient Indian History`,
            description: `Browse ${typeLabel.toLowerCase()} entries in the Shastrarthi history knowledge base.`,
            url: canonical,
            type: "website",
        },
    };
}

export default async function HistoryTypePage({ params }: HistoryTypePageProps) {
    const [types, entities] = await Promise.all([
        getPublishedHistoryTypes(),
        getPublishedHistoryEntities(params.type),
    ]);

    if (!types.includes(params.type)) {
        notFound();
    }

    const schemas = Object.values(getHistoryListStructuredData(params.type, entities, getSiteUrl()));

    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <PageSEO schemas={schemas} />
            <div className="container mx-auto px-4 py-12">
                <nav className="mb-4 text-sm text-gray-500">
                    <Link href="/history" className="hover:text-gray-700">
                        History
                    </Link>
                    {" / "}
                    <span>{label(params.type)}</span>
                </nav>
                <h1 className="mb-2 text-3xl font-bold text-gray-900">{label(params.type)}</h1>
                <p className="mb-8 text-gray-600">
                    {entities.length} published entries for this historical category.
                </p>

                {entities.length ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {entities.map((entity) => (
                            <EntityCard key={entity.id} entity={entity} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-6 text-gray-600">
                        No published entries yet for this type.
                    </div>
                )}
            </div>
        </main>
    );
}
