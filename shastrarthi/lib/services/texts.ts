import { supabase, type Text } from "@/lib/supabase";

interface TextFilters {
    category?: string | null;
    difficulty?: string | null;
    search?: string | null;
    limit?: number;
}

async function measure<T>(label: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now();
    const result = await fn();
    const elapsedMs = Date.now() - start;
    if (elapsedMs > 300) {
        console.warn(`[perf] slow_query ${label} took ${elapsedMs}ms`);
    }
    return result;
}

export async function fetchTexts(filters: TextFilters = {}): Promise<Text[]> {
    return measure("fetchTexts", async () => {
        let query = supabase.from("texts").select("*");

        if (filters.category) {
            query = query.eq("category", filters.category);
        }

        if (filters.difficulty) {
            query = query.eq("difficulty", filters.difficulty);
        }

        if (filters.search) {
            query = query.or(
                `title_en.ilike.%${filters.search}%,title_sa.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
            );
        }

        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query.order("created_at", { ascending: false });

        if (error) {
            throw new Error(`Failed to load texts: ${error.message}`);
        }

        return data ?? [];
    });
}

export async function searchTextsByQuery(query: string, limit = 20): Promise<Text[]> {
    return fetchTexts({ search: query, limit });
}
