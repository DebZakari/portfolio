"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SECTION_IDS = ["about", "skills", "projects", "logs", "contact"];

function routeSection(pathname: string): string | null {
  if (pathname === "/logs" || pathname.startsWith("/logs/")) return "logs";
  if (pathname.startsWith("/projects/")) return "projects";
  return null;
}

export function useActiveSection(): string {
  const pathname = usePathname();
  const [active, setActive] = useState("");

  const fromRoute = routeSection(pathname);

  useEffect(() => {
    if (fromRoute !== null) return;
    setActive(""); // clear stale state from previous route visit
    const onScroll = () => {
      if (window.scrollY < 80) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fromRoute]);

  useEffect(() => {
    if (fromRoute !== null) return;
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [fromRoute]);

  return fromRoute ?? active;
}
