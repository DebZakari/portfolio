"use client";

import { useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";

const SKILLS = [
  { cat: "Web Development", icon: "⬡", items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML & CSS", "Tailwind CSS"] },
  { cat: "AI Integration", icon: "◈", items: ["OpenAI API", "LangChain", "Ollama", "Hugging Face", "Prompt Engineering"] },
  { cat: "LLM / RAG Systems", icon: "◎", items: ["Retrieval-Augmented Generation", "Vector Databases", "Embeddings", "Fine-tuning", "Context Windows"] },
  { cat: "Speech & Audio AI", icon: "◉", items: ["SOTA TTS Systems", "XTTS / Coqui", "Whisper STT", "Audio Pipeline Design"] },
  { cat: "Biometrics", icon: "◇", items: ["Face Recognition", "Liveness Detection", "Fingerprint Auth", "Anti-Spoofing"] },
  { cat: "Computer Vision", icon: "○", items: ["OpenCV", "YOLO Object Detection", "Image Classification", "Video Analysis"] },
  { cat: "UI/UX Engineering", icon: "▣", items: ["Figma", "Framer Motion", "Design Systems", "Accessibility", "Responsive Design"] },
  { cat: "Backend & APIs", icon: "▧", items: ["Node.js", "FastAPI", "REST APIs", "PostgreSQL", "Docker", "Redis"] },
];

export default function Skills() {
  const { mode } = useExperience();
  const immersive = mode === "immersive";
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      id="skills"
      style={{
        padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <SectionLabel
        tag="02 · Skill Systems"
        title="Technical capabilities."
        subtitle="Eight domains spanning web engineering, AI integration, and systems-level development."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {SKILLS.map((s, i) => {
          const isActive = active === i;
          return (
            <div
              key={s.cat}
              onClick={() => setActive(isActive ? null : i)}
              style={{
                background: isActive ? "var(--surface2)" : "var(--surface)",
                border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                borderRadius: 16,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.25s",
                position: "relative",
                overflow: "hidden",
                boxShadow: isActive ? "0 0 32px var(--accent-glow)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--surface2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = "var(--surface)";
                }
              }}
            >
              {immersive && isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    background: "var(--accent-glow)",
                    borderRadius: "50%",
                    filter: "blur(30px)",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <span style={{ fontSize: 22, opacity: 0.7 }}>{s.icon}</span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--text-dim)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  marginBottom: 12,
                  letterSpacing: "-0.01em",
                  color: "var(--text)",
                }}
              >
                {s.cat}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.items.map((item) => (
                  <span
                    key={item}
                    style={{
                      padding: "3px 9px",
                      borderRadius: 20,
                      background: "var(--bg2)",
                      border: "1px solid var(--border)",
                      fontSize: 11,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-jetbrains-mono), monospace",
                      letterSpacing: "0.02em",
                    }}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
