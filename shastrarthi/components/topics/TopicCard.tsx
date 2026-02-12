import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Topic } from "@/lib/supabase"; // Assuming a Topic type exists in lib/supabase.ts
import { cn } from "@/lib/utils";

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  return (
    <Link href={`/topics/${topic.slug}`}>
      <Card className={cn("h-full transition-all hover:scale-[1.02]")}>
        <CardHeader>
          {topic.icon && <span className="text-4xl">{topic.icon}</span>}
          <CardTitle>{topic.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">
            {topic.description}
          </CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}