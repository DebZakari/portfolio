"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface UseRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useReveal(options?: UseRevealOptions) {
  const {
    threshold = 0,
    rootMargin = "-10% 0px -10% 0px",
    once = true,
  } = options ?? {};

  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [observed, setObserved] = useState(false);

  useEffect(() => {
    if (reducedMotion) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setObserved(true);
          if (once) observer.unobserve(el);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion, threshold, rootMargin, once]);

  return { ref, visible: reducedMotion || observed };
}
