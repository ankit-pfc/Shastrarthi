"use client";

import Link from "next/link";
import Breadcrumb from "./Breadcrumb";

export default function TopBar() {
    return (
        <div className="h-14 border-b border-gray-200 bg-white px-4 md:px-6 flex items-center justify-between">
            <Breadcrumb />
            <div className="flex items-center gap-4 text-sm">
                <Link href="/pricing" className="text-gray-600 hover:text-gray-900">
                    Pricing
                </Link>
            </div>
        </div>
    );
}
