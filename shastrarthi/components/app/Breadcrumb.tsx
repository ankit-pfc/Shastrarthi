"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const LABELS: Record<string, string> = {
    app: "Home",
    discover: "Text Discovery",
    reader: "Chat with Text",
    chat: "AI Chat",
    library: "My Library",
    notebooks: "Study Shastras",
    shastras: "Study Shastras",
    topics: "Explore Topics",
    gallery: "Guru Gallery",
    writer: "Shastra Writer",
    simplifier: "Simplifier",
    extract: "Extract Insights",
};

export default function Breadcrumb() {
    const pathname = usePathname();
    const parts = pathname?.split("/").filter(Boolean) || [];
    const appIndex = parts.findIndex((part) => part === "app");
    const scoped = appIndex >= 0 ? parts.slice(appIndex) : parts;

    return (
        <nav className="flex items-center gap-1 text-sm text-gray-500">
            {scoped.map((part, idx) => {
                const href = `/${scoped.slice(0, idx + 1).join("/")}`;
                const isLast = idx === scoped.length - 1;
                const label = LABELS[part] || decodeURIComponent(part).replace(/-/g, " ");
                return (
                    <span key={href} className="inline-flex items-center gap-1">
                        {idx > 0 && <ChevronRight className="h-3.5 w-3.5" />}
                        {isLast ? (
                            <span className="text-gray-700 capitalize">{label}</span>
                        ) : (
                            <Link href={href} className="hover:text-gray-700 capitalize">
                                {label}
                            </Link>
                        )}
                    </span>
                );
            })}
        </nav>
    );
}
