import { cn } from "@/lib/utils";
export default function SectionContainer({ children, className, background = "default", padding = "lg", centered = true, }) {
    const backgroundStyles = {
        default: "bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50",
        gradient: "bg-gradient-to-br from-white via-orange-50/30 to-orange-100/50",
        white: "bg-white",
        parchment: "bg-gray-50",
    };
    const paddingStyles = {
        sm: "py-8",
        md: "py-12",
        lg: "py-20",
        xl: "py-24",
    };
    return (<section className={cn(backgroundStyles[background], paddingStyles[padding], centered && "text-center", className)}>
            <div className="container mx-auto px-4">
                {children}
            </div>
        </section>);
}
