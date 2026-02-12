"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchInput from "@/components/ui/SearchInput";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function Hero() {
    const router = useRouter();

    const handleSearch = (query: string) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return;
        router.push(`/app/discover?q=${encodeURIComponent(trimmedQuery)}`);
    };

    return (
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-white to-orange-100/40">
            <div className="container mx-auto px-4 py-16 md:py-24">
                <div className="flex flex-col items-center text-center">
                    {/* Top Badge - 24px gap before heading */}
                    <div className="mb-8">
                        <Badge icon={<Sparkles className="h-4 w-4 text-orange-500" />} variant="default">
                            AI-Powered Sanskrit Research
                        </Badge>
                    </div>

                    {/* Heading - 16px gap before subheading */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold font-serif text-gray-900 mb-4 tracking-tight">
                        Understand Any Verse in Minutes
                    </h1>

                    {/* Subheading - 40px gap before search bar */}
                    <p className="text-base md:text-lg text-gray-600 max-w-3xl leading-relaxed mb-8">
                        Read verse-by-verse Sanskrit and English. Ask the AI to explain a verse with context, compare
                        interpretations across traditions, and keep your study organized.
                    </p>

                    {/* Search Bar - 12px gap before helper text */}
                    <div className="mb-10 w-full">
                        <SearchInput
                            placeholder="Search texts, concepts, verses..."
                            helperText="Try: 'Bhagavad Gita 2.47', 'Karma Yoga', 'Dharma', 'Atman'"
                            onSearch={handleSearch}
                        />
                    </div>

                    {/* CTA Buttons - 48px gap before footer features */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link href="/discover">
                            <Button variant="primary" size="md">
                                Browse Sacred Texts
                            </Button>
                        </Link>
                        <Link href="/auth/signup">
                            <Button variant="secondary" size="md">
                                Create Free Account
                            </Button>
                        </Link>
                    </div>

                    {/* Footer Features */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 font-medium">
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            10+ Sacred Texts
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                            Verse-level Explanations
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Notes & Notebooks
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
