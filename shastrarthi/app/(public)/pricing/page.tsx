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
                <section className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                    <p className="text-sm font-medium text-orange-600 mb-2">Pricing</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">Simple and transparent</h1>
                    <p className="text-gray-600 mb-8">
                        Pricing plans are being finalized. You can continue exploring the app with the current free
                        experience while we prepare detailed tiers.
                    </p>
                    <div className="flex flex-wrap gap-3">
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
                </section>
            </div>
        </main>
    );
}
