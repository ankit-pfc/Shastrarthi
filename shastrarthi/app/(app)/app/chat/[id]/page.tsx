import ChatInterface from "@/components/chat/ChatInterface";

interface ChatThreadPageProps {
    params: { id: string };
}

export default function ChatThreadPage({ params }: ChatThreadPageProps) {
    const title = decodeURIComponent(params.id).replace(/-/g, " ");
    return <ChatInterface initialTitle={title} />;
}
