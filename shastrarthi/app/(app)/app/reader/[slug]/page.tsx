import ChatPanel from "@/components/reader/ChatPanel";
import TextViewerPanel from "@/components/reader/TextViewerPanel";

interface ReaderPageProps {
    params: { slug: string };
}

const SLUG_TO_TITLE: Record<string, { title: string; sanskritTitle?: string }> = {
    "bhagavad-gita-chapter-2": {
        title: "Bhagavad Gita - Chapter 2",
        sanskritTitle: "भगवद्गीता - सांख्ययोग",
    },
    "yoga-sutras": {
        title: "Yoga Sutras",
        sanskritTitle: "पतञ्जलि योगसूत्र",
    },
};

export default function AppReaderPage({ params }: ReaderPageProps) {
    const data = SLUG_TO_TITLE[params.slug] || { title: decodeURIComponent(params.slug).replace(/-/g, " ") };

    return (
        <div className="h-[calc(100vh-104px)] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <TextViewerPanel title={data.title} sanskritTitle={data.sanskritTitle} />
            <ChatPanel textTitle={data.title} />
        </div>
    );
}
