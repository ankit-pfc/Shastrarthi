"use client";
import { useState } from "react";
const LANGUAGE_OPTIONS = [
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Kannada",
    "Bengali",
    "Marathi",
    "Gujarati",
    "Malayalam",
    "Punjabi",
];
const LEVEL_OPTIONS = ["Simple", "Academic", "Child-friendly"];
export default function SimplifierPage() {
    const [input, setInput] = useState("");
    const [mode, setMode] = useState("simplify");
    const [targetLanguage, setTargetLanguage] = useState("English");
    const [level, setLevel] = useState("Simple");
    const [output, setOutput] = useState("Your output will appear here.");
    const [publicUrl, setPublicUrl] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    async function runTool() {
        var _a, _b, _c;
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch("/api/tools", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode,
                    payload: { input, targetLanguage, level },
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                setError((payload === null || payload === void 0 ? void 0 : payload.error) || "Failed to process request.");
                return;
            }
            const content = (_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.content;
            const pageUrl = (_c = (_b = payload === null || payload === void 0 ? void 0 : payload.data) === null || _b === void 0 ? void 0 : _b.publicPage) === null || _c === void 0 ? void 0 : _c.url;
            setOutput((content === null || content === void 0 ? void 0 : content.trim()) || "No output generated.");
            setPublicUrl(pageUrl || null);
        }
        finally {
            setIsLoading(false);
        }
    }
    async function copyWithAttribution() {
        const attributionUrl = publicUrl || "https://shastrarthi.com/explore";
        const copied = `${output}\n---\nVia Shastrarthi | ${attributionUrl}`;
        await navigator.clipboard.writeText(copied);
    }
    return (<div className="space-y-4">
            <h1 className="text-h2 font-serif font-semibold text-gray-900">Simplify & Translate</h1>
            <p className="text-gray-600">Convert dense Shastra passages into clear explanations or translations.</p>

            <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-3 items-center">
                <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                    <button onClick={() => setMode("simplify")} className={`px-3 py-1.5 text-sm ${mode === "simplify" ? "bg-orange-600 text-white" : "bg-white text-gray-700"}`}>
                        Simplify
                    </button>
                    <button onClick={() => setMode("translate")} className={`px-3 py-1.5 text-sm ${mode === "translate" ? "bg-orange-600 text-white" : "bg-white text-gray-700"}`}>
                        Translate
                    </button>
                </div>

                <label className="text-sm text-gray-700">
                    Language
                    <select className="ml-2 rounded-md border border-gray-200 px-2 py-1 text-sm" value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
                        {LANGUAGE_OPTIONS.map((language) => (<option key={language} value={language}>
                                {language}
                            </option>))}
                    </select>
                </label>

                {mode === "simplify" && (<label className="text-sm text-gray-700">
                        Level
                        <select className="ml-2 rounded-md border border-gray-200 px-2 py-1 text-sm" value={level} onChange={(e) => setLevel(e.target.value)}>
                            {LEVEL_OPTIONS.map((option) => (<option key={option} value={option}>
                                    {option}
                                </option>))}
                        </select>
                    </label>)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <section className="bg-white border border-gray-200 rounded-xl p-4">
                    <h2 className="font-semibold text-gray-900 mb-2">Input</h2>
                    <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full min-h-[240px] rounded-lg border border-gray-200 p-3 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Paste Sanskrit or philosophical text..."/>
                </section>
                <section className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-semibold text-gray-900">Output</h2>
                        <button onClick={copyWithAttribution} className="px-2.5 py-1 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50" disabled={!output.trim()}>
                            Copy
                        </button>
                    </div>
                    <div className="min-h-[240px] rounded-lg border border-gray-200 p-3 text-sm text-gray-700 whitespace-pre-wrap">
                        {output}
                    </div>
                    {publicUrl ? (<p className="mt-2 text-xs text-gray-500">
                            Public page:{" "}
                            <a href={publicUrl} target="_blank" rel="noreferrer" className="text-orange-700 hover:underline">
                                {publicUrl}
                            </a>
                        </p>) : null}
                </section>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button onClick={runTool} disabled={isLoading || !input.trim()} className="px-4 py-2 rounded-md bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white">
                {isLoading ? (mode === "simplify" ? "Simplifying..." : "Translating...") : mode === "simplify" ? "Simplify" : "Translate"}
            </button>
        </div>);
}
