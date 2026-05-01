"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";
import ProjectMediaZone from "@/components/ProjectMediaZone";
import { PROJECTS } from "@/data/projects";

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
            role="button"
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
              <ProjectMediaZone
                project={hero}
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
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
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
                  role="button"
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
                  <ProjectMediaZone
                    project={p}
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
