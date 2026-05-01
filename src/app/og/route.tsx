import { ImageResponse } from "next/og";

export const runtime = "edge";

const spaceGroteskPromise = fetch(
  new URL("./SpaceGrotesk-Bold.woff", import.meta.url)
).then((r) => r.arrayBuffer());

const jetbrainsMonoPromise = fetch(
  new URL("./JetBrainsMono-Regular.woff", import.meta.url)
).then((r) => r.arrayBuffer());

// Design tokens
const VOID_DEEP    = "#0f0f0f";
const SURFACE      = "#141414";
const BORDER       = "#262626";
const SIGNAL_WHITE = "#f0f0f0";
const FAINT_SIGNAL = "#888888";
const VOID_TEXT    = "#444444";

// Stars distributed across canvas; denser in center safe zone (x:285–915)
const STARS: [number, number, number, number][] = [
  [360, 48,  1.5, 0.45], [480, 72,  1.0, 0.30], [600, 36,  2.0, 0.50],
  [720, 88,  1.0, 0.28], [840, 56,  1.5, 0.40], [500, 160, 1.0, 0.22],
  [660, 130, 2.0, 0.35], [780, 200, 1.0, 0.20], [420, 220, 1.5, 0.28],
  [540, 520, 1.0, 0.20], [700, 540, 1.5, 0.25], [820, 480, 1.0, 0.18],
  [400, 480, 2.0, 0.22], [630, 580, 1.0, 0.18], [760, 600, 1.5, 0.20],
  [80,  80,  1.0, 0.18], [180, 140, 1.5, 0.22], [1060, 90,  1.0, 0.20],
  [1140, 200, 1.5, 0.25], [100, 400, 1.0, 0.16], [200, 520, 1.0, 0.18],
  [1080, 420, 1.5, 0.20], [1160, 520, 1.0, 0.16], [60,  560, 1.0, 0.14],
];

export async function GET() {
  const [spaceGroteskData, jetbrainsMonoData] = await Promise.all([
    spaceGroteskPromise,
    jetbrainsMonoPromise,
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: VOID_DEEP,
          position: "relative",
          overflow: "hidden",
          fontFamily: "Space Grotesk, system-ui, sans-serif",
        }}
      >
        {/* Nebula glow — centered, pixel-positioned (no CSS transforms) */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: 250,
            width: 700,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0.012) 45%, transparent 72%)",
          }}
        />

        {/* Secondary glow — bottom center */}
        <div
          style={{
            position: "absolute",
            bottom: -140,
            left: 350,
            width: 500,
            height: 360,
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

        {/* ── Content — centered within the 630px square safe zone ── */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Monogram */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: "linear-gradient(145deg, #f0f0f0 0%, #888888 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
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

          {/* Eyebrow — JetBrains Mono, manual uppercase */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <div style={{ width: 20, height: 1, background: FAINT_SIGNAL }} />
            <span
              style={{
                fontSize: 11,
                fontFamily: "JetBrains Mono, monospace",
                color: FAINT_SIGNAL,
                letterSpacing: "0.14em",
              }}
            >
              {"WEB DEVELOPER · AI ENGINEER"}
            </span>
            <div style={{ width: 20, height: 1, background: FAINT_SIGNAL }} />
          </div>

          {/* Name — display scale */}
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: SIGNAL_WHITE,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              textAlign: "center",
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              marginBottom: 40,
            }}
          >
            Dave Zachary Macarayo
          </div>

          {/* Chips — JetBrains Mono labels */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 24,
            }}
          >
            {["Full-Stack", "LLMs · RAG", "TTS · Vision", "Edge AI"].map(
              (tag) => (
                <div
                  key={tag}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    border: `1px solid ${BORDER}`,
                    background: SURFACE,
                    fontSize: 11,
                    fontFamily: "JetBrains Mono, monospace",
                    color: VOID_TEXT,
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

          {/* URL — JetBrains Mono metadata */}
          <div
            style={{
              fontSize: 11,
              fontFamily: "JetBrains Mono, monospace",
              color: VOID_TEXT,
              letterSpacing: "0.08em",
            }}
          >
            dz-macarayo.vercel.app
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
          data: spaceGroteskData,
          weight: 700,
          style: "normal",
        },
        {
          name: "JetBrains Mono",
          data: jetbrainsMonoData,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
