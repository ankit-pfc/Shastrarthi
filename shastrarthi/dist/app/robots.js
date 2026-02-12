import { getSiteUrl } from "@/lib/site";
export default function robots() {
    const siteUrl = getSiteUrl();
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/explore", "/explore/", "/topics", "/topics/", "/history", "/history/"],
                disallow: [
                    "/app",
                    "/app/",
                    "/api",
                    "/api/",
                    "/auth/callback",
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}
