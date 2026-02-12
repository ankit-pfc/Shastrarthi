import type { Metadata, Viewport } from "next";
import { Inter, Source_Serif_4, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/auth/AuthProvider";
import ClientLayout from "@/components/ClientLayout";
import { getSiteUrl } from "@/lib/site";

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
    metadataBase: new URL(getSiteUrl()),
    title: {
        default: "Shastrarthi — Study Sanskrit Texts with AI Explanations",
        template: "%s — Shastrarthi",
    },
    description:
        "Read the Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras verse by verse with AI-powered explanations. Compare traditions, take notes, and build your study library. Free.",
    keywords: [
        "Sanskrit texts online",
        "Vedas",
        "Upanishads",
        "Bhagavad Gita verse by verse",
        "Yoga Sutras",
        "Shastra study",
        "Sanskrit research",
        "AI Sanskrit",
        "verse explanation",
        "Advaita Vedanta",
        "Hindu philosophy",
        "ancient Indian texts",
        "Sanskrit translation",
        "Dharma",
        "Moksha",
        "spiritual texts",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: "/",
        siteName: "Shastrarthi",
        title: "Shastrarthi — Study Sanskrit Texts with AI Explanations",
        description:
            "Read the Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras verse by verse with AI-powered explanations. Compare traditions and build your study library.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Shastrarthi — Study Sanskrit Texts with AI Explanations",
        description:
            "Read the Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras verse by verse with AI-powered explanations. Compare traditions and build your study library.",
    },
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
