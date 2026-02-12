import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Heading } from "@/components/ui/heading";
import { Shell } from "@/components/shell";
import { type Metadata } from "next";
import { getSiteUrl } from "@/lib/site";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";
// import { getTimelineStructuredData } from "@/lib/seo/structured-data"; // TODO: Implement this structured data function

interface HistoryTimelinePageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: HistoryTimelinePageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: timeline } = await supabase
    .from("history_timelines")
    .select("title, description")
    .eq("slug", params.slug)
    .single();

  if (!timeline) {
    return {};
  }

  const title = `${timeline.title} | History Timelines | Shastrarthi`;
  const description = timeline.description || `Explore the ${timeline.title} timeline in ancient Indian history.`;
  const url = `${getSiteUrl()}/history/timelines/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const supabase = createClient();
  const { data: timelines } = await supabase
    .from("history_timelines")
    .select("slug");

  return (timelines || []).map((timeline) => ({
    slug: timeline.slug,
  }));
}

export default async function HistoryTimelinePage({ params }: HistoryTimelinePageProps) {
  const supabase = createClient();
  const { data: timeline, error } = await supabase
    .from("history_timelines")
    .select("id, slug, title, description, entity_ids")
    .eq("slug", params.slug)
    .single();

  if (error || !timeline) {
    notFound();
  }

  // const structuredData = getTimelineStructuredData(timeline, getSiteUrl()); // TODO: Implement this

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
              <Link href="/history/timelines">Timelines</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Link href={`/history/timelines/${timeline.slug}`}>
              {timeline.title}
            </Link>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Heading title={timeline.title} description={timeline.description || ""} />

      {/* TODO: Implement interactive timeline view using entity_ids */}
      <p>Interactive timeline for {timeline.title}</p>
    </Shell>
  );
}