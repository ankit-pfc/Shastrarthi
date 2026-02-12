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
export async function searchVersesByQuery(query, limit = 30) {
    const q = query.trim();
    if (!q)
        return [];
    return measure("searchVersesByQuery", async () => {
        const { data, error } = await supabase
            .from("verses")
            // Join basic text metadata for display + linking.
            .select("id, ref, order_index, sanskrit, transliteration, translation_en, text_id, text:texts(slug, title_en, category, tradition)")
            .or(`ref.ilike.%${q}%,translation_en.ilike.%${q}%,transliteration.ilike.%${q}%,sanskrit.ilike.%${q}%`)
            .limit(limit);
        if (error) {
            throw new Error(`Failed to search verses: ${error.message}`);
        }
        return (data !== null && data !== void 0 ? data : []);
    });
}
