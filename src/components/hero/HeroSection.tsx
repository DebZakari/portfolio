"use client";

import dynamic from "next/dynamic";
import { useExperience } from "@/hooks/useExperience";
import { useTheme } from "next-themes";

const GalaxyCanvas = dynamic(() => import("./GalaxyCanvas"), { ssr: false });

export default function HeroSection() {
  const { mode } = useExperience();
  const { resolvedTheme } = useTheme();
  const immersive = mode === "immersive";
  const isDark = resolvedTheme !== "light";

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
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

      {/* Canvas */}
      {immersive && <GalaxyCanvas theme={resolvedTheme ?? "dark"} />}

      {/* Focus mode subtle grid */}
      {!immersive && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            opacity: 0.3,
          }}
        />
      )}

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
            color: "var(--accent2)",
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
              width: 24,
              height: 1,
              background: "var(--accent2)",
              display: "inline-block",
            }}
          />
          Computer Engineering Graduate · Web Developer · AI Engineer · IoT · SQA
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
          Building intelligent web experiences from interface to infrastructure.
        </h1>

        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.2rem)",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            maxWidth: 580,
            marginBottom: 40,
          }}
        >
          I&apos;m Dave Zachary Macarayo — a developer working across web
          engineering, AI systems, IoT edge devices, and software quality
          assurance. From full-stack platforms to biometric pipelines and
          embedded vision systems.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {[
            { label: "View Projects", href: "#projects", primary: true },
            { label: "Explore AI Work", href: "#skills", primary: false },
            { label: "Contact Me", href: "#contact", primary: false },
            { label: "Download Résumé", href: "#", primary: false, mono: true },
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
                fontFamily: btn.mono
                  ? "var(--font-jetbrains-mono), monospace"
                  : "inherit",
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

        {immersive && (
          <p
            className="font-mono"
            style={{
              marginTop: 40,
              fontSize: 11,
              color: "var(--text-dim)",
              letterSpacing: "0.05em",
            }}
          >
            ↗ move cursor to interact with the star field
          </p>
        )}
      </div>

      {/* Scroll indicator */}
      <div
        className={immersive ? "animate-bob" : ""}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "var(--text-dim)",
          fontSize: 11,
          letterSpacing: "0.08em",
          fontFamily: "var(--font-jetbrains-mono), monospace",
        }}
      >
        <span>SCROLL</span>
        <span style={{ fontSize: 16 }}>↓</span>
      </div>
    </section>
  );
}
