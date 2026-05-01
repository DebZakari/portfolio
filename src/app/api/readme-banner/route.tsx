import { ImageResponse } from "next/og";

export const runtime = "edge";

const spaceGroteskPromise = fetch(
  new URL("../../og/SpaceGrotesk-Bold.woff", import.meta.url)
).then((r) => r.arrayBuffer());

const jetbrainsMonoPromise = fetch(
  new URL("../../og/JetBrainsMono-Regular.woff", import.meta.url)
).then((r) => r.arrayBuffer());

const VOID_DEEP    = "#0f0f0f";
const SURFACE      = "#141414";
const BORDER       = "#262626";
const SIGNAL_WHITE = "#f0f0f0";
const FAINT_SIGNAL = "#888888";

const STARS: [number, number, number, number][] = [
  [80,  35,  1.5, 0.35], [200, 20,  1.0, 0.25], [350, 45,  2.0, 0.40],
  [500, 25,  1.0, 0.22], [650, 55,  1.5, 0.30], [800, 30,  1.0, 0.28],
  [870, 65,  1.5, 0.22], [60,  245, 1.0, 0.22], [160, 220, 1.5, 0.28],
  [320, 250, 1.0, 0.20], [480, 230, 2.0, 0.30], [630, 255, 1.0, 0.18],
  [750, 235, 1.5, 0.25], [850, 248, 1.0, 0.20], [30,  140, 1.0, 0.18],
  [880, 130, 1.5, 0.20],
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
          width: 900,
          height: 280,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: VOID_DEEP,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Nebula glow */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: 200,
            width: 500,
            height: 320,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.010) 45%, transparent 72%)",
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

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 18,
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

          {/* Name */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: SIGNAL_WHITE,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              textAlign: "center",
              fontFamily: "Space Grotesk, system-ui, sans-serif",
              marginBottom: 20,
            }}
          >
            Dave Zachary Macarayo
          </div>

          {/* Chips */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {["Web Developer", "AI Engineer"].map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "5px 14px",
                  borderRadius: 20,
                  border: `1px solid ${BORDER}`,
                  background: SURFACE,
                  fontSize: 11,
                  fontFamily: "JetBrains Mono, monospace",
                  color: FAINT_SIGNAL,
                  letterSpacing: "0.06em",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      width: 900,
      height: 280,
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
