import AppLayout from "@/components/app/AppLayout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasSupabaseAuthCookie } from "@/lib/routing";

export default function AuthenticatedAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const cookieNames = cookieStore.getAll().map((cookie) => cookie.name);
    const hasAuth = hasSupabaseAuthCookie(cookieNames);

    if (!hasAuth) {
        redirect("/auth/login?redirect=/app");
    }

    return <AppLayout>{children}</AppLayout>;
}
