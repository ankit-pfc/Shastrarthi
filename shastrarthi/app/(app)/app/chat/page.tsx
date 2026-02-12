import ChatInterface from "@/components/chat/ChatInterface";

interface AppChatPageProps {
    searchParams: { agent?: string };
}

export default function AppChatPage({ searchParams }: AppChatPageProps) {
    return <ChatInterface agent={searchParams.agent} />;
}
