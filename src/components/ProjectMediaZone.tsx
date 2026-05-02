"use client";

import Image from "next/image";
import type { Project } from "@/data/projects";

interface Props {
  project: Project;
  hovered: boolean;
  immersive: boolean;
  height: number;
  className?: string;
}

function GitHubIcon({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      title="View on GitHub"
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        zIndex: 2,
        color: "var(--text-dim)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 44,
        height: 44,
        margin: -14,
        padding: 14,
        borderRadius: 8,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dim)")}
    >
      <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    </a>
  );
}

const badgeStyle: React.CSSProperties = {
  padding: "3px 10px",
  borderRadius: 20,
  background: "var(--surface2)",
  border: "1px solid var(--border)",
  color: "var(--text-dim)",
  fontSize: 11,
  fontFamily: "var(--font-jetbrains-mono), monospace",
  letterSpacing: "0.06em",
};

function Badges({ project }: { project: Project }) {
  if (!project.inProgress && !project.ai) return null;
  return (
    <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 6, zIndex: 2 }}>
      {project.inProgress && <span style={badgeStyle}>IN PROGRESS</span>}
      {project.ai && <span style={badgeStyle}>AI</span>}
    </div>
  );
}

// ── Domain illustrations ──────────────────────────────────────────

function FourPointStar({ x, y, r = 5, op = 0.55 }: { x: number; y: number; r?: number; op?: number }) {
  const n = r * 0.12;
  const d = `M${x},${y - r} L${x + n},${y - n} L${x + r},${y} L${x + n},${y + n} L${x},${y + r} L${x - n},${y + n} L${x - r},${y} L${x - n},${y - n} Z`;
  return <path d={d} fill="currentColor" opacity={op} />;
}

