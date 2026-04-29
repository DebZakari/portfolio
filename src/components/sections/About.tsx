"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useExperience } from "@/hooks/useExperience";
import SectionLabel from "@/components/SectionLabel";
import RevealBlock from "@/components/RevealBlock";

const STATS = [
  { v: "3+", l: "Years Building" },
  { v: "20+", l: "Systems Built" },
  { v: "4", l: "Core Domains" },
];

const PROFILE_ROWS = [
  ["name", "Dave Zachary Macarayo"],
  ["role", "Web Developer · AI Engineer · IoT · SQA"],
  ["degree", "BSc Computer Engineering"],
  ["focus", "LLMs · RAG · TTS · Vision · Edge AI"],
  ["stack", "Next.js, NestJS, Laravel, FastAPI, Python, Docker"],
  ["status", "Open to opportunities ✦"],
];

export default function About() {
  const { mode } = useExperience();
  const immersive = mode === "immersive";
  const [modalOpen, setModalOpen] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  const closeModal = useCallback(() => setModalOpen(false), []);

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
              <RevealBlock direction="up" delay={260}>
                <div
                  style={{
                    marginTop: 32,
                    display: "flex",
                    gap: 32,
                  }}
                >
                  {STATS.map((s, i) => (
                    <RevealBlock key={s.l} direction="up" delay={200 + i * 60}>
                      <div>
                        <div style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 700, color: "var(--text)" }}>
                          {s.v}
                        </div>
                        <div
                          className="font-mono"
                          style={{ fontSize: 11, color: "var(--text-dim)", letterSpacing: "0.06em", marginTop: 4 }}
                        >
                          {s.l}
                        </div>
                      </div>
                    </RevealBlock>
                  ))}
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

                {immersive && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(ellipse at 80% 20%, rgba(120,160,255,0.08) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />
                )}

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
                tabIndex={0}
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
                  cursor: "pointer",
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
                  <span style={{ color: "var(--accent-vivid)" }}>$</span> profile --verbose
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
    </>
  );
}
