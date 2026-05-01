"use client";

import React, { useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";

const FEATURED = [
  {
    cat: "Web Development", icon: "⬡",
    desc: "Full-stack web engineering across modern JS and PHP ecosystems.",
    items: ["Next.js", "NestJS", "Laravel", "CodeIgniter", "React", "Tailwind CSS", "Alpine.js", "PHP", "shadcn/ui"],
  },
  {
    cat: "AI / ML Engineering", icon: "◈",
    desc: "Model training, inference optimization, and production ML service architecture.",
    items: ["Python", "FastAPI", "LangGraph", "PyTorch", "TensorFlow", "Hugging Face", "ComfyUI", "vLLM", "Ollama", "ONNX Runtime"],
  },
  {
    cat: "LLM & RAG Systems", icon: "◎",
    desc: "Retrieval-augmented generation with vector databases and semantic search.",
    items: ["RAG Pipelines", "pgvector", "Neo4j", "Embeddings", "Qwen Models", "Semantic Search"],
  },
];

const SUPPORTING = [
  { cat: "DevOps & Infra", icon: "▣", items: ["Docker", "Turborepo", "pnpm", "Node.js", "BullMQ", "Cloudflare R2", "MinIO", "Redis"] },
  { cat: "Databases & ORM", icon: "▧", items: ["PostgreSQL", "pgvector", "Neo4j", "MySQL", "Drizzle ORM", "Eloquent ORM", "Redis"] },
  { cat: "Computer Vision", icon: "○", items: ["YOLO", "UNet", "TFLite", "OpenCV", "Raspberry Pi", "Coral Edge TPU", "Tkinter"] },
  { cat: "Speech & Audio AI", icon: "◉", items: ["Kokoro TTS", "Fish Speech", "faster-whisper", "Voice Cloning", "Audio Pipelines"] },
  { cat: "Biometrics", icon: "◇", items: ["Face Recognition", "ArcFace", "RetinaFace", "Iris Detection", "Iris Segmentation"] },
];


const TAG_BASE: React.CSSProperties = {
  borderRadius: 20,
  fontFamily: "var(--font-jetbrains-mono), monospace",
  letterSpacing: "0.02em",
};

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
      <RevealBlock direction="up" delay={0}>
        <SectionLabel
          tag="02 · Skill Systems"
          title="Technical capabilities."
          subtitle="Eight domains: web engineering, AI and ML, LLM systems, computer vision, biometrics, speech, databases, and infrastructure."
        />
      </RevealBlock>

      {/* Featured tier — 3 primary domains */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          marginBottom: 12,
        }}
      >
        {FEATURED.map((s, i) => {
          const isActive = active === i;
          return (
            <RevealBlock key={s.cat} direction="up" delay={i * 60}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? null : i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(isActive ? null : i); } }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface)"; }}
                style={{
                  background: isActive ? "var(--surface2)" : "var(--surface)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 16,
                  padding: "24px 24px 20px",
                  cursor: "pointer",
                  transition: "all 0.25s",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isActive ? "0 0 32px var(--accent-glow)" : "none",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                {immersive && isActive && (
                  <div
                    style={{
                      position: "absolute",
                      top: -30, right: -30,
                      width: 100, height: 100,
                      background: "var(--accent-glow)",
                      borderRadius: "50%",
                      filter: "blur(30px)",
                    }}
                  />
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <span
                    style={{
                      fontSize: 22,
                      color: isActive ? "var(--accent)" : "var(--text-muted)",
                      transition: "color 0.25s",
                    }}
                  >
                    {s.icon}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 14,
                      color: "var(--text-dim)",
                      lineHeight: 1,
                      transition: "transform 0.2s ease, color 0.2s",
                      display: "inline-block",
                      transform: isActive ? "rotate(45deg)" : "none",
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, letterSpacing: "-0.01em", color: "var(--text)" }}>
                  {s.cat}
                </h3>
                <p style={{ fontSize: 12, color: "var(--text-dim)", lineHeight: 1.55, marginBottom: 14 }}>
                  {s.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {s.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        ...TAG_BASE,
                        padding: "3px 9px",
                        fontSize: 11,
                        background: isActive ? "var(--surface)" : "var(--bg2)",
                        border: "1px solid var(--border)",
                        color: isActive ? "var(--text)" : "var(--text-muted)",
                        transition: "background 0.2s, color 0.2s",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </RevealBlock>
          );
        })}
      </div>

      {/* Tier divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 12px", opacity: 0.45 }}>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        <span className="font-mono" style={{ fontSize: 9, color: "var(--text-dim)", letterSpacing: "0.12em" }}>
          SPECIALIZED DOMAINS
        </span>
        <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      </div>

      {/* Supporting tier — 5 specialized domains */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 10,
        }}
      >
        {SUPPORTING.map((s, j) => {
          const i = j + FEATURED.length;
          const isActive = active === i;
          return (
            <RevealBlock key={s.cat} direction="up" delay={Math.min(j * 50 + 180, 350)}>
              <div
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                onClick={() => setActive(isActive ? null : i)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActive(isActive ? null : i); } }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface2)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "var(--surface)"; }}
                style={{
                  background: isActive ? "var(--surface2)" : "var(--surface)",
                  border: `1px solid ${isActive ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 12,
                  padding: 18,
                  cursor: "pointer",
                  transition: "all 0.25s",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: isActive ? "0 0 20px var(--accent-glow)" : "none",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <span style={{ fontSize: 16, opacity: 0.45 }}>{s.icon}</span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: 12,
                      color: "var(--text-dim)",
                      lineHeight: 1,
                      transition: "transform 0.2s ease",
                      display: "inline-block",
                      transform: isActive ? "rotate(45deg)" : "none",
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </div>
                <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.01em", color: "var(--text)" }}>
                  {s.cat}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {s.items.map((item) => (
                    <span
                      key={item}
                      style={{
                        ...TAG_BASE,
                        padding: "2px 7px",
                        fontSize: 10,
                        background: isActive ? "var(--surface)" : "var(--bg2)",
                        border: "1px solid var(--border)",
                        color: isActive ? "var(--text)" : "var(--text-muted)",
                        transition: "background 0.2s, color 0.2s",
                      }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </RevealBlock>
          );
        })}
      </div>
    </section>
  );
}
