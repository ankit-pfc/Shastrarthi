import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonRow {
    feature: string;
    generic: string | boolean;
    shastrarthi: string | boolean;
}

interface ComparisonTableProps {
    competitorName: string;
    rows: ComparisonRow[];
}

export function ComparisonTable({ competitorName, rows }: ComparisonTableProps) {
    const renderCell = (value: string | boolean) => {
        if (typeof value === "boolean") {
            return value ? (
                <Check className="w-5 h-5 text-emerald-600 mx-auto" />
            ) : (
                <X className="w-5 h-5 text-red-500 mx-auto" />
            );
        }
        return <span className="text-sm font-medium text-stone-600">{value}</span>;
    };

    return (
        <div className="overflow-hidden bg-white shadow-sm rounded-xl border border-stone-200">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                        <th className="p-4 sm:p-6 text-sm font-serif font-bold text-stone-900 tracking-wide uppercase w-1/3">
                            Dimension
                        </th>
                        <th className="p-4 sm:p-6 text-sm font-bold text-stone-500 tracking-wide uppercase w-1/3 text-center">
                            Generic AI Models
                        </th>
                        <th className="p-4 sm:p-6 text-sm font-bold text-saffron-700 tracking-wide uppercase w-1/3 text-center bg-parchment-50">
                            Shastrarthi
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                    {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50 transition-colors">
                            <td className="p-4 sm:p-6 font-medium text-ink-900">{row.feature}</td>
                            <td className="p-4 sm:p-6 text-center border-l border-stone-100">
                                {renderCell(row.generic)}
                            </td>
                            <td className="p-4 sm:p-6 text-center border-l border-stone-100 bg-parchment-50/30">
                                {renderCell(row.shastrarthi)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
