import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Heading } from "@/components/ui/heading";
import { Shell } from "@/components/shell";
import { type Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
// import { getHistoryListStructuredData } from "@/lib/seo/structured-data"; // TODO: Implement this structured data function

interface HistoryListPageProps {
  params: { type: string };
}

// TODO: Implement generateMetadata for SEO
export async function generateMetadata({
  params,
}: HistoryListPageProps): Promise<Metadata> {
  const type = params.type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const title = `${type} | History | Shastrarthi`;
  const description = `Explore ${type} in ancient Indian history on Shastrarthi.`;
  const url = `${getSiteUrl()}/history/${params.type}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// TODO: Implement generateStaticParams for build-time generation of common types
export async function generateStaticParams() {
  const entityTypes = [
    "empire",
    "kingdom",
    "temple",
    "guru",
    "lineage",
    "event",
    "literature",
    "archaeological",
    "path",
    "school",
  ];
  return entityTypes.map((type) => ({
    type: type,
  }));
}

export default async function HistoryListPage({ params }: HistoryListPageProps) {
  const supabase = createClient();
  const { data: entities, error } = await supabase
    .from("history_entities")
    .select("id, slug, title, summary, entity_type, featured_image_url")
    .eq("entity_type", params.type)
    .eq("is_published", true) // Only show published entities
    .order("title", { ascending: true });

  if (error) {
    console.error("Error fetching history entities:", error);
    notFound();
  }

  const pageTitle = params.type.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Shell className="max-w-screen-xl">
      <Heading
        title={pageTitle}
        description={`A comprehensive list of ${pageTitle.toLowerCase()} in ancient Indian history.`}
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {entities.map((entity) => (
          <div key={entity.id} className="rounded-lg border p-4">
            <h3 className="text-lg font-semibold">{entity.title}</h3>
            {entity.featured_image_url && (
              <img src={entity.featured_image_url} alt={entity.title} className="my-2 h-32 w-full object-cover" />
            )}
            <p className="text-sm text-muted-foreground line-clamp-3">{entity.summary}</p>
            <a href={`/history/${entity.entity_type}/${entity.slug}`} className="mt-2 inline-block text-primary hover:underline">
              Read More
            </a>
          </div>
        ))}
      </div>
    </Shell>
  );
}