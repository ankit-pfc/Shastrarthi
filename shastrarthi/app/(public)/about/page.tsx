import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about Shastrarthi’s mission: making ancient Sanskrit texts research-grade, accessible, and deeply contextual.",
    alternates: { canonical: "/about" },
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    About Shastrarthi
                </h1>
                <p className="text-gray-600 mb-8">
                    Our mission is to make ancient wisdom research-grade, accessible, and deeply contextual.
                </p>
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                    <p className="text-gray-500">
                        We are building a Shastra-native research platform inspired by modern academic workflows.
                    </p>
                </div>
            </div>
        </div>
    );
}
