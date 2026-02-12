import AppLayout from "@/components/app/AppLayout";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasSupabaseAuthCookie, isLocalhostHost } from "@/lib/routing";

export default function AuthenticatedAppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const headerStore = headers();
    const cookieNames = cookieStore.getAll().map((cookie) => cookie.name);
    const host = headerStore.get("host");
    const hasAuth = hasSupabaseAuthCookie(cookieNames);
    const bypassAuthForLocalhost = process.env.NODE_ENV !== "production" && isLocalhostHost(host);

    if (!hasAuth && !bypassAuthForLocalhost) {
        redirect("/auth/login?redirect=/app");
    }

    return <AppLayout>{children}</AppLayout>;
}
