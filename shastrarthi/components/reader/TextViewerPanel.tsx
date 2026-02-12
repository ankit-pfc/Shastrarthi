import { Search, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

interface TextViewerPanelProps {
    title: string;
    sanskritTitle?: string | null;
}

export default function TextViewerPanel({ title, sanskritTitle }: TextViewerPanelProps) {
    return (
        <section className="h-full bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <button className="text-orange-600 border-b-2 border-orange-600 pb-1">Text</button>
                    <button className="text-gray-500 hover:text-gray-700 pb-1">Summary</button>
                </div>
                <div className="inline-flex items-center gap-2 text-gray-600">
                    <button className="p-1.5 rounded-md hover:bg-gray-100"><Search className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100"><ZoomOut className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100"><ZoomIn className="h-4 w-4" /></button>
                    <button className="p-1.5 rounded-md hover:bg-gray-100"><Maximize2 className="h-4 w-4" /></button>
                </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
                <button className="inline-flex items-center rounded-md border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50">
                    Explain verse & terms
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-1">{title}</h2>
                {sanskritTitle && <p className="text-orange-600 mb-4">{sanskritTitle}</p>}
                <p className="text-sm text-gray-500 mb-3">Select a statement in the text to use in Chat.</p>
                <div className="space-y-6">
                    <article className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-2">Verse 2.47</p>
                        <p className="font-devanagari text-lg text-gray-900 leading-relaxed mb-2">
                            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed mb-2">
                            Your right is to action alone, never to its fruits. Do not let the fruits of action be your motive.
                        </p>
                        <p className="text-xs text-gray-500">Tap to ask for detailed lineage comparison.</p>
                    </article>
                    <article className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-2">Verse 2.48</p>
                        <p className="font-devanagari text-lg text-gray-900 leading-relaxed mb-2">
                            योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                            Established in yoga, perform action abandoning attachment and remaining even-minded in success and failure.
                        </p>
                    </article>
                </div>
            </div>
        </section>
    );
}
