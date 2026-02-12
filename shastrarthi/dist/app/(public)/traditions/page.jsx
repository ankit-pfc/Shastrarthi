export const metadata = {
    title: "Traditions",
    description: "Explore Vedanta, Yoga, Tantra, Bhakti, and allied lineages with structured context and comparative study.",
    alternates: { canonical: "/traditions" },
};
export default function TraditionsPage() {
    const traditions = [
        {
            name: "Vedanta",
            description: "Non-dual, qualified non-dual, and dual schools with key texts and major acharyas.",
        },
        {
            name: "Yoga",
            description: "Practice-oriented study rooted in Patanjali, allied texts, and meditative disciplines.",
        },
        {
            name: "Tantra",
            description: "Ritual, mantra, and contemplative streams across Shaiva, Shakta, and Vaishnava traditions.",
        },
        {
            name: "Bhakti",
            description: "Devotional theology, practice, and poetic traditions across sampradayas.",
        },
        {
            name: "Nyaya",
            description: "Logic, epistemology, and debate traditions that sharpen philosophical reasoning.",
        },
        {
            name: "Samkhya",
            description: "Foundational metaphysical categories that inform Yoga and broader darshana discourse.",
        },
    ];
    return (<div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Traditions</h1>
                <p className="text-gray-600 mb-10 max-w-3xl">
                    Explore Vedanta, Yoga, Tantra, Bhakti, and allied lineages with structured context.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {traditions.map((tradition) => (<div key={tradition.name} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-lg font-semibold text-gray-900">{tradition.name}</h2>
                                <span className="text-[10px] font-semibold uppercase tracking-wide text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                                    Coming soon
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{tradition.description}</p>
                        </div>))}
                </div>

                <div className="mt-8 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <p className="text-gray-600">
                        Interactive lineage maps and comparative summaries are being rolled out in phases.
                    </p>
                </div>
            </div>
        </div>);
}
