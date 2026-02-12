import type { HistoryEntity } from "@/lib/supabase";
import EntityCard from "@/components/history/EntityCard";

interface RelatedEntitiesProps {
    entities: HistoryEntity[];
    title?: string;
}

export default function RelatedEntities({ entities, title = "Related Entities" }: RelatedEntitiesProps) {
    if (!entities.length) return null;

    return (
        <section className="mt-10">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">{title}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {entities.map((entity) => (
                    <EntityCard key={entity.id} entity={entity} />
                ))}
            </div>
        </section>
    );
}
