import Link from "next/link";
import type { HistoryEntity } from "@/lib/supabase";

interface EntityCardProps {
    entity: HistoryEntity;
}

function formatType(entityType: string): string {
    return entityType.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function EntityCard({ entity }: EntityCardProps) {
    return (
        <Link
            href={`/history/${entity.entity_type}/${entity.slug}`}
            className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-colors hover:border-orange-300"
        >
            <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[11px] font-semibold text-orange-800">
                    {formatType(entity.entity_type)}
                </span>
                {entity.period_label ? (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                        {entity.period_label}
                    </span>
                ) : null}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{entity.title}</h3>
            {entity.subtitle ? <p className="mt-1 text-sm text-gray-600">{entity.subtitle}</p> : null}
            {entity.summary ? <p className="mt-3 line-clamp-3 text-sm text-gray-700">{entity.summary}</p> : null}
        </Link>
    );
}
