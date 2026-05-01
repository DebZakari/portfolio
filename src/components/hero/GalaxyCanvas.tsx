"use client";

import { useEffect, useRef } from "react";

interface GalaxyCanvasProps {
  active: boolean;
  theme: string;
}

const OFFSCREEN = -9999;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const travelArc = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  progress: number,
  arc: number,
  spin: number,
) => {
  const eased = easeOutCubic(clamp(progress, 0, 1));
  const x = mix(fromX, toX, eased);
  const y = mix(fromY, toY, eased);
  const dx = toX - fromX;
  const dy = toY - fromY;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = -dy / dist;
  const ny = dx / dist;
  const bend = Math.sin(eased * Math.PI) * arc * (1 - eased * 0.45) * spin;

  return {
    x: x + nx * bend,
    y: y + ny * bend,
  };
};

type BackgroundStar = {
  x: number;
  y: number;
  r: number;
  opacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
};

type Planet = {
  paOffset: number;
  phase: number;
  orbitScale: number;
  orbitSpeedScale: number;
  sizeScale: number;
  pvx: number;
  pvy: number;
  pCaptured: boolean;
  pCaptureMs: number;
  pCapturePx: number;
  pCapturePy: number;
  pTargetX: number;
  pTargetY: number;
  pCaptureArc: number;
  pSpin: number;
  pOpacity: number;
  driftPx: number;
  driftPy: number;
  driftVx: number;
  driftVy: number;
};

type SpaceObj = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  tailLen: number;
  alpha: number;
  baseAlpha: number;
  kind: "meteor" | "comet";
  captured: boolean;
  captureMs: number;
  captureTotalMs: number;
  captureKind: "blackhole" | "star" | "planet" | null;
  captureFromX: number;
  captureFromY: number;
  captureTargetX: number;
  captureTargetY: number;
  captureArc: number;
  captureSpin: number;
  gravityResistance: number;
  gravityResponse: number;
  baseMaxSpeed: number;
  orbitSpin: number;
  orbitAffinity: number;
  orbitingBlackHole: boolean;
  orbitRadius: number;
  orbitAngle: number;
  orbitAngularSpeed: number;
  orbitRadiusTarget: number;
};

type RingSystem = {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  angle: number;
  opacity: number;
  ps: number;
  pr: number;
  starInfluence: number;
  starImpact: number;
  orbitBias: number;
  svx: number;
  svy: number;
  sCaptured: boolean;
  sCaptureMs: number;
  sCaptureStartX: number;
  sCaptureStartY: number;
  sTargetX: number;
  sTargetY: number;
  sCaptureArc: number;
  sSpin: number;
  sRespawnMs: number;
  planets: Planet[];
  starGlow: [string, string];
  starCore: [string, string];
};

type Nebula = {
  cx: number;
  cy: number;
  r: number;
  colorA: string;
  colorB: string;
};

type GravityBody = {
  kind: "star" | "planet";
  x: number;
  y: number;
  radius: number;
  influenceRadius: number;
  impactRadius: number;
  mass: number;
  orbitBias: number;
};

type Burst = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  lifeMs: number;
  totalMs: number;
  color: string;
};

type Scene = {
  width: number;
  height: number;
  dpr: number;
  stars: BackgroundStar[];
  rings: RingSystem[];
  nebulae: Nebula[];
  spaceObjects: SpaceObj[];
  bursts: Burst[];
  meteorNextMs: number;
  cometNextMs: number;
};

const galaxyRuntimeCache: {
  scene: Scene | null;
  time: number;
} = {
  scene: null,
  time: 0,
};

const makePlanet = (
  paOffset: number,
  orbitScale = 1,
  orbitSpeedScale = 1,
  sizeScale = 1,
): Planet => ({
  paOffset,
  phase: paOffset,
  orbitScale,
  orbitSpeedScale,
  sizeScale,
  pvx: 0,
  pvy: 0,
  pCaptured: false,
  pCaptureMs: 0,
  pCapturePx: 0,
  pCapturePy: 0,
  pTargetX: 0,
  pTargetY: 0,
  pCaptureArc: 0,
  pSpin: 1,
  pOpacity: 1,
  driftPx: 0,
  driftPy: 0,
  driftVx: 0,
  driftVy: 0,
});

const createScene = (width: number, height: number, dpr: number): Scene => {
  const area = width * height;
  const minDim = Math.min(width, height);
  const starCount = clamp(Math.round(area / 3800), 180, 460);
  const layerCutA = Math.floor(starCount * 0.72);
  const layerCutB = Math.floor(starCount * 0.92);
  const stars: BackgroundStar[] = Array.from({ length: starCount }, (_, i) => {
    const layer = i < layerCutA ? 0 : i < layerCutB ? 1 : 2;
    const x = Math.random() * width;
    const y = Math.random() * height;

    return {
      x,
      y,
      r:
        layer === 0
          ? Math.random() * 0.8 + 0.2
          : layer === 1
            ? Math.random() * 1.2 + 0.45
            : Math.random() * 1.8 + 0.9,
      opacity:
        layer === 0
          ? Math.random() * 0.45 + 0.2
          : layer === 1
            ? Math.random() * 0.55 + 0.3
            : Math.random() * 0.7 + 0.38,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    };
  });

  const primaryPlanetR = clamp(minDim * 0.0048, 2.8, 4.8);
  const secondaryPlanetR = clamp(minDim * 0.0038, 2.1, 3.6);
  const rings: RingSystem[] = [
    {
      cx: width * 0.72,
      cy: height * 0.38,
      rx: clamp(minDim * 0.175, 108, 170),
      ry: clamp(minDim * 0.058, 34, 56),
      angle: -0.32,
      opacity: 0.18,
      ps: 0.0038,
      pr: primaryPlanetR,
      starInfluence: clamp(minDim * 0.34, 165, 280),
      starImpact: clamp(primaryPlanetR * 4.5, 15, 24),
      orbitBias: 180,
      svx: 0,
      svy: 0,
      sCaptured: false,
      sCaptureMs: 0,
      sCaptureStartX: 0,
      sCaptureStartY: 0,
      sTargetX: 0,
      sTargetY: 0,
      sCaptureArc: 0,
      sSpin: 1,
      sRespawnMs: 0,
      planets: [
        makePlanet(0, 0.78, 1.02, 0.82),
        makePlanet(2.15, 1.02, 1, 1.12),
        makePlanet(4.25, 1.26, 0.98, 0.94),
      ],
      starGlow: ["rgba(120,160,255,0.6)", "rgba(60,100,220,0.45)"],
      starCore: ["rgba(180,210,255,0.98)", "rgba(50,90,210,0.92)"],
    },
    {
      cx: width * 0.25,
      cy: height * 0.65,
      rx: clamp(minDim * 0.12, 72, 115),
      ry: clamp(minDim * 0.04, 22, 34),
      angle: 0.5,
      opacity: 0.12,
      ps: 0.0052,
      pr: secondaryPlanetR,
      starInfluence: clamp(minDim * 0.25, 120, 215),
      starImpact: clamp(secondaryPlanetR * 4.8, 12, 20),
      orbitBias: 125,
      svx: 0,
      svy: 0,
      sCaptured: false,
      sCaptureMs: 0,
      sCaptureStartX: 0,
      sCaptureStartY: 0,
      sTargetX: 0,
      sTargetY: 0,
      sCaptureArc: 0,
      sSpin: 1,
      sRespawnMs: 0,
      planets: [
        makePlanet(0, 0.86, 1.01, 0.88),
        makePlanet(Math.PI + 0.35, 1.18, 0.99, 1.2),
      ],
      starGlow: ["rgba(255,245,200,0.55)", "rgba(200,140,0,0.4)"],
      starCore: ["rgba(255,250,220,0.95)", "rgba(220,160,20,0.9)"],
    },
  ];

  const nebulae: Nebula[] = [
    {
      cx: width * 0.8,
      cy: height * 0.2,
      r: clamp(minDim * 0.34, 160, 300),
      colorA: "rgba(255,255,255,0.04)",
      colorB: "transparent",
    },
    {
      cx: width * 0.2,
      cy: height * 0.75,
      r: clamp(minDim * 0.26, 120, 220),
      colorA: "rgba(255,255,255,0.03)",
      colorB: "transparent",
    },
  ];

  return {
    width,
    height,
    dpr,
    stars,
    rings,
    nebulae,
    spaceObjects: [],
    bursts: [],
    meteorNextMs: 8000 + Math.random() * 12000,
    cometNextMs: 22000 + Math.random() * 28000,
  };
};

