"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";

const PROJECTS = [
  {
    title: "NovelVerse",
    desc: "Turns static reading into a living ecosystem. Nova, the AI reading companion, uses Agentic Hybrid RAG (Knowledge Graph + semantic search) to let readers interrogate story lore, with Spoiler Guard built in. Authors get Git-like branch and PR workflows for collaborative editing and translations. Backed by a FastAPI microservice with LangGraph orchestration, vLLM inference, and a narration engine that voices stories aloud with personalized voices and expressive prosody.",
    tech: ["Next.js 16", "NestJS 11", "FastAPI", "LangGraph", "pgvector", "Neo4j", "vLLM", "Turborepo"],
    role: "Solo Developer / Founder",
    ai: true,
    outcome: "Spoiler-aware AI reading companion + Git-like collaborative authoring",
    inProgress: true,
    slug: "novelverse",
    github: null,
    demo: null,
  },
  {
    title: "Enrollment V2",
    desc: "The original enrollment system was a single-page form: so long that users lost their place and gave up. The redesign breaks it into guided multi-step stages with progress saved to a generated code, no account required. Applicants leave and resume without starting over. Deployed in production for an academic institution and well-received.",
    tech: ["Laravel PHP", "MySQL", "Blade", "Tailwind CSS", "JavaScript", "SMTP"],
    role: "Full-Stack Developer",
    ai: false,
    outcome: "Multi-step enrollment with session-free progress saving; zero drop-off from form length",
    inProgress: false,
    slug: "enrollment-v2",
    github: null,
    demo: null,
  },
  {
    title: "Iris Biometric Pipeline",
    desc: "Full lifecycle of a production biometric system: trained the iris detection (YOLO) and segmentation (UNet) models from scratch, then built the FastAPI microservice that serves the pipeline into an existing Laravel web application. One project, full stack, from dataset to deployed API.",
    tech: ["Python", "PyTorch", "YOLO", "UNet", "FastAPI", "Docker"],
    role: "ML / Backend Engineer",
    ai: true,
    outcome: "Iris pipeline trained and served to production; Laravel integration live",
    inProgress: false,
    slug: "iris-biometric",
    github: null,
    demo: null,
  },
  {
    title: "PCB Vision System",
    desc: "Client-commissioned edge AI system built end-to-end: trained a custom YOLOv8 model on their PCB dataset, designed the full AI-to-UI interaction flow, and built a lightweight Tkinter interface for a Raspberry Pi 4. Coral Edge TPU acceleration delivers real-time inference at 2-3x the speed of ncnn. Boots with a branded splash screen and auto-starts the detection pipeline.",
    tech: ["Python", "YOLOv8", "Tkinter", "Raspberry Pi 4", "Coral Edge TPU", "ONNX"],
    role: "IoT / CV Engineer",
    ai: true,
    outcome: "Real-time PCB inspection on edge hardware; 2-3x inference speedup via Coral TPU",
    inProgress: false,
    slug: "pcb-vision",
    github: null,
    demo: null,
  },
];

type Project = (typeof PROJECTS)[0];

function GitHubIcon({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title="View on GitHub"
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 2,
        color: "var(--text-dim)",
        display: "flex",
        alignItems: "center",
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
    >
      <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    </a>
  );
}

function Badges({ project }: { project: Project }) {
  return (
    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 2 }}>
      {project.inProgress && <span style={badgeStyle}>IN PROGRESS</span>}
      {project.ai && <span style={badgeStyle}>AI</span>}
    </div>
  );
}

