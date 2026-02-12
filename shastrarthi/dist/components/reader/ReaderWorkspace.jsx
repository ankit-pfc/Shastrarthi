"use client";
import { useState } from "react";
import ChatPanel from "@/components/reader/ChatPanel";
import TextViewerPanel from "@/components/reader/TextViewerPanel";
export default function ReaderWorkspace({ text }) {
    var _a;
    const [activeVerse, setActiveVerse] = useState((_a = text.verses[0]) !== null && _a !== void 0 ? _a : null);
    return (<div className="h-[calc(100vh-104px)] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <TextViewerPanel textId={text.id} title={text.title_en} sanskritTitle={text.title_sa} category={text.category} verses={text.verses} onVerseChange={setActiveVerse}/>
            <ChatPanel textId={text.id} textTitle={text.title_en} activeVerse={activeVerse}/>
        </div>);
}
