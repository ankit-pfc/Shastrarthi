import { QuizInterface } from "@/components/tools/QuizInterface";

export default function YogaPathQuizPage() {
    return (
        <div className="min-h-screen bg-parchment-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-ink-900 mb-4">
                    Which Yoga Path is For You?
                </h1>
                <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                    In the Bhagavad Gita, Sri Krishna outlines four main paths (Margas) to realization.
                    Take this short quiz to discover which path aligns best with your natural temperament.
                </p>
            </div>

            <QuizInterface />
        </div>
    );
}
