"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import RevealBlock from "@/components/RevealBlock";
import ProjectImageLightbox from "@/components/ProjectImageLightbox";
import type { Project, ProjectSection } from "@/data/projects";

interface Props {
  project: Project;
  prev: Project | null;
  next: Project | null;
  projectIndex: number;
  prevIndex: number | null;
  nextIndex: number | null;
}

// ── Shared styles ──────────────────────────────────────────────────

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

const linkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "8px 14px",
  borderRadius: 20,
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--text-muted)",
  fontSize: 12,
  fontFamily: "inherit",
  cursor: "pointer",
  transition: "border-color 0.2s, color 0.2s",
  letterSpacing: "0.02em",
  textDecoration: "none",
};

function applyLinkHover(e: React.MouseEvent<HTMLAnchorElement>, entering: boolean) {
  e.currentTarget.style.borderColor = entering ? "var(--accent2)" : "var(--border)";
  e.currentTarget.style.color = entering ? "var(--text)" : "var(--text-muted)";
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width={13} height={13} fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

// ── Hatched placeholder ────────────────────────────────────────────

function HatchedZone({
  height,
  num,
  rounded,
}: {
  height: number | string;
  num?: string;
  rounded?: number;
}) {
  return (
    <div
      style={{
        height,
        borderRadius: rounded,
        background:
          "repeating-linear-gradient(45deg, var(--surface2) 0px, var(--surface2) 1px, transparent 1px, transparent 12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {num && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 25%, var(--bg) 100%)",
            pointerEvents: "none",
          }}
        />
      )}
      {num && (
        <span
          aria-hidden="true"
          className="font-mono"
          style={{
            fontSize: "clamp(80px, 14vw, 160px)",
            fontWeight: 700,
            color: "var(--text-dim)",
            opacity: 0.1,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            userSelect: "none",
            position: "relative",
            zIndex: 1,
          }}
        >
          {num}
        </span>
      )}
    </div>
  );
}

// ── Narrative section block ────────────────────────────────────────

function NarrativeSection({
  section,
  index,
  onImageClick,
}: {
  section: ProjectSection;
  index: number;
  onImageClick: (src: string, alt: string) => void;
}) {
  const eyebrow = `${String(index).padStart(2, "0")} · ${section.type.toUpperCase()}`;

  if (section.type === "architecture" && !section.diagram && !section.body) {
    return null;
  }

  return (
    <RevealBlock direction="up" delay={index * 60}>
      <div style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
        {/* Eyebrow */}
        <div
          className="font-mono"
          style={{
            fontSize: 11,
            color: "var(--accent)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 20,
              height: 1,
              background: "var(--accent)",
              display: "inline-block",
              flexShrink: 0,
            }}
          />
          {eyebrow}
        </div>

        {/* Body */}
        {(section.type === "context" || section.type === "approach") && (
          <p
            style={{
              fontSize: 15,
              color: "var(--text-muted)",
              lineHeight: 1.75,
              maxWidth: "65ch",
            }}
          >
            {section.body}
          </p>
        )}

        {section.type === "architecture" && (
          <div>
            {section.diagram ? (
              <img
                src={section.diagram}
                alt="Architecture diagram"
                loading="lazy"
                onClick={() => onImageClick(section.diagram!, "Architecture diagram")}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  cursor: "zoom-in",
                  display: "block",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                <HatchedZone height="100%" />
              </div>
            )}
            {section.body && (
              <p
                style={{
                  marginTop: 16,
                  fontSize: 14,
                  color: "var(--text-muted)",
                  lineHeight: 1.65,
                  maxWidth: "65ch",
                }}
              >
                {section.body}
              </p>
            )}
          </div>
        )}

        {section.type === "screenshots" && (
          <div>
            {section.images.length === 0 ? (
              <div
                style={{
                  width: "100%",
                  height: 220,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                }}
              >
                <HatchedZone height="100%" />
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 12,
                }}
              >
                {section.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    loading="lazy"
                    onClick={() => onImageClick(src, `Screenshot ${i + 1}`)}
                    style={{
                      width: "100%",
                      aspectRatio: "16/9",
                      objectFit: "cover",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                      cursor: "zoom-in",
                      display: "block",
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  />
                ))}
              </div>
            )}
            {section.caption && (
              <p
                className="font-mono"
                style={{
                  marginTop: 10,
                  fontSize: 11,
                  color: "var(--text-dim)",
                  letterSpacing: "0.06em",
                }}
              >
                {section.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </RevealBlock>
  );
}

// ── Prev / Next nav item ───────────────────────────────────────────

function ProjectNavItem({
  project,
  direction,
  index,
}: {
  project: Project;
  direction: "prev" | "next";
  index: number;
}) {
  const [hov, setHov] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  const isPrev = direction === "prev";

  return (
    <Link
      href={`/projects/${project.slug}`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "block",
        padding: "28px 0",
        textDecoration: "none",
        borderTop: `1px solid ${hov ? "var(--accent2)" : "var(--border)"}`,
        transform: hov ? "translateY(-2px)" : "translateY(0)",
        transition:
          "border-color 0.2s, transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
        textAlign: isPrev ? "left" : "right",
      }}
    >
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 6,
          justifyContent: isPrev ? "flex-start" : "flex-end",
        }}
      >
        {isPrev && <ArrowLeft size={11} strokeWidth={1.5} />}
        {isPrev ? "Prev" : "Next"}
        {!isPrev && <ArrowRight size={11} strokeWidth={1.5} />}
      </div>
      <div
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          color: hov ? "var(--text)" : "var(--text-muted)",
          transition: "color 0.2s",
          marginBottom: 4,
        }}
      >
        {project.title}
      </div>
      <span
        className="font-mono"
        style={{
          fontSize: 11,
          color: "var(--text-dim)",
          letterSpacing: "0.08em",
        }}
      >
        {project.role} · {num}
      </span>
    </Link>
  );
}

