import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Heading } from "@/components/ui/heading";
import { Shell } from "@/components/shell";
import { type Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
import Image from "next/image";
// import { getHistoryEntityStructuredData } from "@/lib/seo/structured-data"; // TODO: Implement this structured data function

interface HistoryDetailPageProps {
  params: { type: string; slug: string };
}

export async function generateMetadata({
  params,
}: HistoryDetailPageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: entity } = await supabase
    .from("history_entities")
    .select("title, summary, meta_description, featured_image_url, entity_type, slug")
    .eq("slug", params.slug)
    .eq("entity_type", params.type)
    .eq("is_published", true)
    .single();

  if (!entity) {
    return {};
  }

  const title = `${entity.title} | Shastrarthi History`;
  const description = entity.meta_description || entity.summary || `Learn about ${entity.title} in ancient Indian history.`;
  const url = `${getSiteUrl()}/history/${entity.entity_type}/${entity.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: entity.featured_image_url ? [entity.featured_image_url] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: entity.featured_image_url ? [entity.featured_image_url] : [],
    },
  };
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: entities } = await supabase
    .from("history_entities")
    .select("slug, entity_type")
    .eq("is_published", true);

  return (entities || []).map((entity) => ({
    type: entity.entity_type,
    slug: entity.slug,
  }));
}

export default async function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  const supabase = createClient();
  const { data: entity, error } = await supabase
    .from("history_entities")
    .select("id, slug, title, subtitle, summary, content_md, period_label, geography, tags, evidence_sources, featured_image_url, entity_type")
    .eq("slug", params.slug)
    .eq("entity_type", params.type)
    .eq("is_published", true)
    .single();

  if (error || !entity) {
    notFound();
  }

  // const structuredData = getHistoryEntityStructuredData(entity, getSiteUrl()); // TODO: Implement this

  const pageType = entity.entity_type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Shell className="max-w-screen-xl">
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      /> */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/history">History</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/history/${entity.entity_type}`}>{pageType}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={`/history/${entity.entity_type}/${entity.slug}`}>
              {entity.title}
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Heading title={entity.title} description={entity.subtitle || entity.summary || ""} />

      {entity.featured_image_url && (
        <div className="relative h-[300px] w-full overflow-hidden rounded-lg">
          <Image
            src={entity.featured_image_url}
            alt={entity.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      )}

      <div className="prose dark:prose-invert mt-6">
        {entity.content_md && <div dangerouslySetInnerHTML={{ __html: entity.content_md }} />}
        {!entity.content_md && <p>{entity.summary}</p>}

        {entity.period_label && <p><strong>Period:</strong> {entity.period_label}</p>}
        {entity.geography && <p><strong>Geography:</strong> {entity.geography}</p>}
        {entity.tags && entity.tags.length > 0 && (
          <p><strong>Tags:</strong> {entity.tags.join(", ")}</p>
        )}
        {entity.evidence_sources && entity.evidence_sources.length > 0 && (
          <p><strong>Evidence Sources:</strong> {entity.evidence_sources.join(", ")}</p>
        )}
      </div>

      {/* TODO: Add Related Entities, Timelines, etc. */}
    </Shell>
  );
}