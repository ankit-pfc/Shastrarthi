import { Loader2 } from "lucide-react";
export default function Loading({ size = "md", text, fullScreen = false }) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12",
    };
    const textSizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
    };
    const content = (<div className="flex flex-col items-center justify-center gap-3">
            <Loader2 className={`animate-spin text-saffron-600 dark:text-saffron-400 ${sizeClasses[size]}`}/>
            {text && (<p className={`text-sand-600 dark:text-sand-400 ${textSizeClasses[size]}`}>
                    {text}
                </p>)}
        </div>);
    if (fullScreen) {
        return (<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sand-50 to-ochre-50 dark:from-sand-900 dark:to-ochre-900">
                {content}
            </div>);
    }
    return content;
}
