"use client";
import { BookOpen, Scroll, Sparkles, Bookmark } from "@/components/icons/DomainIcons";
import SectionContainer from "@/components/ui/SectionContainer";
export default function HowItWorks() {
    const steps = [
        {
            icon: <BookOpen className="h-6 w-6 text-gray-900"/>,
            title: "Choose a Text",
            description: "Browse the Vedas, Upanishads, Gita, Yoga Sutras, and more — with verse-by-verse Sanskrit and English.",
        },
        {
            icon: <Scroll className="h-6 w-6 text-gray-900"/>,
            title: "Read and Ask",
            description: "Pick any verse and ask the AI for meaning, context, and related passages — with citations.",
        },
        {
            icon: <Sparkles className="h-6 w-6 text-gray-900"/>,
            title: "Compare Traditions",
            description: "Understand how Advaita, Shaiva, Bhakti, and other lineages interpret the same concept differently.",
        },
        {
            icon: <Bookmark className="h-6 w-6 text-gray-900"/>,
            title: "Build Your Study",
            description: "Bookmark verses, take notes, and create structured ShastraBooks you can return to anytime.",
        },
    ];
    return (<SectionContainer background="parchment" padding="lg">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        How It Works
                    </h2>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        A simple workflow for deep study: read, ask, compare, and organize your research as you go.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {steps.map((step, index) => (<div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-sm transition-all min-h-[164px] flex flex-col">
                            <div className="flex items-start gap-4 mb-3">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-white border border-gray-200">
                                        {step.icon}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>))}
                </div>
            </div>
        </SectionContainer>);
}
