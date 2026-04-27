"use client";

import { useEffect, useRef } from "react";

interface GalaxyCanvasProps {
  theme: string;
}

export default function GalaxyCanvas({ theme }: GalaxyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    stars: Array<{
      x: number; y: number; ox: number; oy: number;
      vx: number; vy: number; r: number; opacity: number;
      twinklePhase: number; twinkleSpeed: number;
    }>;
    mouse: { x: number; y: number };
    animId: number | null;
  }>({ stars: [], mouse: { x: -9999, y: -9999 }, animId: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;
    const S = stateRef.current;

    // Build star field — mix of layers for depth
    S.stars = Array.from({ length: 280 }, (_, i) => {
      const layer = i < 200 ? 0 : i < 260 ? 1 : 2;
      const x = Math.random() * W;
      const y = Math.random() * H;
      return {
        x, y, ox: x, oy: y, vx: 0, vy: 0,
        r: layer === 0 ? Math.random() * 0.8 + 0.2 : layer === 1 ? Math.random() * 1.2 + 0.5 : Math.random() * 2 + 1,
        opacity: layer === 0 ? Math.random() * 0.5 + 0.2 : layer === 1 ? Math.random() * 0.6 + 0.3 : Math.random() * 0.8 + 0.4,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
      };
    });

    // Orbital rings data
    const rings = [
      { cx: W * 0.72, cy: H * 0.38, rx: 120, ry: 40, angle: -0.3, opacity: 0.18 },
      { cx: W * 0.25, cy: H * 0.65, rx: 80, ry: 25, angle: 0.5, opacity: 0.12 },
    ];

    // Nebula blobs
    const nebulae = [
      { cx: W * 0.8, cy: H * 0.2, r: 220, colorA: "rgba(255,255,255,0.04)", colorB: "transparent" },
      { cx: W * 0.2, cy: H * 0.75, r: 160, colorA: "rgba(255,255,255,0.03)", colorB: "transparent" },
    ];

    let t = 0;
    const isDark = theme !== "light";

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      t += 0.016;

      // Nebula glows
      nebulae.forEach((n) => {
        const g = ctx.createRadialGradient(n.cx, n.cy, 0, n.cx, n.cy, n.r);
        g.addColorStop(0, n.colorA);
        g.addColorStop(1, n.colorB);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      });

      // Orbital rings
      rings.forEach((ring) => {
        ctx.save();
        ctx.translate(ring.cx, ring.cy);
        ctx.rotate(ring.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = isDark
          ? `rgba(255,255,255,${ring.opacity})`
          : `rgba(0,0,0,${ring.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();
      });

      // Stars
      const mx = S.mouse.x;
      const my = S.mouse.y;
      const BH_RADIUS = 180;
      const BH_FORCE = 45;

      S.stars.forEach((star) => {
        const twinkle = star.opacity + Math.sin(t * star.twinkleSpeed * 60 + star.twinklePhase) * 0.12;
        const dx = mx - star.x;
        const dy = my - star.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < BH_RADIUS && dist > 1) {
          const t2 = 1 - dist / BH_RADIUS;
          const force = t2 * t2 * BH_FORCE;
          star.vx += (dx / dist) * force * 0.04;
          star.vy += (dy / dist) * force * 0.04;
        }
        // Spring back
        star.vx += (star.ox - star.x) * 0.05;
        star.vy += (star.oy - star.y) * 0.05;
        // Damping
        star.vx *= 0.82;
        star.vy *= 0.82;
        star.x += star.vx;
        star.y += star.vy;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
        const a = clamp(twinkle, 0, 1);
        ctx.fillStyle = isDark
          ? `rgba(240,240,240,${a})`
          : `rgba(20,20,20,${a})`;
        ctx.fill();
      });

      // Black hole glow at cursor
      if (mx > 0 && mx < W) {
        const bhg = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        bhg.addColorStop(0, "rgba(255,255,255,0.06)");
        bhg.addColorStop(0.5, "rgba(255,255,255,0.02)");
        bhg.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = bhg;
        ctx.fillRect(0, 0, W, H);
        // Core disc
        const core = ctx.createRadialGradient(mx, my, 0, mx, my, 6);
        core.addColorStop(0, "rgba(0,0,0,1)");
        core.addColorStop(0.6, "rgba(30,30,30,0.6)");
        core.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(mx, my, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      S.animId = requestAnimationFrame(draw);
    };
    draw();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        S.mouse.x = x;
        S.mouse.y = y;
      } else {
        S.mouse.x = -9999;
        S.mouse.y = -9999;
      }
    };
    const onLeave = () => {
      S.mouse.x = -9999;
      S.mouse.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const ro = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    });
    ro.observe(canvas);

    return () => {
      if (S.animId) cancelAnimationFrame(S.animId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      ro.disconnect();
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
      aria-hidden="true"
    />
  );
}
