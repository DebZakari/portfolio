"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useExperience } from "@/hooks/useExperience";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useCursorPosition } from "@/hooks/useCursorPosition";

const GalaxyScene = dynamic(() => import("./galaxy/GalaxyScene"), {
  ssr: false,
  loading: () => null,
});

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb, { passive: true });
  return () => window.removeEventListener("resize", cb);
}

function useParticleCount(): number {
  return useSyncExternalStore(
    subscribeResize,
    () => (window.innerWidth < 768 ? 2500 : 5000),
    () => 5000
  );
}

export default function GalaxyMount() {
  const { mode } = useExperience();
  const reducedMotion = useReducedMotion();
  const mounted = useIsMounted();
  const particleCount = useParticleCount();
  const [visible, setVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useCursorPosition(containerRef);

  useEffect(() => {
    if (mode !== "immersive" || reducedMotion) return;
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, [mode, reducedMotion]);

  if (!mounted || mode !== "immersive" || reducedMotion) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 z-[1] transition-opacity duration-[800ms]"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <GalaxyScene particleCount={particleCount} cursorRef={cursorRef} />
    </div>
  );
}
