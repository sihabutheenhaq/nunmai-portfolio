"use client";

import { useEffect, useRef } from "react";

export type GlobePlace = { lat: number; lon: number; label: string; side: "left" | "right" };

const DEG = Math.PI / 180;
/** Resting view: centred between the Gulf and South India so every location is in sight. */
const HOME = { lon: 60, lat: 18 };
const LIME = "#c8ee93";
const GREEN = "#96c35d";
const DEEP = "#0b2413";

/**
 * Dotted globe (orthographic projection on a canvas) with pulsing, labelled markers.
 * Land dots come from public/geo/land-dots.json. It drifts gently around HOME and turns to
 * face the `active` place when one is selected.
 */
export function LocationGlobe({
  places,
  active,
  className = "",
}: {
  places: GlobePlace[];
  active: number | null;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const placesRef = useRef(places);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);
  useEffect(() => {
    placesRef.current = places;
  }, [places]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const start = performance.now();
    let dots = new Float32Array(0);
    let w = 0;
    let h = 0;
    let font = "sans-serif";
    let lon = HOME.lon;
    let lat = HOME.lat;
    let raf = 0;
    let visible = true;
    let cancelled = false;

    fetch("/geo/land-dots.json")
      .then((r) => r.json())
      .then((arr: number[]) => {
        if (!cancelled) dots = Float32Array.from(arr);
      })
      .catch(() => {});

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Use the page's font (Albert Sans / IBM Plex Sans Arabic) for the labels.
      font = getComputedStyle(canvas).fontFamily || "sans-serif";
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !w) return;

      const R = Math.min(w, h) * 0.44;
      const cx = w / 2;
      const cy = h / 2;
      const a = activeRef.current;
      const pl = placesRef.current;

      // Turn towards the selected place, or drift slowly back and forth around HOME.
      const t = (now - start) / 1000;
      const target =
        a !== null && pl[a]
          ? { lon: pl[a].lon, lat: pl[a].lat * 0.6 }
          : { lon: HOME.lon + (reduce ? 0 : 24 * Math.sin(t / 7)), lat: HOME.lat };
      const ease = reduce ? 1 : 0.06;
      lon += (target.lon - lon) * ease;
      lat += (target.lat - lat) * ease;

      const l0 = lon * DEG;
      const sp0 = Math.sin(lat * DEG);
      const cp0 = Math.cos(lat * DEG);
      // Orthographic projection; depth > 0 means the point faces the viewer.
      const proj = (plon: number, plat: number): [number, number, number] => {
        const l = plon * DEG - l0;
        const p = plat * DEG;
        const cp = Math.cos(p);
        const sp = Math.sin(p);
        const cl = Math.cos(l);
        return [cx + R * cp * Math.sin(l), cy - R * (cp0 * sp - sp0 * cp * cl), sp0 * sp + cp0 * cp * cl];
      };

      ctx.clearRect(0, 0, w, h);

      // Sphere body and rim
      const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
      body.addColorStop(0, "rgba(150,195,93,0.12)");
      body.addColorStop(1, "rgba(150,195,93,0.02)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(200,238,147,0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Graticule every 20°, visible hemisphere only
      ctx.strokeStyle = "rgba(200,238,147,0.09)";
      ctx.beginPath();
      const line = (pts: [number, number][]) => {
        let pen = false;
        for (const [plon, plat] of pts) {
          const [x, y, d] = proj(plon, plat);
          if (d > 0) {
            if (pen) ctx.lineTo(x, y);
            else ctx.moveTo(x, y);
            pen = true;
          } else {
            pen = false;
          }
        }
      };
      for (let m = -180; m < 180; m += 20) {
        const pts: [number, number][] = [];
        for (let la = -90; la <= 90; la += 3) pts.push([m, la]);
        line(pts);
      }
      for (let pa = -60; pa <= 60; pa += 20) {
        const pts: [number, number][] = [];
        for (let lo = -180; lo <= 180; lo += 3) pts.push([lo, pa]);
        line(pts);
      }
      ctx.stroke();

      // Land dots, fading towards the edge of the sphere
      ctx.fillStyle = GREEN;
      const ds = Math.max(1.3, R / 150);
      for (let i = 0; i < dots.length; i += 2) {
        const l = dots[i] * DEG - l0;
        const p = dots[i + 1] * DEG;
        const cp = Math.cos(p);
        const sp = Math.sin(p);
        const cl = Math.cos(l);
        const depth = sp0 * sp + cp0 * cp * cl;
        if (depth <= 0) continue;
        ctx.globalAlpha = 0.12 + 0.7 * depth;
        ctx.fillRect(cx + R * cp * Math.sin(l) - ds / 2, cy - R * (cp0 * sp - sp0 * cp * cl) - ds / 2, ds, ds);
      }
      ctx.globalAlpha = 1;

      // Markers: pulsing ring, lime core, and a city tag beside it
      ctx.font = `600 13px ${font}`;
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      pl.forEach((place, i) => {
        const [x, y, d] = proj(place.lon, place.lat);
        if (d <= 0.05) return;
        const on = a === i;
        ctx.globalAlpha = Math.min(1, d * 2.5);

        const phase = reduce ? 0.5 : (now / 1400 + i * 0.33) % 1;
        ctx.strokeStyle = `rgba(200,238,147,${(1 - phase) * 0.85})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(x, y, 5 + phase * (on ? 22 : 14), 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = LIME;
        ctx.beginPath();
        ctx.arc(x, y, on ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = DEEP;
        ctx.beginPath();
        ctx.arc(x, y, on ? 2.5 : 2, 0, Math.PI * 2);
        ctx.fill();

        const tw = ctx.measureText(place.label).width;
        const padX = 10;
        const tagH = 24;
        const tagW = tw + padX * 2;
        const bx = place.side === "left" ? x - 14 - tagW : x + 14;
        ctx.fillStyle = on ? LIME : "rgba(11,36,19,0.88)";
        ctx.beginPath();
        ctx.roundRect(bx, y - tagH / 2, tagW, tagH, 12);
        ctx.fill();
        if (!on) {
          ctx.strokeStyle = "rgba(200,238,147,0.35)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        ctx.fillStyle = on ? DEEP : "#ffffff";
        ctx.fillText(place.label, bx + padX, y + 0.5);
      });
      ctx.globalAlpha = 1;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(wrap);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} role="img" aria-label={places.map((p) => p.label).join(", ")} className={`relative ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block size-full" />
    </div>
  );
}
