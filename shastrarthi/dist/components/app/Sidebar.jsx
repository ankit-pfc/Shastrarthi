"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAV_ITEMS } from "@/lib/config/nav";
import { supabase } from "@/lib/supabase";
export default function Sidebar() {
    var _a, _b;
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [recentThreads, setRecentThreads] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const [editingThreadId, setEditingThreadId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");
    const [threadActionError, setThreadActionError] = useState(null);
    useEffect(() => {
        const saved = window.localStorage.getItem("shastrarthi.sidebar.collapsed");
        if (saved) {
            setCollapsed(saved === "true");
        }
    }, []);
    useEffect(() => {
        window.localStorage.setItem("shastrarthi.sidebar.collapsed", String(collapsed));
    }, [collapsed]);
    const isReader = useMemo(() => pathname === null || pathname === void 0 ? void 0 : pathname.startsWith("/app/reader/"), [pathname]);
    useEffect(() => {
        if (isReader) {
            setCollapsed(true);
        }
    }, [isReader]);
    const loadRecentThreads = async () => {
        var _a;
        try {
            const response = await fetch("/api/chat/threads");
            if (!response.ok) {
                setRecentThreads([]);
                return;
            }
            const payload = (await response.json());
            const threads = ((_a = payload.data) !== null && _a !== void 0 ? _a : [])
                .filter((item) => Boolean(item.id && item.title))
                .slice(0, 8);
            setRecentThreads(threads);
        }
        catch (error) {
            console.error("Failed loading recent threads:", error);
            setRecentThreads([]);
        }
    };
    useEffect(() => {
        void loadRecentThreads();
    }, []);
    const renameThread = async (threadId) => {
        var _a;
        const title = editingTitle.trim();
        if (!title) {
            setThreadActionError("Thread title cannot be empty.");
            return;
        }
        try {
            const response = await fetch(`/api/chat/threads/${threadId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title }),
            });
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                const message = (_a = payload.error) !== null && _a !== void 0 ? _a : "Failed to rename thread.";
                setThreadActionError(message);
                return;
            }
            setRecentThreads((prev) => prev.map((thread) => (thread.id === threadId ? Object.assign(Object.assign({}, thread), { title }) : thread)));
            setEditingThreadId(null);
            setEditingTitle("");
            setThreadActionError(null);
        }
        catch (_b) {
            setThreadActionError("Failed to rename thread.");
        }
    };
    const deleteThread = async (threadId) => {
        var _a;
        const shouldDelete = window.confirm("Delete this chat thread? This action cannot be undone.");
        if (!shouldDelete)
            return;
        try {
            const response = await fetch(`/api/chat/threads/${threadId}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const payload = await response.json().catch(() => ({}));
                const message = (_a = payload.error) !== null && _a !== void 0 ? _a : "Failed to delete thread.";
                setThreadActionError(message);
                return;
            }
            setRecentThreads((prev) => prev.filter((thread) => thread.id !== threadId));
            setThreadActionError(null);
            if (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(`/app/chat/${threadId}`)) {
                router.push("/app/chat");
            }
        }
        catch (_b) {
            setThreadActionError("Failed to delete thread.");
        }
    };
    useEffect(() => {
        const loadUser = async () => {
            var _a, _b, _c, _d;
            try {
                const { data: { user }, } = await supabase.auth.getUser();
                if (!user) {
                    setUserInfo(null);
                    return;
                }
                let profileName = null;
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("name")
                    .eq("id", user.id)
                    .maybeSingle();
                profileName = (_a = profile === null || profile === void 0 ? void 0 : profile.name) !== null && _a !== void 0 ? _a : null;
                const fallbackName = (typeof ((_b = user.user_metadata) === null || _b === void 0 ? void 0 : _b.name) === "string" && user.user_metadata.name) ||
                    ((_c = user.email) === null || _c === void 0 ? void 0 : _c.split("@")[0]) ||
                    "User";
                setUserInfo({
                    name: profileName || fallbackName,
                    email: (_d = user.email) !== null && _d !== void 0 ? _d : "No email",
                });
            }
            catch (error) {
                console.error("Failed loading user info:", error);
                setUserInfo(null);
            }
        };
        void loadUser();
    }, []);
    const userInitials = useMemo(() => {
        const source = (userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) || (userInfo === null || userInfo === void 0 ? void 0 : userInfo.email) || "User";
        return source
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => { var _a, _b; return (_b = (_a = part[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()) !== null && _b !== void 0 ? _b : ""; })
            .join("");
    }, [userInfo]);
    return (<aside className={cn("h-screen border-r border-gray-200 bg-white sticky top-0 flex flex-col transition-all duration-300", collapsed ? "w-[52px]" : "w-60")}>
            {/* Logo + toggle header */}
            <div className="px-3 py-3.5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <Link href="/" className={cn("flex items-center gap-2", collapsed && "justify-center w-full")}>
                        <span className="font-devanagari text-xl font-bold text-gray-900 leading-none shrink-0" aria-hidden="true">श</span>
                        {!collapsed && (<span className="text-xs font-bold tracking-widest text-gray-900 uppercase">
                                Shastrarthi
                            </span>)}
                    </Link>
                    {!collapsed && (<button onClick={() => setCollapsed(true)} className="p-1 rounded-md hover:bg-gray-100 text-gray-500" aria-label="Close Sidebar" title="Close Sidebar">
                            <ChevronLeft className="h-4 w-4"/>
                        </button>)}
                </div>
                {!collapsed && (<Link href="/app/chat" className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 text-sm font-medium">
                        + New Chat
                    </Link>)}
                {collapsed && (<button onClick={() => setCollapsed(false)} className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5" aria-label="Open Sidebar" title="Open Sidebar">
                        <ChevronRight className="h-4 w-4"/>
                    </button>)}
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-2 py-2">
                <div className="space-y-0.5">
                    {APP_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (pathname === null || pathname === void 0 ? void 0 : pathname.startsWith(`${item.href}/`));
            return (<Link key={item.href} href={item.href} className={cn("group flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors", active
                    ? "bg-orange-50 text-orange-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900", collapsed && "justify-center px-0")} title={collapsed ? item.label : undefined}>
                                <Icon className="h-[18px] w-[18px] shrink-0"/>
                                {!collapsed && <span className="ml-3 truncate">{item.label}</span>}
                            </Link>);
        })}
                </div>

                {!collapsed && (<div className="mt-5">
                        <p className="px-3 mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                            Recent Chats
                        </p>
                        <div className="space-y-0.5">
                            {recentThreads.length > 0 ? (recentThreads.map((chat) => (<div key={chat.id} className="group rounded-lg px-2 py-1 hover:bg-gray-100">
                                        {editingThreadId === chat.id ? (<div className="flex items-center gap-1">
                                                <input value={editingTitle} onChange={(event) => setEditingTitle(event.target.value)} onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault();
                            void renameThread(chat.id);
                        }
                        if (event.key === "Escape") {
                            setEditingThreadId(null);
                            setEditingTitle("");
                        }
                    }} className="w-full rounded border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700" autoFocus/>
                                                <button onClick={() => void renameThread(chat.id)} className="rounded p-1 text-gray-500 hover:bg-gray-200" aria-label="Save title">
                                                    <Check className="h-3.5 w-3.5"/>
                                                </button>
                                                <button onClick={() => {
                        setEditingThreadId(null);
                        setEditingTitle("");
                        setThreadActionError(null);
                    }} className="rounded p-1 text-gray-500 hover:bg-gray-200" aria-label="Cancel rename">
                                                    <X className="h-3.5 w-3.5"/>
                                                </button>
                                            </div>) : (<div className="flex items-center gap-1">
                                                <Link href={`/app/chat/${chat.id}`} className="block flex-1 truncate rounded px-1 py-0.5 text-sm text-gray-500 hover:text-gray-700" title={chat.title}>
                                                    {chat.title}
                                                </Link>
                                                <button onClick={() => {
                        setEditingThreadId(chat.id);
                        setEditingTitle(chat.title);
                        setThreadActionError(null);
                    }} className="rounded p-1 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-200 hover:text-gray-600" aria-label="Rename thread">
                                                    <Pencil className="h-3.5 w-3.5"/>
                                                </button>
                                                <button onClick={() => void deleteThread(chat.id)} className="rounded p-1 text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-gray-200 hover:text-red-600" aria-label="Delete thread">
                                                    <Trash2 className="h-3.5 w-3.5"/>
                                                </button>
                                            </div>)}
                                    </div>))) : (<p className="px-3 py-1.5 text-sm text-gray-400">No recent chats yet.</p>)}
                        </div>
                        {threadActionError ? <p className="px-3 pt-2 text-xs text-red-600">{threadActionError}</p> : null}
                    </div>)}
            </nav>

            {/* User footer */}
            <div className={cn("border-t border-gray-100 px-3 py-2.5", collapsed && "flex justify-center")}>
                {!collapsed ? (<div>
                        <p className="text-sm font-medium text-gray-900">{(_a = userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) !== null && _a !== void 0 ? _a : "Guest"}</p>
                        <p className="text-xs text-gray-400 truncate">{(_b = userInfo === null || userInfo === void 0 ? void 0 : userInfo.email) !== null && _b !== void 0 ? _b : "Not signed in"}</p>
                    </div>) : (<div className="h-7 w-7 rounded-full bg-orange-100 text-orange-700 grid place-items-center text-[10px] font-semibold">
                        {userInitials || "U"}
                    </div>)}
            </div>
        </aside>);
}
