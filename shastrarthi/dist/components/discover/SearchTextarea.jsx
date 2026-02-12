"use client";
import { useState } from "react";
import { ArrowUp, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import DepthToggle from "./DepthToggle";
export default function SearchTextarea({ initialQuery = "" }) {
    const [query, setQuery] = useState(initialQuery);
    const [depth, setDepth] = useState("deep");
    const router = useRouter();
    const submit = () => {
        if (!query.trim())
            return;
        router.push(`/app/discover/${encodeURIComponent(query.trim())}?depth=${depth}`);
    };
    return (<div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <textarea value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Enter your research query" className="w-full min-h-[94px] rounded-t-xl px-4 py-3 resize-none outline-none text-gray-800 placeholder:text-gray-400"/>
            <div className="border-t border-gray-100 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <DepthToggle value={depth} onChange={setDepth}/>
                    <button className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
                        <Globe className="h-4 w-4"/>
                        English (en)
                    </button>
                </div>
                <button onClick={submit} className="inline-flex items-center justify-center rounded-md bg-orange-600 hover:bg-orange-700 text-white p-2" aria-label="Search">
                    <ArrowUp className="h-4 w-4"/>
                </button>
            </div>
        </div>);
}
