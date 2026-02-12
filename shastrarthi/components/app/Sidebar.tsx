"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAV_ITEMS, RECENT_CHATS } from "@/lib/config/nav";

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const saved = window.localStorage.getItem("shastrarthi.sidebar.collapsed");
        if (saved) {
            setCollapsed(saved === "true");
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("shastrarthi.sidebar.collapsed", String(collapsed));
    }, [collapsed]);

    const isReader = useMemo(() => pathname?.startsWith("/app/reader/"), [pathname]);

    useEffect(() => {
        if (isReader) {
            setCollapsed(true);
        }
    }, [isReader]);

    return (
        <aside
            className={cn(
                "h-screen border-r border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 flex flex-col transition-all duration-300",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className="p-3 border-b border-gray-100">
                <div className="flex items-center justify-between gap-2">
                    <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
                        <BookOpen className="h-5 w-5 text-orange-600" />
                        {!collapsed && <span className="text-sm font-semibold text-gray-900">SHASTRARTHI</span>}
                    </Link>
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600"
                            aria-label="Close Sidebar"
                            title="Close Sidebar"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                    )}
                </div>
                {!collapsed && (
                    <Link
                        href="/app/chat"
                        className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 text-sm font-medium"
                    >
                        + New Chat
                    </Link>
                )}
                {collapsed && (
                    <button
                        onClick={() => setCollapsed(false)}
                        className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2"
                        aria-label="Open Sidebar"
                        title="Open Sidebar"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3">
                <div className="space-y-1">
                    {APP_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-lg px-2.5 py-2 text-sm transition-colors",
                                    active
                                        ? "bg-orange-50 text-orange-700"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                    collapsed && "justify-center"
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className="h-4 w-4 shrink-0" />
                                {!collapsed && <span className="ml-2.5">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {!collapsed && (
                    <div className="mt-6">
                        <p className="px-2.5 mb-2 text-xs text-gray-500 uppercase tracking-wide">Recent Chats</p>
                        <div className="space-y-1">
                            {RECENT_CHATS.map((chat) => (
                                <Link
                                    key={chat}
                                    href={`/app/chat?q=${encodeURIComponent(chat)}`}
                                    className="block rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 truncate"
                                >
                                    {chat}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </nav>

            <div className={cn("border-t border-gray-100 p-3", collapsed ? "text-center" : "")}>
                {!collapsed ? (
                    <div>
                        <p className="text-sm font-medium text-gray-900">Ankit Mishra</p>
                        <p className="text-xs text-gray-500 truncate">ankit.m309@gmail.com</p>
                    </div>
                ) : (
                    <div className="mx-auto h-8 w-8 rounded-full bg-orange-100 text-orange-700 grid place-items-center text-xs font-semibold">
                        AM
                    </div>
                )}
            </div>
        </aside>
    );
}
