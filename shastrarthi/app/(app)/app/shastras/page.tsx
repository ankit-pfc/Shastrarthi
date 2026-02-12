import ShastraBooksPageClient from "@/components/shastrabooks/ShastraBooksPageClient";
import { requireUser } from "@/lib/server-supabase";
import type { ShastraBook } from "@/lib/supabase";
import { redirect } from "next/navigation";

export default async function AppShastrasPage() {
    try {
        const { supabase, user } = await requireUser();
        const { data } = await supabase
            .from("notebooks")
            .select("id, title, content")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false });

        return <ShastraBooksPageClient initialShastraBooks={(data ?? []) as ShastraBook[]} />;
    } catch (error) {
        if (error instanceof Error && error.message === "UNAUTHORIZED") {
            redirect("/auth/login?redirect=/app/shastras");
        }
        return <ShastraBooksPageClient initialShastraBooks={[]} />;
    }
}
