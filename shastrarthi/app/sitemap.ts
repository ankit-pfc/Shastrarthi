import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const siteUrl = getSiteUrl();
    const lastModified = new Date();

    // Keep this intentionally conservative until public, crawlable text/verse pages exist.
    const routes = [
        "",
        "/about",
        "/pricing",
        "/traditions",
    ];

    return routes.map((path) => ({
        url: `${siteUrl}${path}`,
        lastModified,
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.7,
    }));
}

