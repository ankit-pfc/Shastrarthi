"use client";

import Link from "next/link";
import SearchInput from "@/components/ui/SearchInput";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Sparkles } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-white to-orange-100/40">
            <div className="container mx-auto px-4 py-24 md:py-32">
                <div className="flex flex-col items-center text-center">
                    {/* Top Badge - 24px gap before heading */}
                    <div className="mb-8">
                        <Badge icon={<Sparkles className="h-4 w-4 text-orange-500" />} variant="default">
                            AI-Powered Ancient Wisdom
                        </Badge>
                    </div>

                    {/* Heading - 16px gap before subheading */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif text-gray-900 mb-4 tracking-tight">
                        Ancient Wisdom, Illuminated
                    </h1>

                    {/* Subheading - 40px gap before search bar */}
                    <p className="text-xl md:text-2xl text-gray-600 max-w-3xl leading-relaxed mb-10">
                        Explore the timeless wisdom of the Vedas, Upanishads, and Yoga with AI-powered explanations.
                        Ask questions, take notes, and build your personal library.
                    </p>

                    {/* Search Bar - 12px gap before helper text */}
                    <div className="mb-16 w-full">
                        <SearchInput
                            placeholder="Search texts, concepts, verses..."
                            helperText="Try: 'Bhagavad Gita', 'Karma Yoga', 'Dharma', 'Meditation'"
                        />
                    </div>

                    {/* CTA Buttons - 48px gap before footer features */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Link href="/discover" className="w-full sm:w-auto">
                            <Button variant="primary" size="lg" fullWidth>
                                Browse Texts
                            </Button>
                        </Link>
                        <Link href="/auth/signup" className="w-full sm:w-auto">
                            <Button variant="secondary" size="lg" fullWidth>
                                Get Started Free
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
                            AI Explanations
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            Save & Organize
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
