import Navbar from "@/components/header/Navbar";
import Hero from "@/components/landing/Hero";
import IntentBuilder from "@/components/landing/IntentBuilder";
import HistorySpotlight from "@/components/landing/HistorySpotlight";
// import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import type { Metadata } from "next";
import JsonLd from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
    title: "Shastrarthi — Study Ancient Texts with AI from Great Masters",
    description:
        "Study Shastras, texts of the ancient civilization with AI from the great masters. Learn Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras with explanations from Shri Krishna, Shankara, Ramanuja, and more.",
    alternates: { canonical: "/" },
    openGraph: {
        title: "Shastrarthi — Study Ancient Texts with AI from Great Masters",
        description:
            "Study Shastras, texts of the ancient civilization with AI from the great masters. Learn Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras with explanations from Shri Krishna, Shankara, Ramanuja, and more.",
        url: "/",
        images: [{ url: "/icon.png", width: 512, height: 512, alt: "Shastrarthi Logo" }],
    },
    twitter: {
        title: "Shastrarthi — Study Ancient Texts with AI from Great Masters",
        description:
            "Study Shastras, texts of the ancient civilization with AI from the great masters. Learn Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras with explanations from Shri Krishna, Shankara, Ramanuja, and more.",
        images: ["/icon.png"],
    },
};

export default async function Home() {
    const siteUrl = getSiteUrl();

    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Shastrarthi",
        url: siteUrl,
        description:
            "A research platform for ancient Sanskrit texts with AI-powered explanations.",
    };

    const organizationJsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Shastrarthi",
        url: siteUrl,
    };

    return (
        <main className="min-h-screen">
            <JsonLd data={websiteJsonLd} />
            <JsonLd data={organizationJsonLd} />
            <Navbar />
            <Hero />
            <div>
                <IntentBuilder />
                <HistorySpotlight />
                {/* <Pricing /> */}
                <FAQ />
                <Footer />
            </div>
        </main>
    );
}
