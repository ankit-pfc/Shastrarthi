import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default async function TopicsPage() {
    const { data: texts } = await supabase
        .from("texts")
        .select("category, tradition")
        .order("category", { ascending: true });

    const topicMap = new Map<string, { title: string; query: string; description: string }>();

    (texts ?? []).forEach((text) => {
        if (text.category && !topicMap.has(`category-${text.category}`)) {
            topicMap.set(`category-${text.category}`, {
                title: text.category,
                query: text.category,
                description: `Explore key ideas across ${text.category} texts.`,
            });
        }
        if (text.tradition && !topicMap.has(`tradition-${text.tradition}`)) {
            topicMap.set(`tradition-${text.tradition}`, {
                title: `${text.tradition} Tradition`,
                query: text.tradition,
                description: `Study lineage-specific insights from ${text.tradition}.`,
            });
        }
    });

    const topics = Array.from(topicMap.values()).slice(0, 12);

    return (
        <div>
            <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Explore Topics</h1>
            <p className="text-gray-600 mb-6">Discover conceptual maps and cross-text connections.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic) => (
                    <Link
                        key={topic.title}
                        href={`/app/discover?q=${encodeURIComponent(topic.query)}`}
                        className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 hover:border-orange-300 transition-colors"
                    >
                        <h3 className="font-medium text-gray-900">{topic.title}</h3>
                        <p className="text-sm text-gray-600 mt-2">{topic.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
