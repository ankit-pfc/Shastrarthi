import ChatInterface from "@/components/chat/ChatInterface";
export default function ChatThreadPage({ params }) {
    const title = "Saved conversation";
    return <ChatInterface initialTitle={title} initialThreadId={params.id}/>;
}
