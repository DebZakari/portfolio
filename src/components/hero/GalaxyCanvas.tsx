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

    // Orbital rings + planets (pvx/pvy = black-hole displacement velocity)
    // starA/starB: [glowColor, coreColor] for [dark, light] mode
    const rings = [
      { cx: W * 0.72, cy: H * 0.38, rx: 120, ry: 40, angle: -0.3, opacity: 0.18, pa: 0.8,  ps: 0.004, pr: 3.2, pvx: 0, pvy: 0,
        starGlow: ["rgba(120,160,255,0.6)",  "rgba(60,100,220,0.45)"],
        starCore: ["rgba(180,210,255,0.98)", "rgba(50,90,210,0.92)"] },
      { cx: W * 0.25, cy: H * 0.65, rx: 80,  ry: 25, angle: 0.5,  opacity: 0.12, pa: 3.2,  ps: 0.006, pr: 2.4, pvx: 0, pvy: 0,
        starGlow: ["rgba(255,245,200,0.55)", "rgba(200,140,0,0.4)"],
        starCore: ["rgba(255,250,220,0.95)", "rgba(220,160,20,0.9)"] },
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

      // Cursor + gravity constants (shared by rings and stars)
      const mx = S.mouse.x;
      const my = S.mouse.y;
      const BH_RADIUS = 180;
      const BH_FORCE = 45;

      // Orbital rings + planets (layered: back arc → back planet → front arc → front planet)
      rings.forEach((ring) => {
        ring.pa += ring.ps;
        const cp = Math.cos(ring.pa);
        const sp = Math.sin(ring.pa);

        // Orbital position (the "home" the planet springs back to)
        const ox = ring.cx + ring.rx * cp * Math.cos(ring.angle) - ring.ry * sp * Math.sin(ring.angle);
        const oy = ring.cy + ring.rx * cp * Math.sin(ring.angle) + ring.ry * sp * Math.cos(ring.angle);

        // Black-hole gravity on planet
        const curX = ox + ring.pvx;
        const curY = oy + ring.pvy;
        const dx = mx - curX;
        const dy = my - curY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < BH_RADIUS && dist > 1) {
          const f = (1 - dist / BH_RADIUS) ** 2 * BH_FORCE;
          ring.pvx += (dx / dist) * f * 0.04;
          ring.pvy += (dy / dist) * f * 0.04;
        }
        // Spring back toward orbital path + damping
        ring.pvx += -ring.pvx * 0.05;
        ring.pvy += -ring.pvy * 0.05;
        ring.pvx *= 0.82;
        ring.pvy *= 0.82;

        const px = ox + ring.pvx;
        const py = oy + ring.pvy;
        const isFront = sp > 0; // positive local-y = near side

        const ringColor = isDark
          ? `rgba(255,255,255,${ring.opacity})`
          : `rgba(0,0,0,${ring.opacity})`;

        const drawPlanet = () => {
          // Atmospheric glow
          const glow = ctx.createRadialGradient(px, py, 0, px, py, ring.pr * 3.5);
          glow.addColorStop(0, isDark ? "rgba(200,210,255,0.22)" : "rgba(0,0,40,0.18)");
          glow.addColorStop(1, "transparent");
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(px, py, ring.pr * 3.5, 0, Math.PI * 2);
          ctx.fill();
          // Core
          ctx.beginPath();
          ctx.arc(px, py, ring.pr, 0, Math.PI * 2);
          ctx.fillStyle = isDark ? "rgba(205,215,230,0.95)" : "rgba(20,20,35,0.88)";
          ctx.fill();
        };

        // Central star (drawn first — below ring and planet)
        const starR = ring.pr * 1.4;
        const sGlow = ctx.createRadialGradient(ring.cx, ring.cy, 0, ring.cx, ring.cy, starR * 5);
        sGlow.addColorStop(0, isDark ? ring.starGlow[0] : ring.starGlow[1]);
        sGlow.addColorStop(0.4, isDark ? ring.starGlow[0].replace(/[\d.]+\)$/, "0.1)") : ring.starGlow[1].replace(/[\d.]+\)$/, "0.07)"));
        sGlow.addColorStop(1, "transparent");
        ctx.fillStyle = sGlow;
        ctx.beginPath();
        ctx.arc(ring.cx, ring.cy, starR * 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(ring.cx, ring.cy, starR, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? ring.starCore[0] : ring.starCore[1];
        ctx.fill();

        // Back arc (far side: sin < 0, angles π → 2π)
        ctx.save();
        ctx.translate(ring.cx, ring.cy);
        ctx.rotate(ring.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, Math.PI, Math.PI * 2);
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Planet behind ring
        if (!isFront) drawPlanet();

        // Front arc (near side: sin > 0, angles 0 → π)
        ctx.save();
        ctx.translate(ring.cx, ring.cy);
        ctx.rotate(ring.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, ring.rx, ring.ry, 0, 0, Math.PI);
        ctx.strokeStyle = ringColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.restore();

        // Planet in front of ring
        if (isFront) drawPlanet();
      });

      // Stars
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
