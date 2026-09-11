"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AppWindow,
  Boxes,
  Braces,
  Database,
  FolderOpen,
  Globe,
  Landmark,
  LayoutDashboard,
  Mail,
  MessageCircle,
  MessagesSquare,
  Send,
  Ticket,
  UserCog,
  Users,
  Webhook,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { NunmaiMark } from "./NunmaiMark";

const channelIcons: LucideIcon[] = [Globe, LayoutDashboard, Braces, Mail, MessageCircle, Send, AppWindow];
const systemIcons: LucideIcon[] = [MessagesSquare, FolderOpen, Landmark, Users, Ticket, UserCog, Database, Webhook, Boxes];

type Flow = { key: string; d: string; dir: "in" | "out" };
type Hub = { cx: number; cy: number; r: number };

// One shared cycle: every request dot arrives at the hub together (first 45%),
// the hub pulses, then every dispatch dot leaves together (last 45%).
const CYCLE = "3.2s";
const EASE = "0.45 0 0.55 1";
const motion = {
  in: { keyPoints: "0;1;1", keyTimes: "0;0.45;1", keySplines: `${EASE};0 0 1 1` },
  out: { keyPoints: "0;0;1", keyTimes: "0;0.55;1", keySplines: `0 0 1 1;${EASE}` },
};
const fade = {
  in: { values: "0;1;1;0;0", keyTimes: "0;0.04;0.43;0.46;1" },
  out: { values: "0;0;1;1;0", keyTimes: "0;0.54;0.57;0.96;1" },
};

const reducedQuery = "(prefers-reduced-motion: reduce)";
function useReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(reducedQuery);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

function curve(sx: number, sy: number, ex: number, ey: number, vertical: boolean) {
  if (vertical) {
    const my = (sy + ey) / 2;
    return `M${sx},${sy} C${sx},${my} ${ex},${my} ${ex},${ey}`;
  }
  const mx = (sx + ex) / 2;
  return `M${sx},${sy} C${mx},${sy} ${mx},${ey} ${ex},${ey}`;
}

/**
 * Channels → Nunmai hub → enterprise systems, joined by animated flow lines.
 * Works in either direction: in Arabic (RTL) channels sit on the right.
 */
