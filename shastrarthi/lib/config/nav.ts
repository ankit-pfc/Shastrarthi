import type { LucideIcon } from "lucide-react";
import {
    Home,
    Library,
    Search,
    StickyNote,
} from "lucide-react";

export interface NavItemConfig {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const APP_NAV_ITEMS: NavItemConfig[] = [
    { label: "Home", href: "/app", icon: Home },
    { label: "My Notes", href: "/app/notes", icon: StickyNote },
    { label: "My Library", href: "/app/library", icon: Library },
    { label: "Shastra Discovery", href: "/app/discover", icon: Search },
    { label: "Ancient History", href: "/app/history", icon: Library },
];
