"use client";

import { useState } from "react";
import ChatPanel from "@/components/reader/ChatPanel";
import TextViewerPanel from "@/components/reader/TextViewerPanel";

interface ReaderVerse {
    id: string;
    ref: string;
    sanskrit: string | null;
    transliteration: string | null;
    translation_en: string;
    order_index: number;
}

interface ReaderWorkspaceProps {
    text: {
        id: string;
        title_en: string;
        title_sa: string | null;
        category: string;
        verses: ReaderVerse[];
    };
}

export default function ReaderWorkspace({ text }: ReaderWorkspaceProps) {
    const [activeVerse, setActiveVerse] = useState<ReaderVerse | null>(text.verses[0] ?? null);

    return (
        <div className="h-[calc(100vh-104px)] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <TextViewerPanel
                textId={text.id}
                title={text.title_en}
                sanskritTitle={text.title_sa}
                category={text.category}
                verses={text.verses}
                onVerseChange={setActiveVerse}
            />
            <ChatPanel textId={text.id} textTitle={text.title_en} activeVerse={activeVerse} />
        </div>
    );
}
