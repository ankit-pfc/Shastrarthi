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
    title: "Understand any verse in minutes",
    description:
        "Read verse-by-verse Sanskrit and English. Ask the AI to explain a verse with context, compare traditions, and organize your study with notes and ShastraBooks.",
    alternates: { canonical: "/" },
    openGraph: {
        title: "Understand any verse in minutes",
        description:
            "Read verse-by-verse Sanskrit and English. Ask the AI to explain a verse with context, compare traditions, and organize your study.",
        url: "/",
        images: [{ url: "/opengraph-image" }],
    },
    twitter: {
        title: "Understand any verse in minutes",
        description:
            "Read verse-by-verse Sanskrit and English. Ask the AI to explain a verse with context, compare traditions, and organize your study.",
        images: ["/twitter-image"],
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