function NovelVerseIllustration({ active }: { active: boolean }) {
  const bhx = 160, bhy = 44, bhR = 24, bhIn = 13;
  const outsidePath = `M0 0 H320 V160 H0 Z M${bhx - bhR - 1},${bhy} a${bhR + 1},${bhR + 1} 0 1,0 ${(bhR + 1) * 2},0 a${bhR + 1},${bhR + 1} 0 1,0 -${(bhR + 1) * 2},0 Z`;
  const bookLiftStyle: React.CSSProperties = {
    transform: active ? "translateY(-3px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };
  const orbitStyle: React.CSSProperties = {
    transform: active ? "translateY(-2px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };

  return (
    <svg
      viewBox="0 0 320 160"
      style={{ width: "100%", height: "100%", maxWidth: 320, maxHeight: 160 }}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="nv-clip-in">
          <circle cx={bhx} cy={bhy} r={bhR + 1} />
        </clipPath>
        <clipPath id="nv-clip-out">
          <path d={outsidePath} clipRule="evenodd" />
        </clipPath>
      </defs>

      {/* ✦ Stars */}
      <FourPointStar x={106} y={16} r={5} op={0.58} />
      <FourPointStar x={214} y={20} r={4} op={0.5} />
      <FourPointStar x={86} y={50} r={3} op={0.42} />
      <FourPointStar x={234} y={54} r={3.5} op={0.48} />
      <FourPointStar x={130} y={10} r={3} op={0.4} />
      <FourPointStar x={190} y={12} r={2.5} op={0.38} />

      <g style={orbitStyle}>
        {/* Orbital ring — behind circle */}
        <ellipse
          cx={bhx} cy={bhy} rx={42} ry={9}
          transform={`rotate(-32, ${bhx}, ${bhy})`}
          stroke="currentColor" strokeWidth="3.5"
          clipPath="url(#nv-clip-in)"
          opacity="0.28"
        />

        {/* Black hole outer ring */}
        <circle cx={bhx} cy={bhy} r={bhR} stroke="currentColor" strokeWidth="1.5" opacity="0.72" />

        {/* Black hole inner ring */}
        <circle cx={bhx} cy={bhy} r={bhIn} stroke="currentColor" strokeWidth="1" opacity="0.42" />

        {/* Orbital ring — in front of circle */}
        <ellipse
          cx={bhx} cy={bhy} rx={42} ry={9}
          transform={`rotate(-32, ${bhx}, ${bhy})`}
          stroke="currentColor" strokeWidth="3.5"
          clipPath="url(#nv-clip-out)"
          opacity="0.75"
        />
      </g>

      <g
        opacity={active ? 0.12 : 0}
        stroke="currentColor"
        strokeWidth="1"
        style={{
          transform: active ? "translate(5px, 6px)" : "translate(0, 0)",
          transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
        }}
      >
        <path d="M72 82 Q72 80 74 80 L153 80 L153 150 Q153 152 151 152 L74 152 Q72 152 72 150 Z" />
        <path d="M167 80 L246 80 Q248 80 248 82 L248 150 Q248 152 246 152 L169 152 Q167 152 167 150 Z" />
        <line x1="160" y1="80" x2="160" y2="152" strokeWidth="1.5" />
        <path d="M72 152 Q160 158 248 152" />
      </g>

      <g style={bookLiftStyle}>
        {/* Book — flat open book */}
        <g opacity={active ? 0.68 : 0.6} stroke="currentColor" strokeWidth="1">
          {/* Left page */}
          <path d="M72 82 Q72 80 74 80 L153 80 L153 150 Q153 152 151 152 L74 152 Q72 152 72 150 Z" />
          {/* Right page */}
          <path d="M167 80 L246 80 Q248 80 248 82 L248 150 Q248 152 246 152 L169 152 Q167 152 167 150 Z" />
          {/* Spine */}
          <line x1="160" y1="80" x2="160" y2="152" strokeWidth="1.5" />
          {/* Book base curve */}
          <path d="M72 152 Q160 158 248 152" />
        </g>

        {/* Text lines — left page */}
        <g opacity={active ? 0.28 : 0.22} stroke="currentColor" strokeWidth="0.75">
          <line x1="83" y1="94" x2="144" y2="94" />
          <line x1="83" y1="102" x2="138" y2="102" />
          <line x1="83" y1="110" x2="144" y2="110" />
          <line x1="83" y1="118" x2="134" y2="118" />
          <line x1="83" y1="126" x2="144" y2="126" />
          <line x1="83" y1="134" x2="140" y2="134" />
        </g>

        {/* Text lines — right page */}
        <g opacity={active ? 0.28 : 0.22} stroke="currentColor" strokeWidth="0.75">
          <line x1="176" y1="94" x2="237" y2="94" />
          <line x1="176" y1="102" x2="231" y2="102" />
          <line x1="176" y1="110" x2="237" y2="110" />
          <line x1="176" y1="118" x2="228" y2="118" />
          <line x1="176" y1="126" x2="237" y2="126" />
          <line x1="176" y1="134" x2="232" y2="134" />
        </g>
      </g>
    </svg>
  );
}

function EnrollmentIllustration({ active }: { active: boolean }) {
  const xs = [54, 118, 182, 246];
  const liftStyle: React.CSSProperties = {
    transform: active ? "translateY(-4px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };
  const progressStyle: React.CSSProperties = {
    transform: active ? "translateY(-2px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };

  return (
    <svg
      viewBox="0 0 320 160"
      style={{ width: "100%", height: "100%", maxWidth: 320, maxHeight: 160 }}
      fill="none"
      aria-hidden="true"
    >
      {/* Hover-only offset layers create depth without changing the drawing language. */}
      <g
        opacity={active ? 0.16 : 0}
        stroke="currentColor"
        strokeWidth="1"
        style={{
          transform: active ? "translate(5px, 6px)" : "translate(0, 0)",
          transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
        }}
      >
        <rect x="40" y="84" width="108" height="16" rx="3" />
        <rect x="158" y="84" width="122" height="16" rx="3" />
        <rect x="40" y="108" width="240" height="16" rx="3" />
        <rect x="100" y="134" width="120" height="20" rx="10" />
      </g>

      <g style={progressStyle}>
        {/* Progress track */}
        <line x1="54" y1="46" x2="246" y2="46" stroke="currentColor" strokeWidth="1" opacity="0.2" />
        {/* Filled segment — steps 1 and 2 done */}
        <line x1="54" y1="46" x2="182" y2="46" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />

        {/* Step nodes */}
        {xs.map((x, i) => {
          const done = i < 2;
          const current = i === 2;
          const op = done ? 0.7 : current ? 0.55 : 0.25;
          return (
            <g key={i} opacity={op}>
              <circle cx={x} cy={46} r={done ? 8 : 7} stroke="currentColor" strokeWidth={done ? 1.5 : 1} />
              {done && (
                <path
                  d={`M${x - 3.5},46 L${x - 1},48.5 L${x + 3.5},42`}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {!done && (
                <circle cx={x} cy={46} r={2.5} fill="currentColor" />
              )}
            </g>
          );
        })}

        {/* Step label stubs */}
        <g opacity="0.18" fill="currentColor">
          {xs.map((x, i) => (
            <g key={i}>
              <rect x={x - 20} y={60} width={40} height={4} rx={2} />
              <rect x={x - 14} y={67} width={28} height={3} rx={1.5} />
            </g>
          ))}
        </g>
      </g>

      <g style={liftStyle}>
        {/* Form fields */}
        <g opacity={active ? 0.48 : 0.38} stroke="currentColor" strokeWidth="1">
          <rect x="40" y="84" width="108" height="16" rx="3" />
          <rect x="158" y="84" width="122" height="16" rx="3" />
          <rect x="40" y="108" width="240" height="16" rx="3" />
        </g>

        {/* Field inner lines */}
        <g opacity={active ? 0.28 : 0.2} stroke="currentColor" strokeWidth="0.75">
          <line x1="50" y1="92" x2="108" y2="92" />
          <line x1="168" y1="92" x2="262" y2="92" />
          <line x1="50" y1="116" x2="212" y2="116" />
        </g>

        {/* Submit button */}
        <g opacity={active ? 0.58 : 0.48}>
          <rect x="100" y="134" width="120" height="20" rx="10" stroke="currentColor" strokeWidth="1.5" />
          <line x1="130" y1="144" x2="190" y2="144" stroke="currentColor" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
}

function IrisBiometricIllustration({ active }: { active: boolean }) {
  const cx = 160, cy = 80;

  // Neutral eye — both canthi at y=80, control points symmetric around x=160
  const lx = 96, rx = 224;
  const eyePath = `M${lx},80 C118,42 202,42 ${rx},80 C202,108 118,110 ${lx},80 Z`;

  const irisR = 32, pupilR = 13;
  const radials = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 * Math.PI) / 180;
    return {
      x1: cx + Math.cos(a) * (pupilR + 2),
      y1: cy + Math.sin(a) * (pupilR + 2),
      x2: cx + Math.cos(a) * (irisR - 2),
      y2: cy + Math.sin(a) * (irisR - 2),
    };
  });

  // Detection box: 12px pad — iris circle fully inside brackets with clear margin
  const pad = 12;
  const sqL = cx - irisR - pad, sqR = cx + irisR + pad;
  const sqT = cy - irisR - pad, sqB = cy + irisR + pad;
  const bk = 14;
  const eyeLiftStyle: React.CSSProperties = {
    transform: active ? "translateY(-3px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };
  const bracketLiftStyle: React.CSSProperties = {
    transform: active ? "translateY(-5px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };

  return (
    <svg
      viewBox="20 10 280 140"
      style={{ width: "100%", height: "100%", maxWidth: 320, maxHeight: 160 }}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="iris-eye-clip">
          <path d={eyePath} />
        </clipPath>
      </defs>

      {/* Crosshair */}
      <g opacity="0.18" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,4">
        <line x1={cx} y1={18} x2={cx} y2={sqT - 5} />
        <line x1={cx} y1={sqB + 5} x2={cx} y2={148} />
        <line x1={28} y1={cy} x2={sqL - 5} y2={cy} />
        <line x1={sqR + 5} y1={cy} x2={292} y2={cy} />
      </g>

      <g
        opacity={active ? 0.12 : 0}
        stroke="currentColor"
        strokeWidth="1"
        style={{
          transform: active ? "translate(5px, 6px)" : "translate(0, 0)",
          transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
        }}
      >
        <path d={eyePath} />
        <circle cx={cx} cy={cy} r={irisR} />
      </g>

      <g style={eyeLiftStyle}>
        {/* Iris — clipped to eye opening */}
        <g clipPath="url(#iris-eye-clip)">
          <circle cx={cx} cy={cy} r={irisR + 10} stroke="currentColor" strokeWidth="1" opacity="0.22" />
          <circle cx={cx} cy={cy} r={irisR} stroke="currentColor" strokeWidth="1.5" opacity={active ? 0.78 : 0.7} />
          <g opacity={active ? 0.38 : 0.32} stroke="currentColor" strokeWidth="0.75">
            {radials.map((r, i) => (
              <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
            ))}
          </g>
          <circle cx={cx} cy={cy} r={pupilR} stroke="currentColor" strokeWidth="1.5" opacity="0.78" />
          <circle cx={cx} cy={cy} r={pupilR - 5} stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
          <circle cx={cx + 9} cy={cy - 9} r={4} stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
        </g>

        {/* Eyelid outline */}
        <path d={eyePath} stroke="currentColor" strokeWidth="1.5" opacity={active ? 0.8 : 0.72} />
      </g>


      {/* Detection: 4 corner brackets only, hugging iris circle */}
      <g stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" opacity={active ? 0.86 : 0.78} style={bracketLiftStyle}>
        <path d={`M${sqL},${sqT + bk} V${sqT} H${sqL + bk}`} />
        <path d={`M${sqR - bk},${sqT} H${sqR} V${sqT + bk}`} />
        <path d={`M${sqL},${sqB - bk} V${sqB} H${sqL + bk}`} />
        <path d={`M${sqR - bk},${sqB} H${sqR} V${sqB - bk}`} />
      </g>
    </svg>
  );
}

function PCBVisionIllustration({ active }: { active: boolean }) {
  const componentLiftStyle: React.CSSProperties = {
    transform: active ? "translateY(-4px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };
  const bracketLiftStyle: React.CSSProperties = {
    transform: active ? "translateY(-3px)" : "translateY(0)",
    transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
  };

  return (
    <svg
      viewBox="0 0 320 160"
      style={{ width: "100%", height: "100%", maxWidth: 320, maxHeight: 160 }}
      fill="none"
      aria-hidden="true"
    >
      {/* PCB trace grid */}
      <g opacity="0.22" stroke="currentColor" strokeWidth="0.75">
        <line x1="18" y1="34" x2="302" y2="34" />
        <line x1="18" y1="58" x2="108" y2="58" />
        <line x1="174" y1="58" x2="302" y2="58" />
        <line x1="18" y1="88" x2="302" y2="88" />
        <line x1="58" y1="116" x2="262" y2="116" />
        <line x1="18" y1="130" x2="302" y2="130" />
        <line x1="58" y1="34" x2="58" y2="130" />
        <line x1="108" y1="58" x2="108" y2="116" />
        <line x1="158" y1="34" x2="158" y2="88" />
        <line x1="174" y1="58" x2="174" y2="88" />
        <line x1="238" y1="34" x2="238" y2="130" />
        <line x1="302" y1="34" x2="302" y2="130" />
      </g>

      {/* Via holes */}
      <g opacity="0.42" stroke="currentColor" strokeWidth="1">
        <circle cx="58" cy="34" r="4" />
        <circle cx="58" cy="88" r="4" />
        <circle cx="108" cy="88" r="4" />
        <circle cx="108" cy="116" r="4" />
        <circle cx="158" cy="34" r="4" />
        <circle cx="238" cy="34" r="4" />
        <circle cx="238" cy="88" r="4" />
        <circle cx="238" cy="130" r="4" />
      </g>
      <g opacity="0.42" stroke="currentColor" strokeWidth="0.5">
        <circle cx="58" cy="34" r="2" />
        <circle cx="58" cy="88" r="2" />
        <circle cx="108" cy="88" r="2" />
        <circle cx="238" cy="34" r="2" />
        <circle cx="238" cy="88" r="2" />
      </g>

      <g
        opacity={active ? 0.13 : 0}
        stroke="currentColor"
        strokeWidth="1"
        style={{
          transform: active ? "translate(5px, 6px)" : "translate(0, 0)",
          transition: "transform 0.28s ease-out, opacity 0.28s ease-out",
        }}
      >
        <rect x="76" y="38" width="54" height="30" rx="2" />
        <rect x="144" y="92" width="26" height="11" rx="1.5" />
        <rect x="80" y="108" width="20" height="9" rx="1" />
        <rect x="192" y="76" width="16" height="7" rx="1" />
      </g>

      {/* IC component + pins */}
      <g opacity={active ? 0.54 : 0.45} stroke="currentColor" strokeWidth="1" style={componentLiftStyle}>
        <rect x="76" y="38" width="54" height="30" rx="2" />
        <line x1="72" y1="44" x2="76" y2="44" />
        <line x1="72" y1="51" x2="76" y2="51" />
        <line x1="72" y1="58" x2="76" y2="58" />
        <line x1="130" y1="44" x2="134" y2="44" />
        <line x1="130" y1="51" x2="134" y2="51" />
        <line x1="130" y1="58" x2="134" y2="58" />
        {/* SMD pads */}
        <rect x="144" y="92" width="26" height="11" rx="1.5" />
        <rect x="80" y="108" width="20" height="9" rx="1" />
        <rect x="192" y="76" width="16" height="7" rx="1" />
      </g>

      {/* Detection bounding box */}
      <rect
        x="32"
        y="20"
        width="196"
        height="122"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="5,3"
        opacity={active ? 0.58 : 0.5}
        style={bracketLiftStyle}
      />

      {/* Corner brackets */}
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={active ? 0.86 : 0.78} style={bracketLiftStyle}>
        <path d="M32,42 L32,20 L54,20" />
        <path d="M206,20 L228,20 L228,42" />
        <path d="M32,120 L32,142 L54,142" />
        <path d="M206,142 L228,142 L228,120" />
      </g>

      {/* Detection label tag */}
      <g opacity="0.42">
        <rect x="32" y="8" width="48" height="12" rx="2" fill="currentColor" opacity="0.12" />
        <line x1="40" y1="14" x2="72" y2="14" stroke="currentColor" strokeWidth="0.75" />
      </g>
    </svg>
  );
}

const ILLUSTRATIONS: Record<string, (props: { active: boolean }) => React.ReactElement> = {
  novelverse: NovelVerseIllustration,
  "enrollment-v2": EnrollmentIllustration,
  "iris-biometric": IrisBiometricIllustration,
  "pcb-vision": PCBVisionIllustration,
};

export default function ProjectMediaZone({ project, hovered, immersive, height, className }: Props) {
  const hasImage = project.images.length > 0;

  const sharedStyle: React.CSSProperties = {
    height,
    position: "relative",
    overflow: "hidden",
    borderBottom: "1px solid var(--border)",
  };

  if (hasImage) {
    return (
      <div className={className} style={sharedStyle}>
        <Image
          src={project.images[0]}
          alt={`${project.title} screenshot`}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {project.github && <GitHubIcon href={project.github} />}
        <Badges project={project} />
      </div>
    );
  }

  const Illustration = ILLUSTRATIONS[project.slug];

  return (
    <div
      className={className}
      style={{
        ...sharedStyle,
        background: "var(--surface2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-secondary)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--accent2-glow)",
          opacity: immersive && hovered ? 1 : 0,
          transition: "opacity 0.3s",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px 24px",
        }}
      >
        {Illustration && <Illustration active={immersive && hovered} />}
      </div>
      {project.github && <GitHubIcon href={project.github} />}
      <Badges project={project} />
    </div>
  );
}
