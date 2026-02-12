import { Heading } from "@/components/ui/heading";
import { Shell } from "@/components/shell";
import { createClient } from "@/lib/supabase/server";
import { TopicCard } from "@/components/topics/TopicCard";
export default async function TopicsPage() {
    const supabase = createClient();
    const { data: topics, error } = await supabase
        .from("topics")
        .select("id, slug, name, description, icon, category")
        .order("sort_order", { ascending: true });
    if (error) {
        console.error("Error fetching topics:", error);
        return <p>Error loading topics.</p>;
    }
    return (<Shell className="max-w-screen-xl">
      <Heading title="Explore Topics" description="Dive deeper into various traditions, concepts, and practices."/>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {topics.map((topic) => (<TopicCard key={topic.id} topic={topic}/>))}
      </div>
    </Shell>);
}
