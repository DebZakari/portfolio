"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function ScrollIndicator() {
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = document.getElementById("hero");
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={[
        "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none",
        "transition-opacity duration-[--duration-slow]",
        visible ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      <ChevronDown
        size={24}
        className="text-text-muted animate-bounce"
        strokeWidth={1.5}
      />
    </div>
  );
}
