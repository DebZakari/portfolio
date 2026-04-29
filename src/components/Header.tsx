"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X } from "lucide-react";
import { useExperience } from "@/hooks/useExperience";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { ExperienceMode } from "@/contexts/ExperienceContext";

const NAV_LINKS = [
  { href: "#about",    label: "About"    },
  { href: "#skills",   label: "Skills"   },
  { href: "#projects", label: "Projects" },
  { href: "#logs",     label: "Logs"     },
  { href: "#contact",  label: "Contact"  },
];

function ModeToggle() {
  const { mode, setMode } = useExperience();
  const mounted = useIsMounted();

  if (!mounted) return <div className="w-[140px] h-[34px]" aria-hidden="true" />;

  return (
    <div
      style={{
        display: "flex",
        gap: 4,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 24,
        padding: 4,
      }}
    >
      {(["immersive", "focus"] as ExperienceMode[]).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            onClick={() => setMode(m)}
            aria-pressed={active}
            style={{
              padding: "5px 14px",
              borderRadius: 20,
              border: `1px solid ${active ? "var(--accent)" : "transparent"}`,
              background: active ? "var(--accent-glow)" : "transparent",
              color: active ? "var(--accent)" : "var(--text-muted)",
              fontFamily: "inherit",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.04em",
            }}
          >
            {m === "immersive" ? "Immersive" : "Focus"}
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();
  const isDark = theme !== "light";

  if (!mounted) return <div className="w-9 h-9" aria-hidden="true" />;

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Solar Dawn mode" : "Deep Space mode"}
      aria-label="Toggle theme"
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: "1px solid var(--border)",
        background: "var(--surface)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        transition: "all 0.2s",
        color: "var(--text)",
      }}
    >
      {isDark ? "☀" : "🌑"}
    </button>
  );
}

export default function Header() {
  const { resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const isDark = resolvedTheme !== "light";

  const activeSection = useActiveSection();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          transition: "background 0.4s, backdrop-filter 0.4s, border-color 0.4s",
          background: scrolled
            ? isDark
              ? "oklch(7% 0.02 265 / 0.85)"
              : "oklch(97% 0.012 75 / 0.88)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        }}
        className={scrolled ? (isDark ? "dark" : "light") : ""}
      >
        <nav
          className="flex w-full h-full items-center justify-between"
          aria-label="Primary"
        >
          {/* Logo */}
          <a
            href="#"
            aria-label="Back to top"
            style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "var(--grad)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--bg)",
                flexShrink: 0,
              }}
            >
              D
            </div>
            <span
              style={{
                fontWeight: 600,
                fontSize: 15,
                letterSpacing: "-0.02em",
                color: "var(--text)",
              }}
            >
              DZM
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center" style={{ gap: 8 }}>
            {NAV_LINKS.map((l) => {
              const active = activeSection === l.href.slice(1);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    fontSize: 14,
                    color: active ? "var(--text)" : "var(--text-muted)",
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: 8,
                    transition: "color 0.2s, background 0.2s",
                    background: active ? "var(--surface)" : "transparent",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--text)";
                    e.currentTarget.style.background = "var(--surface)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  {l.label}
                  {active && (
                    <span
                      style={{
                        position: "absolute",
                        bottom: 3,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--accent-vivid)",
                        display: "block",
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Controls */}
          <div className="hidden md:flex items-center" style={{ gap: 8 }}>
            <ModeToggle />
            <ThemeToggle />
            <a
              href="#contact"
              style={{
                padding: "8px 18px",
                borderRadius: 24,
                background: "var(--grad)",
                color: "var(--bg)",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={toggleRef}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-md transition-colors duration-[--duration-base]"
            style={{ color: "var(--text-muted)" }}
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {/* Reading progress bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            pointerEvents: "none",
            overflow: "hidden",
          }}
          aria-hidden="true"
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              background: "var(--accent-vivid)",
              transform: `scaleX(${scrollProgress})`,
              transformOrigin: "left",
              transition: "transform 0.1s linear",
              opacity: scrolled ? 1 : 0,
            }}
          />
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,0.6)" }}
          aria-hidden="true"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-drawer"
        role="dialog"
        aria-label="Navigation menu"
        aria-modal="true"
        className={[
          "fixed top-0 right-0 z-50 h-full w-72 flex flex-col pt-20 pb-8 px-6 md:hidden",
          "transition-transform duration-[--duration-slow]",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
        style={{
          background: "var(--surface)",
          borderLeft: "1px solid var(--border)",
        }}
      >
        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col gap-1" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active = activeSection === href.slice(1);
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "block rounded-md px-3 py-2.5 text-base font-medium transition-colors duration-[--duration-base]",
                    ].join(" ")}
                    style={{
                      color: active ? "var(--text)" : "var(--text-muted)",
                      background: active ? "var(--surface2)" : "transparent",
                    }}
                    onClick={() => setDrawerOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-4">
          <ModeToggle />
          <ThemeToggle />
          <a
            href="#contact"
            style={{
              padding: "10px 18px",
              borderRadius: 24,
              background: "var(--grad)",
              color: "var(--bg)",
              textDecoration: "none",
              fontSize: 14,
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            Hire Me
          </a>
        </div>
      </div>
    </>
  );
}
