import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import JsonLd from "@/components/seo/JsonLd";
export const revalidate = 3600;
export const metadata = {
    title: "Explore Meanings and Translations",
    description: "Browse simplified and translated Shastra passages across languages, with contextual explanations generated on Shastrarthi.",
    alternates: { canonical: "/explore" },
};
function createPublicSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey)
        return null;
    return createClient(url, anonKey);
}
export default async function ExploreLandingPage() {
    var _a;
    const supabase = createPublicSupabase();
    const { data } = supabase
        ? await supabase
            .from("public_pages")
            .select("slug, title, mode, language")
            .order("created_at", { ascending: false })
            .limit(24)
        : { data: [] };
    const list = (_a = data) !== null && _a !== void 0 ? _a : [];
    const itemListJsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Shastra Explainers",
        itemListElement: list.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            url: `/explore/${item.slug}`,
            name: item.title,
        })),
    };
    return (<main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <JsonLd data={itemListJsonLd}/>
            <div className="container mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Explore Meanings and Translations</h1>
                <p className="text-gray-600 mb-8 max-w-3xl">
                    Public, indexable pages generated from simplify and translate requests.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map((item) => (<Link key={item.slug} href={`/explore/${item.slug}`} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:border-orange-300 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-medium">
                                    {item.mode === "translate" ? "Translate" : "Simplify"}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium">
                                    {item.language}
                                </span>
                            </div>
                            <p className="font-medium text-gray-900">{item.title}</p>
                        </Link>))}
                </div>
            </div>
        </main>);
}
