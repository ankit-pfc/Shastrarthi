const DEFAULT_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(rawUrl: string): string | null {
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;

    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

    try {
        return new URL(withProtocol).toString().replace(/\/+$/, "");
    } catch {
        return null;
    }
}

export function getSiteUrl(): string {
    const envUrl = process.env.NEXT_PUBLIC_APP_URL;
    const normalizedEnvUrl = envUrl ? normalizeSiteUrl(envUrl) : null;
    if (normalizedEnvUrl) return normalizedEnvUrl;

    const vercelUrl = process.env.VERCEL_URL;
    const normalizedVercelUrl = vercelUrl ? normalizeSiteUrl(vercelUrl) : null;
    if (normalizedVercelUrl) return normalizedVercelUrl;

    return DEFAULT_SITE_URL;
}

