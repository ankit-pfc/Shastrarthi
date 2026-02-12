import NotebooksPageClient from "@/components/notebooks/NotebooksPageClient";
import { requireUser } from "@/lib/server-supabase";
import type { Notebook } from "@/lib/supabase";

export default async function AppNotebooksPage() {
    const { supabase, user } = await requireUser();
    const { data } = await supabase
        .from("notebooks")
        .select("id, title, content")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    return <NotebooksPageClient initialNotebooks={(data ?? []) as Notebook[]} />;
}
