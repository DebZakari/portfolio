"use client";

import { useEffect, useRef } from "react";

export interface CursorPixelPos {
  x: number;
  y: number;
  containerWidth: number;
  containerHeight: number;
}

export function useCursorPosition(
  containerRef: React.RefObject<HTMLElement | null>
): React.MutableRefObject<CursorPixelPos | null> {
  const cursorRef = useRef<CursorPixelPos | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId = 0;

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        cursorRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          containerWidth: rect.width,
          containerHeight: rect.height,
        };
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rafId);
      cursorRef.current = null;
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(rafId);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [containerRef]);

  return cursorRef;
}
