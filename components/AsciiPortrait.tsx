"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Light → dense. Bright areas (the photo's background) become blank. */
const RAMP = " .:-=+*#%@";

type Props = {
  src: string;
  className?: string;
  /** Glyph colour. */
  color?: string;
  /** Glyph opacity (0–1); lower gives the soft, low-contrast tone. */
  opacity?: number;
  /** Glyph cell width in CSS px (height is 1.7×). Smaller = finer detail. */
  cell?: number;
  /** Tonal contrast around mid-grey (1 = unchanged). */
  contrast?: number;
  /** Luma treated as white (0–1). Below 1 lifts a grey studio background to blank space. */
  whitePoint?: number;
};

/**
 * Renders a photo as monospace ASCII art on a canvas (object-fit: cover).
 * Dark tones map to dense glyphs, light tones to sparse ones or blank space.
 */
export function AsciiPortrait({
  src,
  className = "",
  color = "#0b2413",
  opacity = 0.6,
  cell = 5,
  contrast = 1.2,
  whitePoint = 1,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const img = new Image();
    let w = 0;
    let h = 0;

    const render = () => {
      if (!img.naturalWidth || !w || !h) return;
      const cw = cell;
      const ch = Math.round(cell * 1.7);
      const cols = Math.floor(w / cw);
      const rows = Math.floor(h / ch);
      if (!cols || !rows) return;
      const off = document.createElement("canvas");
      off.width = cols;
      off.height = rows;
      const o = off.getContext("2d", { willReadFrequently: true });
      if (!o) return;

      // Sample one pixel per glyph cell, "cover"-fitted (cells are taller than wide).
      const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const dw = (img.naturalWidth * scale) / cw;
      const dh = (img.naturalHeight * scale) / ch;
      o.imageSmoothingQuality = "high";
      o.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
      const d = o.getImageData(0, 0, cols, rows).data;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${Math.round(ch * 0.95)}px ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = (r * cols + c) * 4;
          const luma = Math.min(1, (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255 / whitePoint);
          const v = Math.min(1, Math.max(0, (luma - 0.5) * contrast + 0.5));
          const glyph = RAMP[Math.round((1 - v) * (RAMP.length - 1))];
          if (glyph !== " ") ctx.fillText(glyph, c * cw + cw / 2, r * ch + ch / 2);
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      render();
    };

    img.onload = render;
    img.src = src;
    const ro = new ResizeObserver(resize); // also runs the first layout
    ro.observe(wrap);

    return () => {
      ro.disconnect();
      img.onload = null;
    };
  }, [src, color, opacity, cell, contrast, whitePoint]);

  return (
    // cn() lets a caller's positioning (e.g. "absolute inset-0") replace the default "relative".
    <div ref={wrapRef} className={cn("relative", className)}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block size-full" />
    </div>
  );
}