// ── Left rail ──────────────────────────────────────────────────────

function LeftRail({ project, num }: { project: Project; num: string }) {
  return (
    <aside style={{ position: "sticky", top: 88, alignSelf: "start" }}>
      {/* Back */}
      <Link
        href="/#projects"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          textDecoration: "none",
          color: "var(--text-muted)",
          fontSize: 13,
          marginBottom: 28,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        <ArrowLeft size={13} strokeWidth={1.5} />
        Work
      </Link>

      {/* Project number */}
      <div
        className="font-mono"
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: "var(--text-dim)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginBottom: 24,
          opacity: 0.35,
        }}
      >
        {num}
      </div>

      <div
        style={{
          width: "100%",
          height: 1,
          background: "var(--border)",
          marginBottom: 20,
        }}
      />

      {/* Role */}
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Role
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-muted)",
          marginBottom: 16,
          lineHeight: 1.45,
        }}
      >
        {project.role}
      </div>

      {/* Status badges */}
      {(project.inProgress || project.ai) && (
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}
        >
          {project.inProgress && <span style={badgeStyle}>IN PROGRESS</span>}
          {project.ai && <span style={badgeStyle}>AI</span>}
        </div>
      )}

      <div
        style={{
          width: "100%",
          height: 1,
          background: "var(--border)",
          marginBottom: 20,
        }}
      />

      {/* Stack */}
      <div
        className="font-mono"
        style={{
          fontSize: 10,
          color: "var(--text-dim)",
          letterSpacing: "0.10em",
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        Stack
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
        {project.tech.map((t) => (
          <span key={t} style={chipStyle}>
            {t}
          </span>
        ))}
      </div>

      {/* External links */}
      {(project.github || project.demo) && (
        <>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "var(--border)",
              marginBottom: 20,
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseEnter={(e) => applyLinkHover(e, true)}
                onMouseLeave={(e) => applyLinkHover(e, false)}
              >
                <GitHubIcon />
                GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                style={linkStyle}
                onMouseEnter={(e) => applyLinkHover(e, true)}
                onMouseLeave={(e) => applyLinkHover(e, false)}
              >
                <ExternalLink size={13} strokeWidth={1.5} />
                Live demo
              </a>
            )}
          </div>
        </>
      )}
    </aside>
  );
}

// ── Main component ─────────────────────────────────────────────────

