"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  ArrowRight,
  Brain,
  Fingerprint,
  Library,
  Route,
  ScrollText,
  ShieldCheck,
  UserCheck,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { controlVisuals } from "./ControlVisuals";
import { NunmaiMark } from "./NunmaiMark";
import { Eyebrow } from "./SectionHeading";

const controlIcons: Record<string, LucideIcon> = {
  identity: Fingerprint,
  knowledge: Library,
  routing: Route,
  orchestration: Workflow,
  tools: Wrench,
  memory: Brain,
  approval: UserCheck,
  audit: ScrollText,
  security: ShieldCheck,
};

type Layout = { vw: number; centers: number[] };

const pad = (n: number) => String(n).padStart(2, "0");
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const cardClass =
  "flex h-[min(32rem,calc(100svh-13rem))] w-[var(--card-w)] shrink-0 flex-col overflow-hidden rounded-[2rem]";

/**
 * One card in the cover-flow row. Its distance from the viewport centre
 * (-1 = left edge, 0 = centre, 1 = right edge) drives size, tilt and fade:
 * biggest and flat in the middle, smaller and turned away at the sides.
 */
function PanoCard({
  index,
  x,
  tick,
  layout,
  animate3d,
  className,
  children,
}: {
  index: number;
  x: MotionValue<number>;
  tick: MotionValue<number>;
  layout: RefObject<Layout>;
  animate3d: boolean;
  className: string;
  children: ReactNode;
}) {
  const offset = useTransform([x, tick], ([xv]: number[]) => {
    const { vw, centers } = layout.current;
    const c = centers[index];
    if (!vw || c === undefined) return 0;
    return clamp((c + xv - vw / 2) / (vw / 2), -1.4, 1.4);
  });
  const scale = useTransform(offset, (v) => 1 - 0.3 * Math.min(Math.abs(v), 1));
  const rotateY = useTransform(offset, (v) => v * -30);
  const opacity = useTransform(offset, (v) => 1 - 0.5 * Math.min(Math.abs(v), 1));
  const zIndex = useTransform(offset, (v) => 50 - Math.round(Math.abs(v) * 20));

  return (
    <motion.article
      style={animate3d ? { scale, rotateY, opacity, zIndex, transformPerspective: 1100 } : undefined}
      className={className}
    >
      {children}
    </motion.article>
  );
}

/**
 * Pinned cover-flow: while the section is on screen, scrolling down moves the
 * engine-control cards through a large centre spotlight: right to left in
 * English, left to right in Arabic (following the reading direction).
 */
export function EnginePanorama({ t, rtl }: { t: Dictionary; rtl: boolean }) {
  const { engine, ui, visuals } = t;
  const reduced = useReducedMotion();
  const pinned = !reduced;
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const layout = useRef<Layout>({ vw: 0, centers: [] });
  const distance = useMotionValue(0);
  const tick = useMotionValue(0);
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(0);
  const total = engine.controls.length;
  const direction = rtl ? 1 : -1;

  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;
    const ro = new ResizeObserver(() => {
      const vw = viewport.clientWidth;
      const cards = Array.from(track.children) as HTMLElement[];
      // offsetLeft is measured from the sticky viewport, so this works in LTR and RTL.
      layout.current = { vw, centers: cards.map((c) => c.offsetLeft + c.offsetWidth / 2) };
      // Travel from "first card centred" to "last card centred".
      const d = Math.max(0, track.scrollWidth - vw);
      distance.set(d);
      setHeight(d);
      tick.set(tick.get() + 1);
    });
    ro.observe(track);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, [distance, tick]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, distance], ([p, d]: number[]) => direction * p * d);
  // total control cards + 1 closing card; the centred one is round(p * total).
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(total - 1, Math.round(p * total))));

  return (
    <section
      ref={sectionRef}
      aria-label={engine.coreTitle}
      className="relative"
      // Vertical scroll room equals the horizontal travel, so 1px down = 1px sideways.
      style={pinned ? { height: `calc(100svh + ${height}px)` } : undefined}
    >
      <div
        ref={viewportRef}
        className={pinned ? "sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pt-20" : "overflow-hidden py-16"}
      >
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Eyebrow>{engine.coreEyebrow}</Eyebrow>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{engine.coreTitle}</h3>
            </div>
            {pinned && (
              <div className="flex items-center gap-4" aria-hidden>
                <span className="text-sm font-semibold tabular-nums text-muted">
                  {pad(active + 1)} / {pad(total)}
                </span>
                <div className="h-1 w-32 overflow-hidden rounded-full bg-surface-2">
                  <motion.div className="h-full origin-left rounded-full bg-brand rtl:origin-right" style={{ scaleX: scrollYProgress }} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className={pinned ? "" : "overflow-x-auto"}>
          <motion.div
            ref={trackRef}
            style={pinned ? { x } : undefined}
            className="mt-6 flex w-max items-center gap-2 px-[calc(50%-var(--card-w)/2)] py-4 [--card-w:min(84vw,26rem)] lg:[--card-w:27rem]"
          >
            {engine.controls.map((c, i) => {
              const Visual = controlVisuals[c.id];
              const Icon = controlIcons[c.id];
              return (
                <PanoCard
                  key={c.id}
                  index={i}
                  x={x}
                  tick={tick}
                  layout={layout}
                  animate3d={pinned}
                  className={`${cardClass} bg-surface shadow-xl shadow-ink/5 ring-1 ring-ink/5`}
                >
                  <div className="relative h-[44%] shrink-0 overflow-hidden bg-gradient-to-br from-[#0b2413] via-[#123a1e] to-[#2a5e30] sm:h-[50%]">
                    <div
                      aria-hidden
                      className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:22px_22px]"
                    />
                    <span className="absolute start-5 top-4 z-10 text-xs font-bold tracking-[0.2em] text-white/45">{pad(i + 1)}</span>
                    <div aria-hidden className="relative h-full">
                      <Visual v={visuals} rtl={rtl} />
                    </div>
                  </div>
                  <div className="flex min-h-0 flex-1 flex-col p-5 sm:p-6">
                    <div className="flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-brand-dark shadow-sm">
                        <Icon className="size-5" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-lg font-semibold leading-tight sm:text-xl">{c.name}</h4>
                        <p className="text-sm font-semibold text-brand-dark">{c.short}</p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted sm:mt-4 sm:line-clamp-3 sm:text-[15px]">
                      {c.what}
                    </p>
                    <p className="mt-auto rounded-2xl bg-white px-4 py-3 text-[13px] leading-snug sm:text-sm">
                      <span className="font-bold text-brand-dark">{ui.whyItMatters} · </span>
                      {c.why}
                    </p>
                  </div>
                </PanoCard>
              );
            })}

            {/* Closing card */}
            <PanoCard
              index={total}
              x={x}
              tick={tick}
              layout={layout}
              animate3d={pinned}
              className={`${cardClass} justify-center bg-brand p-8 text-white shadow-xl shadow-brand/30`}
            >
              <NunmaiMark className="h-14 w-auto self-start text-white" gap="#96c35d" />
              <h4 className="mt-6 text-3xl font-semibold leading-tight">{engine.title}</h4>
              <a
                href="#contact"
                className="group mt-8 inline-flex items-center gap-2 self-start rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                {ui.requestPilot}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
              </a>
            </PanoCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
