import LibraryPageClient, { type LibraryData } from "@/components/library/LibraryPageClient";
import { requireUser } from "@/lib/server-supabase";

export default async function AppLibraryPage() {
    const { supabase, user } = await requireUser();
    const db = supabase as any;

    const [{ data: savedTexts }, { data: bookmarks }, { data: notes }] = await Promise.all([
        db
            .from("user_texts")
            .select("saved_at, text:texts(id, slug, title_en, title_sa, category, verse_count)")
            .eq("user_id", user.id)
            .order("saved_at", { ascending: false }),
        db
            .from("bookmarks")
            .select("id, created_at, verse:verses(ref, translation_en, text:texts(slug, title_en))")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        db
            .from("notes")
            .select("id, content, created_at, verse:verses(ref, translation_en, text:texts(slug, title_en))")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false }),
    ]);

    const initialData: LibraryData = {
        savedTexts: (savedTexts ?? []).map((row: any) => row.text).filter(Boolean),
        bookmarks: (bookmarks ?? []).map((row: any) => ({
            id: row.id,
            verseRef: row.verse?.ref ?? "",
            verseTranslation: row.verse?.translation_en ?? "",
            textSlug: row.verse?.text?.slug ?? "",
            textTitle: row.verse?.text?.title_en ?? "",
            createdAt: row.created_at,
        })),
        notes: (notes ?? []).map((row: any) => ({
            id: row.id,
            content: row.content,
            verseRef: row.verse?.ref ?? "",
            verseTranslation: row.verse?.translation_en ?? "",
            textSlug: row.verse?.text?.slug ?? "",
            textTitle: row.verse?.text?.title_en ?? "",
            createdAt: row.created_at,
        })),
    };

    return <LibraryPageClient initialData={initialData} />;
}
