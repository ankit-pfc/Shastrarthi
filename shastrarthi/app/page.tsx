import Hero from "@/components/landing/Hero";
import QuickIntents from "@/components/landing/QuickIntents";
import FeaturedTexts from "@/components/landing/FeaturedTexts";
import HowItWorks from "@/components/landing/HowItWorks";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Hero />
            <div className="container mx-auto px-4 py-12 space-y-12">
                <QuickIntents />
                <FeaturedTexts />
                <HowItWorks />
            </div>
        </main>
    );
}
