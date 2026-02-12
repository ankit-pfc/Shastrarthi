import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
export function TopicCard({ topic }) {
    return (<Link href={`/topics/${topic.slug}`}>
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
    </Link>);
}
