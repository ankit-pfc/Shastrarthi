const DEFAULT_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (!envUrl) return DEFAULT_SITE_URL;

    return envUrl.replace(/\/+$/, "");
}

