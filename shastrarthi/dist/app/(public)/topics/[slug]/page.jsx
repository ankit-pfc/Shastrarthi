import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Heading } from "@/components/ui/heading";
import { Shell } from "@/components/shell";
import { getSiteUrl } from "@/lib/site";
import { getTopicStructuredData } from "@/lib/seo/structured-data";
export async function generateMetadata({ params, }) {
    const supabase = createClient();
    const { data: topic } = await supabase
        .from("topics")
        .select("name, description")
        .eq("slug", params.slug)
        .single();
    if (!topic) {
        return {};
    }
    const title = `${topic.name} | Shastrarthi`;
    const description = topic.description || `Explore ${topic.name} on Shastrarthi.`;
    const url = `${getSiteUrl()}/topics/${params.slug}`;
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
    const { data: topics } = await supabase.from("topics").select("slug");
    return (topics || []).map((topic) => ({
        slug: topic.slug,
    }));
}
export default async function TopicDetailPage({ params }) {
    const supabase = createClient();
    const { data: topic, error } = await supabase
        .from("topics")
        .select("id, slug, name, description, icon, category, parent_topic_id")
        .eq("slug", params.slug)
        .single();
    if (error || !topic) {
        notFound();
    }
    const structuredData = getTopicStructuredData(topic, getSiteUrl());
    return (<Shell className="max-w-screen-xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/>
      <Heading title={topic.name} description={topic.description || ""}/>
      {/* TODO: Add related texts, sub-topics, etc. */}
      <p>Content for {topic.name}</p>
    </Shell>);
}
