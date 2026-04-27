"use client";

import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";

const STATS = [
  { v: "4+", l: "Years Building" },
  { v: "10+", l: "AI Projects" },
  { v: "8", l: "Skill Domains" },
];

const PROFILE_ROWS = [
  ["name", "Dave Zachary Macarayo"],
  ["role", "Web Developer + AI Engineer"],
  ["degree", "BSc Computer Engineering"],
  ["focus", "LLMs · RAG · TTS · Vision · Biometrics"],
  ["stack", "React, Next.js, Node, Python"],
  ["status", "Open to opportunities ✦"],
];

export default function About() {
  const { mode } = useExperience();
  const immersive = mode === "immersive";

  return (
    <div
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <section
        id="about"
        style={{
          padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            gap: "clamp(2rem, 5vw, 5rem)",
            alignItems: "center",
          }}
        >
          <div>
            <SectionLabel
              tag="01 · Origin System"
              title="The developer behind the system."
              subtitle="Computer Engineering graduate turned full-stack developer with a focus on AI integration — I build practical, intelligent web systems that work."
            />
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.75,
                fontSize: 15,
                marginBottom: 20,
              }}
            >
              My engineering background gives me a systems-level perspective on
              software. I don&apos;t just wire APIs together — I understand the
              models, the infrastructure, and the trade-offs, which lets me
              build AI features that are genuinely reliable in production.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.75,
                fontSize: 15,
              }}
            >
              Currently focused on AI-integrated web applications, with deep
              experience in LLMs, RAG architectures, speech AI, biometrics, and
              computer vision — always with a strong frontend engineering layer
              on top.
            </p>
            <div
              style={{ marginTop: 32, display: "flex", gap: 32 }}
            >
              {STATS.map((s) => (
                <div key={s.l}>
                  <div
                    style={{
                      fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {s.v}
                  </div>
                  <div
                    className="font-mono"
                    style={{
                      fontSize: 11,
                      color: "var(--text-dim)",
                      letterSpacing: "0.06em",
                      marginTop: 4,
                    }}
                  >
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual panel */}
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 20,
              padding: 32,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {immersive && (
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 200,
                  height: 200,
                  background: "var(--accent-glow)",
                  borderRadius: "50%",
                  filter: "blur(60px)",
                }}
              />
            )}
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
                marginBottom: 20,
              }}
            >
              $ profile --verbose
            </div>
            {PROFILE_ROWS.map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "grid",
                  gridTemplateColumns: "130px 1fr",
                  gap: 12,
                  padding: "9px 0",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 12,
                    color: "var(--accent)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {k}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