const spawnSpaceObj = (kind: "meteor" | "comet", scene: Scene): SpaceObj => {
  const { width, height, rings } = scene;
  const edge = Math.floor(Math.random() * 4);
  const orbitalBias = Math.random() < (kind === "comet" ? 0.55 : 0.3);
  const targetRing = orbitalBias ? rings[Math.random() < 0.68 ? 0 : 1] : null;

  let x = 0;
  let y = 0;
  if (edge === 0) {
    x = Math.random() * width;
    y = -20;
  } else if (edge === 1) {
    x = width + 20;
    y = Math.random() * height;
  } else if (edge === 2) {
    x = Math.random() * width;
    y = height + 20;
  } else {
    x = -20;
    y = Math.random() * height;
  }

  let angle: number;
  if (targetRing) {
    const targetX = targetRing.cx + (Math.random() - 0.5) * targetRing.rx * 0.8;
    const targetY = targetRing.cy + (Math.random() - 0.5) * targetRing.ry * 1.6;
    const base = Math.atan2(targetY - y, targetX - x);
    const tangent = (Math.random() < 0.5 ? -1 : 1) * (0.4 + Math.random() * 0.35);
    angle = base + tangent;
  } else {
    angle = [Math.PI / 2, Math.PI, -Math.PI / 2, 0][edge] + (Math.random() - 0.5) * 1.0;
  }

  const speed = kind === "meteor" ? 3.8 + Math.random() * 3 : 1 + Math.random() * 1.5;
  const baseAlpha = 0.5 + Math.random() * 0.45;
  const radius = kind === "meteor" ? 0.8 + Math.random() * 0.8 : 1.8 + Math.random() * 1.6;
  const sizeTier =
    kind === "meteor"
      ? clamp((radius - 0.8) / 0.8, 0, 1)
      : clamp((radius - 1.8) / 1.6, 0, 1);
  const gravityResistance = mix(0.42, 0.92, sizeTier);
  const gravityResponse = mix(1.7, 1.12, sizeTier);
  const baseMaxSpeed = kind === "meteor" ? mix(10.2, 11.8, sizeTier) : mix(4.9, 6.2, sizeTier);
  const orbitSpin = Math.random() < 0.5 ? -1 : 1;
  const orbitAffinity = kind === "meteor" ? mix(0.68, 0.42, sizeTier) : mix(0.78, 0.5, sizeTier);

  return {
    x,
    y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    r: radius,
    tailLen: kind === "meteor" ? 24 + Math.random() * 26 : 70 + Math.random() * 90,
    alpha: baseAlpha,
    baseAlpha,
    kind,
    captured: false,
    captureMs: 0,
    captureTotalMs: 0,
    captureKind: null,
    captureFromX: 0,
    captureFromY: 0,
    captureTargetX: 0,
    captureTargetY: 0,
    captureArc: 0,
    captureSpin: 1,
    gravityResistance,
    gravityResponse,
    baseMaxSpeed,
    orbitSpin,
    orbitAffinity,
    orbitingBlackHole: false,
    orbitRadius: 0,
    orbitAngle: 0,
    orbitAngularSpeed: 0,
    orbitRadiusTarget: 0,
  };
};

