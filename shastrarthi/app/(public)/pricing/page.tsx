import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pricing",
    description:
        "Simple and transparent pricing for Shastrarthi. Start exploring sacred texts and AI-powered explanations for free.",
    alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50">
            <div className="container mx-auto px-4 py-16">
                <section className="max-w-5xl mx-auto">
                    <p className="text-sm font-medium text-orange-600 mb-2">Pricing</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Simple and transparent</h1>
                    <p className="text-gray-600 mb-8 max-w-3xl">
                        Start with the free tier today. Advanced research workflows and premium features will be added
                        in upcoming releases.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="text-sm font-semibold text-gray-900 mb-1">Free</div>
                            <p className="text-3xl font-bold text-gray-900 mb-4">$0</p>
                            <ul className="space-y-2 text-sm text-gray-600 mb-5">
                                <li>Text discovery and verse reading</li>
                                <li>Basic AI-assisted chat</li>
                                <li>Personal library and notebooks</li>
                            </ul>
                            <Link
                                href="/auth/signup"
                                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                            >
                                Get started
                            </Link>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-[11px] font-semibold text-orange-700 mb-3">
                                Coming soon
                            </div>
                            <div className="text-sm font-semibold text-gray-900 mb-1">Pro</div>
                            <p className="text-3xl font-bold text-gray-900 mb-4">TBD</p>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li>Higher AI usage limits</li>
                                <li>Advanced synthesis and exports</li>
                                <li>Priority support</li>
                            </ul>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-3">FAQs</h2>
                        <div className="space-y-3 text-sm text-gray-600">
                            <p>
                                <span className="font-medium text-gray-900">Will current users lose access?</span> No,
                                current free access remains available.
                            </p>
                            <p>
                                <span className="font-medium text-gray-900">When will Pro launch?</span> We will share
                                timelines once the feature set is finalized.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3 mt-6">
                            <Link
                                href="/app"
                                className="inline-flex items-center justify-center rounded-lg bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
                            >
                                Open App
                            </Link>
                            <Link
                                href="/"
                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
