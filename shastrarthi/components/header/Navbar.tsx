"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, BookOpen } from "lucide-react";

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: "Discover", href: "/discover" },
        { label: "Reading Lists", href: "/lists" },
        { label: "Traditions", href: "/traditions" },
        { label: "About", href: "/about" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left: Brand */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-900 hover:text-orange-600 transition-colors"
                    >
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-600 rounded-lg shadow-sm">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold font-serif tracking-tight">Shastrarthi</span>
                    </Link>

                    {/* Center: Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-orange-600 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right: Auth Buttons */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-4">
                            <Link
                                href="/auth/login"
                                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/auth/signup"
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
                            >
                                Sign up
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-stone-200">
                        <div className="flex flex-col gap-4 mb-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-3 pt-4 border-t border-stone-200">
                            <Link
                                href="/auth/login"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors py-2"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/auth/signup"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
