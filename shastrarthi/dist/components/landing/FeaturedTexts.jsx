import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionContainer from "@/components/ui/SectionContainer";
function getCategoryColor(category) {
    switch (category) {
        case "Vedas":
        case "Veda":
            return { text: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" };
        case "Upanishad":
            return { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
        case "Yoga":
            return { text: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
        case "Itihasa":
            return { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" };
        case "Tantra":
            return { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
        case "Vedanta":
            return { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200" };
        case "Purana":
            return { text: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" };
        default:
            return { text: "text-gray-600", bg: "bg-gray-50", border: "border-gray-200" };
    }
}
export default function FeaturedTexts({ texts }) {
    return (<SectionContainer background="white" padding="lg">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                            Start with These Texts
                        </h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            The most-studied Shastras, ready for verse-level research.
                        </p>
                    </div>
                    <Link href="/discover" className="hidden sm:flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                        View All Texts
                        <ArrowRight className="h-4 w-4"/>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {texts.map((text) => {
            var _a, _b;
            const categoryStyle = getCategoryColor(text.category);
            return (<div key={text.slug} className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all flex flex-col h-full p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                                        {text.category}
                                    </span>
                                    <span className="text-xs text-gray-500 capitalize">
                                        {text.difficulty}
                                    </span>
                                </div>

                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                    {text.title_en}
                                </h3>
                                <p className="text-sm text-gray-500 font-devanagari mb-2 line-clamp-1">
                                    {(_a = text.title_sa) !== null && _a !== void 0 ? _a : " "}
                                </p>
                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-4 flex-grow">
                                    {(_b = text.description) !== null && _b !== void 0 ? _b : "Explore this text in the reader and discover key verses."}
                                </p>
                                <Link href={`/reader/${text.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-600 hover:text-orange-700">
                                    Read
                                    <ArrowRight className="h-3.5 w-3.5"/>
                                </Link>
                            </div>);
        })}
                </div>

                <div className="mt-6 text-center sm:hidden">
                    <Link href="/discover" className="inline-flex items-center gap-2 px-4 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                        View All Texts
                        <ArrowRight className="h-4 w-4"/>
                    </Link>
                </div>
            </div>
        </SectionContainer>);
}
