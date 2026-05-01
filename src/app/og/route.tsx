import { ImageResponse } from "next/og";

export const runtime = "edge";

const fontPromise = fetch(
  new URL("./SpaceGrotesk-Bold.woff", import.meta.url)
).then((r) => r.arrayBuffer());

const BG      = "#0b0b0e";
const SURFACE = "#141414";
const BORDER  = "#262626";
const TEXT    = "#f0f0f0";
const MUTED   = "#888888";
const DIM     = "#444444";

// [x, y, diameter, opacity] — weighted toward top-right (nebula region)
const STARS: [number, number, number, number][] = [
  [848, 38,  1.5, 0.50], [912, 64,  1.0, 0.30], [966, 28,  2.0, 0.55],
  [1028, 88, 1.0, 0.25], [1082, 52, 1.5, 0.42], [1128, 118, 1.0, 0.22],
  [978, 136, 1.5, 0.38], [874, 154, 1.0, 0.20], [1056, 168, 2.0, 0.32],
  [1144, 78, 1.0, 0.36], [1100, 200, 1.5, 0.20], [940, 192, 1.0, 0.18],
  // sparse scatter
  [118, 58,  1.0, 0.22], [284, 42,  1.5, 0.30], [452, 76,  1.0, 0.18],
  [614, 52,  2.0, 0.28], [196, 178, 1.0, 0.18], [376, 138, 1.0, 0.22],
  [706, 114, 1.5, 0.26], [52,  286, 1.0, 0.16], [338, 298, 1.0, 0.20],
  [528, 244, 1.0, 0.18], [768, 272, 1.5, 0.22], [62,  420, 1.0, 0.14],
];

export async function GET() {
  const fontData = await fontPromise;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 72px 64px",
          background: BG,
          position: "relative",
          overflow: "hidden",
          fontFamily: "Space Grotesk, system-ui, sans-serif",
        }}
      >
        {/* Nebula glow — achromatic, top-right */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -40,
            width: 560,
            height: 460,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 45%, transparent 72%)",
          }}
        />

        {/* Secondary glow — bottom-left warmth */}
        <div
          style={{
            position: "absolute",
            bottom: -120,
            left: -60,
            width: 380,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.025) 0%, transparent 70%)",
          }}
        />

        {/* Star field */}
        {STARS.map(([x, y, d, o], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: d,
              height: d,
              borderRadius: "50%",
              background: `rgba(240,240,240,${o})`,
            }}
          />
        ))}

        {/* ── Header row ── */}
        <div
          style={{
            position: "absolute",
            top: 56,
            left: 72,
            right: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Monogram */}
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #f0f0f0 0%, #888888 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#0a0a0a",
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontFamily: "Space Grotesk, system-ui, sans-serif",
              }}
            >
              D
            </div>
          </div>

          {/* URL annotation */}
          <div
            style={{
              fontSize: 11,
              fontFamily: "monospace",
              color: DIM,
              letterSpacing: "0.08em",
            }}
          >
            dz-macarayo.vercel.app
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Eyebrow — matches Section Label pattern */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 20,
                height: 1,
                background: MUTED,
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontFamily: "monospace",
                color: MUTED,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
              }}
            >
              Web Developer · AI Engineer
            </span>
          </div>

          {/* Name — display scale */}
          <div
            style={{
              fontSize: 66,
              fontWeight: 700,
              color: TEXT,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              marginBottom: 30,
            }}
          >
            Dave Zachary Macarayo
          </div>

          {/* Chips + divider row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {/* Vertical rule */}
            <div
              style={{
                width: 1,
                height: 28,
                background: BORDER,
                marginRight: 4,
              }}
            />
            {["LLMs · RAG", "TTS · Vision", "Edge AI", "Full-Stack"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    border: `1px solid ${BORDER}`,
                    background: SURFACE,
                    fontSize: 11,
                    fontFamily: "monospace",
                    color: DIM,
                    letterSpacing: "0.06em",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {tag}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Space Grotesk",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
