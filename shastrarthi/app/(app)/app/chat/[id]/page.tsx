import ChatInterface from "@/components/chat/ChatInterface";

interface ChatThreadPageProps {
    params: { id: string };
}

export default function ChatThreadPage({ params }: ChatThreadPageProps) {
    const title = "Saved conversation";
    return <ChatInterface initialTitle={title} initialThreadId={params.id} />;
}
