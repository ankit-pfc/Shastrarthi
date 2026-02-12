"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAV_ITEMS } from "@/lib/config/nav";
import { supabase } from "@/lib/supabase";

interface ThreadSummary {
    id: string;
    title: string;
}

interface SidebarUser {
    name: string;
    email: string;
}

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [recentThreads, setRecentThreads] = useState<ThreadSummary[]>([]);
    const [userInfo, setUserInfo] = useState<SidebarUser | null>(null);

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

    useEffect(() => {
        const loadRecentThreads = async () => {
            try {
                const response = await fetch("/api/chat/threads");
                if (!response.ok) {
                    setRecentThreads([]);
                    return;
                }

                const payload = (await response.json()) as {
                    data?: Array<{ id?: string; title?: string }>;
                };
                const threads = (payload.data ?? [])
                    .filter((item): item is { id: string; title: string } => Boolean(item.id && item.title))
                    .slice(0, 8);
                setRecentThreads(threads);
            } catch (error) {
                console.error("Failed loading recent threads:", error);
                setRecentThreads([]);
            }
        };

        void loadRecentThreads();
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (!user) {
                    setUserInfo(null);
                    return;
                }

                let profileName: string | null = null;
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("name")
                    .eq("id", user.id)
                    .maybeSingle();
                profileName = profile?.name ?? null;

                const fallbackName =
                    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
                    user.email?.split("@")[0] ||
                    "User";

                setUserInfo({
                    name: profileName || fallbackName,
                    email: user.email ?? "No email",
                });
            } catch (error) {
                console.error("Failed loading user info:", error);
                setUserInfo(null);
            }
        };

        void loadUser();
    }, []);

    const userInitials = useMemo(() => {
        const source = userInfo?.name || userInfo?.email || "User";
        return source
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part[0]?.toUpperCase() ?? "")
            .join("");
    }, [userInfo]);

    return (
        <aside
            className={cn(
                "h-screen border-r border-gray-200 bg-white sticky top-0 flex flex-col transition-all duration-300",
                collapsed ? "w-[52px]" : "w-60"
            )}
        >
            {/* Logo + toggle header */}
            <div className="px-3 py-3.5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
                        <span className="font-devanagari text-xl font-bold text-gray-900 leading-none shrink-0" aria-hidden="true">श</span>
                        {!collapsed && (
                            <span className="text-xs font-bold tracking-widest text-gray-900 uppercase">
                                Shastrarthi
                            </span>
                        )}
                    </Link>
                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(true)}
                            className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
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
                        className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5"
                        aria-label="Open Sidebar"
                        title="Open Sidebar"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-2 py-2">
                <div className="space-y-0.5">
                    {APP_NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "group flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
                                    active
                                        ? "bg-orange-50 text-orange-700 font-medium"
                                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                                    collapsed && "justify-center px-0"
                                )}
                                title={collapsed ? item.label : undefined}
                            >
                                <Icon className="h-[18px] w-[18px] shrink-0" />
                                {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                            </Link>
                        );
                    })}
                </div>

                {!collapsed && (
                    <div className="mt-5">
                        <p className="px-3 mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            Recent Chats
                        </p>
                        <div className="space-y-0.5">
                            {recentThreads.length > 0 ? (
                                recentThreads.map((chat) => (
                                    <Link
                                        key={chat.id}
                                        href={`/app/chat/${chat.id}`}
                                        className="block rounded-lg px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-100 hover:text-gray-700 truncate"
                                    >
                                        {chat.title}
                                    </Link>
                                ))
                            ) : (
                                <p className="px-3 py-1.5 text-sm text-gray-400">No recent chats yet.</p>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            {/* User footer */}
            <div className={cn("border-t border-gray-100 px-3 py-2.5", collapsed && "flex justify-center")}>
                {!collapsed ? (
                    <div>
                        <p className="text-sm font-medium text-gray-900">{userInfo?.name ?? "Guest"}</p>
                        <p className="text-xs text-gray-400 truncate">{userInfo?.email ?? "Not signed in"}</p>
                    </div>
                ) : (
                    <div className="h-7 w-7 rounded-full bg-orange-100 text-orange-700 grid place-items-center text-[10px] font-semibold">
                        {userInitials || "U"}
                    </div>
                )}
            </div>
        </aside>
    );
}
