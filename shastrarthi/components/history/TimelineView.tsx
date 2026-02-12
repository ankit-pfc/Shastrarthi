import Link from "next/link";
import type { HistoryEntity } from "@/lib/supabase";

interface TimelineViewProps {
    items: Array<{
        entity: HistoryEntity;
        year: number | null;
    }>;
}

export default function TimelineView({ items }: TimelineViewProps) {
    if (!items.length) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-5 text-sm text-gray-600">
                No timeline events are available yet.
            </div>
        );
    }

    const sorted = [...items].sort((a, b) => {
        const aYear = a.year ?? Number.MAX_SAFE_INTEGER;
        const bYear = b.year ?? Number.MAX_SAFE_INTEGER;
        return aYear - bYear;
    });

    return (
        <ol className="relative border-s border-orange-200 pl-6">
            {sorted.map((item) => (
                <li key={item.entity.id} className="mb-6 ms-2">
                    <span className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full bg-orange-500" />
                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-700">
                        {item.year != null ? item.year : "Undated"}
                    </p>
                    <Link
                        href={`/history/${item.entity.entity_type}/${item.entity.slug}`}
                        className="text-base font-semibold text-gray-900 hover:text-orange-700"
                    >
                        {item.entity.title}
                    </Link>
                    {item.entity.summary ? <p className="mt-1 text-sm text-gray-700">{item.entity.summary}</p> : null}
                </li>
            ))}
        </ol>
    );
}
