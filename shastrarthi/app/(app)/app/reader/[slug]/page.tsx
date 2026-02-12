import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReaderWorkspace from "@/components/reader/ReaderWorkspace";

interface ReaderPageProps {
    params: { slug: string };
}

export default async function AppReaderPage({ params }: ReaderPageProps) {
    const slug = decodeURIComponent(params.slug);

    const { data: text, error: textError } = await supabase
        .from("texts")
        .select("id, title_en, title_sa, category")
        .eq("slug", slug)
        .single();

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
