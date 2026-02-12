const config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Brand Core Colors: Ink + Parchment + Saffron + Stone
                ink: {
                    900: "#2D2A3D", // Primary text, nav links active, primary button bg, icon strokes
                    800: "#635B60", // Secondary headings, UI icon secondary
                },
                neutral: {
                    700: "#666464", // Helper text, placeholders, metadata
                    500: "#8C868B", // Disabled text, subtle labels
                },
                parchment: {
                    50: "#FEF7F4", // Page background (the "paper")
                    100: "#F7EAE2", // Hero wash base, soft fills
                },
                stone: {
                    200: "#E7D4C9", // Borders, dividers, hairlines
                    300: "#CEBEB6", // Input borders, card outlines, separators
                },
                saffron: {
                    500: "#D89569", // Accent lines, badges, micro-emphasis
                    700: "#A07461", // Deeper saffron for hover/pressed accents
                },
                // Orange accent colors for new design system
                orange: {
                    100: "#FFEDD5", // Light peach for secondary backgrounds
                    200: "#FED7AA", // Light orange for hover states
                    300: "#FDBA74", // Medium light orange
                    400: "#FB923C", // Medium orange
                    500: "#F97316", // Medium orange for icons
                    600: "#EA580C", // Primary orange for buttons
                    700: "#C2410C", // Darker orange for hover states
                },
                // Gray colors for text hierarchy
                gray: {
                    400: "#9CA3AF", // Placeholder text
                    500: "#6B7280", // Helper text
                    600: "#4B5563", // Secondary text
                    900: "#111827", // Primary text
                },
                // Status dot colors
                green: {
                    500: "#22C55E",
                },
                blue: {
                    500: "#3B82F6",
                },
                purple: {
                    500: "#A855F7",
                },
                // Legacy colors for backward compatibility
                sand: {
                    50: "#faf9f6",
                    100: "#f5f3ed",
                    200: "#e8e5da",
                    300: "#d4cfc0",
                    400: "#b5a993",
                    500: "#9a8c73",
                    600: "#7d6f59",
                    700: "#655846",
                    800: "#53483a",
                    900: "#453b31",
                },
                marigold: {
                    50: "#fffbeb",
                    100: "#fef3c7",
                    200: "#fde68a",
                    300: "#fcd34d",
                    400: "#fbbf24",
                    500: "#f59e0b",
                    600: "#d97706",
                    700: "#b45309",
                    800: "#92400e",
                    900: "#78350f",
                },
                ochre: {
                    50: "#fdf8f6",
                    100: "#f2e8e5",
                    200: "#eaddd7",
                    300: "#e0cec7",
                    400: "#d2bab0",
                    500: "#c4a89d",
                    600: "#a88b80",
                    700: "#8c6e64",
                    800: "#70564d",
                    900: "#58443d",
                },
                // Background colors
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                card: "20px",
                control: "16px",
                chip: "14px",
                "2xl": "16px", // For search bar
                xl: "12px", // For search button
            },
            fontFamily: {
                // Typography-optimized for long-form reading
                sans: ["Inter", "system-ui", "sans-serif"],
                serif: ["Merriweather", "Newsreader", "Playfair Display", "Georgia", "serif"],
                devanagari: ["Noto Serif Devanagari", "serif"],
            },
            fontSize: {
                // Reading-friendly sizes
                "reading-sm": "0.875rem",
                "reading-base": "1rem",
                "reading-lg": "1.125rem",
                "reading-xl": "1.25rem",
                "reading-2xl": "1.5rem",
                // Brand type scale
                "display/1": ["56px", { lineHeight: "64px", letterSpacing: "-0.01em", fontWeight: "600" }],
                h1: ["48px", { lineHeight: "56px", letterSpacing: "-0.01em", fontWeight: "600" }],
                h2: ["36px", { lineHeight: "44px", letterSpacing: "-0.005em", fontWeight: "600" }],
                h3: ["28px", { lineHeight: "36px", letterSpacing: "-0.005em", fontWeight: "600" }],
                "body/lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
                "body/md": ["16px", { lineHeight: "26px", fontWeight: "400" }],
                "body/sm": ["14px", { lineHeight: "22px", fontWeight: "400" }],
                "label/md": ["14px", { lineHeight: "20px", fontWeight: "600" }],
                "label/sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "600" }],
                meta: ["12px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "500" }],
            },
            spacing: {
                // 8pt rhythm
                "0.5": "4px",
                "1": "8px",
                "2": "16px",
                "3": "24px",
                "4": "32px",
                "5": "40px",
                "6": "48px",
                "7": "56px",
                "8": "64px",
                "10": "80px",
                "12": "96px",
            },
            lineHeight: {
                // Better readability for long-form content
                "reading": "1.8",
                "sanskrit": "1.6",
                relaxed: "1.75", // For subheadings
            },
            boxShadow: {
                "sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)", // Badge
                "md": "0 4px 6px -1px rgb(0 0 0 / 0.1)", // Buttons
                "lg": "0 10px 15px -3px rgb(0 0 0 / 0.1)", // Cards
                "xl": "0 20px 25px -5px rgb(0 0 0 / 0.1)", // Search bar
                "orange": "0 4px 6px -1px rgb(234 88 12 / 0.2)", // Orange shadow
            },
        },
    },
    plugins: [],
};
export default config;
