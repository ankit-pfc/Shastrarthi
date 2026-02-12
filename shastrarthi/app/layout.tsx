import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ClientLayout from "@/components/ClientLayout";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const sourceSerif4 = Source_Serif_4({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-serif",
    display: "swap",
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin", "devanagari"],
    variable: "--font-devanagari",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Shastrarthi - Ancient Wisdom, Illuminated",
    description: "A research platform for ancient Sanskrit texts with AI-powered explanations. Explore Vedas, Upanishads, Bhagavad Gita, and more.",
    keywords: ["Sanskrit", "Vedas", "Upanishads", "Bhagavad Gita", "Yoga", "AI", "Ancient Wisdom"],
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FEF7F4" },
        { media: "(prefers-color-scheme: dark)", color: "#1D1B28" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.variable} ${sourceSerif4.variable} ${notoSerifDevanagari.variable} font-sans antialiased`}>
                <a href="#main-content" className="skip-link">
                    Skip to main content
                </a>
                <AuthProvider>
                    <ClientLayout>
                        <main id="main-content">
                            {children}
                        </main>
                    </ClientLayout>
                </AuthProvider>
            </body>
        </html>
    );
}
