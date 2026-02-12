"use client";
const OPTIONS = ["standard", "high", "deep"];
export default function DepthToggle({ value, onChange }) {
    return (<div className="inline-flex items-center rounded-lg border border-gray-200 p-1 bg-white">
            {OPTIONS.map((option) => (<button key={option} onClick={() => onChange(option)} className={`px-3 py-1.5 text-sm rounded-md transition-colors capitalize ${value === option ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                    {option === "high" ? "High Quality" : option === "deep" ? "Deep Review" : "Standard"}
                </button>))}
        </div>);
}
