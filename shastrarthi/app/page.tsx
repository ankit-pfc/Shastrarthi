import Navbar from "@/components/header/Navbar";
import Hero from "@/components/landing/Hero";
import IntentBuilder from "@/components/landing/IntentBuilder";
import PopularTasks from "@/components/landing/PopularTasks";
import FeaturedTexts from "@/components/landing/FeaturedTexts";
import HowItWorks from "@/components/landing/HowItWorks";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";

export default function Home() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <Hero />
            <div>
                <IntentBuilder />
                <PopularTasks />
                <FeaturedTexts />
                <HowItWorks />
                <Pricing />
                <FAQ />
                <Footer />
            </div>
        </main>
    );
}
