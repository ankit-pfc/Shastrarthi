import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site";
export const revalidate = 3600;
function createPublicSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anonKey)
        return null;
    return createClient(url, anonKey);
}
async function fetchPublicPage(slug) {
    const supabase = createPublicSupabase();
    if (!supabase)
        return null;
    const { data, error } = await supabase
        .from("public_pages")
        .select("slug, title, content, mode, language, meta_description, created_at")
        .eq("slug", slug)
        .single();
    if (error || !data)
        return null;
    return data;
}
async function fetchRelatedPages(slug, mode, language) {
    var _a;
    const supabase = createPublicSupabase();
    if (!supabase)
        return [];
    const { data } = await supabase
        .from("public_pages")
        .select("slug, title")
        .neq("slug", slug)
        .eq("mode", mode)
        .eq("language", language)
        .order("created_at", { ascending: false })
        .limit(5);
    return (_a = data) !== null && _a !== void 0 ? _a : [];
}
export async function generateStaticParams() {
    var _a;
    const supabase = createPublicSupabase();
    if (!supabase)
        return [];
    const { data } = await supabase.from("public_pages").select("slug").order("created_at", { ascending: false }).limit(300);
    return ((_a = data) !== null && _a !== void 0 ? _a : []).map((row) => ({ slug: row.slug }));
}
export async function generateMetadata({ params }) {
    const slug = decodeURIComponent(params.slug);
    const page = await fetchPublicPage(slug);
    const canonical = `/explore/${params.slug}`;
    if (!page) {
        return {
            title: "Explore Shastra Meanings",
            robots: { index: false, follow: false },
            alternates: { canonical },
        };
    }
    const title = page.title;
    const description = page.meta_description ||
        `Read a ${page.mode === "translate" ? "translation" : "simplified explanation"} in ${page.language} on Shastrarthi.`;
    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "article",
            images: [{ url: "/opengraph-image" }],
        },
        twitter: {
            title,
            description,
            images: ["/twitter-image"],
        },
    };
}
export default async function ExplorePage({ params }) {
    const slug = decodeURIComponent(params.slug);
    const page = await fetchPublicPage(slug);
    if (!page)
        notFound();
    const related = await fetchRelatedPages(page.slug, page.mode, page.language);
    const siteUrl = getSiteUrl();
    const pageUrl = `${siteUrl}/explore/${page.slug}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: page.title,
        inLanguage: page.language,
        datePublished: page.created_at,
        dateModified: page.created_at,
        mainEntityOfPage: pageUrl,
        url: pageUrl,
        description: page.meta_description || page.content.slice(0, 160),
        publisher: {
            "@type": "Organization",
            name: "Shastrarthi",
            url: siteUrl,
        },
        breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
                { "@type": "ListItem", position: 2, name: "Explore", item: `${siteUrl}/explore` },
                { "@type": "ListItem", position: 3, name: page.title, item: pageUrl },
            ],
        },
    };
    return (<main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <JsonLd data={jsonLd}/>
            <div className="container mx-auto px-4 py-12">
                <nav className="text-sm text-gray-500 mb-4">
                    <Link href="/" className="hover:text-gray-700">
                        Home
                    </Link>
                    {" / "}
                    <span>Explore</span>
                </nav>

                <article className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="text-xs font-medium rounded-full bg-orange-100 text-orange-800 px-3 py-1">
                            {page.mode === "translate" ? "Translate" : "Simplify"}
                        </span>
                        <span className="text-xs font-medium rounded-full bg-gray-100 text-gray-700 px-3 py-1">
                            {page.language}
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{page.title}</h1>
                    <div className="prose prose-gray max-w-none whitespace-pre-wrap text-gray-800">{page.content}</div>
                </article>

                {related.length > 0 ? (<section className="mt-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Related explanations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {related.map((item) => (<Link key={item.slug} href={`/explore/${item.slug}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors">
                                    <p className="font-medium text-gray-900">{item.title}</p>
                                </Link>))}
                        </div>
                    </section>) : null}
            </div>
        </main>);
}
