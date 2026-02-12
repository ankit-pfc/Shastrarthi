import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@supabase/supabase-js";

function createPublicSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();
    const lastModified = new Date();

    const staticRoutes = [
        "",
        "/about",
        "/explore",
        "/pricing",
        "/traditions",
        "/privacy",
        "/terms",
    ];

    const baseEntries = staticRoutes.map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: path === "" ? 1 : 0.7,
    }));

    const supabase = createPublicSupabase();
    if (!supabase) return baseEntries;

    const { data } = await supabase
        .from("public_pages")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false })
        .limit(1000);
    const exploreEntries =
        ((data as Array<{ slug: string; updated_at: string }> | null) ?? []).map((page) => ({
            url: `${siteUrl}/explore/${page.slug}`,
            lastModified: new Date(page.updated_at),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));

    return [...baseEntries, ...exploreEntries];
}

