"use client";

import { useState } from "react";
import { useActiveSection } from "@/hooks/useActiveSection";

const SECTIONS = [
  { id: "about",    label: "About"    },
  { id: "skills",   label: "Skills"   },
  { id: "projects", label: "Projects" },
  { id: "logs",     label: "Logs"     },
  { id: "contact",  label: "Contact"  },
];

export default function SideNav() {
  const activeSection = useActiveSection();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className="hidden lg:flex"
      style={{
        position: "fixed",
        right: 24,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 50,
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 20,
      }}
    >
      {SECTIONS.map((s) => {
        const isActive = activeSection === s.id;
        const isHov = hovered === s.id;

        return (
          <button
            key={s.id}
            aria-label={`Go to ${s.label}`}
            onClick={() =>
              document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth" })
            }
            onMouseEnter={() => setHovered(s.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 4,
              margin: -4,
            }}
          >
            {/* Label — fades in from right on hover or active */}
            <span
              className="font-mono"
              style={{
                fontSize: 9,
                color: isActive ? "var(--accent2)" : "var(--text-dim)",
                letterSpacing: "0.12em",
                opacity: isHov || isActive ? 1 : 0,
                transform: isHov || isActive ? "translateX(0)" : "translateX(6px)",
                transition: "opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1), transform 0.2s cubic-bezier(0.22, 1, 0.36, 1), color 0.2s",
                pointerEvents: "none",
                userSelect: "none",
                whiteSpace: "nowrap",
              }}
            >
              {s.label.toUpperCase()}
            </span>

            {/* Dot */}
            <div
              style={{
                width: isActive ? 8 : 6,
                height: isActive ? 8 : 6,
                borderRadius: "50%",
                background: isActive ? "var(--accent-vivid)" : "transparent",
                border: `1px solid ${
                  isActive ? "var(--accent-vivid)" : isHov ? "var(--accent2)" : "var(--border)"
                }`,
                transition: "all 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
                flexShrink: 0,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
