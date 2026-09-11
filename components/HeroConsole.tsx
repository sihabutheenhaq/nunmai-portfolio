"use client";

import { useRef } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  BookOpen,
  Bot,
  CheckCircle2,
  Clock3,
  Cpu,
  LayoutGrid,
  Pause,
  Play,
  ScrollText,
  Search,
  Server,
  Settings,
  ShieldCheck,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { useReducedMotionPref, useTicker } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { NunmaiMark } from "./NunmaiMark";

type Console = Dictionary["hero"]["console"];

const STEP_MS = 1300;
const LAST = 6; // 0 request · 1-3 agent steps · 4 approval asked · 5 approved · 6 done
const HOLD = 4; // ticks the finished story stays on screen before it replays
const AUDIT_AT = [0, 1, 2, 4, 5, 6]; // step at which each audit entry appears
const railIcons = [LayoutGrid, Bot, BookOpen, ShieldCheck, ScrollText];

/** The Nunmai Portal as the hero's product window: an AI worker resolving a request, with approval and audit. */
export function HeroConsole({
  c,
  ui,
  paused,
  onTogglePause,
}: {
  c: Console;
  ui: Dictionary["ui"];
  paused: boolean;
  onTogglePause: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduce = useReducedMotionPref();
  const tick = useTicker(STEP_MS, inView && !paused && !reduce);
  const step = reduce ? LAST : Math.min(tick % (LAST + 1 + HOLD), LAST);
  const approved = step >= 5;
  const latestAudit = AUDIT_AT.filter((at) => step >= at).length - 1;
  const fade = {
    initial: reduce ? false : { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0 },
    transition: { duration: 0.35 },
  } as const;

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#07150d] text-white shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]"
    >
      {/* Light spilling in from the beam */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_var(--beam)_0%,rgba(200,238,147,0.14),transparent_70%)]" />

      <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <i className="size-2.5 rounded-full bg-white/20" />
          <i className="size-2.5 rounded-full bg-white/20" />
          <i className="size-2.5 rounded-full bg-white/20" />
        </span>
        <span className="mx-auto hidden items-center gap-2 rounded-md bg-white/5 px-3 py-1 text-[11px] text-white/50 sm:flex">
          <ShieldCheck className="size-3 text-brand-light" />
          {c.app}
        </span>
        <span className="ms-auto flex items-center gap-2 text-[11px] text-white/40 sm:ms-0">
          {ui.sample}
          <button
            type="button"
            onClick={onTogglePause}
            aria-label={paused ? ui.playAnimation : ui.pauseAnimation}
            className="grid size-6 place-items-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
          >
            {paused ? <Play className="size-3" fill="currentColor" /> : <Pause className="size-3" fill="currentColor" />}
          </button>
        </span>
      </div>

      <div className="relative grid h-[28rem] grid-cols-[3.25rem_minmax(0,1fr)] md:grid-cols-[3.25rem_12.5rem_minmax(0,1fr)] lg:grid-cols-[3.25rem_12.5rem_minmax(0,1fr)_16rem]">
        {/* Icon rail */}
        <div className="flex flex-col items-center gap-2 border-e border-white/10 py-4" aria-hidden>
          <span className="mb-2 grid size-8 place-items-center rounded-lg bg-brand">
            <NunmaiMark className="h-4 w-auto text-white" gap="#96c35d" />
          </span>
          {railIcons.map((Icon, i) => (
            <span key={i} className={cn("grid size-8 place-items-center rounded-lg", i === 1 ? "bg-white/10 text-brand-light" : "text-white/35")}>
              <Icon className="size-4" />
            </span>
          ))}
          <span className="mt-auto grid size-8 place-items-center text-white/35">
            <Settings className="size-4" />
          </span>
        </div>

        {/* Sidebar */}
        <div className="hidden border-e border-white/10 p-4 md:block">
          <p className="text-sm font-semibold">{c.app}</p>
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-xs text-white/35">
            <Search className="size-3.5" />
            {c.search}
          </div>
          {c.groups.map((g, gi) => (
            <div key={g.title} className="mt-5">
              <p className="px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">{g.title}</p>
              <ul className="mt-2 space-y-0.5">
                {g.items.map((item, ii) => (
                  <li
                    key={item}
                    className={cn(
                      "flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-[13px]",
                      gi === 0 && ii === 0 ? "bg-white/10 font-medium text-white" : "text-white/50",
                    )}
                  >
                    <span className="truncate">{item}</span>
                    {gi === 1 && ii === 0 && step === 4 && (
                      <span className="rounded-full bg-amber-300 px-1.5 text-[10px] font-bold text-deep">1</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Conversation */}
        <div className="min-w-0 p-4 sm:p-5">
          <p className="text-[11px] text-white/35">{c.crumbs.join(" / ")}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <p className="me-auto text-base font-semibold">{c.title}</p>
            {c.chips.map((chip, i) => {
              const Icon = i === 0 ? Cpu : Server;
              return (
                <span key={chip} className="hidden items-center gap-1.5 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/60 ring-1 ring-inset ring-white/10 sm:flex">
                  <Icon className="size-3 text-brand-light" />
                  {chip}
                </span>
              );
            })}
          </div>

          <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
            <div className="flex gap-3">
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/15 text-[11px] font-semibold">{c.user.name.charAt(0)}</span>
              <div className="min-w-0">
                <p className="text-[11px] text-white/40">
                  <span className="font-semibold text-white/75">{c.user.name}</span> · {c.user.via}
                </p>
                <p className="mt-1 rounded-2xl rounded-ss-md bg-white/[0.06] px-3.5 py-2.5 text-[13px] text-white/85">{c.user.text}</p>
              </div>
            </div>

            <AnimatePresence>
              {step >= 1 && (
                <motion.div key="agent" {...fade} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand/20">
                    <NunmaiMark className="h-3.5 w-auto text-brand-light" gap="#24381d" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold text-white/75">{c.agent}</p>
                    <ul className="mt-1.5 space-y-1.5">
                      {c.steps.map(
                        (s, k) =>
                          step >= k + 1 && (
                            <motion.li key={s} {...fade} className="flex items-center gap-2 text-[13px] text-white/80">
                              <CheckCircle2 className="size-3.5 shrink-0 text-brand-light" />
                              {s}
                            </motion.li>
                          ),
                      )}
                    </ul>

                    {step >= 4 && (
                      <motion.div
                        {...fade}
                        className={cn(
                          "mt-3 max-w-md rounded-2xl border p-3.5 transition-colors duration-500",
                          approved ? "border-brand/40 bg-brand/[0.08]" : "border-amber-300/30 bg-amber-300/[0.06]",
                        )}
                      >
                        <p className={cn("flex items-center gap-1.5 text-[11px] font-semibold", approved ? "text-brand-light" : "text-amber-300")}>
                          {approved ? <CheckCircle2 className="size-3.5" /> : <Clock3 className="size-3.5" />}
                          {approved ? c.approval.approved : c.approval.label}
                        </p>
                        <p className="mt-1 text-[13px] font-semibold">{c.approval.text}</p>
                        <p className="mt-0.5 text-[11px] text-white/45">{c.approval.policy}</p>
                        {!approved && (
                          <div className="mt-2.5 flex gap-2" aria-hidden>
                            <span className="rounded-full bg-brand px-3 py-1 text-[11px] font-semibold">{c.approval.approve}</span>
                            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/70">{c.approval.reject}</span>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {step >= 6 && (
                      <motion.p {...fade} className="mt-3 inline-block rounded-2xl rounded-ss-md bg-brand/15 px-3.5 py-2.5 text-[13px] text-brand-light">
                        {c.done}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Audit trail */}
        <div className="hidden border-s border-white/10 p-5 lg:block">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <ScrollText className="size-4 text-brand-light" />
            {c.auditTitle}
          </p>
          <ol className="mt-4 space-y-3.5 border-s border-white/10 ps-4">
            <AnimatePresence initial={false}>
              {c.audit.map(
                (a, i) =>
                  step >= AUDIT_AT[i] && (
                    <motion.li key={a.text} {...fade} className="relative">
                      <span
                        className={cn(
                          "absolute -start-[21px] top-1 size-2 rounded-full",
                          i === latestAudit ? "bg-brand-light ring-4 ring-brand-light/20" : "bg-white/30",
                        )}
                      />
                      <p className="font-mono text-[10px] text-white/35">{a.time}</p>
                      <p className="text-xs text-white/75">{a.text}</p>
                    </motion.li>
                  ),
              )}
            </AnimatePresence>
          </ol>
        </div>
      </div>
    </div>
  );
}
