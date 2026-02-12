import { createClient } from "@/lib/supabase/server";
import { HistoryEntity, HistoryRelation, HistoryTimeline } from "@/lib/supabase";

export async function getHistoryEntities(type?: string, isPublished: boolean = true): Promise<HistoryEntity[]> {
  const supabase = createClient();
  let query = supabase.from("history_entities").select("*", { count: "exact" });

  if (type) {
    query = query.eq("entity_type", type);
  }
  if (isPublished) {
    query = query.eq("is_published", true);
  }

  const { data, error } = await query.order("title", { ascending: true });

  if (error) {
    console.error("Error fetching history entities:", error);
    return [];
  }

  return data as HistoryEntity[];
}

export async function getHistoryEntityBySlug(type: string, slug: string): Promise<HistoryEntity | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("history_entities")
    .select("*", { count: "exact" })
    .eq("entity_type", type)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error(`Error fetching history entity ${type}/${slug}:`, error);
    return null;
  }

  return data as HistoryEntity;
}

export async function getHistoryTimelines(isPublished: boolean = true): Promise<HistoryTimeline[]> {
  const supabase = createClient();
  let query = supabase.from("history_timelines").select("*", { count: "exact" });

  // For timelines, we might not have a direct 'is_published' column on the timeline itself,
  // but rather derive it from the entities it contains. For now, we assume all defined timelines are "published".
  // if (isPublished) { query = query.eq("is_published", true); }

  const { data, error } = await query.order("title", { ascending: true });

  if (error) {
    console.error("Error fetching history timelines:", error);
    return [];
  }

  return data as HistoryTimeline[];
}

export async function getHistoryTimelineBySlug(slug: string): Promise<HistoryTimeline | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("history_timelines")
    .select("*", { count: "exact" })
    .eq("slug", slug)
    .single();

  if (error) {
    console.error(`Error fetching history timeline ${slug}:`, error);
    return null;
  }

  return data as HistoryTimeline;
}

// TODO: Add functions for relations if needed directly for fetching, otherwise manage via entity updates
