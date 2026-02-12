import { cn } from "@/lib/utils";

interface ProgressBarProps {
    current: number;
    total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

    return (
        <div className="w-full h-1 bg-sand-200 dark:bg-sand-700">
            <div
                className={cn(
                    "h-full bg-gradient-to-r from-saffron-500 to-marigold-500",
                    "transition-all duration-300 ease-out"
                )}
                style={{ width: `${percentage}%` }}
                role="progressbar"
                aria-valuenow={current}
                aria-valuemin={0}
                aria-valuemax={total}
                aria-label={`Reading progress: ${current} of ${total} verses (${percentage}%)`}
            />
        </div>
    );
}
