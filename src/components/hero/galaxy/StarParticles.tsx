"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cursorToWorld } from "@/utils/cursorToWorld";
import { GRAVITY_CONFIG } from "./GalaxyConfig";
import type { CursorPixelPos } from "@/hooks/useCursorPosition";

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateGalaxyPositions(count: number): Float32Array {
  const rand = mulberry32(0xcafebabe);
  const positions = new Float32Array(count * 3);
  const ARM_COUNT = 3;
  const SPIN = 1.2;
  const ARM_SPREAD = 0.25;
  const CORE_FRACTION = 0.15;
  const coreCount = Math.floor(count * CORE_FRACTION);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    if (i < coreCount) {
      const r = Math.pow(rand(), 2) * 1.2;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.3;
      positions[i3 + 2] = r * Math.cos(phi);
    } else {
      const arm = Math.floor(rand() * ARM_COUNT);
      const armAngle = (arm / ARM_COUNT) * Math.PI * 2;
      const t = Math.pow(rand(), 0.5);
      const radius = 1.5 + t * 8.5;
      const angle = armAngle + SPIN * Math.log(radius + 1);
      const scatter = (rand() - 0.5) * ARM_SPREAD * radius;
      positions[i3]     = Math.cos(angle) * radius + scatter;
      positions[i3 + 1] = (rand() - 0.5) * 0.4;
      positions[i3 + 2] = Math.sin(angle) * radius + scatter;
    }
  }
  return positions;
}

function generateColors(count: number): Float32Array {
  const rand = mulberry32(0xbeefdead);
  const palette = [
    new THREE.Color("#E0E7FF"),
    new THREE.Color("#C7D2FE"),
    new THREE.Color("#38BDF8"),
    new THREE.Color("#A78BFA"),
  ];
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const c = palette[Math.floor(rand() * palette.length)];
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return colors;
}

// Pre-allocated vector for world→local cursor conversion
const _localCursor = new THREE.Vector3();

interface StarParticlesProps {
  count: number;
  cursorRef: React.MutableRefObject<CursorPixelPos | null>;
}

export default function StarParticles({ count, cursorRef }: StarParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const reducedMotion = useReducedMotion();

  // base positions — read-only, deterministic per count
  const basePositions = useMemo(() => generateGalaxyPositions(count), [count]);
  const colors = useMemo(() => generateColors(count), [count]);

  // current positions — mutable ref (mutated in useFrame, not during render)
  const currentRef = useRef<Float32Array>(new Float32Array(0));

  // Set up / reset geometry attributes imperatively when count changes
  useEffect(() => {
    if (!geomRef.current) return;
    const current = basePositions.slice();
    currentRef.current = current;
    geomRef.current.setAttribute("position", new THREE.BufferAttribute(current, 3));
    geomRef.current.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  }, [basePositions, colors]);

  useFrame((state, delta) => {
    if (reducedMotion || !pointsRef.current || !geomRef.current) return;

    pointsRef.current.rotation.y += delta * 0.04;

    const cursor = cursorRef.current;
    const base = basePositions;
    const current = currentRef.current;
    if (current.length === 0) return;

    const posAttr = geomRef.current.attributes.position as THREE.BufferAttribute | undefined;
    if (!posAttr) return;

    const {
      GRAVITY_RADIUS,
      GRAVITY_STRENGTH,
      RETURN_STRENGTH,
      MAX_DISPLACEMENT,
      DEAD_ZONE_RADIUS,
    } = GRAVITY_CONFIG;

    let hasLocalCursor = false;
    if (cursor) {
      const worldPos = cursorToWorld(
        cursor.x,
        cursor.y,
        cursor.containerWidth,
        cursor.containerHeight,
        state.camera,
      );
      if (worldPos) {
        _localCursor.copy(worldPos);
        pointsRef.current.worldToLocal(_localCursor);
        hasLocalCursor = true;
      }
    }

    const gravRadSq = GRAVITY_RADIUS * GRAVITY_RADIUS;
    const deadZoneSq = DEAD_ZONE_RADIUS * DEAD_ZONE_RADIUS;
    const maxDispSq = MAX_DISPLACEMENT * MAX_DISPLACEMENT;
    let needsUpdate = false;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const bx = base[i3], by = base[i3 + 1], bz = base[i3 + 2];
      let cx = current[i3], cy = current[i3 + 1], cz = current[i3 + 2];

      if (hasLocalCursor) {
        const dx = _localCursor.x - bx;
        const dy = _localCursor.y - by;
        const dz = _localCursor.z - bz;
        // Cheap bounding reject before sqrt
        if (Math.abs(dx) < GRAVITY_RADIUS && Math.abs(dz) < GRAVITY_RADIUS) {
          const distSq = dx * dx + dy * dy + dz * dz;
          if (distSq < gravRadSq && distSq > deadZoneSq) {
            const dist = Math.sqrt(distSq);
            const force = GRAVITY_STRENGTH * (1 - dist / GRAVITY_RADIUS) * delta;
            cx += (dx / dist) * force;
            cy += (dy / dist) * force;
            cz += (dz / dist) * force;

            const ex = cx - bx, ey = cy - by, ez = cz - bz;
            const dispSq = ex * ex + ey * ey + ez * ez;
            if (dispSq > maxDispSq) {
              const inv = MAX_DISPLACEMENT / Math.sqrt(dispSq);
              cx = bx + ex * inv;
              cy = by + ey * inv;
              cz = bz + ez * inv;
            }
            needsUpdate = true;
          } else {
            const rx = bx - cx, ry = by - cy, rz = bz - cz;
            cx += rx * RETURN_STRENGTH;
            cy += ry * RETURN_STRENGTH;
            cz += rz * RETURN_STRENGTH;
            if (rx * rx + ry * ry + rz * rz > 0.0001) needsUpdate = true;
          }
        } else {
          const rx = bx - cx, ry = by - cy, rz = bz - cz;
          cx += rx * RETURN_STRENGTH;
          cy += ry * RETURN_STRENGTH;
          cz += rz * RETURN_STRENGTH;
          if (rx * rx + ry * ry + rz * rz > 0.0001) needsUpdate = true;
        }
      } else {
        const rx = bx - cx, ry = by - cy, rz = bz - cz;
        cx += rx * RETURN_STRENGTH;
        cy += ry * RETURN_STRENGTH;
        cz += rz * RETURN_STRENGTH;
        if (rx * rx + ry * ry + rz * rz > 0.0001) needsUpdate = true;
      }

      current[i3] = cx;
      current[i3 + 1] = cy;
      current[i3 + 2] = cz;
    }

    if (needsUpdate) {
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geomRef} />
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