export function EngineFlow({ t }: { t: Dictionary }) {
  const { engine } = t;
  const reduced = useReducedMotion();
  const boxRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const leftRefs = useRef<(HTMLLIElement | null)[]>([]);
  const rightRefs = useRef<(HTMLLIElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hub, setHub] = useState<Hub | null>(null);
  const [flows, setFlows] = useState<Flow[]>([]);

  useEffect(() => {
    const box = boxRef.current;
    const hubEl = hubRef.current;
    if (!box || !hubEl) return;

    const measure = () => {
      const b = box.getBoundingClientRect();
      const c = hubEl.getBoundingClientRect();
      const cx = c.left + c.width / 2 - b.left;
      const cy = c.top + c.height / 2 - b.top;
      const r = c.width / 2;
      const channels = leftRefs.current.filter((el): el is HTMLLIElement => !!el);
      const systems = rightRefs.current.filter((el): el is HTMLLIElement => !!el);
      if (!channels.length) return;
      // Stacked (mobile) when the hub sits below every channel node.
      const vertical = c.top >= channels[channels.length - 1].getBoundingClientRect().bottom;

      // Edge of a node that faces the hub, relative to the box.
      const nodeEdge = (n: DOMRect) => {
        const nodeCx = n.left + n.width / 2 - b.left;
        const midY = n.top + n.height / 2 - b.top;
        return nodeCx < cx ? { x: n.right - b.left, y: midY, hubX: cx - r } : { x: n.left - b.left, y: midY, hubX: cx + r };
      };

      const out: Flow[] = [];
      channels.forEach((el, i) => {
        const n = el.getBoundingClientRect();
        const spread = (i - (channels.length - 1) / 2) * 6;
        const e = nodeEdge(n);
        out.push({
          key: `in-${i}`,
          dir: "in",
          d: vertical
            ? curve(n.left + n.width / 2 - b.left, n.bottom - b.top, cx + spread, cy - r, true)
            : curve(e.x, e.y, e.hubX, cy + spread, false),
        });
      });
      systems.forEach((el, i) => {
        const n = el.getBoundingClientRect();
        const spread = (i - (systems.length - 1) / 2) * 5;
        const e = nodeEdge(n);
        out.push({
          key: `out-${i}`,
          dir: "out",
          d: vertical
            ? curve(cx + spread, cy + r, n.left + n.width / 2 - b.left, n.top - b.top, true)
            : curve(e.hubX, cy + spread, e.x, e.y, false),
        });
      });

      setSize({ w: b.width, h: b.height });
      setHub({ cx, cy, r });
      setFlows(out);
    };

    // ResizeObserver fires once on observe, so this also does the first measurement.
    const ro = new ResizeObserver(measure);
    [box, hubEl, ...leftRefs.current, ...rightRefs.current].forEach((el) => el && ro.observe(el));
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={boxRef} className="relative overflow-hidden rounded-[2rem] bg-surface px-6 py-10 sm:px-10">
      <svg aria-hidden className="pointer-events-none absolute inset-0" width={size.w} height={size.h}>
        {flows.map((f) => (
          <g key={f.key}>
            <path d={f.d} fill="none" stroke="#d3e6bd" strokeWidth={2} />
            <path d={f.d} fill="none" stroke="#96c35d" strokeWidth={2} strokeDasharray="4 12" className="flow-dash" />
            {!reduced && (
              <circle r={4.5} fill="#6e9938" opacity={0}>
                <animateMotion
                  dur={CYCLE}
                  begin="0s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  path={f.d}
                  {...motion[f.dir]}
                />
                <animate attributeName="opacity" dur={CYCLE} begin="0s" repeatCount="indefinite" {...fade[f.dir]} />
              </circle>
            )}
          </g>
        ))}

        {/* Hub pulse, timed to the moment the request dots arrive */}
        {hub && !reduced && (
          <circle cx={hub.cx} cy={hub.cy} r={hub.r} fill="none" stroke="#96c35d" strokeWidth={3} opacity={0}>
            <animate
              attributeName="r"
              dur={CYCLE}
              begin="0s"
              repeatCount="indefinite"
              values={`${hub.r};${hub.r};${hub.r + 28};${hub.r + 28}`}
              keyTimes="0;0.44;0.62;1"
            />
            <animate
              attributeName="opacity"
              dur={CYCLE}
              begin="0s"
              repeatCount="indefinite"
              values="0;0.9;0;0"
              keyTimes="0;0.44;0.62;1"
            />
          </circle>
        )}
      </svg>

      <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-28">
        {/* Channels */}
        <div className="flex flex-col items-center lg:items-end">
          <p className="mb-5 font-semibold">{engine.channelsTitle}</p>
          <ul className="flex flex-wrap justify-center gap-3 lg:flex-col lg:items-end">
            {engine.channels.map((c, i) => {
              const Icon = channelIcons[i % channelIcons.length];
              return (
                <li
                  key={c}
                  ref={(el) => {
                    leftRefs.current[i] = el;
                  }}
                  className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-ink/5"
                >
                  <Icon className="size-4 text-brand-dark" />
                  {c}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Nunmai hub */}
        <div className="relative mx-auto grid size-40 place-items-center">
          <span className="absolute inset-2 rounded-full bg-brand/15" />
          <div
            ref={hubRef}
            className="relative grid size-32 place-items-center rounded-full bg-white shadow-xl shadow-brand/25 ring-4 ring-brand/30"
          >
            <div className="text-center">
              <NunmaiMark className="mx-auto h-12 w-auto text-deep" />
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-dark">{engine.coreTitle}</p>
            </div>
          </div>
        </div>

        {/* Systems */}
        <div className="flex flex-col items-center lg:items-start">
          <p className="mb-5 font-semibold">{engine.systemsTitle}</p>
          <ul className="flex flex-wrap justify-center gap-3 lg:flex-col lg:items-start">
            {engine.systems.map((s, i) => {
              const Icon = systemIcons[i % systemIcons.length];
              return (
                <li
                  key={s}
                  ref={(el) => {
                    rightRefs.current[i] = el;
                  }}
                  className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-sm font-medium shadow-sm ring-1 ring-ink/5"
                >
                  <Icon className="size-4 text-brand-dark" />
                  {s}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
