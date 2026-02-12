import SearchTextarea from "@/components/discover/SearchTextarea";
import { fetchTexts } from "@/lib/services/texts";
import Link from "next/link";
import { redirect } from "next/navigation";
import { INTENT_BUILDER_CONFIG } from "@/lib/config/intents";
const EXAMPLES = [
    "What is the nature of consciousness in Upanishads?",
    "Compare Karma Yoga across Gita and Yoga Sutras",
    "How is Shakti described across Tantra traditions?",
];
export const revalidate = 60;
function buildIntentQuery({ goal, lens, start, }) {
    var _a, _b, _c;
    const selected = [goal, lens, start].some(Boolean);
    if (!selected)
        return null;
    const byValue = new Map();
    INTENT_BUILDER_CONFIG.forEach((col) => {
        var _a;
        [...col.items, ...((_a = col.expandedItems) !== null && _a !== void 0 ? _a : [])].forEach((item) => {
            // Ignore "Show More" synthetic values.
            if (item.isShowMore)
                return;
            byValue.set(item.value, { label: item.label, column: col.title });
        });
    });
    const goalLabel = goal ? (_a = byValue.get(goal)) === null || _a === void 0 ? void 0 : _a.label : undefined;
    const lensLabel = lens ? (_b = byValue.get(lens)) === null || _b === void 0 ? void 0 : _b.label : undefined;
    const startLabel = start ? (_c = byValue.get(start)) === null || _c === void 0 ? void 0 : _c.label : undefined;
    const parts = [];
    if (goalLabel)
        parts.push(goalLabel);
    if (lensLabel)
        parts.push(`in ${lensLabel}`);
    if (startLabel)
        parts.push(`starting with ${startLabel}`);
    // If we can’t resolve labels (shouldn’t happen), fall back to raw values.
    if (parts.length === 0) {
        const raw = [goal, lens, start].filter(Boolean).join(" ");
        return raw.length > 0 ? raw : null;
    }
    return parts.join(" ");
}
export default async function AppDiscoverPage({ searchParams }) {
    var _a, _b, _c, _d;
    const quickQuery = (_a = searchParams === null || searchParams === void 0 ? void 0 : searchParams.q) === null || _a === void 0 ? void 0 : _a.trim();
    if (quickQuery) {
        const params = new URLSearchParams({ depth: "deep" });
        if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.mode)
            params.set("mode", searchParams.mode);
        redirect(`/app/discover/${encodeURIComponent(quickQuery)}?${params.toString()}`);
    }
    const intentQuery = buildIntentQuery({
        goal: (_b = searchParams === null || searchParams === void 0 ? void 0 : searchParams.goal) === null || _b === void 0 ? void 0 : _b.trim(),
        lens: (_c = searchParams === null || searchParams === void 0 ? void 0 : searchParams.lens) === null || _c === void 0 ? void 0 : _c.trim(),
        start: (_d = searchParams === null || searchParams === void 0 ? void 0 : searchParams.start) === null || _d === void 0 ? void 0 : _d.trim(),
    });
    if (intentQuery) {
        const params = new URLSearchParams({ depth: "deep" });
        if (searchParams === null || searchParams === void 0 ? void 0 : searchParams.mode)
            params.set("mode", searchParams.mode);
        redirect(`/app/discover/${encodeURIComponent(intentQuery)}?${params.toString()}`);
    }
    const texts = await fetchTexts({ limit: 6 });
    return (<div className="max-w-5xl mx-auto pt-8">
            <h1 className="text-h2 font-serif font-semibold text-gray-900 mb-4">Text Discovery</h1>
            <SearchTextarea />
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-gray-500">Try searching for:</span>
                {EXAMPLES.map((example) => (<Link key={example} href={`/app/discover/${encodeURIComponent(example)}?depth=deep`} className="px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50">
                        {example}
                    </Link>))}
            </div>

            <div className="mt-6 bg-white border border-gray-200 rounded-xl shadow-sm p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-2">Recently Indexed Texts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {texts.map((text) => (<p key={text.id} className="text-sm text-gray-700">
                            {text.title_en}
                        </p>))}
                </div>
            </div>
        </div>);
}
