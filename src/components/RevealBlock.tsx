"use client";

import React from "react";
import { useExperience } from "@/hooks/useExperience";
import { useReveal } from "@/hooks/useReveal";

type Direction = "up" | "left" | "right" | "none";

interface RevealBlockProps {
  children: React.ReactNode;
  delay?: number;
  direction?: Direction;
  distance?: number;
  className?: string;
  style?: React.CSSProperties;
}

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function hiddenTransform(direction: Direction, distance: number): string | undefined {
  switch (direction) {
    case "up":    return `translateY(${distance}px)`;
    case "left":  return `translateX(-${distance}px)`;
    case "right": return `translateX(${distance}px)`;
    case "none":  return undefined;
  }
}

function visibleTransform(direction: Direction): string | undefined {
  switch (direction) {
    case "up":    return "translateY(0px)";
    case "left":  return "translateX(0px)";
    case "right": return "translateX(0px)";
    case "none":  return undefined;
  }
}

export default function RevealBlock({
  children,
  delay = 0,
  direction = "up",
  distance = 20,
  className,
  style,
}: RevealBlockProps) {
  const { mode } = useExperience();
  const { ref, visible } = useReveal();

  if (mode !== "immersive") {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const hasTransform = direction !== "none";

  const transition = [
    `opacity 600ms ${EASE} ${delay}ms`,
    hasTransform ? `transform 600ms ${EASE} ${delay}ms` : null,
    `filter 500ms ${EASE} ${delay}ms`,
  ]
    .filter(Boolean)
    .join(", ");

  const animationStyle: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? visibleTransform(direction)
      : hiddenTransform(direction, distance),
    filter: visible ? "blur(0px)" : "blur(8px)",
    transition,
    willChange: visible ? "auto" : "opacity, transform, filter",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{ ...style, ...animationStyle }}
    >
      {children}
    </div>
  );
}
