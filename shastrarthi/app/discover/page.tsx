import { redirect } from "next/navigation";

interface LegacyDiscoverRedirectProps {
    searchParams?: Record<string, string | string[] | undefined>;
}

export default function LegacyDiscoverRedirect({ searchParams }: LegacyDiscoverRedirectProps) {
    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams ?? {})) {
        if (value === undefined) continue;
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
        } else {
            params.set(key, value);
        }
    }

    const query = params.toString();
    redirect(query ? `/app/discover?${query}` : "/app/discover");
}
