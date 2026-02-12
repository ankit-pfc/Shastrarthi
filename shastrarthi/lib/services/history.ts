import { createClient } from "@supabase/supabase-js";
import type { HistoryEntity, HistoryTimeline } from "@/lib/supabase";

function createPublicSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey) return null;
    return createClient(url, anonKey);
}

export async function getPublishedHistoryEntities(type?: string): Promise<HistoryEntity[]> {
    const supabase = createPublicSupabase();
    if (!supabase) return [];

    let query = supabase
        .from("history_entities")
        .select("*")
        .eq("is_published", true)
        .order("updated_at", { ascending: false });

    if (type) {
        query = query.eq("entity_type", type);
    }

    const { data, error } = await query.limit(1000);
    if (error || !data) return [];
    return data as HistoryEntity[];
}

export async function getHistoryEntityBySlug(type: string, slug: string): Promise<HistoryEntity | null> {
    const supabase = createPublicSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from("history_entities")
        .select("*")
        .eq("is_published", true)
        .eq("entity_type", type)
        .eq("slug", slug)
        .single();

    if (error || !data) return null;
    return data as HistoryEntity;
}

export async function getPublishedHistoryTypes(): Promise<string[]> {
    const entities = await getPublishedHistoryEntities();
    return Array.from(new Set(entities.map((entity) => entity.entity_type))).sort();
}

export async function getPublishedTimelines(): Promise<HistoryTimeline[]> {
    const supabase = createPublicSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("history_timelines")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);

    if (error || !data) return [];
    return data as HistoryTimeline[];
}

export async function getTimelineBySlug(slug: string): Promise<HistoryTimeline | null> {
    const supabase = createPublicSupabase();
    if (!supabase) return null;

    const { data, error } = await supabase.from("history_timelines").select("*").eq("slug", slug).single();
    if (error || !data) return null;
    return data as HistoryTimeline;
}

export async function getEntitiesByIds(ids: string[]): Promise<HistoryEntity[]> {
    if (!ids.length) return [];
    const supabase = createPublicSupabase();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from("history_entities")
        .select("*")
        .eq("is_published", true)
        .in("id", ids)
        .limit(500);

    if (error || !data) return [];
    return data as HistoryEntity[];
}
