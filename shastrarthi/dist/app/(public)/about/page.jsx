import Link from "next/link";
export const metadata = {
    title: "About",
    description: "Learn about Shastrarthi’s mission: making ancient Sanskrit texts research-grade, accessible, and deeply contextual.",
    alternates: { canonical: "/about" },
};
export default function AboutPage() {
    return (<div className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Shastrarthi</h1>
                    <p className="text-gray-600 mb-10 max-w-3xl">
                        Our mission is to make ancient wisdom research-grade, accessible, and deeply contextual for
                        serious students, seekers, and teachers.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Verse-first study</h2>
                            <p className="text-sm text-gray-600">
                                Read Sanskrit, transliteration, and translation together with quick cross-references.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">AI with context</h2>
                            <p className="text-sm text-gray-600">
                                Ask questions grounded in text context instead of generic summaries.
                            </p>
                        </div>
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Research workflow</h2>
                            <p className="text-sm text-gray-600">
                                Save notes and organize learning into ShastraBooks.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
                        <h3 className="text-xl font-semibold text-gray-900 mb-3">Our vision</h3>
                        <p className="text-gray-600 leading-relaxed">
                            We are building a Shastra-native platform inspired by modern academic workflows, while
                            staying faithful to traditional methods of inquiry and contemplation.
                        </p>
                        <div className="mt-6">
                            <Link href="/auth/signup" className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
                                Create free account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
}