export default function GalaxyCanvas({ active, theme }: GalaxyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const themeRef = useRef(theme);
  const stateRef = useRef<{
    scene: Scene | null;
    mouse: { x: number; y: number };
    animId: number | null;
    resizeTimer: number | null;
    redraw: (() => void) | null;
    syncPlayback: (() => void) | null;
    time: number;
  }>({
    scene: galaxyRuntimeCache.scene,
    mouse: { x: OFFSCREEN, y: OFFSCREEN },
    animId: null,
    resizeTimer: null,
    redraw: null,
    syncPlayback: null,
    time: galaxyRuntimeCache.time,
  });

  useEffect(() => {
    themeRef.current = theme;
    stateRef.current.redraw?.();
  }, [theme]);

  useEffect(() => {
    activeRef.current = active;
    stateRef.current.syncPlayback?.();
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const S = stateRef.current;

    const PLANET_G = 3400;
    const STAR_G = 760;
    const P_SPRING = 0.022;
    const S_SPRING = 0.014;
    const P_DAMP = 0.94;
    const S_DAMP = 0.91;
    const EV_PLANET = 20;
    const EV_STAR = 15;
    const EV_OBJ = 14;
    const TIDAL_R = 120;

    const P_TOTAL = 4200;
    const P_FADEOUT = 400;
    const P_FADEIN = 800;
    const S_TOTAL = 4200;
    const S_FADEOUT = 400;
    const S_FADEIN = 800;
    const S_RESPAWN_DELAY = 1200;
    const OBJ_FADE = 400;
    const OBJ_IMPACT_FADE = 320;

    const BH_RADIUS = 180;
    const BH_PLANET_PULL_RADIUS = 166;
    const BH_PLANET_CORE_BOOST = 2.35;
    const BH_STAR_PULL_RADIUS = 144;
    const BH_STAR_CORE_BOOST = 3;
    const BH_OBJ_OUTER_RADIUS_MIN = 148;
    const BH_OBJ_OUTER_RADIUS_FACTOR = 0.24;
    const BH_OBJ_CORE_RADIUS_MIN = 70;
    const BH_OBJ_CORE_RADIUS_RATIO = 0.46;
    const BH_LENS_OFFSET = 11;
    const BH_LENS_STRETCH = 1.6;
    const BH_LENS_ALPHA = 0.2;
    const BH_OBJ_GRAVITY = 10800;
    const BH_OBJ_CORE_BOOST = 5.8;
    const BH_OBJ_SPEED_BOOST = 4.8;
    const BH_OBJ_ORBIT_PULL = 0.24;
    const BH_OBJ_ORBIT_CORE_DAMP = 0.84;
    const BH_OBJ_SOFTENING = 32;
    const BH_ORBIT_CAPTURE_MIN = 42;
    const BH_ORBIT_CAPTURE_MAX = 104;
    const BH_ORBIT_TARGET_MIN = 52;
    const BH_ORBIT_TARGET_MAX = 84;
    const MAX_ACTIVE_METEORS = 3;
    const MAX_ACTIVE_COMETS = 2;
    const MAX_ORBITING_OBJECTS = 3;
    const MAX_SPACE_OBJECTS = 8;
    const STAR_OBJ_GRAVITY = 2200;
    const PLANET_OBJ_GRAVITY = 760;

    let t = S.time;
    let lastTs: number | null = null;
    let isDark = themeRef.current !== "light";
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const syncRuntimeCache = () => {
      S.time = t;
      galaxyRuntimeCache.scene = S.scene;
      galaxyRuntimeCache.time = t;
    };

    const rebuildScene = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (
        galaxyRuntimeCache.scene &&
        galaxyRuntimeCache.scene.width === width &&
        galaxyRuntimeCache.scene.height === height &&
        galaxyRuntimeCache.scene.dpr === dpr
      ) {
        S.scene = galaxyRuntimeCache.scene;
      } else {
        S.scene = createScene(width, height, dpr);
      }
      syncRuntimeCache();
    };

    const resetMouse = () => {
      S.mouse.x = OFFSCREEN;
      S.mouse.y = OFFSCREEN;
    };

    const drawStaticScene = () => {
      const scene = S.scene;
      if (!scene) return;
      isDark = themeRef.current !== "light";

      const { width: W, height: H, stars, rings, nebulae } = scene;
      ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      nebulae.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(nebula.cx, nebula.cy, 0, nebula.cx, nebula.cy, nebula.r);
        gradient.addColorStop(0, nebula.colorA);
        gradient.addColorStop(1, nebula.colorB);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      });

      stars.forEach((star) => {
        ctx.fillStyle = isDark ? `rgba(240,240,240,${star.opacity})` : `rgba(20,20,20,${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });

      rings.forEach((ring) => {
        const starR = ring.pr * 1.4;
        const glow = ctx.createRadialGradient(ring.cx, ring.cy, 0, ring.cx, ring.cy, starR * 5);
        glow.addColorStop(0, isDark ? ring.starGlow[0] : ring.starGlow[1]);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(ring.cx, ring.cy, starR * 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isDark ? ring.starCore[0] : ring.starCore[1];
        ctx.beginPath();
        ctx.arc(ring.cx, ring.cy, starR, 0, Math.PI * 2);
        ctx.fill();

        ring.planets.forEach((planet) => {
          const orbitState = getBoundOrbitState(ring.cx, ring.cy, ring, planet);
          const planetRadius = ring.pr * planet.sizeScale;
          const orbitAlpha = ring.opacity * 0.8;
          drawOrbitArc(ring.cx, ring.cy, orbitState.orbitRx, orbitState.orbitRy, ring.angle, 0, Math.PI * 2, orbitAlpha);
          drawOnePlanet(orbitState.ox, orbitState.oy, planetRadius, 1, 1, 0);
        });
      });
    };

    S.redraw = () => {
      if (S.scene && (reducedMotionQuery.matches || S.animId === null)) {
        drawStaticScene();
      }
    };

    const drawOnePlanet = (
      px: number,
      py: number,
      pr: number,
      pOpacity: number,
      tScale: number,
      tAngle: number,
    ) => {
      if (pOpacity <= 0.01) return;
      ctx.save();
      ctx.globalAlpha = pOpacity;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, pr * 3.5);
      glow.addColorStop(0, isDark ? "rgba(200,210,255,0.22)" : "rgba(0,0,40,0.18)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, pr * 3.5, 0, Math.PI * 2);
      ctx.fill();

      if (tScale > 1.05) {
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(tAngle);
        ctx.beginPath();
        ctx.ellipse(0, 0, pr * tScale, pr / Math.sqrt(tScale), 0, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(205,215,230,0.95)" : "rgba(20,20,35,0.88)";
        ctx.fill();
        ctx.restore();
      } else {
        ctx.beginPath();
        ctx.arc(px, py, pr, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(205,215,230,0.95)" : "rgba(20,20,35,0.88)";
        ctx.fill();
      }
      ctx.restore();
    };

    const drawOrbitArc = (
      cx: number,
      cy: number,
      rx: number,
      ry: number,
      angle: number,
      from: number,
      to: number,
      alpha: number,
    ) => {
      if (alpha <= 0.005) return;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, from, to);
      ctx.strokeStyle = isDark ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const getPlanetPhaseSpeed = (ring: RingSystem, planet: Planet) =>
      (ring.ps * planet.orbitSpeedScale) / Math.pow(Math.max(planet.orbitScale, 0.72), 1.5);

    const getBoundOrbitState = (scx: number, scy: number, ring: RingSystem, planet: Planet, phase = planet.phase) => {
      const orbitRx = ring.rx * planet.orbitScale;
      const orbitRy = ring.ry * planet.orbitScale;
      const cp = Math.cos(phase);
      const sp = Math.sin(phase);
      const ox = scx + orbitRx * cp * Math.cos(ring.angle) - orbitRy * sp * Math.sin(ring.angle);
      const oy = scy + orbitRx * cp * Math.sin(ring.angle) + orbitRy * sp * Math.cos(ring.angle);
      const angularSpeed = getPlanetPhaseSpeed(ring, planet);
      const orbitalVx =
        (-orbitRx * Math.sin(phase) * Math.cos(ring.angle) - orbitRy * Math.cos(phase) * Math.sin(ring.angle)) *
        angularSpeed;
      const orbitalVy =
        (-orbitRx * Math.sin(phase) * Math.sin(ring.angle) + orbitRy * Math.cos(phase) * Math.cos(ring.angle)) *
        angularSpeed;

      return {
        orbitRx,
        orbitRy,
        ox,
        oy,
        orbitalVx,
        orbitalVy,
      };
    };

    const getPlanetRenderPosition = (
      orbitState: ReturnType<typeof getBoundOrbitState>,
      planet: Planet,
    ) => {
      if (planet.pCaptured) {
        if (planet.pCaptureMs > P_TOTAL - P_FADEOUT) {
          const prog = (P_TOTAL - planet.pCaptureMs) / P_FADEOUT;
          return travelArc(
            planet.pCapturePx,
            planet.pCapturePy,
            planet.pTargetX,
            planet.pTargetY,
            prog,
            planet.pCaptureArc,
            planet.pSpin,
          );
        }

        if (planet.pCaptureMs > P_FADEIN) {
          return {
            x: planet.pTargetX,
            y: planet.pTargetY,
          };
        }

        return {
          x: orbitState.ox,
          y: orbitState.oy,
        };
      }

      return {
        x: orbitState.ox + planet.pvx,
        y: orbitState.oy + planet.pvy,
      };
    };

    const getCursorGravityPull = (
      dist: number,
      radius: number,
      base: number,
      edgeScale: number,
      curveScale: number,
      coreRatio: number,
      coreBoost: number,
    ) => {
      if (dist <= 1 || dist >= radius) return 0;
      const t = 1 - dist / radius;
      const curvePull = base * (edgeScale + t * t * curveScale);
      const coreRadius = radius * coreRatio;
      const coreT = dist < coreRadius ? Math.pow(1 - dist / coreRadius, 2) : 0;
      return curvePull * (1 + coreT * coreBoost);
    };

    const getBlackHoleObjectAcceleration = (
      obj: SpaceObj,
      dist: number,
      outerRadius: number,
      coreRadius: number,
    ) => {
      if (dist <= 1 || dist >= outerRadius) {
        return {
          radialAccel: 0,
          speedBoost: 0,
          tangentialAccel: 0,
        };
      }

      const outerT = 1 - dist / outerRadius;
      const normalizedResistance = clamp((obj.gravityResistance - 0.42) / (0.92 - 0.42), 0, 1);
      const curveExp = 1.15 + obj.gravityResistance * 0.4;
      const outerFloor = mix(0.18, 0.08, normalizedResistance);
      const outerRamp = (outerFloor + Math.pow(outerT, curveExp) * 1.1) * obj.gravityResponse;
      const coreT = dist < coreRadius ? Math.pow(1 - dist / coreRadius, 2) : 0;
      const coreBoost = 1 + coreT * BH_OBJ_CORE_BOOST * (0.9 + obj.gravityResistance * 0.35);
      const softenedDist2 = dist * dist + BH_OBJ_SOFTENING * BH_OBJ_SOFTENING;
      const radialAccel = (BH_OBJ_GRAVITY * outerRamp * coreBoost) / softenedDist2;
      const orbitCurve = obj.orbitAffinity * (0.36 + outerT * 0.64) * (1 - coreT * BH_OBJ_ORBIT_CORE_DAMP);
      const tangentialAccel = Math.min(radialAccel * BH_OBJ_ORBIT_PULL * orbitCurve, radialAccel * 0.42);

      return {
        radialAccel,
        speedBoost: coreT * BH_OBJ_SPEED_BOOST * (0.85 + obj.gravityResistance * 0.4),
        tangentialAccel,
      };
    };

    const shouldCaptureBlackHoleOrbit = (obj: SpaceObj, dirX: number, dirY: number, dist: number, dtF: number) => {
      if (dist < BH_ORBIT_CAPTURE_MIN || dist > BH_ORBIT_CAPTURE_MAX) return false;

      const speed = Math.hypot(obj.vx, obj.vy);
      if (speed < 0.4) return false;

      const inwardSpeed = obj.vx * dirX + obj.vy * dirY;
      const tangentialSpeed = Math.abs(obj.vx * -dirY + obj.vy * dirX);
      const tangentialBias = clamp(tangentialSpeed / Math.max(speed, 0.1), 0, 1);
      const inwardBias = clamp((inwardSpeed + 1.2) / 5.2, 0, 1);
      const sweetSpot = 1 - Math.abs(dist - (BH_ORBIT_CAPTURE_MIN + BH_ORBIT_CAPTURE_MAX) * 0.5) / 38;
      const baseChance = obj.kind === "meteor" ? 0.024 : 0.014;
      const captureChance = baseChance * clamp(sweetSpot, 0.2, 1) * mix(0.45, 1.75, tangentialBias) * inwardBias;

      return Math.random() < captureChance * dtF;
    };

    const startBlackHoleOrbit = (obj: SpaceObj, mx: number, my: number, dist: number) => {
      const targetRadius = clamp(dist, BH_ORBIT_TARGET_MIN, BH_ORBIT_TARGET_MAX);
      const speedSign = obj.vx * (obj.y - my) - obj.vy * (obj.x - mx);

      obj.orbitingBlackHole = true;
      obj.orbitRadius = dist;
      obj.orbitRadiusTarget = targetRadius;
      obj.orbitAngle = Math.atan2(obj.y - my, obj.x - mx);
      obj.orbitSpin = speedSign === 0 ? obj.orbitSpin : speedSign > 0 ? -1 : 1;
      obj.orbitAngularSpeed =
        obj.orbitSpin * (obj.kind === "meteor" ? mix(0.036, 0.052, obj.orbitAffinity) : mix(0.018, 0.03, obj.orbitAffinity));
    };

    const updateBlackHoleOrbit = (obj: SpaceObj, mx: number, my: number, dtF: number) => {
      obj.orbitAngle += obj.orbitAngularSpeed * dtF;
      obj.orbitRadius = mix(obj.orbitRadius, obj.orbitRadiusTarget, 0.018 * dtF);

      const nextX = mx + Math.cos(obj.orbitAngle) * obj.orbitRadius;
      const nextY = my + Math.sin(obj.orbitAngle) * obj.orbitRadius;
      obj.vx = (nextX - obj.x) / Math.max(dtF, 0.001);
      obj.vy = (nextY - obj.y) / Math.max(dtF, 0.001);
      obj.x = nextX;
      obj.y = nextY;
      obj.alpha = obj.baseAlpha;
    };

    rebuildScene();

    const draw = (ts: number) => {
      const scene = S.scene;
      if (!scene) {
        S.animId = requestAnimationFrame(draw);
        return;
      }

      isDark = themeRef.current !== "light";

      if (reducedMotionQuery.matches) {
        drawStaticScene();
        S.animId = null;
        return;
      }

      const dt = lastTs !== null ? Math.min(ts - lastTs, 50) : 16.67;
      lastTs = ts;
      const dtF = dt / 16.67;
      t += dt / 1000;

      const { width: W, height: H, stars, rings, nebulae, spaceObjects, bursts } = scene;
      ctx.setTransform(scene.dpr, 0, 0, scene.dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      nebulae.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(nebula.cx, nebula.cy, 0, nebula.cx, nebula.cy, nebula.r);
        gradient.addColorStop(0, nebula.colorA);
        gradient.addColorStop(1, nebula.colorB);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);
      });

      const mx = S.mouse.x;
      const my = S.mouse.y;
      const bhActive = mx !== OFFSCREEN;
      const gravityBodies: GravityBody[] = [];

      rings.forEach((ring) => {
        const scx = ring.cx + ring.svx;
        const scy = ring.cy + ring.svy;
        let starRenderX = scx;
        let starRenderY = scy;
        const starR = ring.pr * 1.4;

        let starTidalScale = 1;
        let starTidalAngle = 0;
        if (bhActive) {
          if (ring.sCaptured && ring.sCaptureMs > S_TOTAL - S_FADEOUT) {
            const prog = (S_TOTAL - ring.sCaptureMs) / S_FADEOUT;
            starTidalScale = 1 + Math.min(2.2, 2.5 * prog);
            starTidalAngle = Math.atan2(my - scy, mx - scx);
          } else if (!ring.sCaptured) {
            const sdx = mx - scx;
            const sdy = my - scy;
            const sd = Math.hypot(sdx, sdy);
            const starTidalRadius = TIDAL_R * 0.55;
            if (sd < starTidalRadius) {
              starTidalScale = 1 + 0.7 * Math.pow(1 - sd / starTidalRadius, 2);
              starTidalAngle = Math.atan2(sdy, sdx);
            }
          }
        }

        if (!ring.sCaptured && ring.sRespawnMs > 0) {
          ring.sRespawnMs = Math.max(0, ring.sRespawnMs - dt);
        }

        let respawnFade = ring.sRespawnMs > 0 ? clamp(1 - ring.sRespawnMs / S_FADEIN, 0, 1) : 1;
        let starFade = respawnFade;
        let anyPlanetDrift = ring.sCaptured;

        if (ring.sCaptured) {
          ring.sCaptureMs -= dt;

          if (ring.sCaptureMs > S_TOTAL - S_FADEOUT) {
            const prog = (S_TOTAL - ring.sCaptureMs) / S_FADEOUT;
            const swallowPos = travelArc(
              ring.sCaptureStartX,
              ring.sCaptureStartY,
              ring.sTargetX,
              ring.sTargetY,
              prog,
              ring.sCaptureArc,
              ring.sSpin,
            );
            starFade = 1 - prog;
            starRenderX = swallowPos.x;
            starRenderY = swallowPos.y;

            ring.planets.forEach((planet) => {
              if (bhActive) {
                const ddx = mx - planet.driftPx;
                const ddy = my - planet.driftPy;
                const dd2 = ddx * ddx + ddy * ddy;
                const dd = Math.sqrt(dd2);
                const pull = getCursorGravityPull(dd, BH_PLANET_PULL_RADIUS, PLANET_G, 0.12, 1.9, 0.42, BH_PLANET_CORE_BOOST);
                if (pull > 0) {
                  planet.driftVx += (ddx / (dd2 * dd)) * pull * dtF;
                  planet.driftVy += (ddy / (dd2 * dd)) * pull * dtF;
                }
              }
              planet.driftVx *= Math.pow(0.999, dtF);
              planet.driftVy *= Math.pow(0.999, dtF);
              planet.driftPx += planet.driftVx * dtF;
              planet.driftPy += planet.driftVy * dtF;
              planet.pOpacity = 1;
            });
          } else if (ring.sCaptureMs > S_FADEIN) {
            starFade = 0;
            starRenderX = ring.sTargetX;
            starRenderY = ring.sTargetY;

            ring.planets.forEach((planet) => {
              if (bhActive) {
                const ddx = mx - planet.driftPx;
                const ddy = my - planet.driftPy;
                const dd2 = ddx * ddx + ddy * ddy;
                const dd = Math.sqrt(dd2);
                const pull = getCursorGravityPull(dd, BH_PLANET_PULL_RADIUS, PLANET_G, 0.12, 1.9, 0.42, BH_PLANET_CORE_BOOST);
                if (pull > 0) {
                  planet.driftVx += (ddx / (dd2 * dd)) * pull * dtF;
                  planet.driftVy += (ddy / (dd2 * dd)) * pull * dtF;
                }
              }
              planet.driftVx *= Math.pow(0.999, dtF);
              planet.driftVy *= Math.pow(0.999, dtF);
              planet.driftPx += planet.driftVx * dtF;
              planet.driftPy += planet.driftVy * dtF;
              planet.pOpacity = 1;
            });
          } else {
            const prog = ring.sCaptureMs / S_FADEIN;
            starFade = 0;
            ring.planets.forEach((planet) => {
              if (bhActive) {
                const ddx = mx - planet.driftPx;
                const ddy = my - planet.driftPy;
                const dd2 = ddx * ddx + ddy * ddy;
                const dd = Math.sqrt(dd2);
                const pull = getCursorGravityPull(dd, BH_PLANET_PULL_RADIUS, PLANET_G, 0.12, 1.9, 0.42, BH_PLANET_CORE_BOOST);
                if (pull > 0) {
                  planet.driftVx += (ddx / (dd2 * dd)) * pull * dtF;
                  planet.driftVy += (ddy / (dd2 * dd)) * pull * dtF;
                }
              }
              planet.driftVx *= Math.pow(0.999, dtF);
              planet.driftVy *= Math.pow(0.999, dtF);
              planet.driftPx += planet.driftVx * dtF;
              planet.driftPy += planet.driftVy * dtF;
              planet.pvx = 0;
              planet.pvy = 0;
              planet.pOpacity = prog;
            });
          }

          if (ring.sCaptureMs <= 0) {
            ring.sCaptured = false;
            ring.sCaptureMs = 0;
            ring.sRespawnMs = S_RESPAWN_DELAY + S_FADEIN;
            ring.svx = 0;
            ring.svy = 0;
            ring.planets.forEach((planet) => {
              planet.pvx = 0;
              planet.pvy = 0;
              planet.pOpacity = 1;
            });
            starFade = 0;
            respawnFade = 0;
            anyPlanetDrift = false;
          }

          if (bhActive && ring.sCaptureMs > S_FADEIN) {
            const sdx = mx - scx;
            const sdy = my - scy;
            const sd2 = sdx * sdx + sdy * sdy;
            const sd = Math.sqrt(sd2);
            const pull = getCursorGravityPull(sd, BH_STAR_PULL_RADIUS, STAR_G, 0.16, 2.15, 0.46, BH_STAR_CORE_BOOST);
            if (pull > 0 && sd > 5) {
              ring.svx += (sdx / (sd2 * sd)) * pull * dtF;
              ring.svy += (sdy / (sd2 * sd)) * pull * dtF;
            }
          }
        } else {
          ring.planets.forEach((planet) => {
            if (!planet.pCaptured) {
              planet.phase += getPlanetPhaseSpeed(ring, planet) * dtF;
            }

            if (planet.pCaptured) {
              planet.pCaptureMs -= dt;
              if (planet.pCaptureMs > P_TOTAL - P_FADEOUT) {
                planet.pOpacity = 1 - (P_TOTAL - planet.pCaptureMs) / P_FADEOUT;
              } else if (planet.pCaptureMs > P_FADEIN) {
                planet.pOpacity = 0;
              } else {
                planet.pvx = 0;
                planet.pvy = 0;
                planet.pOpacity = 1 - planet.pCaptureMs / P_FADEIN;
              }
              if (planet.pCaptureMs <= 0) {
                planet.pCaptured = false;
                planet.pCaptureMs = 0;
                planet.pOpacity = 1;
              }
            } else {
              const { ox, oy } = getBoundOrbitState(scx, scy, ring, planet);
              const pcx = ox + planet.pvx;
              const pcy = oy + planet.pvy;

              if (bhActive) {
                const pdx = mx - pcx;
                const pdy = my - pcy;
                const pd2 = pdx * pdx + pdy * pdy;
                const pd = Math.sqrt(pd2);

                if (pd < BH_PLANET_PULL_RADIUS) {
                  if (pd < EV_PLANET) {
                    planet.pCaptured = true;
                    planet.pCaptureMs = P_TOTAL;
                    planet.pCapturePx = pcx;
                    planet.pCapturePy = pcy;
                    planet.pTargetX = mx;
                    planet.pTargetY = my;
                    planet.pCaptureArc = clamp(ring.rx * 0.12, 10, 24) * (0.8 + Math.random() * 0.5);
                    planet.pSpin = Math.random() < 0.5 ? -1 : 1;
                    planet.pOpacity = 1;
                  } else {
                    const pull = getCursorGravityPull(
                      pd,
                      BH_PLANET_PULL_RADIUS,
                      PLANET_G,
                      0.12,
                      1.9,
                      0.42,
                      BH_PLANET_CORE_BOOST,
                    );
                    if (pull > 0) {
                      planet.pvx += (pdx / (pd2 * pd)) * pull * dtF;
                      planet.pvy += (pdy / (pd2 * pd)) * pull * dtF;
                    }
                  }
                }
              }
            }

            planet.pvx += -planet.pvx * (P_SPRING * dtF);
            planet.pvy += -planet.pvy * (P_SPRING * dtF);
            planet.pvx *= Math.pow(P_DAMP, dtF);
            planet.pvy *= Math.pow(P_DAMP, dtF);
          });

          if (bhActive) {
            const sdx = mx - scx;
            const sdy = my - scy;
            const sd2 = sdx * sdx + sdy * sdy;
            const sd = Math.sqrt(sd2);
            if (sd < EV_STAR) {
              ring.sCaptured = true;
              ring.sCaptureMs = S_TOTAL;
              ring.sCaptureStartX = scx;
              ring.sCaptureStartY = scy;
              ring.sTargetX = mx;
              ring.sTargetY = my;
              ring.sCaptureArc = clamp(ring.rx * 0.18, 16, 34);
              ring.sSpin = Math.random() < 0.5 ? -1 : 1;

              ring.planets.forEach((planet) => {
                const orbitState = getBoundOrbitState(scx, scy, ring, planet);
                const { x: currentPx, y: currentPy } = getPlanetRenderPosition(orbitState, planet);
                const currentVx = orbitState.orbitalVx + planet.pvx * 0.4;
                const currentVy = orbitState.orbitalVy + planet.pvy * 0.4;

                planet.driftPx = currentPx;
                planet.driftPy = currentPy;
                planet.driftVx = currentVx;
                planet.driftVy = currentVy;
                planet.pCaptured = false;
                planet.pOpacity = 1;
              });
              anyPlanetDrift = true;
            } else {
              const pull = getCursorGravityPull(sd, BH_STAR_PULL_RADIUS, STAR_G, 0.16, 2.15, 0.46, BH_STAR_CORE_BOOST);
              if (pull > 0 && sd > 5) {
                ring.svx += (sdx / (sd2 * sd)) * pull * dtF;
                ring.svy += (sdy / (sd2 * sd)) * pull * dtF;
              }
            }
          }
        }

        ring.svx += -ring.svx * (S_SPRING * dtF);
        ring.svy += -ring.svy * (S_SPRING * dtF);
        ring.svx *= Math.pow(S_DAMP, dtF);
        ring.svy *= Math.pow(S_DAMP, dtF);

        type PlanetDraw = {
          px: number;
          py: number;
          pr: number;
          orbitRx: number;
          orbitRy: number;
          pOpacity: number;
          tScale: number;
          tAngle: number;
          isFront: boolean;
        };

        const planetDrawList: PlanetDraw[] = ring.planets.map((planet) => {
          const orbitState = getBoundOrbitState(scx, scy, ring, planet);
          const planetRadius = ring.pr * planet.sizeScale;
          const orbitRx = orbitState.orbitRx;
          const orbitRy = orbitState.orbitRy;

          let px: number;
          let py: number;
          if (anyPlanetDrift) {
            px = planet.driftPx;
            py = planet.driftPy;
          } else {
            const renderPosition = getPlanetRenderPosition(orbitState, planet);
            px = renderPosition.x;
            py = renderPosition.y;
          }

          let tScale = 1;
          let tAngle = 0;
          if (bhActive && planet.pOpacity > 0) {
            const tdx = mx - px;
            const tdy = my - py;
            const td = Math.hypot(tdx, tdy);
            if (planet.pCaptured && planet.pCaptureMs > P_TOTAL - P_FADEOUT) {
              const prog = (P_TOTAL - planet.pCaptureMs) / P_FADEOUT;
              tScale = 1 + Math.min(4, 3.5 * prog);
              tAngle = Math.atan2(tdy, tdx);
            } else if (td < TIDAL_R) {
              tScale = 1 + 2.2 * Math.pow(1 - td / TIDAL_R, 2);
              tAngle = Math.atan2(tdy, tdx);
            }
          }

          return {
            px,
            py,
            pr: planetRadius,
            orbitRx,
            orbitRy,
            pOpacity: planet.pOpacity * respawnFade,
            tScale,
            tAngle,
            isFront: Math.sin(planet.phase) > 0,
          };
        });

        let ringFade = 1;
        const anyPlanetCapture = ring.planets.some((planet) => planet.pCaptured);
        if (anyPlanetCapture) {
          const allGone = ring.planets.every((planet) => planet.pCaptured || planet.pOpacity < 0.1);
          if (allGone) {
            const minMs = Math.min(
              ...ring.planets.map((planet) => (planet.pCaptured ? planet.pCaptureMs : P_FADEIN)),
            );
            if (minMs > P_TOTAL - P_FADEOUT) {
              ringFade = 1 - (P_TOTAL - minMs) / P_FADEOUT;
            } else if (minMs <= P_FADEIN) {
              ringFade = 1 - minMs / P_FADEIN;
            } else {
              ringFade = 0;
            }
          }
        }
        ringFade = Math.min(ringFade, starFade);

        if (starFade > 0.01) {
          ctx.save();
          ctx.globalAlpha = starFade;
          const starGlow = ctx.createRadialGradient(starRenderX, starRenderY, 0, starRenderX, starRenderY, starR * 5);
          starGlow.addColorStop(0, isDark ? ring.starGlow[0] : ring.starGlow[1]);
          starGlow.addColorStop(
            0.4,
            isDark ? ring.starGlow[0].replace(/[\d.]+\)$/, "0.1)") : ring.starGlow[1].replace(/[\d.]+\)$/, "0.07)"),
          );
          starGlow.addColorStop(1, "transparent");
          ctx.fillStyle = starGlow;
          ctx.beginPath();
          ctx.arc(starRenderX, starRenderY, starR * 5, 0, Math.PI * 2);
          ctx.fill();

          if (starTidalScale > 1.05) {
            ctx.save();
            ctx.translate(starRenderX, starRenderY);
            ctx.rotate(starTidalAngle);
            ctx.beginPath();
            ctx.ellipse(0, 0, starR * starTidalScale, starR / Math.sqrt(starTidalScale), 0, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? ring.starCore[0] : ring.starCore[1];
            ctx.fill();
            ctx.restore();
          } else {
            ctx.beginPath();
            ctx.arc(starRenderX, starRenderY, starR, 0, Math.PI * 2);
            ctx.fillStyle = isDark ? ring.starCore[0] : ring.starCore[1];
            ctx.fill();
          }
          ctx.restore();
        }

        planetDrawList.forEach((planet) => {
          const orbitAlpha = ring.opacity * ringFade * clamp(planet.pOpacity * 0.85 + 0.08, 0, 1);
          drawOrbitArc(scx, scy, planet.orbitRx, planet.orbitRy, ring.angle, Math.PI, Math.PI * 2, orbitAlpha);
        });

        planetDrawList
          .filter((planet) => !planet.isFront)
          .forEach((planet) =>
            drawOnePlanet(planet.px, planet.py, planet.pr, planet.pOpacity, planet.tScale, planet.tAngle),
          );

        planetDrawList.forEach((planet) => {
          const orbitAlpha = ring.opacity * ringFade * clamp(planet.pOpacity * 0.85 + 0.08, 0, 1);
          drawOrbitArc(scx, scy, planet.orbitRx, planet.orbitRy, ring.angle, 0, Math.PI, orbitAlpha);
        });

        planetDrawList
          .filter((planet) => planet.isFront)
          .forEach((planet) =>
            drawOnePlanet(planet.px, planet.py, planet.pr, planet.pOpacity, planet.tScale, planet.tAngle),
          );

        if (starFade > 0.15) {
          const starGravityMass = STAR_OBJ_GRAVITY * Math.pow(starR / 4.2, 1.35);
          gravityBodies.push({
            kind: "star",
            x: starRenderX,
            y: starRenderY,
            radius: starR,
            influenceRadius: ring.starInfluence,
            impactRadius: ring.starImpact,
            mass: starGravityMass,
            orbitBias: ring.orbitBias,
          });
        }

        planetDrawList.forEach((planet) => {
          if (planet.pOpacity > 0.15) {
            const planetGravityMass = PLANET_OBJ_GRAVITY * Math.pow(planet.pr / 3, 1.3);
            gravityBodies.push({
              kind: "planet",
              x: planet.px,
              y: planet.py,
              radius: planet.pr,
              influenceRadius: clamp(ring.rx * 0.18 + planet.pr * 6, 18, 56),
              impactRadius: planet.pr + (planet.pr > 3 ? 3.6 : 2.8),
              mass: planetGravityMass,
              orbitBias: 0,
            });
          }
        });
      });

      stars.forEach((star) => {
        const twinkle = star.opacity + Math.sin(t * star.twinkleSpeed * 60 + star.twinklePhase) * 0.12;
        const dx = mx - star.x;
        const dy = my - star.y;
        const dist = Math.hypot(dx, dy);
        let renderX = star.x;
        let renderY = star.y;
        let stretch = 1;
        let stretchAngle = 0;

        if (dist < BH_RADIUS && dist > 1) {
          const t2 = 1 - dist / BH_RADIUS;
          const nx = dx / dist;
          const ny = dy / dist;
          const lensOffset = t2 * t2 * BH_LENS_OFFSET;

          renderX = star.x - nx * lensOffset;
          renderY = star.y - ny * lensOffset;
          stretch = 1 + t2 * BH_LENS_STRETCH;
          // Background stars should read as warped light around the cursor, not dragged particles.
          stretchAngle = Math.atan2(dy, dx) + Math.PI / 2;
        }

        const alpha = clamp(twinkle + (stretch - 1) * BH_LENS_ALPHA, 0, 1);
        ctx.fillStyle = isDark ? `rgba(240,240,240,${alpha})` : `rgba(20,20,20,${alpha})`;
        ctx.beginPath();
        if (stretch > 1.04) {
          ctx.save();
          ctx.translate(renderX, renderY);
          ctx.rotate(stretchAngle);
          ctx.ellipse(0, 0, star.r * stretch, star.r / Math.sqrt(stretch), 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          ctx.arc(renderX, renderY, star.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      scene.meteorNextMs -= dt;
      scene.cometNextMs -= dt;
      const activeMeteorCount = spaceObjects.filter((obj) => obj.kind === "meteor" && !obj.orbitingBlackHole).length;
      const activeCometCount = spaceObjects.filter((obj) => obj.kind === "comet" && !obj.orbitingBlackHole).length;
      let orbitingObjectCount = spaceObjects.filter((obj) => obj.orbitingBlackHole).length;

      if (
        scene.meteorNextMs <= 0 &&
        activeMeteorCount < MAX_ACTIVE_METEORS &&
        spaceObjects.length < MAX_SPACE_OBJECTS
      ) {
        spaceObjects.push(spawnSpaceObj("meteor", scene));
        scene.meteorNextMs = 9000 + Math.random() * 15000;
      }
      if (
        scene.cometNextMs <= 0 &&
        activeCometCount < MAX_ACTIVE_COMETS &&
        spaceObjects.length < MAX_SPACE_OBJECTS
      ) {
        spaceObjects.push(spawnSpaceObj("comet", scene));
        scene.cometNextMs = 28000 + Math.random() * 32000;
      }

      const bhObjOuterRadius = Math.max(BH_OBJ_OUTER_RADIUS_MIN, Math.min(W, H) * BH_OBJ_OUTER_RADIUS_FACTOR);
      const bhObjCoreRadius = Math.max(BH_OBJ_CORE_RADIUS_MIN, bhObjOuterRadius * BH_OBJ_CORE_RADIUS_RATIO);

      for (let i = spaceObjects.length - 1; i >= 0; i--) {
        const obj = spaceObjects[i];

        const captureObject = (kind: "blackhole" | "star" | "planet", targetX: number, targetY: number) => {
          obj.captured = true;
          obj.captureKind = kind;
          obj.captureFromX = obj.x;
          obj.captureFromY = obj.y;
          obj.captureTargetX = targetX;
          obj.captureTargetY = targetY;
          obj.captureArc = kind === "blackhole" ? 16 + Math.random() * 14 : 8 + Math.random() * 10;
          obj.captureSpin = Math.random() < 0.5 ? -1 : 1;
          obj.captureTotalMs = kind === "blackhole" ? OBJ_FADE : OBJ_IMPACT_FADE;
          obj.captureMs = obj.captureTotalMs;
        };

        if (!obj.captured) {
          let ax = 0;
          let ay = 0;
          let localMaxSpeed = obj.baseMaxSpeed;

          if (obj.orbitingBlackHole) {
            if (bhActive) {
              updateBlackHoleOrbit(obj, mx, my, dtF);
            } else {
              obj.orbitingBlackHole = false;
            }
          } else if (bhActive) {
            const dx = mx - obj.x;
            const dy = my - obj.y;
            const d2 = dx * dx + dy * dy;
            const d = Math.sqrt(d2);
            if (d < EV_OBJ) {
              captureObject("blackhole", mx, my);
            } else {
              const { radialAccel, speedBoost, tangentialAccel } = getBlackHoleObjectAcceleration(
                obj,
                d,
                bhObjOuterRadius,
                bhObjCoreRadius,
              );
              if (radialAccel > 0) {
                const dirX = dx / d;
                const dirY = dy / d;
                if (
                  orbitingObjectCount < MAX_ORBITING_OBJECTS &&
                  shouldCaptureBlackHoleOrbit(obj, dirX, dirY, d, dtF)
                ) {
                  startBlackHoleOrbit(obj, mx, my, d);
                  orbitingObjectCount += 1;
                  updateBlackHoleOrbit(obj, mx, my, dtF);
                } else {
                  ax += dirX * radialAccel;
                  ay += dirY * radialAccel;
                  ax += -dirY * tangentialAccel * obj.orbitSpin;
                  ay += dirX * tangentialAccel * obj.orbitSpin;
                  localMaxSpeed += speedBoost;
                }
              }
            }
          }

          for (const body of gravityBodies) {
            if (obj.orbitingBlackHole) break;
            if (obj.captured) break;
            const dx = body.x - obj.x;
            const dy = body.y - obj.y;
            const d2 = dx * dx + dy * dy;
            const d = Math.sqrt(d2);

            if (d < body.impactRadius) {
              captureObject(body.kind, body.x, body.y);
              bursts.push({
                x: body.x,
                y: body.y,
                radius: body.radius * 0.9,
                maxRadius: body.radius * (body.kind === "star" ? 8 : 5),
                lifeMs: body.kind === "star" ? 420 : 300,
                totalMs: body.kind === "star" ? 420 : 300,
                color:
                  body.kind === "star"
                    ? isDark
                      ? "rgba(255,235,190,0.35)"
                      : "rgba(255,190,80,0.3)"
                    : isDark
                      ? "rgba(210,220,255,0.28)"
                      : "rgba(70,90,150,0.22)",
              });
              break;
            }

            if (d < body.influenceRadius && d > 1) {
              const softening = body.radius * 10;
              const pull = (body.mass / (d2 + softening * softening)) / obj.gravityResistance;
              ax += (dx / d) * pull;
              ay += (dy / d) * pull;
              if (body.kind === "star") {
                const tangential = (body.orbitBias / (d2 + softening * softening)) / obj.gravityResistance;
                ax += (-dy / d) * tangential;
                ay += (dx / d) * tangential;
              }
            }
          }

          if (!obj.captured && !obj.orbitingBlackHole) {
            obj.vx += ax * dtF;
            obj.vy += ay * dtF;
            const drag = obj.kind === "comet" ? 0.9995 : 0.999;
            obj.vx *= Math.pow(drag, dtF);
            obj.vy *= Math.pow(drag, dtF);
            const speed = Math.hypot(obj.vx, obj.vy);
            if (speed > localMaxSpeed) {
              const scale = localMaxSpeed / speed;
              obj.vx *= scale;
              obj.vy *= scale;
            }
            obj.x += obj.vx * dtF;
            obj.y += obj.vy * dtF;
            obj.alpha = obj.baseAlpha;
          }
        }

        if (obj.captured) {
          obj.captureMs -= dt;
          const prog = 1 - obj.captureMs / obj.captureTotalMs;
          const capturePos = travelArc(
            obj.captureFromX,
            obj.captureFromY,
            obj.captureTargetX,
            obj.captureTargetY,
            prog,
            obj.captureArc,
            obj.captureSpin,
          );
          obj.x = capturePos.x;
          obj.y = capturePos.y;
          obj.alpha = Math.max(0, obj.baseAlpha * (1 - prog));
          obj.tailLen *= Math.pow(0.96, dtF);
          if (obj.captureMs <= 0) {
            spaceObjects.splice(i, 1);
            continue;
          }
        } else {
          const margin = 120;
          if (obj.x < -margin || obj.x > W + margin || obj.y < -margin || obj.y > H + margin) {
            spaceObjects.splice(i, 1);
            continue;
          }
        }

        const speed = Math.hypot(obj.vx, obj.vy);
        if (speed < 0.01 && !obj.captured) continue;
        const dirX = speed < 0.01 ? 0 : -obj.vx / speed;
        const dirY = speed < 0.01 ? 1 : -obj.vy / speed;
        const tx = obj.x + dirX * obj.tailLen;
        const ty = obj.y + dirY * obj.tailLen;

        ctx.save();
        ctx.globalAlpha = obj.alpha;

        if (obj.kind === "comet") {
          const wide = ctx.createLinearGradient(obj.x, obj.y, tx, ty);
          wide.addColorStop(0, isDark ? "rgba(180,210,255,0.14)" : "rgba(0,20,80,0.10)");
          wide.addColorStop(1, "transparent");
          ctx.strokeStyle = wide;
          ctx.lineWidth = 8;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(obj.x, obj.y);
          ctx.lineTo(tx, ty);
          ctx.stroke();
        }

        const core = ctx.createLinearGradient(obj.x, obj.y, tx, ty);
        core.addColorStop(0, isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.9)");
        core.addColorStop(1, "transparent");
        ctx.strokeStyle = core;
        ctx.lineWidth = obj.kind === "comet" ? 1.5 : 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.98)" : "rgba(0,0,0,0.95)";
        ctx.fill();

        if (obj.kind === "comet") {
          const glow = ctx.createRadialGradient(obj.x, obj.y, 0, obj.x, obj.y, obj.r * 5);
          glow.addColorStop(0, isDark ? "rgba(180,220,255,0.35)" : "rgba(0,30,100,0.28)");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, obj.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      for (let i = bursts.length - 1; i >= 0; i--) {
        const burst = bursts[i];
        burst.lifeMs -= dt;
        if (burst.lifeMs <= 0) {
          bursts.splice(i, 1);
          continue;
        }

        const prog = 1 - burst.lifeMs / burst.totalMs;
        const radius = mix(burst.radius, burst.maxRadius, prog);
        const alpha = (1 - prog) * 0.9;

        ctx.save();
        ctx.globalAlpha = alpha;
        const glow = ctx.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, radius);
        glow.addColorStop(0, burst.color);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.lineWidth = 1.2;
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)";
        ctx.beginPath();
        ctx.arc(burst.x, burst.y, radius * 0.72, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (mx > 0 && mx < W) {
        const bhGlow = ctx.createRadialGradient(mx, my, 0, mx, my, 84);
        bhGlow.addColorStop(0, "rgba(255,255,255,0.06)");
        bhGlow.addColorStop(0.4, "rgba(255,255,255,0.025)");
        bhGlow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bhGlow;
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.strokeStyle = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 12, 0, Math.PI * 2);
        ctx.stroke();

        const bhCore = ctx.createRadialGradient(mx, my, 0, mx, my, 7);
        bhCore.addColorStop(0, "rgba(0,0,0,1)");
        bhCore.addColorStop(0.6, "rgba(30,30,30,0.62)");
        bhCore.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bhCore;
        ctx.beginPath();
        ctx.arc(mx, my, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      syncRuntimeCache();
      S.animId = requestAnimationFrame(draw);
    };

    const startAnimation = () => {
      if (S.animId !== null || reducedMotionQuery.matches) return;
      lastTs = null;
      S.animId = requestAnimationFrame(draw);
    };

    const stopAnimation = () => {
      if (S.animId === null) return;
      cancelAnimationFrame(S.animId);
      S.animId = null;
    };

    const syncPlaybackState = () => {
      if (!activeRef.current) {
        stopAnimation();
        resetMouse();
        drawStaticScene();
        return;
      }

      if (reducedMotionQuery.matches) {
        stopAnimation();
        resetMouse();
        drawStaticScene();
      } else {
        startAnimation();
      }
    };

    S.syncPlayback = syncPlaybackState;

    syncPlaybackState();

    const onReducedMotionChange = () => {
      syncPlaybackState();
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        S.mouse.x = x;
        S.mouse.y = y;
      } else {
        resetMouse();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", resetMouse);
    window.addEventListener("pointercancel", resetMouse);
    window.addEventListener("blur", resetMouse);
    reducedMotionQuery.addEventListener("change", onReducedMotionChange);

    const ro = new ResizeObserver(() => {
      if (S.resizeTimer !== null) {
        window.clearTimeout(S.resizeTimer);
      }

      S.resizeTimer = window.setTimeout(() => {
        S.resizeTimer = null;
        rebuildScene();
        resetMouse();
        if (reducedMotionQuery.matches) {
          drawStaticScene();
        }
      }, 120);
    });
    ro.observe(canvas);

    return () => {
      syncRuntimeCache();
      S.redraw = null;
      S.syncPlayback = null;
      stopAnimation();
      if (S.resizeTimer !== null) {
        window.clearTimeout(S.resizeTimer);
        S.resizeTimer = null;
      }
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", resetMouse);
      window.removeEventListener("pointercancel", resetMouse);
      window.removeEventListener("blur", resetMouse);
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      aria-hidden="true"
      role="presentation"
    />
  );
}
