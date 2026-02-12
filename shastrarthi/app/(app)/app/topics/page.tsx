const TOPICS = [
    "Atman and Brahman",
    "Karma and Dharma",
    "Maya and Avidya",
    "Shiva-Shakti non-duality",
    "Yoga and Mind Discipline",
    "Bhakti and Surrender",
];

export default function TopicsPage() {
    return (
        <div>
            <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Explore Topics</h1>
            <p className="text-gray-600 mb-6">Discover conceptual maps and cross-text connections.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TOPICS.map((topic) => (
                    <div key={topic} className="bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                        <h3 className="font-medium text-gray-900">{topic}</h3>
                        <p className="text-sm text-gray-600 mt-2">Cross-text references and tradition-wise interpretations.</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
