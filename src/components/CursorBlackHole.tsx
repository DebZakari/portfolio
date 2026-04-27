"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useExperience } from "@/hooks/useExperience";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMounted } from "@/hooks/useIsMounted";

const INTERACTIVE =
  'a, button, input, textarea, select, label, [role="button"], [tabindex]:not([tabindex="-1"])';

const STYLE_ID = "__cursor-bh-hide";

export default function CursorBlackHole() {
  const { mode } = useExperience();
  const prefersReduced = useReducedMotion();
  const mounted = useIsMounted();
  const { resolvedTheme } = useTheme();
  // outer: position only — no transition so cursor tracks instantly
  const outerRef = useRef<HTMLDivElement>(null);
  // inner: visuals + scale — transition here doesn't affect tracking
  const innerRef = useRef<HTMLDivElement>(null);

  const active = mounted && mode === "immersive" && !prefersReduced;

  // Cursor suppression — separate effect, no resolvedTheme dep
  useEffect(() => {
    if (!active) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => document.getElementById(STYLE_ID)?.remove();
  }, [active]);

  // Cursor movement + interaction detection
  useEffect(() => {
    if (!active) return;

    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const isDark = resolvedTheme !== "light";
    const rgb = isDark ? "255,255,255" : "0,0,0";

    inner.style.transition =
      "border-color 0.15s ease-out, box-shadow 0.15s ease-out, transform 0.15s ease-out, opacity 0.2s";

    let prevInteractive = false;

    const applyNormal = () => {
      inner.style.borderColor = `rgba(${rgb},0.22)`;
      inner.style.boxShadow = `0 0 10px rgba(${rgb},0.1), 0 0 24px rgba(${rgb},0.04)`;
      inner.style.transform = "scale(1)";
    };

    const applyInteractive = () => {
      inner.style.borderColor = `rgba(${rgb},0.6)`;
      inner.style.boxShadow = `0 0 18px rgba(${rgb},0.2), 0 0 48px rgba(${rgb},0.08)`;
      inner.style.transform = "scale(1.3)";
    };

    applyNormal();

    const onMove = (e: PointerEvent) => {
      // Outer moves instantly — no transition, pure position
      outer.style.transform = `translate(${e.clientX - 14}px, ${e.clientY - 14}px)`;

      const isInteractive = !!(e.target as Element | null)?.closest(INTERACTIVE);
      if (isInteractive !== prevInteractive) {
        prevInteractive = isInteractive;
        isInteractive ? applyInteractive() : applyNormal();
      }
    };

    const onLeave = () => { outer.style.opacity = "0"; };
    const onEnter = () => { outer.style.opacity = "1"; };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, [active, resolvedTheme]);

  if (!active) return null;

  const isDark = resolvedTheme !== "light";

  return (
    // Outer: position carrier — no transition
    <div
      ref={outerRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 28,
        height: 28,
        transform: "translate(-200px, -200px)",
        pointerEvents: "none",
        zIndex: 99999,
        willChange: "transform",
      }}
    >
      {/* Inner: visuals + scale — transition here never affects cursor tracking */}
      <div
        ref={innerRef}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, #000 28%, rgba(0,0,0,0.55) 52%, transparent 72%)"
            : "radial-gradient(circle, rgba(0,0,0,0.85) 28%, rgba(0,0,0,0.3) 52%, transparent 72%)",
          border: "1.5px solid transparent",
        }}
      />
    </div>
  );
}
