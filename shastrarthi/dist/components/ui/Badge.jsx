import { cn } from "@/lib/utils";
export default function Badge({ children, icon, variant = "default", className }) {
    const variantStyles = {
        default: "bg-white border border-gray-100 text-gray-700",
        orange: "bg-orange-50 border border-orange-200 text-orange-700",
        green: "bg-green-50 border border-green-200 text-green-700",
        blue: "bg-blue-50 border border-blue-200 text-blue-700",
        purple: "bg-purple-50 border border-purple-200 text-purple-700",
    };
    return (<div className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm text-sm font-medium", variantStyles[variant], className)}>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
        </div>);
}
