import AIAnswer from "@/components/discover/AIAnswer";
import CustomColumnPanel from "@/components/discover/CustomColumnPanel";
import TextResultsTable from "@/components/discover/TextResultsTable";
import ResultsHeader from "@/components/discover/ResultsHeader";
import { searchTextsByQuery } from "@/lib/services/texts";

interface PageProps {
    params: { query: string };
    searchParams: { depth?: "standard" | "high" | "deep" };
}

export const revalidate = 60;

export default async function DiscoverResultPage({ params, searchParams }: PageProps) {
    const decodedQuery = decodeURIComponent(params.query);
    const depth = searchParams.depth ?? "deep";
    const texts = await searchTextsByQuery(decodedQuery, 20);

    return (
        <div className="max-w-6xl mx-auto pt-6 space-y-4">
            <ResultsHeader query={decodedQuery} depth={depth} />
            <AIAnswer query={decodedQuery} texts={texts} />
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-4">
                <TextResultsTable rows={texts} />
                <CustomColumnPanel />
            </div>
        </div>
    );
}