function PlaceholderZone({
  project,
  num,
  hovered,
  immersive,
  height,
  className,
}: {
  project: Project;
  num: string;
  hovered: boolean;
  immersive: boolean;
  height: number;
  className?: string;
}) {
  return (
    <div
      className={className}
      style={{
        height,
        background: `repeating-linear-gradient(45deg, var(--surface2) 0px, var(--surface2) 1px, transparent 1px, transparent 12px)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {immersive && hovered && (
        <div style={{ position: "absolute", inset: 0, background: "var(--accent2-glow)", transition: "opacity 0.3s" }} />
      )}
      <span
        aria-hidden="true"
        className="font-mono"
        style={{
          fontSize: 80,
          fontWeight: 700,
          color: "var(--text-dim)",
          opacity: 0.15,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          userSelect: "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        {num}
      </span>
      {project.github && <GitHubIcon href={project.github} />}
      <Badges project={project} />
    </div>
  );
}

export default function Projects() {
  const { mode } = useExperience();
  const immersive = mode === "immersive";
  const [hovered, setHovered] = useState<number | null>(null);
  const router = useRouter();

  const [hero, ...supporting] = PROJECTS;
  const heroHov = hovered === 0;

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

        {/* ── Hero card — NovelVerse ─────────────────────────────── */}
        <RevealBlock direction="up" delay={0}>
          <div
            role="link"
            tabIndex={0}
            className="project-card"
            onClick={() => router.push(`/projects/${hero.slug}`)}
            onKeyDown={(e) => e.key === "Enter" && router.push(`/projects/${hero.slug}`)}
            onMouseEnter={() => setHovered(0)}
            onMouseLeave={() => setHovered(null)}
            style={{
              background: "var(--surface)",
              border: `1px solid ${heroHov ? "var(--accent2)" : "var(--border)"}`,
              borderRadius: 20,
              overflow: "hidden",
              transition: "border-color 0.2s, box-shadow 0.25s, transform 0.25s",
              marginBottom: 16,
              boxShadow: heroHov && immersive ? "0 8px 48px var(--accent2-glow)" : "none",
              transform: heroHov && immersive ? "translateY(-4px)" : "translateY(0)",
              cursor: "pointer",
            }}
          >
            <div className="project-hero-inner">
              <PlaceholderZone
                project={hero}
                num="01"
                hovered={heroHov}
                immersive={immersive}
                height={220}
                className="project-hero-image-pane"
              />
              <div
                className="project-hero-content-pane"
                style={{ padding: 28, display: "flex", flexDirection: "column" }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 8 }}
                >
                  {hero.role}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  <h3
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.1,
                      color: "var(--text)",
                    }}
                  >
                    {hero.title}
                  </h3>
                  <span
                    className="font-mono"
                    style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.06em", flexShrink: 0, paddingTop: 6 }}
                  >
                    01
                  </span>
                </div>
                <p
                  style={{
                    fontSize: 14,
                    color: "var(--text-muted)",
                    lineHeight: 1.65,
                    marginBottom: 20,
                    flex: 1,
                  }}
                >
                  {hero.desc}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                  {hero.tech.map((t) => (
                    <span key={t} style={chipStyle}>
                      {t}
                    </span>
                  ))}
                </div>
                <div style={outcomeStyle}>
                  <span style={{ color: "var(--text-muted)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                  <span className="font-mono" style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {hero.outcome}
                  </span>
                </div>
                {hero.demo && (
                  <div style={{ marginTop: 20 }}>
                    <a
                      href={hero.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={linkBtnStyle}
                      onMouseEnter={(e) => applyHover(e, true)}
                      onMouseLeave={(e) => applyHover(e, false)}
                    >
                      Live demo →
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── Supporting grid ────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {supporting.map((p, i) => {
            const idx = i + 1;
            const num = String(idx + 1).padStart(2, "0");
            const isHov = hovered === idx;
            return (
              <RevealBlock key={p.title} direction="up" delay={Math.min(i * 60, 240)}>
                <div
                  role="link"
                  tabIndex={0}
                  className="project-card"
                  onClick={() => router.push(`/projects/${p.slug}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/projects/${p.slug}`)}
                  onMouseEnter={() => setHovered(idx)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: "var(--surface)",
                    border: `1px solid ${isHov ? "var(--accent2)" : "var(--border)"}`,
                    borderRadius: 20,
                    overflow: "hidden",
                    transition: "border-color 0.2s, box-shadow 0.25s, transform 0.25s",
                    boxShadow: isHov && immersive ? "0 8px 48px var(--accent2-glow)" : "none",
                    transform: isHov && immersive ? "translateY(-4px)" : "translateY(0)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                  }}
                >
                  <PlaceholderZone
                    project={p}
                    num={num}
                    hovered={isHov}
                    immersive={immersive}
                    height={160}
                  />
                  <div style={{ padding: 20, flex: 1, display: "flex", flexDirection: "column" }}>
                    <span
                      className="font-mono"
                      style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: 4 }}
                    >
                      {p.role}
                    </span>
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
                        style={{ fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.06em", flexShrink: 0, paddingTop: 2 }}
                      >
                        {num}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--text-muted)",
                        lineHeight: 1.6,
                        marginBottom: 14,
                        flex: 1,
                      }}
                    >
                      {p.desc}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      {p.tech.map((t) => (
                        <span key={t} style={chipStyle}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div style={outcomeStyle}>
                      <span style={{ color: "var(--text-muted)", fontSize: 12, flexShrink: 0, marginTop: 1 }}>→</span>
                      <span className="font-mono" style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.5 }}>
                        {p.outcome}
                      </span>
                    </div>
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

const badgeStyle: React.CSSProperties = {
  padding: "3px 10px",
  borderRadius: 20,
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  color: "var(--text-dim)",
  fontSize: 11,
  fontFamily: "var(--font-jetbrains-mono), monospace",
  letterSpacing: "0.06em",
};

const chipStyle: React.CSSProperties = {
  padding: "2px 8px",
  borderRadius: 20,
  background: "var(--bg)",
  border: "1px solid var(--border)",
  fontSize: 11,
  color: "var(--text-dim)",
  fontFamily: "var(--font-jetbrains-mono), monospace",
  letterSpacing: "0.06em",
};

const outcomeStyle: React.CSSProperties = {
  display: "flex",
  gap: 6,
  alignItems: "flex-start",
  padding: "10px 14px",
  background: "var(--bg)",
  borderRadius: 10,
  border: "1px solid var(--border)",
};

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
