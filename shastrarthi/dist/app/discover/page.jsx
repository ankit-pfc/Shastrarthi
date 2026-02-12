import { redirect } from "next/navigation";
export default function LegacyDiscoverRedirect({ searchParams }) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams !== null && searchParams !== void 0 ? searchParams : {})) {
        if (value === undefined)
            continue;
        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
        }
        else {
            params.set(key, value);
        }
    }
    const query = params.toString();
    redirect(query ? `/app/discover?${query}` : "/app/discover");
}
