import { ImageResponse } from "next/og";
export const runtime = "edge";
export const size = {
    width: 1200,
    height: 600,
};
export const contentType = "image/png";
export default function TwitterImage() {
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
                        Shastrarthi
                    </div>

                    <div style={{ fontSize: 56, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1 }}>
                        AI-powered Sanskrit research
                        <br />
                        for serious study
                    </div>

                    <div style={{ fontSize: 24, lineHeight: 1.35, color: "#374151", maxWidth: 900 }}>
                        Read verses, ask questions, compare traditions, and organize your learning.
                    </div>
                </div>

                <div style={{ fontSize: 18, color: "#4B5563" }}>
                    Vedas · Upanishads · Bhagavad Gita · Yoga Sutras
                </div>
            </div>), size);
}
