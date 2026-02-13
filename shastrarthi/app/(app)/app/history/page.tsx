import TimelineView from "@/components/history/TimelineView";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function HistoryPage() {
    const supabase = createClient();

    // We should select entities with explicit years to show on timeline
    const { data: entities, error } = await supabase
        .from("history_entities")
        .select("id, title, slug, summary, entity_type, period_start_year, period_end_year")
        .not("period_start_year", "is", null)
        .order("period_start_year", { ascending: true })
        .limit(50);

    if (error) {
        console.error("Failed to fetch history entities:", error);
    }

    // Map to TimelineView format
    const items = (entities || []).map((entity: any) => ({
        entity: {
            id: entity.id,
            title: entity.title,
            slug: entity.slug,
            summary: entity.summary,
            entity_type: entity.entity_type,
            period_start_year: entity.period_start_year,
            period_end_year: entity.period_end_year,
        } as any,
        year: entity.period_start_year,
    }));

    return (
        <div className="max-w-4xl mx-auto pt-8 px-4 md:px-0">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Ancient History Timeline</h1>
            <p className="text-gray-600 mb-8 max-w-2xl">
                Explore the chronological development of Indian philosophy, texts, and key figures.
            </p>

            <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                {items.length > 0 ? (
                    <TimelineView items={items} />
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <p>No historical data available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
