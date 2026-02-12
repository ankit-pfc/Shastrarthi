export default function MessageBubble({ role, content }) {
    const isUser = role === "user";
    return (<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-3xl rounded-xl px-4 py-3 text-sm leading-relaxed ${isUser ? "bg-gray-100 text-gray-900" : "bg-white border border-gray-200 text-gray-700"}`}>
                {content}
            </div>
        </div>);
}