export default function ProjectDetail({
  project,
  prev,
  next,
  projectIndex,
  prevIndex,
  nextIndex,
}: Props) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null
  );

  const num = String(projectIndex + 1).padStart(2, "0");
  const hasHeroImage = project.images.length > 0;

  const visibleSections = project.sections.filter((s) => {
    if (s.type === "architecture" && !s.diagram && !s.body) return false;
    return true;
  });

  return (
    <>
      {lightbox && (
        <ProjectImageLightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}

      <article>
        {/* ── HERO ZONE ──────────────────────────────────────────── */}
        <div
          style={{
            position: "relative",
            height: "clamp(280px, 44vh, 480px)",
            overflow: "hidden",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {hasHeroImage ? (
            <>
              <img
                src={project.images[0]}
                alt={`${project.title} preview`}
                onClick={() =>
                  setLightbox({
                    src: project.images[0],
                    alt: `${project.title} preview`,
                  })
                }
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  cursor: "zoom-in",
                  display: "block",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to bottom, transparent 55%, var(--bg) 100%)",
                  pointerEvents: "none",
                }}
              />
            </>
          ) : (
            <HatchedZone height="100%" num={num} />
          )}

          {/* Status badges */}
          <div
            style={{
              position: "absolute",
              top: 84,
              right: 20,
              display: "flex",
              gap: 6,
              zIndex: 2,
            }}
          >
            {project.inProgress && <span style={badgeStyle}>IN PROGRESS</span>}
            {project.ai && <span style={badgeStyle}>AI</span>}
          </div>
        </div>

        {/* ── ENTRY BLOCK ────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding:
              "clamp(2.5rem, 5vw, 4rem) clamp(1.5rem, 5vw, 4rem) clamp(2rem, 4vw, 3rem)",
          }}
        >
          {/* Back — mobile only */}
          <Link
            href="/#projects"
            className="md:hidden"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              textDecoration: "none",
              color: "var(--text-muted)",
              fontSize: 13,
              marginBottom: 24,
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
          >
            <ArrowLeft size={13} strokeWidth={1.5} />
            Work
          </Link>

          <RevealBlock direction="up">
            <div
              className="font-mono"
              style={{
                fontSize: 11,
                color: "var(--text-dim)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {project.role}
            </div>

            <h1
              style={{
                fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.06,
                color: "var(--text)",
                textWrap: "balance",
                marginBottom: 20,
              }}
            >
              {project.title}
            </h1>

            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.1rem)",
                color: "var(--text-muted)",
                lineHeight: 1.65,
                maxWidth: 560,
              }}
            >
              {project.headline}
            </p>
          </RevealBlock>

          {/* Mobile meta */}
          <div className="md:hidden" style={{ marginTop: 28 }}>
            <div
              style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}
            >
              {project.tech.map((t) => (
                <span key={t} style={chipStyle}>
                  {t}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={(e) => applyLinkHover(e, true)}
                  onMouseLeave={(e) => applyLinkHover(e, false)}
                >
                  <GitHubIcon />
                  GitHub
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  onMouseEnter={(e) => applyLinkHover(e, true)}
                  onMouseLeave={(e) => applyLinkHover(e, false)}
                >
                  <ExternalLink size={13} strokeWidth={1.5} />
                  Live demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── BODY (two-col on desktop) ──────────────────────────── */}
        <div
          className="project-detail-body"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)",
          }}
        >
          {/* Left rail — desktop only */}
          <div className="hidden md:block">
            <LeftRail project={project} num={num} />
          </div>

          {/* Narrative */}
          <div>
            {visibleSections.map((section, i) => (
              <NarrativeSection
                key={`${section.type}-${i}`}
                section={section}
                index={i + 1}
                onImageClick={(src, alt) => setLightbox({ src, alt })}
              />
            ))}
          </div>
        </div>

        {/* ── OUTCOME ────────────────────────────────────────────── */}
        <RevealBlock direction="up">
          <div
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              padding:
                "0 clamp(1.5rem, 5vw, 4rem) clamp(3rem, 6vw, 5rem)",
            }}
          >
            <div
              style={{
                width: "100%",
                height: 1,
                background: "var(--border)",
                marginBottom: 32,
              }}
            />
            <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
              <span
                aria-hidden="true"
                style={{
                  fontSize: 28,
                  color: "var(--text-dim)",
                  lineHeight: 1,
                  flexShrink: 0,
                  marginTop: 20,
                  fontWeight: 300,
                }}
              >
                →
              </span>
              <div>
                <div
                  className="font-mono"
                  style={{
                    fontSize: 10,
                    color: "var(--text-dim)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  Outcome
                </div>
                <p
                  style={{
                    fontSize: "clamp(1rem, 1.8vw, 1.1rem)",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    maxWidth: "65ch",
                    fontWeight: 400,
                  }}
                >
                  {project.outcome}
                </p>
              </div>
            </div>
          </div>
        </RevealBlock>

        {/* ── EXIT ───────────────────────────────────────────────── */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding:
              "clamp(2rem, 4vw, 3rem) clamp(1.5rem, 5vw, 4rem) clamp(4rem, 8vw, 6rem)",
          }}
        >
          {/* Prev / Next */}
          {(prev || next) && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                marginBottom: "clamp(3rem, 6vw, 5rem)",
              }}
            >
              {prev && prevIndex !== null ? (
                <ProjectNavItem
                  project={prev}
                  direction="prev"
                  index={prevIndex}
                />
              ) : (
                <div />
              )}
              {next && nextIndex !== null ? (
                <ProjectNavItem
                  project={next}
                  direction="next"
                  index={nextIndex}
                />
              ) : (
                <div />
              )}
            </div>
          )}

          {/* Contact CTA */}
          <div
            style={{
              textAlign: "center",
              padding: "clamp(2.5rem, 5vw, 4rem) 0",
              borderTop: "1px solid var(--border)",
            }}
          >
            <p
              style={{
                fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
                color: "var(--text-muted)",
                marginBottom: 20,
              }}
            >
              Interested in working together?
            </p>
            <Link
              href="/#contact"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 24px",
                borderRadius: 28,
                background: "var(--grad)",
                color: "var(--bg)",
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 600,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Get in touch
              <ArrowRight size={14} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </article>
    </>
  );
}
