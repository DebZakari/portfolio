"use client";

import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import StarParticles from "./StarParticles";
import type { CursorPixelPos } from "@/hooks/useCursorPosition";

interface GalaxySceneProps {
  particleCount: number;
  cursorRef: React.MutableRefObject<CursorPixelPos | null>;
}

export default function GalaxyScene({ particleCount, cursorRef }: GalaxySceneProps) {
  return (
    <Canvas
      aria-hidden="true"
      role="presentation"
      className="absolute inset-0 h-full w-full"
      dpr={[1, 2]}
      frameloop="always"
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      camera={{
        fov: 65,
        near: 0.1,
        far: 100,
        position: [0, 4, 12],
      }}
    >
      <fog attach="fog" args={["#000000", 18, 32]} />

      <mesh>
        <sphereGeometry args={[5, 16, 16]} />
        <meshBasicMaterial
          color={new THREE.Color("#6366F1")}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <StarParticles count={particleCount} cursorRef={cursorRef} />
    </Canvas>
  );
}
