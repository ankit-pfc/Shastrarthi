import { Bot, Compass, FileText, Home, Library, MessageSquareText, NotebookPen, Search, Wand2, Zap, } from "lucide-react";
export const APP_NAV_ITEMS = [
    { label: "Home", href: "/app", icon: Home },
    { label: "My Library", href: "/app/library", icon: Library },
    { label: "Study Shastras", href: "/app/shastras", icon: NotebookPen },
    { label: "Guru Gallery", href: "/app/gallery", icon: Bot },
    { label: "Shastra Writer", href: "/app/writer", icon: FileText },
    { label: "Chat with Text", href: "/app/chat", icon: MessageSquareText },
    { label: "Text Discovery", href: "/app/discover", icon: Search },
    { label: "Explore Topics", href: "/app/topics", icon: Compass },
    { label: "Ancient History", href: "/history", icon: Library },
    { label: "Simplify & Translate", href: "/app/simplifier", icon: Wand2 },
    { label: "Extract Insights", href: "/app/extract", icon: Zap },
];
