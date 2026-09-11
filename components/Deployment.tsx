"use client";

import { useState } from "react";
import {
  Cloud,
  Cpu,
  LockKeyhole,
  Network,
  Route,
  ScrollText,
  Server,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";
import { NunmaiMark } from "./NunmaiMark";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./SectionHeading";

type Layer = Dictionary["deployment"]["models"];

const optionIcons: Record<string, LucideIcon> = {
  local: Cpu,
  private: LockKeyhole,
  cloud: Sparkles,
  "private-cloud": Cloud,
  vpc: Network,
  "on-prem": Server,
};
const alwaysIcons = [ShieldCheck, ScrollText, Route];

/** One swappable layer of the stack: three icon tiles plus a short hint for the choice. */
function LayerPicker({ layer }: { layer: Layer }) {
  const [selected, setSelected] = useState(layer.defaultId);
  const current = layer.options.find((o) => o.id === selected) ?? layer.options[0];

  return (
    <div className="rounded-3xl bg-white p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{layer.title}</p>
        <p key={current.id} className="animate-fade-up text-xs font-semibold text-brand-dark">
          {current.text}
        </p>
      </div>
      <div role="radiogroup" aria-label={layer.title} className="mt-3 grid grid-cols-3 gap-2">
        {layer.options.map((o) => {
          const Icon = optionIcons[o.id];
          const on = o.id === selected;
          return (
            <button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setSelected(o.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl px-2 py-3.5 text-center text-[13px] font-semibold leading-tight transition-all duration-300",
                on ? "bg-brand text-white shadow-lg shadow-brand/30" : "bg-surface text-ink/70 hover:bg-surface-2 hover:text-ink",
              )}
            >
              <Icon className="size-5" strokeWidth={1.75} />
              {o.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <svg aria-hidden viewBox="0 0 2 32" className="mx-auto block h-8 w-0.5 overflow-visible">
      <line x1="1" x2="1" y1="0" y2="32" stroke="#96c35d" strokeWidth="2" strokeDasharray="4 4" className="flow-dash" />
    </svg>
  );
}

export function Deployment({ t }: { t: Dictionary }) {
  const { deployment } = t;
  return (
    <section id="deployment" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16">
      <Reveal>
        <div className="grid items-center gap-10 rounded-[2rem] bg-surface p-6 sm:p-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div>
            <Eyebrow>{deployment.label}</Eyebrow>
            <h2 className="mt-4 text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">{deployment.title}</h2>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">{deployment.text}</p>
            <p className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold">
              <LockKeyhole className="size-4 shrink-0 text-brand-dark" />
              {deployment.footnote}
            </p>
          </div>

          {/* The stack: swap the models or the infrastructure; the engine and its rules stay put */}
          <div>
            <LayerPicker layer={deployment.models} />
            <Connector />
            <div className="rounded-3xl bg-deep p-5 text-white shadow-xl shadow-deep/20">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 whitespace-nowrap">
                <NunmaiMark className="h-7 w-auto text-brand-light" gap="#052819" />
                <p className="font-semibold">{deployment.engine}</p>
                <p className="ms-auto text-[11px] font-bold uppercase tracking-[0.1em] text-brand-light sm:tracking-[0.14em]">{deployment.alwaysTitle}</p>
              </div>
              <ul className="mt-4 grid grid-cols-3 gap-2">
                {deployment.always.map((a, i) => {
                  const Icon = alwaysIcons[i % alwaysIcons.length];
                  return (
                    <li
                      key={a}
                      className="flex flex-col items-center gap-2 rounded-2xl bg-white/[0.08] px-2 py-3 text-center text-xs font-semibold leading-tight ring-1 ring-inset ring-white/10"
                    >
                      <Icon className="size-4 text-brand-light" />
                      {a}
                    </li>
                  );
                })}
              </ul>
            </div>
            <Connector />
            <LayerPicker layer={deployment.where} />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
