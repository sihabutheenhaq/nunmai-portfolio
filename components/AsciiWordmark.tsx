"use client";

import { useEffect, useRef } from "react";

/** Resting letters: a steady ":" with an occasional "+" flicker. */
const IDLE = ":::::::::+";
/** Spotlight: glyphs get denser towards its centre. */
const RAMP = ".:-=+*%#";

type Props = {
  /** Mask image: dark, opaque areas become letters (white areas stay empty). */
  src: string;
  className?: string;
  /** Resting glyph colour. */
  color?: string;
  /** Glyph colour at the soft edge of the cursor spotlight. */
  glowColor?: string;
  /** Glyph colour at the centre of the cursor spotlight. */
  hotColor?: string;
  /** Opacity of the resting letters (0–1). */
  restOpacity?: number;
  /** Largest glyph cell width in CSS px (height is 1.55×); shrinks on narrow screens. */
  cell?: number;
  /** Share of the logo height cropped off the bottom edge. */
  bleed?: number;
  label?: string;
};

/**
 * Renders a logo as monospace ASCII glyphs on a canvas. Letters shimmer quietly at rest,
 * and an elliptical spotlight follows the cursor, packing denser, darker glyphs around it.
 */
export function AsciiWordmark({
  src,
  className = "",
  color = "#6e9938",
  glowColor = "#96c35d",
  hotColor = "#3f6b22",
  restOpacity = 0.9,
  cell = 9,
  bleed = 0.12,
  label = "Nunmai",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const img = new Image();
    const pointer = { x: 0, y: 0, active: false };
    let w = 0;
    let h = 0;
    let cw = cell;
    let ch = Math.round(cell * 1.55);
    let cols = 0;
    let rows = 0;
    let mask = new Float32Array(0); // 0..1 letter coverage per glyph cell
    let heat = new Float32Array(0); // smoothed spotlight strength per cell
    let seed = new Float32Array(0); // per-cell randomness for the shimmer
    let raf = 0;
    let lastFrame = 0;
    let visible = true;

    const buildMask = () => {
      mask = new Float32Array(cols * rows);
      if (!img.naturalWidth || !cols || !rows) return;
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;
      // The logo spans ~96% of the width; convert its pixel size into glyph cells
      // (cells are taller than wide) and let its lower part bleed off the bottom.
      const drawWpx = w * 0.96;
      const drawHpx = (drawWpx * img.naturalHeight) / img.naturalWidth;
      const dw = drawWpx / cw;
      const dh = drawHpx / ch;
      o.imageSmoothingQuality = "high";
      o.drawImage(img, (cols - dw) / 2, rows - dh * (1 - bleed), dw, dh);
      const d = o.getImageData(0, 0, cols, rows).data;
      for (let i = 0; i < cols * rows; i++) {
        const alpha = d[i * 4 + 3] / 255;
        const luma = (0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]) / 255;
        mask[i] = alpha * (1 - luma);
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      // On narrow screens glyphs are tiny, so use a bold "+" to keep the lockup legible.
      const small = cw < 6;
      ctx.font = `${small ? "700 " : ""}${Math.max(5, Math.round(cw * 1.3))}px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const rx = Math.max(90, w * 0.1); // spotlight ellipse, wider than tall
      const ry = rx * 0.6;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;
          const x = c * cw + cw / 2;
          const y = r * ch + ch / 2;

          let target = 0;
          if (pointer.active) {
            const dx = (x - pointer.x) / rx;
            const dy = (y - pointer.y) / ry;
            const dist = dx * dx + dy * dy;
            if (dist < 1) target = 1 - dist;
          }
          // Light up quickly, fade out slowly.
          heat[i] += (target - heat[i]) * (target > heat[i] ? 0.3 : 0.07);

          const inLetter = mask[i] > 0.4;
          const hv = heat[i];
          if (!inLetter && hv < 0.05) continue;

          let glyph: string;
          if (hv >= 0.05) {
            const level = Math.min(1, hv * (inLetter ? 1.25 : 0.8));
            glyph = RAMP[Math.min(RAMP.length - 1, Math.floor(level * RAMP.length))];
            ctx.globalAlpha = 0.35 + level * 0.65;
            ctx.fillStyle = level > 0.5 ? hotColor : glowColor;
          } else {
            // Each resting cell re-rolls every few seconds; only ~1 in 10 shows a "+".
            const s = seed[i];
            const step = reduce ? 0 : Math.floor(now / (1600 + s * 4200));
            glyph = small ? "+" : IDLE[Math.floor(s * IDLE.length + step * 7) % IDLE.length];
            ctx.globalAlpha = small ? Math.min(1, restOpacity + 0.2) : restOpacity;
            ctx.fillStyle = color;
          }
          ctx.fillText(glyph, x, y);
        }
      }
      ctx.globalAlpha = 1;
    };

    const layout = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep roughly 150+ columns so the lockup stays legible on narrow screens.
      cw = Math.max(4, Math.min(cell, w / 150));
      ch = Math.round(cw * 1.55);
      cols = Math.ceil(w / cw);
      rows = Math.ceil(h / ch);
      heat = new Float32Array(cols * rows);
      seed = Float32Array.from({ length: cols * rows }, () => Math.random());
      buildMask();
      draw(performance.now());
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - lastFrame < 33) return; // ~30 fps is plenty for glyphs
      lastFrame = now;
      draw(now);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    img.onload = buildMask;
    img.src = src;
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointercancel", onLeave);
    const ro = new ResizeObserver(layout); // also runs the first layout
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(wrap);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      img.onload = null;
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointercancel", onLeave);
    };
  }, [src, color, glowColor, hotColor, restOpacity, cell, bleed]);

  return (
    <div ref={wrapRef} role="img" aria-label={label} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  );
}
