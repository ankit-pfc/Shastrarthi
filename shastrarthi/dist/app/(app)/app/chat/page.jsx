import ChatInterface from "@/components/chat/ChatInterface";
export default function AppChatPage({ searchParams }) {
    return <ChatInterface agent={searchParams.agent}/>;
}
