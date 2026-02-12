import Link from "next/link";
import { HistoryEntity } from "@/lib/supabase";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface RelatedEntitiesProps {
  entities: HistoryEntity[];
  title?: string;
}

export function RelatedEntities({ entities, title = "Related Entities" }: RelatedEntitiesProps) {
  if (!entities || entities.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entities.map((entity) => (
          <Link key={entity.id} href={`/history/${entity.entity_type}/${entity.slug}`}>
            <Card>
              <CardHeader>
                <CardTitle>{entity.title}</CardTitle>
                <CardDescription>{entity.summary}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}