"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useExperience } from "@/hooks/useExperience";
import { useTheme } from "next-themes";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useIsMobile } from "@/hooks/useIsMobile";

const GalaxyCanvas = dynamic(() => import("./GalaxyCanvas"), { ssr: false });

export default function HeroSection() {
  const { mode } = useExperience();
  const { resolvedTheme } = useTheme();
  const immersive = mode === "immersive";
  const mounted = useIsMounted();
  const isMobile = useIsMobile();
  const [scrolled, setScrolled] = useState(false);
  const [hasActivatedImmersive, setHasActivatedImmersive] = useState(immersive);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!immersive || hasActivatedImmersive) return;
    const id = window.setTimeout(() => setHasActivatedImmersive(true), 0);
    return () => window.clearTimeout(id);
  }, [immersive, hasActivatedImmersive]);
  const isDark = mounted ? resolvedTheme !== "light" : true;
  const canUseGalaxyCanvas = mounted && !isMobile;
  const shouldMountGalaxyCanvas = canUseGalaxyCanvas && (immersive || hasActivatedImmersive);
  const showGalaxyCanvas = canUseGalaxyCanvas && immersive;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "clip",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            immersive && isDark
              ? "radial-gradient(ellipse 80% 60% at 70% 40%, oklch(12% 0.04 285 / 0.8) 0%, var(--bg) 70%)"
              : immersive
                ? "radial-gradient(ellipse 80% 60% at 70% 40%, oklch(90% 0.03 75) 0%, var(--bg) 70%)"
                : "var(--bg)",
          transition: "background 0.6s",
        }}
      />

      {/* Canvas — mount once used, pause in focus mode for smoother return */}
      {shouldMountGalaxyCanvas && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: showGalaxyCanvas ? 1 : 0,
            pointerEvents: showGalaxyCanvas ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
          aria-hidden={!showGalaxyCanvas}
        >
          <GalaxyCanvas active={showGalaxyCanvas} theme={resolvedTheme ?? "dark"} />
        </div>
      )}

      {/* Focus mode subtle grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          opacity: immersive ? 0 : 0.3,
          transition: "opacity 0.3s ease",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: 800,
          margin: "0 auto",
          padding: "clamp(6rem, 15vw, 10rem) clamp(1.5rem, 5vw, 4rem) 6rem",
        }}
      >
        <div
          className="font-mono"
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "var(--accent)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 24,
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
            }}
          />
          Web Developer · AI Engineer
        </div>

        <h1
          style={{
            fontSize: "clamp(2.4rem, 6vw, 5rem)",
            fontWeight: 700,
            lineHeight: 1.06,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            textWrap: "balance",
            color: "var(--text)",
          }}
        >
          The system behind the interface.
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: 520,
            marginBottom: 40,
          }}
        >
          I&apos;m Dave Zachary Macarayo. I engineer AI pipelines, inference
          layers, and edge systems; then build the interfaces that make them
          usable.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[
            { label: "View Projects", href: "#projects", primary: true },
            { label: "Contact Me", href: "#contact", primary: false },
          ].map((btn) => (
            <a
              key={btn.label}
              href={btn.href}
              style={{
                padding: "12px 22px",
                borderRadius: 28,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: "-0.01em",
                background: btn.primary ? "var(--grad)" : "transparent",
                color: btn.primary ? "var(--bg)" : "var(--text)",
                border: btn.primary ? "none" : "1px solid var(--border)",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                if (!btn.primary) {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                } else {
                  e.currentTarget.style.opacity = "0.85";
                }
              }}
              onMouseLeave={(e) => {
                if (!btn.primary) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text)";
                } else {
                  e.currentTarget.style.opacity = "1";
                }
              }}
            >
              {btn.label}
              {btn.primary && <span style={{ opacity: 0.8 }}>→</span>}
            </a>
          ))}
        </div>

        <p
          className="font-mono"
          style={{
            marginTop: 40,
            fontSize: 11,
            color: "var(--text-dim)",
            letterSpacing: "0.05em",
            opacity: showGalaxyCanvas ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            userSelect: "none",
          }}
          aria-hidden={!showGalaxyCanvas}
        >
          ↗ move cursor to interact with the star field
        </p>
      </div>

      {/* Scroll indicator — anchored to the hero to avoid mobile fixed-layer jitter */}
      <div
        className={immersive ? "animate-bob" : ""}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          color: "var(--text-dim)",
          fontSize: 18,
          fontFamily: "var(--font-jetbrains-mono), monospace",
          opacity: scrolled ? 0 : 1,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
          zIndex: 10,
          lineHeight: 1,
        }}
        aria-hidden="true"
      >
        ↓
      </div>
    </section>
  );
}
