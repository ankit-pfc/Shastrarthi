import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryEntity } from "@/lib/supabase";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  entity: HistoryEntity;
}

export function EntityCard({ entity }: EntityCardProps) {
  const href = `/history/${entity.entity_type}/${entity.slug}`;
  return (
    <Link href={href}>
      <Card className={cn("h-full transition-all hover:scale-[1.02]")}>
        {entity.featured_image_url && (
          <div className="relative h-48 w-full">
            <Image
              src={entity.featured_image_url}
              alt={entity.title}
              fill
              style={{ objectFit: "cover" }}
              className="rounded-t-lg"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{entity.title}</CardTitle>
          {entity.subtitle && <CardDescription>{entity.subtitle}</CardDescription>}
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">
            {entity.summary}
          </CardDescription>
          {entity.period_label && (
            <p className="mt-2 text-sm text-muted-foreground">Period: {entity.period_label}</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}