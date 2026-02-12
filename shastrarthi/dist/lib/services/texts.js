import { supabase } from "@/lib/supabase";
async function measure(label, fn) {
    const start = Date.now();
    const result = await fn();
    const elapsedMs = Date.now() - start;
    if (elapsedMs > 300) {
        console.warn(`[perf] slow_query ${label} took ${elapsedMs}ms`);
    }
    return result;
}
export async function fetchTexts(filters = {}) {
    return measure("fetchTexts", async () => {
        let query = supabase.from("texts").select("*");
        if (filters.category) {
            query = query.eq("category", filters.category);
        }
        if (filters.difficulty) {
            query = query.eq("difficulty", filters.difficulty);
        }
        if (filters.search) {
            query = query.or(`title_en.ilike.%${filters.search}%,title_sa.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }
        if (filters.limit) {
            query = query.limit(filters.limit);
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) {
            throw new Error(`Failed to load texts: ${error.message}`);
        }
        return data !== null && data !== void 0 ? data : [];
    });
}
export async function searchTextsByQuery(query, limit = 20) {
    return fetchTexts({ search: query, limit });
}
export async function fetchTextsByIds(ids) {
    const unique = Array.from(new Set(ids)).filter(Boolean);
    if (unique.length === 0)
        return [];
    return measure("fetchTextsByIds", async () => {
        const { data, error } = await supabase
            .from("texts")
            .select("*")
            .in("id", unique)
            .limit(Math.min(unique.length, 50));
        if (error) {
            throw new Error(`Failed to load texts by ids: ${error.message}`);
        }
        return data !== null && data !== void 0 ? data : [];
    });
}
