"use client";

import { useEffect, useRef } from "react";

/**
 * Animated backdrop of fanned, softly lit green ribbons that sway slowly.
 * Drawn on a canvas so it needs no video file; `paused` freezes the motion.
 */
export function RibbonBackground({ paused = false, className = "" }: { paused?: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let t = 0;
    let last = 0;
    let visible = true;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      // The image is soft, so rendering at 1x keeps it smooth and cheap.
      canvas.width = Math.round(w);
      canvas.height = Math.round(h);
    };

    const draw = () => {
      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#56753a");
      bg.addColorStop(0.45, "#7fae4f");
      bg.addColorStop(1, "#b7da8a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      const count = 15;
      const band = Math.max(70, w * 0.085);
      for (let i = 0; i < count; i++) {
        const k = i / (count - 1);
        const sway = Math.sin(t * 0.00035 + i * 0.55) * w * 0.025;
        const lift = Math.cos(t * 0.00028 + i * 0.4) * h * 0.04;

        // Each ribbon sweeps from lower-left to upper-right, bending as it rises.
        const baseX = -0.1 * w + k * 1.15 * w;
        const x0 = baseX - 0.32 * w;
        const y0 = h * 1.2;
        const c1x = baseX - 0.08 * w + sway;
        const c1y = h * 0.78 + lift;
        const c2x = baseX + 0.02 * w - sway;
        const c2y = h * 0.22 - lift;
        const x3 = baseX + 0.38 * w + sway;
        const y3 = -h * 0.2;

        // Light across the ribbon (perpendicular to its direction): bright edge to shaded edge.
        const dx = x3 - x0;
        const dy = y3 - y0;
        const len = Math.hypot(dx, dy);
        const px = -dy / len;
        const py = dx / len;
        const mx = (x0 + x3) / 2 + (c1x + c2x - x0 - x3) * 0.375;
        const my = (y0 + y3) / 2 + (c1y + c2y - y0 - y3) * 0.375;
        const g = ctx.createLinearGradient(mx - (px * band) / 2, my - (py * band) / 2, mx + (px * band) / 2, my + (py * band) / 2);
        g.addColorStop(0, "rgba(58,110,34,0.95)");
        g.addColorStop(0.35, "rgba(150,195,105,0.92)");
        g.addColorStop(0.75, "rgba(226,238,212,0.95)");
        g.addColorStop(1, "rgba(246,250,240,0.98)");

        ctx.save();
        ctx.shadowColor = "rgba(22,52,12,0.45)";
        ctx.shadowBlur = 28;
        ctx.shadowOffsetX = -10;
        ctx.strokeStyle = g;
        ctx.lineWidth = band;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.bezierCurveTo(c1x, c1y, c2x, c2y, x3, y3);
        ctx.stroke();
        ctx.restore();
      }

      // Gentle vignette for depth
      const v = ctx.createRadialGradient(w * 0.6, h * 0.45, h * 0.2, w * 0.6, h * 0.45, Math.max(w, h) * 0.8);
      v.addColorStop(0, "rgba(255,255,255,0)");
      v.addColorStop(1, "rgba(30,55,15,0.35)");
      ctx.fillStyle = v;
      ctx.fillRect(0, 0, w, h);
    };

    const loop = (now: number) => {
      const dt = last ? Math.min(now - last, 100) : 16;
      last = now;
      if (visible && !pausedRef.current) {
        t += dt;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };

    resize();
    draw();
    if (!reduce) raf = requestAnimationFrame(loop);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
