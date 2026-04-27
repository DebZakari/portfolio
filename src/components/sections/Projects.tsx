"use client";

import { useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";

const PROJECTS = [
  {
    title: "RAG Knowledge Engine",
    desc: "Intelligent document QA system using retrieval-augmented generation. Users query private documents with LLM-powered answers grounded in source material.",
    tech: ["Next.js", "LangChain", "Pinecone", "OpenAI"],
    role: "Full-Stack Developer",
    ai: true,
    outcome: "Sub-2s query latency on 10k+ document corpus",
  },
  {
    title: "Biometric Auth Platform",
    desc: "Web-based identity verification system combining facial recognition with liveness detection for secure, passwordless login flows.",
    tech: ["React", "FastAPI", "OpenCV", "DeepFace"],
    role: "Lead Developer",
    ai: true,
    outcome: "99.2% accuracy, deployed for enterprise client",
  },
  {
    title: "SOTA TTS Integration",
    desc: "Custom speech synthesis pipeline integrated into a web application, enabling expressive, multilingual voice output from text inputs.",
    tech: ["XTTS", "Whisper", "Node.js", "React"],
    role: "AI Integration Engineer",
    ai: true,
    outcome: "Reduced voice production time by 80%",
  },
  {
    title: "Computer Vision Dashboard",
    desc: "Real-time object detection and analytics dashboard processing live video streams with YOLO-based models.",
    tech: ["Python", "YOLO", "React", "WebSockets"],
    role: "Full-Stack + ML Engineer",
    ai: true,
    outcome: "30 FPS inference at deployment scale",
  },
  {
    title: "Portfolio CMS",
    desc: "Content management system with AI-assisted content generation, markdown editing, and dynamic preview — purpose-built for developers.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI"],
    role: "Solo Developer",
    ai: false,
    outcome: "Used by 5+ developer clients",
  },
  {
    title: "Conversational Support Agent",
    desc: "LLM-powered customer support bot with escalation logic, intent classification, and CRM integration.",
    tech: ["React", "LangChain", "Supabase", "OpenAI"],
    role: "AI Developer",
    ai: true,
    outcome: "Handled 60% of tier-1 queries autonomously",
  },
];

export default function Projects() {
  const { mode } = useExperience();
  const immersive = mode === "immersive";
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div
      style={{
        background: "var(--bg2)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <section
        id="projects"
        style={{
          padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <SectionLabel
          tag="03 · Constellation Gallery"
          title="Project systems."
          subtitle="Web applications and AI integrations — each one a distinct system solving a real problem."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {PROJECTS.map((p, i) => {
            const isHov = hovered === i;
            return (
              <div
                key={p.title}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: "var(--surface)",
                  border: `1px solid ${isHov ? "var(--accent2)" : "var(--border)"}`,
                  borderRadius: 20,
                  overflow: "hidden",
                  transition: "all 0.3s",
                  boxShadow:
                    isHov && immersive
                      ? "0 8px 48px var(--accent2-glow)"
                      : "none",
                  transform:
                    isHov && immersive
                      ? "translateY(-4px)"
                      : "translateY(0)",
                }}
              >
                {/* Screenshot placeholder */}
                <div
                  style={{
                    height: 180,
                    background: `repeating-linear-gradient(45deg, var(--surface2) 0px, var(--surface2) 1px, transparent 1px, transparent 12px)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderBottom: "1px solid var(--border)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.3s",
                  }}
                >
                  {immersive && isHov && (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "var(--accent2-glow)",
                        transition: "opacity 0.3s",
                      }}
                    />
                  )}
                  <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: "var(--text-dim)",
                        letterSpacing: "0.1em",
                      }}
                    >
                      PROJECT SCREENSHOT
                    </div>
                    <div
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: "var(--text-dim)",
                        letterSpacing: "0.06em",
                        marginTop: 4,
                      }}
                    >
                      {p.title}
                    </div>
                  </div>
                  {p.ai && (
                    <div
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: "var(--surface2)",
                        border: "1px solid var(--border)",
                        color: "var(--text-muted)",
                        fontSize: 10,
                        fontFamily: "var(--font-jetbrains-mono), monospace",
                        letterSpacing: "0.06em",
                      }}
                    >
                      AI
                    </div>
                  )}
                </div>
                <div style={{ padding: 24 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                      marginBottom: 10,
                    }}
                  >
                    <h3
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                        color: "var(--text)",
                      }}
                    >
                      {p.title}
                    </h3>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 10,
                        color: "var(--text-dim)",
                        letterSpacing: "0.06em",
                        flexShrink: 0,
                        paddingTop: 3,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--text-muted)",
                      lineHeight: 1.6,
                      marginBottom: 16,
                    }}
                  >
                    {p.desc}
                  </p>
                  {/* Tech tags */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginBottom: 16,
                    }}
                  >
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        style={{
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "var(--bg)",
                          border: "1px solid var(--border)",
                          fontSize: 11,
                          color: "var(--text-dim)",
                          fontFamily: "var(--font-jetbrains-mono), monospace",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {/* Outcome */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      alignItems: "flex-start",
                      padding: "10px 14px",
                      background: "var(--bg)",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        color: "var(--accent2)",
                        fontSize: 12,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      →
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 11,
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                      }}
                    >
                      {p.outcome}
                    </span>
                  </div>
                  {/* Links */}
                  <div
                    style={{
                      marginTop: 16,
                      display: "flex",
                      gap: 10,
                    }}
                  >
                    {["Demo", "GitHub", "Case Study"].map((l) => (
                      <button
                        key={l}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 20,
                          border: "1px solid var(--border)",
                          background: "transparent",
                          color: "var(--text-muted)",
                          fontSize: 11,
                          fontFamily: "inherit",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          letterSpacing: "0.02em",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = "var(--accent2)";
                          e.currentTarget.style.color = "var(--accent2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = "var(--border)";
                          e.currentTarget.style.color = "var(--text-muted)";
                        }}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
