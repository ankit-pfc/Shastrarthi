"use client";

import { usePathname } from "next/navigation";
import Breadcrumb from "./Breadcrumb";

export default function TopBar() {
    const pathname = usePathname();
    const isChatPage = pathname === "/app" || pathname?.startsWith("/app/chat");

    if (isChatPage) return null;

    return (
        <div className="h-14 border-b border-gray-200 bg-white px-4 md:px-6 flex items-center justify-between shrink-0">
            <Breadcrumb />
            <div className="flex items-center gap-4 text-sm">
                {/* Pricing removed */}
            </div>
        </div>
    );
}
