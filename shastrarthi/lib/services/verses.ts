import { supabase } from "@/lib/supabase";

export type VerseSearchRow = {
    id: string;
    ref: string;
    order_index: number;
    sanskrit: string | null;
    transliteration: string | null;
    translation_en: string;
    text_id: string;
    text: {
        slug: string;
        title_en: string;
        category: string;
        tradition: string | null;
    } | null;
};

type RawVerseSearchRow = Omit<VerseSearchRow, "text"> & {
    text:
        | VerseSearchRow["text"]
        | Array<{
              slug: string;
              title_en: string;
              category: string;
              tradition: string | null;
          }>;
};

async function measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    const result = await fn();
    const elapsedMs = Date.now() - start;
    if (elapsedMs > 300) {
        console.warn(`[perf] slow_query ${label} took ${elapsedMs}ms`);
    }
    return result;
}

export async function searchVersesByQuery(query: string, limit = 30): Promise<VerseSearchRow[]> {
    const q = query.trim();
    if (!q) return [];

    return measure("searchVersesByQuery", async () => {
        const { data, error } = await supabase
            .from("verses")
            // Join basic text metadata for display + linking.
            .select(
                "id, ref, order_index, sanskrit, transliteration, translation_en, text_id, text:texts(slug, title_en, category, tradition)"
            )
            .or(
                `ref.ilike.%${q}%,translation_en.ilike.%${q}%,transliteration.ilike.%${q}%,sanskrit.ilike.%${q}%`
            )
            .limit(limit);

        if (error) {
            throw new Error(`Failed to search verses: ${error.message}`);
        }

        const rows = (data ?? []) as RawVerseSearchRow[];
        return rows.map((row) => ({
            ...row,
            text: Array.isArray(row.text) ? (row.text[0] ?? null) : row.text,
        }));
    });
}

