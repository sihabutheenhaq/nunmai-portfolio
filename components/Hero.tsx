"use client";

import { useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { HeroBeam } from "./HeroBeam";
import { HeroConsole } from "./HeroConsole";

export function Hero({ t }: { t: Dictionary }) {
  const { hero, ui } = t;
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="top"
      data-paused={paused ? "" : undefined}
      className="relative overflow-hidden rounded-b-[2.5rem] bg-[#030f09] text-white"
    >
      {/* WebGL light beam, landing on the product window's top edge */}
      <HeroBeam stageRef={stageRef} paused={paused} />
      <div aria-hidden className="grain pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-36 sm:pt-44">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-white/80 backdrop-blur">
            <span className="size-1.5 rounded-full bg-brand-light shadow-[0_0_8px_2px_rgba(200,238,147,0.8)]" />
            {hero.eyebrow}
          </span>
          <h1 className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-[3.6rem]">
            {hero.titleA}
            <br />
            {hero.titleB}{" "}
            <span className="bg-gradient-to-r from-brand-light via-[#e6ffc4] to-brand bg-clip-text text-transparent">{hero.titleHighlight}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">{hero.lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={hero.primary.href}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white shadow-[0_0_0_1px_rgba(200,238,147,0.45),0_0_36px_-4px_rgba(150,195,93,0.85)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(200,238,147,0.7),0_0_52px_0_rgba(150,195,93,0.95)]"
            >
              {hero.primary.label}
              <ArrowRight className="size-4 rtl:-scale-x-100" />
            </a>
            <a
              href={hero.secondary.href}
              className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white backdrop-blur transition-colors hover:bg-white/10"
            >
              {hero.secondary.label}
            </a>
          </div>
        </div>
      </div>

      {/* Product window; --beam (globals.css, mirrored for Arabic) sets where the beam lands */}
      <div className="relative mx-auto mt-24 max-w-7xl px-4 sm:px-6 lg:mt-28">
        <div ref={stageRef} className="beam-stage relative">
          <div className="relative [mask-image:linear-gradient(to_bottom,#000_80%,transparent)]">
            <HeroConsole c={hero.console} ui={ui} paused={paused} onTogglePause={() => setPaused((p) => !p)} />
          </div>

          {/* Lit edge: bright where the beam hits, fading along the top and down the sides */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.75rem] border-[1.5px] border-[#effddc] [mask-image:radial-gradient(ellipse_75%_110%_at_var(--beam)_0%,#000,transparent_75%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[1.75rem] border-2 border-brand-light blur-[6px] [mask-image:radial-gradient(ellipse_90%_130%_at_var(--beam)_0%,#000,transparent_80%)]"
          />
          <span aria-hidden className="beam-anim edge-run-l pointer-events-none absolute -top-px h-[2px] w-24 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,#fff,transparent)]" />
          <span aria-hidden className="beam-anim edge-run-r pointer-events-none absolute -top-px h-[2px] w-24 -translate-x-1/2 bg-[linear-gradient(90deg,transparent,#fff,transparent)]" />
        </div>
      </div>
    </section>
  );
}
