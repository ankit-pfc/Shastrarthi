export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900">
            <div className="container mx-auto px-4 py-16">
                <h1 className="text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-100 mb-4">
                    About Shastra
                </h1>
                <p className="text-sand-600 dark:text-sand-400 mb-8">
                    Learn about our mission to make ancient wisdom accessible to everyone.
                </p>
                <div className="bg-white dark:bg-sand-800 rounded-xl p-8 border border-sand-200 dark:border-sand-700">
                    <p className="text-sand-500 dark:text-sand-400">
                        Coming soon! This feature is under development.
                    </p>
                </div>
            </div>
        </div>
    );
}
