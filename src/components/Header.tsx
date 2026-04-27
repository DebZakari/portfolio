"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import {
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Zap,
  Menu,
  X,
} from "lucide-react";
import { useExperience } from "@/hooks/useExperience";
import { useIsMounted } from "@/hooks/useIsMounted";
import type { ExperienceMode } from "@/contexts/ExperienceContext";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

type ThemeValue = "light" | "dark" | "system";

const THEME_OPTIONS: {
  value: ThemeValue;
  label: string;
  Icon: React.ElementType;
}[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

const EXPERIENCE_OPTIONS: {
  value: ExperienceMode;
  label: string;
  description: string;
  Icon: React.ElementType;
}[] = [
  {
    value: "immersive",
    label: "Immersive",
    description: "Interactive galaxy and rich animations",
    Icon: Sparkles,
  },
  {
    value: "focus",
    label: "Focus",
    description: "Clean, fast, content-first",
    Icon: Zap,
  },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  if (!mounted) return <div className="w-[88px] h-8" aria-hidden="true" />;

  return (
    <div
      role="group"
      aria-label="Theme mode"
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
    >
      {THEME_OPTIONS.map(({ value, label, Icon }) => {
        const active = theme === value;
        return (
          <button
            key={value}
            onClick={() => setTheme(value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-[--duration-base]",
              active
                ? "bg-accent text-white"
                : "text-text-muted hover:text-text hover:bg-surface",
            ].join(" ")}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}

function ExperienceToggle() {
  const { mode, setMode } = useExperience();
  const mounted = useIsMounted();

  if (!mounted) return <div className="w-[72px] h-8" aria-hidden="true" />;

  return (
    <div
      role="group"
      aria-label="Experience mode"
      className="flex items-center gap-0.5 rounded-full border border-border p-0.5"
    >
      {EXPERIENCE_OPTIONS.map(({ value, label, description, Icon }) => {
        const active = mode === value;
        return (
          <button
            key={value}
            onClick={() => setMode(value)}
            aria-label={`${label} mode — ${description}`}
            aria-pressed={active}
            title={`${label}: ${description}`}
            className={[
              "flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-[--duration-base]",
              active
                ? "bg-accent text-white"
                : "text-text-muted hover:text-text hover:bg-surface",
            ].join(" ")}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section via IntersectionObserver — rootMargin centres detection band
  const setActive = useCallback((id: string) => setActiveSection(id), []);
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [setActive]);

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
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-[--duration-base]",
          scrolled
            ? "border-b border-border bg-surface/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        ].join(" ")}
      >
        <nav
          className="mx-auto flex h-full max-w-7xl items-center justify-between px-6"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <a
            href="#"
            className="font-semibold text-text tracking-tight text-lg hover:text-accent transition-colors duration-[--duration-base]"
            aria-label="Dave Macarayo — home"
          >
            DM
          </a>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-6" role="list">
            {NAV_LINKS.map(({ href, label }) => {
              const active = activeSection === href.slice(1);
              return (
                <li key={href}>
                  <a
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "text-sm font-medium transition-colors duration-[--duration-base]",
                      active ? "text-accent" : "text-text-secondary hover:text-text",
                    ].join(" ")}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Desktop toggles */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <ExperienceToggle />
          </div>

          {/* Mobile hamburger */}
          <button
            ref={toggleRef}
            className="flex md:hidden h-9 w-9 items-center justify-center rounded-md text-text-secondary hover:text-text hover:bg-surface transition-colors duration-[--duration-base]"
            aria-label={drawerOpen ? "Close menu" : "Open menu"}
            aria-expanded={drawerOpen}
            aria-controls="mobile-drawer"
            onClick={() => setDrawerOpen((v) => !v)}
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
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
          "fixed top-0 right-0 z-50 h-full w-72 bg-surface border-l border-border flex flex-col pt-20 pb-8 px-6 md:hidden",
          "transition-transform duration-[--duration-slow]",
          drawerOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
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
                      active
                        ? "text-accent bg-accent/10"
                        : "text-text-secondary hover:text-text hover:bg-surface-raised",
                    ].join(" ")}
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
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-widest mb-2">
              Theme
            </p>
            <ThemeToggle />
          </div>
          <div>
            <p className="text-xs font-medium text-text-muted uppercase tracking-widest mb-2">
              Experience
            </p>
            <ExperienceToggle />
          </div>
        </div>
      </div>
    </>
  );
}
