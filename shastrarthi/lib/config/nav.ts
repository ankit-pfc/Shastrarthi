import type { LucideIcon } from "lucide-react";
import {
    Bot,
    Compass,
    FileText,
    Home,
    Library,
    MessageSquareText,
    NotebookPen,
    Quote,
    Search,
    Wand2,
    Zap,
} from "lucide-react";

export interface NavItemConfig {
    label: string;
    href: string;
    icon: LucideIcon;
}

export const APP_NAV_ITEMS: NavItemConfig[] = [
    { label: "Home", href: "/app", icon: Home },
    { label: "My Library", href: "/app/library", icon: Library },
    { label: "Study Notebooks", href: "/app/notebooks", icon: NotebookPen },
    { label: "Guru Gallery", href: "/app/gallery", icon: Bot },
    { label: "Shastra Writer", href: "/app/writer", icon: FileText },
    { label: "Chat with Text", href: "/app/reader/bhagavad-gita-chapter-2", icon: MessageSquareText },
    { label: "Text Discovery", href: "/app/discover", icon: Search },
    { label: "Explore Topics", href: "/app/topics", icon: Compass },
    { label: "Simplifier", href: "/app/simplifier", icon: Wand2 },
    { label: "Reference Generator", href: "/app/references", icon: Quote },
    { label: "Extract Insights", href: "/app/extract", icon: Zap },
];

export const RECENT_CHATS: string[] = [
    "Deep Research Into Shastras",
    "Karma and Dharma Comparison",
    "Tantra Intro Notes",
];
