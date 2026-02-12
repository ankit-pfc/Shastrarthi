import AIAnswer from "@/components/discover/AIAnswer";
import CustomColumnPanel from "@/components/discover/CustomColumnPanel";
import TextResultsTable from "@/components/discover/TextResultsTable";
import VerseResultsTable from "@/components/discover/VerseResultsTable";
import ResultsHeader from "@/components/discover/ResultsHeader";
import { fetchTextsByIds, searchTextsByQuery } from "@/lib/services/texts";
import { searchVersesByQuery } from "@/lib/services/verses";
export const revalidate = 60;
function normalizeMode(mode) {
    if (mode === "texts" ||
        mode === "verses" ||
        mode === "concepts" ||
        mode === "compare" ||
        mode === "practice" ||
        mode === "all") {
        return mode;
    }
    return "all";
}
function uniqById(items) {
    const seen = new Set();
    const out = [];
    for (const item of items) {
        if (seen.has(item.id))
            continue;
        seen.add(item.id);
        out.push(item);
    }
    return out;
}
export default async function DiscoverResultPage({ params, searchParams }) {
    var _a;
    const decodedQuery = decodeURIComponent(params.query);
    const depth = (_a = searchParams.depth) !== null && _a !== void 0 ? _a : "deep";
    const mode = normalizeMode(searchParams.mode);
    if (mode === "verses") {
        const verses = await searchVersesByQuery(decodedQuery, 30);
        const relatedTexts = await fetchTextsByIds(verses.map((v) => v.text_id));
        return (<div className="max-w-6xl mx-auto pt-6 space-y-4">
                <ResultsHeader query={decodedQuery} depth={depth} mode={mode}/>
                <AIAnswer query={decodedQuery} texts={relatedTexts} contextLabel={<>
                            Answer grounded in{" "}
                            <span className="text-orange-600 font-medium">{Math.min(relatedTexts.length, 5)} texts</span>{" "}
                            related to matching verses
                        </>}/>
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
                    <VerseResultsTable rows={verses}/>
                    <CustomColumnPanel mode={mode}/>
                </div>
            </div>);
    }
    if (mode === "concepts") {
        const [texts, verses] = await Promise.all([
            searchTextsByQuery(decodedQuery, 20),
            searchVersesByQuery(decodedQuery, 20),
        ]);
        const verseTexts = await fetchTextsByIds(verses.map((v) => v.text_id));
        const groundingTexts = uniqById([...texts, ...verseTexts]).slice(0, 20);
        return (<div className="max-w-6xl mx-auto pt-6 space-y-4">
                <ResultsHeader query={decodedQuery} depth={depth}/>
                <AIAnswer query={decodedQuery} texts={groundingTexts} contextLabel="Concept summary grounded in relevant verses and texts"/>
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
                    <div className="space-y-4">
                        <VerseResultsTable rows={verses}/>
                        <TextResultsTable rows={texts}/>
                    </div>
                    <CustomColumnPanel mode={mode}/>
                </div>
            </div>);
    }
    // Default experience for: all/texts/concepts/compare/practice (until dedicated indexes exist).
    // We still use the AI synthesis + text table, but mode changes framing and can later branch into dedicated UIs.
    const texts = await searchTextsByQuery(decodedQuery, 20);
    const contextLabel = mode === "compare"
        ? "Comparison-style synthesis from the most relevant texts"
        : mode === "practice"
            ? "Practice-focused synthesis from the most relevant texts"
            : undefined;
    return (<div className="max-w-6xl mx-auto pt-6 space-y-4">
            <ResultsHeader query={decodedQuery} depth={depth} mode={mode}/>
            <AIAnswer query={decodedQuery} texts={texts} contextLabel={contextLabel}/>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
                <TextResultsTable rows={texts}/>
                <CustomColumnPanel mode={mode}/>
            </div>
        </div>);
}
