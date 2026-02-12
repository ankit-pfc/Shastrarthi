import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    const siteUrl = getSiteUrl();

    return {
        rules: [
            {
                userAgent: "*",
                allow: [
                    "/",
                    "/about",
                    "/traditions",
                    "/explore",
                    "/explore/",
                    "/topics",
                    "/topics/",
                    "/history",
                    "/history/",
                ],
                disallow: [
                    "/app/",
                    "/api/",
                    "/auth/",
                    "/auth/callback",
                ],
            },
        ],
        sitemap: `${siteUrl}/sitemap.xml`,
        host: siteUrl,
    };
}

