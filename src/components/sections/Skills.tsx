"use client";

import { useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";

const SKILLS = [
  { cat: "Web Development", icon: "⬡", items: ["Next.js", "NestJS", "Laravel", "React", "TypeScript", "Tailwind CSS", "shadcn/ui"] },
  { cat: "AI / ML Engineering", icon: "◈", items: ["FastAPI", "LangGraph", "PyTorch", "TensorFlow", "vLLM", "Ollama", "ONNX Runtime"] },
  { cat: "LLM & RAG Systems", icon: "◎", items: ["RAG Pipelines", "pgvector", "Neo4j", "Embeddings", "Qwen Models", "Semantic Search"] },
  { cat: "Speech & Audio AI", icon: "◉", items: ["Kokoro TTS", "Fish Speech", "faster-whisper", "Voice Cloning", "Audio Pipelines"] },
  { cat: "Biometrics", icon: "◇", items: ["Face Recognition", "ArcFace", "RetinaFace", "Iris Detection", "Iris Segmentation"] },
  { cat: "Computer Vision", icon: "○", items: ["YOLOv8", "UNet", "OpenCV", "Raspberry Pi", "Coral Edge TPU", "Tkinter"] },
  { cat: "DevOps & Infra", icon: "▣", items: ["Docker", "Turborepo", "pnpm", "BullMQ", "Cloudflare R2", "MinIO", "Redis"] },
  { cat: "Databases & ORM", icon: "▧", items: ["PostgreSQL", "pgvector", "Neo4j", "MySQL", "Drizzle ORM", "Eloquent ORM", "Redis"] },
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
