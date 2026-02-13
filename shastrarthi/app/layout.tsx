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
        default: "Shastrarthi — Study Ancient Texts with AI from Great Masters",
        template: "%s — Shastrarthi",
    },
    description:
        "Study Shastras, texts of the ancient civilization with AI from the great masters. Learn Vedas, Upanishads, Bhagavad Gita, and Yoga Sutras with explanations from Shri Krishna, Shankara, Ramanuja, and more.",
    keywords: [
        "Shastra Study",
        "Sanskrit texts online",
        "Learn with AI",
        "Understand Ancient Texts",
        "Shri Krishna",
        "Adi Shankaracharya",
        "Ramanujacharya",
        "Madhvacharya",
        "Abhinavagupta",
        "Patanjali",
        "Vedas",
        "Upanishads",
        "Bhagavad Gita",
        "Yoga Sutras",
        "Tantra",
        "Dharma",
        "Moksha",
        "Karma",
        "Advaita Vedanta",
        "Kashmir Shaivism",
        "ISKCON",
        "Spiritually inclined",
        "Daily Life Philosophy",
    ],
    icons: {
        icon: "/icon.png",
    },
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: "/",
        siteName: "Shastrarthi",
        title: "Shastrarthi — Study Ancient Texts with AI from Great Masters",
        description:
            "Study Shastras, texts of the ancient civilization with AI from the great masters. Learn Vedas, Upanishads, Gita, and Yoga Sutras with lineage-specific explanations.",
        images: [
            {
                url: "/icon.png",
                width: 512,
                height: 512,
                alt: "Shastrarthi Logo",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Shastrarthi — Study Ancient Texts with AI from Great Masters",
        description:
            "Study Shastras, texts of the ancient civilization with AI from the great masters. Learn Vedas, Upanishads, Gita, and Yoga Sutras with lineage-specific explanations.",
        images: ["/icon.png"],
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
