"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";
import StatsDrawer from "@/components/StatsDrawer";
import { TIMELINE, SYSTEMS, DOMAINS } from "@/data/stats";

const MONO: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
};

const PROFILE_ROWS = [
  ["name", "Dave Zachary Macarayo"],
  ["role", "Web Developer · AI Engineer · IoT · SQA"],
  ["degree", "BSc Computer Engineering"],
  ["focus", "LLMs · RAG · TTS · Vision · Edge AI"],
  ["stack", "Next.js, NestJS, Laravel, FastAPI, Python, Docker"],
  ["status", "Open to opportunities ✦"],
];

const TIMELINE_GROUPS = (() => {
  const years = [...new Set(TIMELINE.map((e) => e.date.split(" ")[1]))];
  return years.map((year) => ({
    year,
    entries: TIMELINE.filter((e) => e.date.split(" ")[1] === year),
  }));
})();

const STATS_ROW = [
  { key: "years",   label: "years",   value: "3+",  kind: "drawer" as const },
  { key: "systems", label: "systems", value: "20+", kind: "drawer" as const },
  { key: "domains", label: "domains", value: "4",   kind: "expand" as const },
];

export default function About() {
  const { mode } = useExperience();
  const immersive = mode === "immersive";
  const [modalOpen, setModalOpen] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);
  const [drawerType, setDrawerType] = useState<"years" | "systems" | null>(null);
  const [domainsOpen, setDomainsOpen] = useState(false);

  const closeModal = useCallback(() => setModalOpen(false), []);
  const closeDrawer = useCallback(() => setDrawerType(null), []);

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modalOpen, closeModal]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  function handleStatClick(key: string, kind: "drawer" | "expand") {
    if (kind === "expand") {
      setDomainsOpen((v) => !v);
    } else {
      setDrawerType((prev) => (prev === key ? null : key as "years" | "systems"));
    }
  }

  return (
    <>
      {/* Fullscreen photo modal */}
      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Profile photo fullscreen view"
          onClick={closeModal}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "clamp(1rem, 4vw, 3rem)",
            cursor: "zoom-out",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              position: "relative",
              maxWidth: 700,
              width: "100%",
              animation: "fadeScaleIn 180ms ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src="/images/ZEG00343.JPG"
              alt="Dave Zachary Macarayo — full portrait"
              width={700}
              height={875}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "auto",
                maxHeight: "88vh",
                borderRadius: 20,
                border: "1px solid var(--border)",
                display: "block",
              }}
              priority
            />
            <button
              onClick={closeModal}
              aria-label="Close photo"
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                cursor: "pointer",
                fontSize: 20,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeScaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

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
            minHeight: "100svh",
            padding: "clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: "clamp(2rem, 5vw, 5rem)", alignItems: "start" }}
          >
            {/* Left — text content */}
            <div>
              <RevealBlock direction="left" distance={32} delay={0}>
                <SectionLabel
                  tag="01 · Origin System"
                  title="The developer behind the system."
                  subtitle="Computer Engineering graduate turned full-stack developer with a focus on AI integration — I build practical, intelligent web systems that work."
                />
              </RevealBlock>
              <RevealBlock direction="up" delay={100}>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.75, fontSize: 15, marginBottom: 20, maxWidth: "65ch" }}>
                  My engineering background gives me a systems-level perspective
                  across the full stack. I&apos;ve built production web platforms
                  with Next.js and NestJS, designed AI microservices with FastAPI
                  and LangGraph, and deployed edge computer vision on Raspberry Pi
                  with Coral TPU accelerators.
                </p>
              </RevealBlock>
              <RevealBlock direction="up" delay={180}>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.75, fontSize: 15, maxWidth: "65ch" }}>
                  Whether it&apos;s orchestrating vLLM inference with RAG pipelines,
                  implementing SOTA TTS with voice cloning, or fine-tuning YOLO for
                  PCB component detection — I bring the same rigorous approach to
                  software quality and system design.
                </p>
              </RevealBlock>

              {/* Interactive stats row */}
              <RevealBlock direction="up" delay={260}>
                <div
                  style={{
                    marginTop: 32,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {STATS_ROW.map((stat) => {
                    const isActive =
                      stat.kind === "drawer"
                        ? drawerType === stat.key
                        : domainsOpen;
                    const toggle =
                      stat.kind === "drawer"
                        ? "›"
                        : domainsOpen
                        ? "▴"
                        : "▾";
                    return (
                      <button
                        key={stat.key}
                        onClick={() => handleStatClick(stat.key, stat.kind)}
                        aria-expanded={isActive}
                        style={{
                          display: "flex",
                          width: "calc(100% + 16px)",
                          alignItems: "center",
                          justifyContent: "space-between",
                          background: isActive ? "var(--surface2)" : "transparent",
                          border: "none",
                          borderBottom: "1px solid var(--border)",
                          padding: "11px 8px",
                          margin: "0 -8px",
                          cursor: "pointer",
                          borderRadius: 6,
                          transition: "background 0.15s",
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                          if (!isActive) e.currentTarget.style.background = "var(--surface2)";
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) e.currentTarget.style.background = "transparent";
                        }}
                      >
                        <span
                          style={{
                            ...MONO,
                            fontSize: 11,
                            color: "var(--text-dim)",
                            letterSpacing: "0.08em",
                          }}
                        >
                          $ {stat.label}
                        </span>
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <span
                            style={{
                              ...MONO,
                              fontSize: 15,
                              fontWeight: 600,
                              color: isActive ? "var(--text)" : "var(--text-muted)",
                              letterSpacing: "-0.02em",
                              transition: "color 0.15s",
                            }}
                          >
                            {stat.value}
                          </span>
                          <span
                            style={{
                              ...MONO,
                              fontSize: 11,
                              color: "var(--text-dim)",
                              transition: "transform 0.2s ease",
                              display: "inline-block",
                              transform:
                                stat.kind === "drawer" && isActive
                                  ? "translateX(2px)"
                                  : "none",
                            }}
                          >
                            {toggle}
                          </span>
                        </span>
                      </button>
                    );
                  })}

                  {/* Domain bar — inline expand */}
                  <div
                    style={{
                      overflow: "hidden",
                      maxHeight: domainsOpen ? "160px" : "0",
                      opacity: domainsOpen ? 1 : 0,
                      transition: "max-height 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease",
                    }}
                  >
                    <div style={{ paddingTop: 16, paddingBottom: 4 }}>
                      {/* Stacked bar */}
                      <div
                        style={{
                          height: 6,
                          borderRadius: 3,
                          overflow: "hidden",
                          display: "flex",
                          background: "var(--border)",
                          marginBottom: 12,
                        }}
                      >
                        {DOMAINS.map((d, i) => {
                          const SEGMENT_COLORS = [
                            "var(--accent2)",
                            "var(--accent)",
                            "oklch(0.72 0.15 260)",
                            "oklch(0.62 0.12 200)",
                          ];
                          return (
                            <div
                              key={d.label}
                              title={`${d.label} ${d.pct}%`}
                              style={{
                                height: "100%",
                                width: domainsOpen ? `${d.pct}%` : "0%",
                                background: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                                borderRight: i < DOMAINS.length - 1 ? "1px solid var(--bg2)" : "none",
                                transition: domainsOpen
                                  ? `width 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + i * 0.05}s`
                                  : "width 0.2s ease",
                              }}
                            />
                          );
                        })}
                      </div>
                      {/* Legend */}
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {DOMAINS.map((d, i) => {
                          const SEGMENT_COLORS = [
                            "var(--accent2)",
                            "var(--accent)",
                            "oklch(0.72 0.15 260)",
                            "oklch(0.62 0.12 200)",
                          ];
                          return (
                            <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div
                                style={{
                                  width: 8,
                                  height: 8,
                                  borderRadius: 2,
                                  background: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
                                  flexShrink: 0,
                                }}
                              />
                              <span style={{ ...MONO, fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.06em", flex: 1 }}>
                                {d.label}
                              </span>
                              <span style={{ ...MONO, fontSize: 10, color: "var(--text-dim)", letterSpacing: "0.06em" }}>
                                {d.pct}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </RevealBlock>
            </div>

            {/* Right — portrait card + profile card, stacked */}
            <RevealBlock
              direction="right"
              distance={40}
              delay={80}
              className="w-full md:max-w-[500px] md:justify-self-end"
              style={{ display: "flex", flexDirection: "column" }}
            >
              {/* Portrait card — rises above profile card on hover */}
              <div
                onMouseEnter={() => setImageHovered(true)}
                onMouseLeave={() => setImageHovered(false)}
                onClick={() => setModalOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="View full portrait photo"
                onKeyDown={(e) => e.key === "Enter" && setModalOpen(true)}
                style={{
                  position: "relative",
                  zIndex: imageHovered ? 3 : 1,
                  borderRadius: 20,
                  overflow: "hidden",
                  border: "1px solid var(--border)",
                  aspectRatio: "6 / 5",
                  cursor: "zoom-in",
                  transform: imageHovered ? "translateY(-10px)" : "translateY(0)",
                  boxShadow: imageHovered
                    ? "0 28px 56px rgba(0,0,0,0.45)"
                    : "0 4px 16px rgba(0,0,0,0.16)",
                  transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease",
                }}
              >
                <Image
                  src="/images/ZEG00343.JPG"
                  alt="Dave Zachary Macarayo"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 44vw, 500px"
                  style={{ objectFit: "cover", objectPosition: "58% 15%" }}
                  priority
                />

                {/* Zoom hint */}
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(4px)",
                    borderRadius: 8,
                    padding: "4px 10px",
                    fontSize: 11,
                    color: "#fff",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    letterSpacing: "0.06em",
                    pointerEvents: "none",
                    opacity: imageHovered ? 1 : 0,
                    transition: "opacity 180ms ease",
                  }}
                >
                  ⤢ view photo
                </div>
              </div>

              {/* Profile card — sits below image */}
              <div
                onMouseEnter={() => setCardHovered(true)}
                onMouseLeave={() => setCardHovered(false)}
                style={{
                  position: "relative",
                  zIndex: 2,
                  marginTop: 12,
                  background: "var(--surface)",
                  border: `1px solid ${cardHovered ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: 16,
                  padding: "18px 20px",
                  overflow: "hidden",
                  boxShadow: cardHovered
                    ? "0 20px 44px rgba(0,0,0,0.32), 0 0 0 1px var(--accent)"
                    : "0 18px 40px rgba(0,0,0,0.24)",
                  transform: cardHovered ? "translateY(-4px)" : "translateY(0)",
                  transition: "transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease",
                  cursor: "default",
                }}
              >
                {immersive && (
                  <div
                    style={{
                      position: "absolute",
                      top: -40,
                      right: -40,
                      width: 140,
                      height: 140,
                      background: "var(--accent-glow)",
                      borderRadius: "50%",
                      filter: "blur(40px)",
                    }}
                  />
                )}
                <div
                  className="font-mono"
                  style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.08em", marginBottom: 14 }}
                >
                  <span style={{ color: "var(--text-dim)" }}>$</span> profile --verbose
                </div>
                {PROFILE_ROWS.map(([k, v]) => (
                  <div
                    key={k}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "88px 1fr",
                      gap: 10,
                      padding: "6px 0",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    <span
                      className="font-mono"
                      style={{ fontSize: 10, color: "var(--accent)", letterSpacing: "0.04em" }}
                    >
                      {k}
                    </span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", lineHeight: 1.45 }}>
                      {v}
                    </span>
                  </div>
                ))}
              </div>
            </RevealBlock>
          </div>
        </section>
      </div>

      {/* Timeline drawer */}
      <StatsDrawer
        open={drawerType === "years"}
        onClose={closeDrawer}
        title="$ tail --follow logs/timeline.log"
      >
        <div style={{ position: "relative", paddingLeft: 24 }}>
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 5,
              top: 0,
              bottom: 0,
              width: 1,
              background: "var(--border)",
            }}
            aria-hidden="true"
          />

          {TIMELINE_GROUPS.map(({ year, entries }, gi) => (
            <div key={year} style={{ marginBottom: gi < TIMELINE_GROUPS.length - 1 ? 8 : 0 }}>
              {/* Year anchor */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  paddingTop: gi === 0 ? 0 : 16,
                  paddingBottom: 10,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: -19,
                    width: 11,
                    height: 11,
                    borderRadius: "50%",
                    border: "1.5px solid var(--accent2)",
                    background: "var(--surface)",
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    ...MONO,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "var(--accent2)",
                    letterSpacing: "0.1em",
                  }}
                >
                  {year}
                </span>
              </div>

              {/* Entries */}
              {entries.map((entry, ei) => (
                <div
                  key={entry.name}
                  style={{
                    position: "relative",
                    paddingBottom: ei < entries.length - 1 ? 12 : 0,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: -21,
                      top: 5,
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "var(--text-dim)",
                    }}
                    aria-hidden="true"
                  />
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.3,
                    }}
                  >
                    {entry.name}
                  </div>
                  <div
                    style={{
                      ...MONO,
                      fontSize: 10,
                      color: "var(--text-dim)",
                      letterSpacing: "0.06em",
                      marginTop: 3,
                    }}
                  >
                    {entry.type} · {entry.date}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </StatsDrawer>

      {/* Systems drawer */}
      <StatsDrawer
        open={drawerType === "systems"}
        onClose={closeDrawer}
        title="$ ls --count systems/"
      >
        <div>
          {SYSTEMS.map((sys, i) => (
            <div
              key={sys.title}
              style={{
                paddingTop: i === 0 ? 0 : 14,
                paddingBottom: 14,
                borderBottom: i < SYSTEMS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                  marginBottom: 7,
                }}
              >
                {sys.title}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {sys.stack.map((tech) => (
                  <span
                    key={tech}
                    style={{
                      ...MONO,
                      fontSize: 10,
                      color: "var(--text-dim)",
                      padding: "2px 7px",
                      borderRadius: 20,
                      border: "1px solid var(--border)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StatsDrawer>
    </>
  );
}
