import NotebooksPageClient from "@/components/notebooks/NotebooksPageClient";
import { requireUser } from "@/lib/server-supabase";
import type { Notebook } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function AppNotebooksPage() {
    try {
        const { supabase, user } = await requireUser();
        const { data } = await supabase
            .from("notebooks")
            .select("id, title, content")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        return <NotebooksPageClient initialNotebooks={(data ?? []) as Notebook[]} />;
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            redirect("/auth/login?redirect=/app/notebooks");
        }
        return <NotebooksPageClient initialNotebooks={[]} />;
    }
}
