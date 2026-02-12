import { getSiteUrl } from "@/lib/site";
import { createClient } from "@supabase/supabase-js";
function createPublicSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey)
        return null;
    return createClient(url, anonKey);
}
export default async function sitemap() {
    var _a, _b, _c, _d;
    const siteUrl = getSiteUrl();
    const lastModified = new Date();
    const staticRoutes = [
        "",
        "/about",
        "/explore",
        "/topics",
        "/history",
        "/pricing",
        "/traditions",
        "/privacy",
        "/terms",
    ];
    const baseEntries = staticRoutes.map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
    }));
    const supabase = createPublicSupabase();
    if (!supabase)
        return baseEntries;
    const { data } = await supabase
        .from("public_pages")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false })
        .limit(1000);
    const exploreEntries = ((_a = data) !== null && _a !== void 0 ? _a : []).map((page) => ({
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
    const topicsEntries = ((_b = topicsData) !== null && _b !== void 0 ? _b : []).map((topic) => ({
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
    const historyEntitiesEntries = ((_c = historyEntitiesData) !== null && _c !== void 0 ? _c : []).map((entity) => ({
        url: `${siteUrl}/history/${entity.entity_type}/${entity.slug}`,
        lastModified: new Date(entity.updated_at),
        changeFrequency: "weekly",
        priority: 0.6,
    }));
    const { data: historyTimelinesData } = await supabase
        .from("history_timelines")
        .select("slug, created_at") // Timelines don't have updated_at yet
        .order("created_at", { ascending: false })
        .limit(1000);
    const historyTimelinesEntries = ((_d = historyTimelinesData) !== null && _d !== void 0 ? _d : []).map((timeline) => ({
        url: `${siteUrl}/history/timelines/${timeline.slug}`,
        lastModified: new Date(timeline.created_at),
        changeFrequency: "weekly",
        priority: 0.5,
    }));
    return [...baseEntries, ...exploreEntries, ...topicsEntries, ...historyEntitiesEntries, ...historyTimelinesEntries];
}
