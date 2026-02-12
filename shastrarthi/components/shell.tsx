import type { ReactNode } from "react";

interface ShellProps {
    children: ReactNode;
    className?: string;
}

export function Shell({ children, className }: ShellProps) {
    const base = "mx-auto w-full px-4 py-8";
    return <div className={className ? `${base} ${className}` : base}>{children}</div>;
}
