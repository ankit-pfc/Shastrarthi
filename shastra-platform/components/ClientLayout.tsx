"use client";

import { ErrorBoundary } from "./ErrorBoundary";

interface ClientLayoutProps {
    children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    );
}
