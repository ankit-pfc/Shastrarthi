import Link from "next/link";

const TIERS = [
    {
        name: "Free",
        price: "$0",
        subtitle: "For curious learners",
        features: ["Access to core texts", "Basic AI chat", "Bookmarks and notes"],
    },
    {
        name: "Premium",
        price: "$19/mo",
        subtitle: "For serious researchers",
        featured: true,
        features: ["Unlimited AI chat", "Deep research mode", "Advanced discovery and exports"],
    },
    {
        name: "Guru",
        price: "$79/mo",
        subtitle: "For teachers and cohorts",
        features: ["Everything in Premium", "Study circles and sharing", "Learning path management"],
    },
];

export default function Pricing() {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-h2 font-serif font-semibold text-gray-900 mb-2">Pricing</h2>
                    <p className="text-gray-600">Start free and scale as your study deepens.</p>
                </div>

                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
                    {TIERS.map((tier) => (
                        <div
                            key={tier.name}
                            className={`rounded-2xl border p-6 shadow-sm ${tier.featured ? "border-orange-300 bg-orange-50/40" : "border-gray-200 bg-white"}`}
                        >
                            <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{tier.price}</p>
                            <p className="text-gray-600 mt-1">{tier.subtitle}</p>
                            <ul className="mt-5 space-y-2 text-sm text-gray-700">
                                {tier.features.map((feature) => (
                                    <li key={feature}>- {feature}</li>
                                ))}
                            </ul>
                            <Link
                                href="/auth/signup"
                                className={`mt-6 inline-flex w-full justify-center rounded-lg px-4 py-2.5 font-medium transition-colors ${tier.featured ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-gray-900 hover:bg-gray-800 text-white"}`}
                            >
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
