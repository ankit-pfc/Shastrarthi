import { ImageResponse } from "next/og";
export const runtime = "edge";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";
export default function OpenGraphImage() {
    return new ImageResponse((<div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            background: "radial-gradient(1200px 600px at 10% 0%, rgba(255,237,213,1) 0%, rgba(255,255,255,1) 45%, rgba(255,237,213,0.6) 100%)",
            color: "#111827",
        }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            fontSize: 18,
            fontWeight: 600,
            color: "#9A3412",
            letterSpacing: 0.2,
        }}>
                        <span style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: "#EA580C",
            display: "inline-block",
        }}/>
                        AI-Powered Sanskrit Research
                    </div>

                    <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1 }}>
                        Understand any verse
                        <br />
                        in minutes
                    </div>

                    <div style={{ fontSize: 26, lineHeight: 1.35, color: "#374151", maxWidth: 900 }}>
                        Verse-by-verse reading. Contextual explanations. Multi-tradition comparison.
                    </div>
                </div>

                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.2 }}>
                        Shastrarthi
                    </div>
                    <div style={{ fontSize: 18, color: "#4B5563" }}>
                        Vedas · Upanishads · Bhagavad Gita · Yoga
                    </div>
                </div>
            </div>), size);
}
