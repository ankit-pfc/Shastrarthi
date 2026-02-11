import { supabase } from "@/lib/supabase";
import TextCard from "@/components/discover/TextCard";
import FilterBar from "@/components/discover/FilterBar";
import SearchBar from "@/components/discover/SearchBar";
import { AlertCircle, RefreshCw } from "lucide-react";

export const dynamic = "force-dynamic";

async function getTexts(category?: string | null, difficulty?: string | null, search?: string | null) {
    let query = supabase.from("texts").select("*");

    if (category) {
        query = query.eq("category", category);
    }

    if (difficulty) {
        query = query.eq("difficulty", difficulty);
    }

    if (search) {
        query = query.or(`title_en.ilike.%${search}%,title_sa.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching texts:", error);
        throw new Error("Failed to load texts. Please try again.");
    }

    return data || [];
}

export default async function DiscoverPage({
    searchParams,
}: {
    searchParams: {
        category?: string;
        difficulty?: string;
        search?: string;
        mode?: string;
        goal?: string;
        lens?: string;
        start?: string;
        q?: string;
    };
}) {
    let texts = [];
    let error = null;

    // Handle new query params - use 'q' for mode-based search, fallback to 'search'
    const searchQuery = searchParams.q || searchParams.search || null;

    try {
        texts = await getTexts(
            searchParams.category || null,
            searchParams.difficulty || null,
            searchQuery
        );
    } catch (err) {
        error = err instanceof Error ? err.message : "An unexpected error occurred";
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900">
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-sand-900 dark:text-sand-100 mb-2">
                        Discover Ancient Texts
                    </h1>
                    <p className="text-sand-600 dark:text-sand-400 max-w-2xl">
                        Explore our collection of sacred texts from the Vedic tradition. Filter by category, difficulty, or search for specific texts.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 flex items-center gap-3">
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-medium">Failed to load texts</p>
                            <p className="text-sm opacity-90">{error}</p>
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Retry
                        </button>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="space-y-4 mb-8">
                    <SearchBar
                        value={searchQuery || ""}
                        onChange={() => {
                            // Search is handled via URL params
                        }}
                        onClear={() => {
                            // Clear is handled via URL params
                        }}
                    />
                    <FilterBar
                        category={searchParams.category || null}
                        difficulty={searchParams.difficulty || null}
                        onCategoryChange={() => {
                            // Category is handled via URL params
                        }}
                        onDifficultyChange={() => {
                            // Difficulty is handled via URL params
                        }}
                        onClearFilters={() => {
                            // Clear is handled via URL params
                        }}
                    />
                </div>

                {/* Text Grid */}
                {!error && texts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sand-200 dark:bg-sand-700 flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-sand-500 dark:text-sand-400" />
                        </div>
                        <p className="text-sand-600 dark:text-sand-400 text-lg">
                            No texts found matching your criteria.
                        </p>
                        <p className="text-sm text-sand-500 dark:text-sand-500 mt-2">
                            Try adjusting your filters or search terms.
                        </p>
                    </div>
                ) : !error ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {texts.map((text) => (
                            <TextCard
                                key={text.id}
                                id={text.id}
                                slug={text.slug}
                                title={text.title_en}
                                sanskritTitle={text.title_sa}
                                category={text.category}
                                difficulty={text.difficulty}
                                description={text.description}
                                verseCount={text.verse_count}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export const metadata = {
    title: "Discover Texts - Shastra Platform",
    description: "Browse and discover ancient Sanskrit texts from the Vedic tradition",
};
