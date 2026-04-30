"use client";

import { useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";

const GITHUB = "https://github.com/DebZakari";

const PROJECTS = [
  {
    title: "NovelVerse",
    desc: "A next-generation web novel platform for deep immersion, collaborative storytelling, and AI-augmented reading. Full-stack monorepo with agentic AI microservices, SOTA TTS, RAG-powered semantic search, and voice cloning.",
    tech: ["Next.js 16", "NestJS 11", "FastAPI", "PostgreSQL + pgvector", "Neo4j", "LangGraph", "vLLM", "Docker"],
    role: "Solo Developer / Founder",
    ai: true,
    outcome: "End-to-end AI platform: RAG search, TTS narration, voice cloning",
    inProgress: true,
    github: null,
    demo: null,
  },
  {
    title: "Enrollment V2",
    desc: "Enterprise enrollment management system built for production use. Handles student registration, course allocation, and automated email workflows via SMTP integration.",
    tech: ["Laravel PHP", "MySQL", "Blade", "Tailwind CSS", "JavaScript", "SMTP"],
    role: "Full-Stack Developer",
    ai: false,
    outcome: "Deployed enterprise enrollment system in production",
    inProgress: false,
    github: null, // private repo
    demo: null,
  },
  {
    title: "PCB Components UI",
    desc: "Real-time PCB component detection system running on edge hardware. Fine-tuned YOLOv8 model for electronics inspection with a Tkinter-based desktop interface.",
    tech: ["Python", "Tkinter", "YOLOv8", "Raspberry Pi", "Coral Edge TPU"],
    role: "IoT / CV Engineer",
    ai: true,
    outcome: "Real-time edge inference for electronics manufacturing",
    inProgress: false,
    github: GITHUB, // TODO: replace with specific repo URL
    demo: null,
  },
  {
    title: "Iris Biometric System",
    desc: "End-to-end iris detection and segmentation pipeline for biometric authentication. Combines YOLO-based detection with UNet precision segmentation.",
    tech: ["Python", "PyTorch", "YOLO", "UNet", "Computer Vision"],
    role: "Computer Vision Engineer",
    ai: true,
    outcome: "Complete iris biometric detection + segmentation pipeline",
    inProgress: false,
    github: GITHUB, // TODO: replace with specific repo URL
    demo: null,
  },
  {
    title: "Face Recognition Pipeline",
    desc: "Complete face detection and recognition system using RetinaFace for localization and ArcFace for identity matching. Implemented in TensorFlow 2.0 with ResNet50 and MobileNetV2 backbones.",
    tech: ["Python", "TensorFlow 2.0", "RetinaFace", "ArcFace", "ResNet50"],
    role: "ML Engineer",
    ai: true,
    outcome: "99%+ accuracy face detection and recognition system",
    inProgress: false,
    github: GITHUB, // TODO: replace with specific repo URL
    demo: null,
  },
  {
    title: "FastAPI AI Microservice",
    desc: "Production-ready async AI microservice architecture built with FastAPI. Serves as the foundation for scalable ML model deployment and inference APIs.",
    tech: ["Python", "FastAPI", "AsyncIO", "Docker"],
    role: "Backend Engineer",
    ai: true,
    outcome: "Scalable async microservice for AI model serving",
    inProgress: false,
    github: GITHUB, // TODO: replace with specific repo URL
    demo: null,
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
        <RevealBlock direction="up" delay={0}>
          <SectionLabel
            tag="03 · Constellation Gallery"
            title="Project systems."
            subtitle="Web applications and AI integrations. Each one a distinct system solving a real problem."
          />
        </RevealBlock>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 20,
          }}
        >
          {PROJECTS.map((p, i) => {
            const isHov = hovered === i;
            const hasLinks = p.github || p.demo;
            return (
              <RevealBlock key={p.title} direction="up" delay={Math.min(i * 60, 300)}>
                <div
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
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
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
                    <div style={{ textAlign: "center", position: "relative", zIndex: 1 }} aria-hidden="true">
                      <div
                        className="font-mono"
                        style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.1em" }}
                      >
                        PROJECT SCREENSHOT
                      </div>
                      <div
                        className="font-mono"
                        style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.06em", marginTop: 4 }}
                      >
                        {p.title}
                      </div>
                    </div>

                    {/* Badges */}
                    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6 }}>
                      {p.inProgress && (
                        <div
                          style={{
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                            fontSize: 10,
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            letterSpacing: "0.06em",
                          }}
                        >
                          IN PROGRESS
                        </div>
                      )}
                      {p.ai && (
                        <div
                          style={{
                            padding: "3px 10px",
                            borderRadius: 20,
                            background: "var(--surface2)",
                            border: "1px solid var(--border)",
                            color: "var(--text-dim)",
                            fontSize: 10,
                            fontFamily: "var(--font-jetbrains-mono), monospace",
                            letterSpacing: "0.06em",
                          }}
                        >
                          AI
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
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
                        flex: 1,
                      }}
                    >
                      {p.desc}
                    </p>

                    {/* Tech tags */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                      {p.tech.map((t) => (
                        <span
                          key={t}
                          style={{
                            padding: "2px 8px",
                            borderRadius: 20,
                            background: "var(--bg2)",
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
                      <span style={{ color: "var(--text-muted)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>
                        →
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}
                      >
                        {p.outcome}
                      </span>
                    </div>

                    {/* Links — only render when real links exist */}
                    {hasLinks && (
                      <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {p.demo && (
                          <a
                            href={p.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkBtnStyle}
                            onMouseEnter={(e) => applyHover(e, true)}
                            onMouseLeave={(e) => applyHover(e, false)}
                          >
                            Demo
                          </a>
                        )}
                        {p.github && (
                          <a
                            href={p.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={linkBtnStyle}
                            onMouseEnter={(e) => applyHover(e, true)}
                            onMouseLeave={(e) => applyHover(e, false)}
                          >
                            GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </RevealBlock>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const linkBtnStyle: React.CSSProperties = {
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
  textDecoration: "none",
  display: "inline-block",
};

function applyHover(e: React.MouseEvent<HTMLAnchorElement>, entering: boolean) {
  e.currentTarget.style.borderColor = entering ? "var(--accent2)" : "var(--border)";
  e.currentTarget.style.color = entering ? "var(--text)" : "var(--text-muted)";
}
