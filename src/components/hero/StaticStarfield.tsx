import type { CSSProperties } from "react";

// Mulberry32 — deterministic PRNG, fixed seed avoids hydration mismatch
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  layer: 0 | 1 | 2;
  delay: number;
}

function generateStars(count: number, seed: number): Star[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const layer = Math.floor(rand() * 3) as 0 | 1 | 2;
    return {
      cx: rand() * 100,
      cy: rand() * 100,
      r: layer === 2 ? 1.2 + rand() * 0.8 : layer === 1 ? 0.7 + rand() * 0.5 : 0.3 + rand() * 0.3,
      opacity: 0.3 + rand() * 0.6,
      layer,
      delay: rand() * 6,
    };
  });
}

const STARS = generateStars(260, 0xdeadbeef);

const LAYER_CLASSES: Record<number, string> = {
  0: "star-twinkle-slow",
  1: "star-twinkle-mid",
  2: "star-twinkle-fast",
};

export default function StaticStarfield() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" fill="transparent" />
      {STARS.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={s.layer === 2 ? "#E0E7FF" : s.layer === 1 ? "#C7D2FE" : "#A5B4FC"}
          opacity={s.opacity}
          className={LAYER_CLASSES[s.layer]}
          style={{ "--twinkle-delay": `${s.delay}s` } as CSSProperties}
        />
      ))}
    </svg>
  );
}
