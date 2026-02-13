import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@supabase/supabase-js";
import { GURU_PERSONAS } from "@/lib/config/prompts";
import { TRADITIONS } from "@/lib/config/traditions";

function createPublicSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();
    const lastModified = new Date();
    const supabase = createPublicSupabase();

    const masterPages: MetadataRoute.Sitemap = Object.values(GURU_PERSONAS).map((persona) => ({
        url: `${siteUrl}/masters/${persona.key}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const traditionPages: MetadataRoute.Sitemap = TRADITIONS.map((tradition) => ({
        url: `${siteUrl}/traditions/${tradition.slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.9,
    }));

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: siteUrl,
            lastModified,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${siteUrl}/about`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${siteUrl}/traditions`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.6,
        },
        {
            url: `${siteUrl}/explore`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/topics`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.7,
        },
        {
            url: `${siteUrl}/history`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.75,
        },
        {
            url: `${siteUrl}/history/timelines`,
            lastModified,
            changeFrequency: "weekly",
            priority: 0.6,
        },
    ];

    if (!supabase) return staticPages;

    let textPages: MetadataRoute.Sitemap = [];
    try {
        const { data: texts } = await supabase
            .from("texts")
            .select("slug, created_at")
            .order("created_at", { ascending: false });

        if (texts) {
            textPages = texts.map((text) => ({
                url: `${siteUrl}/app/reader/${text.slug}`,
                lastModified: new Date(text.created_at),
                changeFrequency: "monthly" as const,
                priority: 0.8,
            }));
        }
    } catch (error) {
        console.error("[sitemap] Failed to fetch texts:", error);
    }

    const { data: explorePages } = await supabase
        .from("public_pages")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false })
        .limit(1000);

    const dynamicExplorePages: MetadataRoute.Sitemap =
        ((explorePages as Array<{ slug: string; updated_at: string }> | null) ?? []).map((page) => ({
            url: `${siteUrl}/explore/${page.slug}`,
            lastModified: new Date(page.updated_at),
            changeFrequency: "weekly",
            priority: 0.6,
        }));

    const { data: topicsData } = await supabase
        .from("topics")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false })
        .limit(1000);

    const dynamicTopicsPages: MetadataRoute.Sitemap =
        ((topicsData as Array<{ slug: string; updated_at: string }> | null) ?? []).map((topic) => ({
            url: `${siteUrl}/topics/${topic.slug}`,
            lastModified: new Date(topic.updated_at),
            changeFrequency: "weekly",
            priority: 0.6,
        }));

    const { data: historyEntitiesData } = await supabase
        .from("history_entities")
        .select("slug, entity_type, updated_at")
        .eq("is_published", true)
        .order("updated_at", { ascending: false })
        .limit(1000);

    const historyEntityPages: MetadataRoute.Sitemap =
        ((historyEntitiesData as Array<{ slug: string; entity_type: string; updated_at: string }> | null) ?? []).map(
            (entity) => ({
                url: `${siteUrl}/history/${entity.entity_type}/${entity.slug}`,
                lastModified: new Date(entity.updated_at),
                changeFrequency: "weekly",
                priority: 0.6,
            })
        );

    const historyTypePages: MetadataRoute.Sitemap = Array.from(
        new Set(
            ((historyEntitiesData as Array<{ entity_type: string }> | null) ?? []).map((entity) => entity.entity_type)
        )
    ).map((entityType) => ({
        url: `${siteUrl}/history/${entityType}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.55,
    }));

    const { data: historyTimelinesData } = await supabase
        .from("history_timelines")
        .select("slug, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

    const historyTimelinePages: MetadataRoute.Sitemap =
        ((historyTimelinesData as Array<{ slug: string; created_at: string }> | null) ?? []).map((timeline) => ({
            url: `${siteUrl}/history/timelines/${timeline.slug}`,
            lastModified: new Date(timeline.created_at),
            changeFrequency: "weekly",
            priority: 0.5,
        }));

    return [
        ...staticPages,
        ...masterPages,
        ...traditionPages,
        ...textPages,
        ...dynamicExplorePages,
        ...dynamicTopicsPages,
        ...historyTypePages,
        ...historyEntityPages,
        ...historyTimelinePages,
    ];
}
