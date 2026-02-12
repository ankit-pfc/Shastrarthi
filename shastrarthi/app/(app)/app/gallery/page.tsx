const AGENTS = [
    { name: "Advaita Scholar", desc: "Specialized in Advaita Vedanta texts and commentarial traditions." },
    { name: "Yoga Guide", desc: "Focused on Yoga Sutras, practice maps, and practical application." },
    { name: "Sanskrit Etymologist", desc: "Deep root analysis, lexical families, and contextual usage." },
    { name: "Comparative Traditions", desc: "Cross-tradition synthesis between Vedanta, Yoga, and Tantra." },
    { name: "Practice Advisor", desc: "Bridges textual knowledge with practical spiritual routines." },
];

export default function GalleryPage() {
    return (
        <div>
            <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Guru Gallery</h1>
            <p className="text-gray-600 mb-6">Choose a specialized AI guide for your current research need.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {AGENTS.map((agent) => (
                    <div key={agent.name} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                        <h3 className="font-semibold text-gray-900">{agent.name}</h3>
                        <p className="text-sm text-gray-600 mt-2">{agent.desc}</p>
                        <button className="mt-4 px-3 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white text-sm">Start Chat</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
