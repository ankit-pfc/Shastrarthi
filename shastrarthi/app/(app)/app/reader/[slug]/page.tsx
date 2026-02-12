import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ReaderWorkspace from "@/components/reader/ReaderWorkspace";

interface ReaderPageProps {
    params: { slug: string };
}

async function fetchTextForReader(slug: string) {
    return supabase
        .from("texts")
        .select("id, title_en, title_sa, category")
        .eq("slug", slug)
        .single();
}

export async function generateMetadata({ params }: ReaderPageProps): Promise<Metadata> {
    const slug = decodeURIComponent(params.slug);

    const { data: text } = await fetchTextForReader(slug);

    if (!text) {
        return {
            title: "Reader",
            robots: { index: false, follow: false },
            alternates: { canonical: `/app/reader/${params.slug}` },
        };
    }

    const title = `Read ${text.title_en}`;
    const description = `Read ${text.title_en} verse-by-verse with Sanskrit, translation, and AI-guided explanations across traditions.`;

    return {
        title,
        description,
        robots: { index: false, follow: false },
        alternates: { canonical: `/app/reader/${params.slug}` },
        openGraph: {
            title,
            description,
            url: `/app/reader/${params.slug}`,
            images: [{ url: "/opengraph-image" }],
        },
        twitter: {
            title,
            description,
            images: ["/twitter-image"],
        },
    };
}

export default async function AppReaderPage({ params }: ReaderPageProps) {
    const slug = decodeURIComponent(params.slug);

    const { data: text, error: textError } = await fetchTextForReader(slug);

    if (textError || !text) {
        notFound();
    }

    const { data: verses, error: versesError } = await supabase
        .from("verses")
        .select("id, ref, sanskrit, transliteration, translation_en, order_index")
        .eq("text_id", text.id)
        .order("order_index", { ascending: true });

    if (versesError) {
        console.error("Reader verses fetch failed:", versesError);
    }

    return (
        <ReaderWorkspace
            text={{
                ...text,
                verses: verses ?? [],
            }}
        />
    );
}
