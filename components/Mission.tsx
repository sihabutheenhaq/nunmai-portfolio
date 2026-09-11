"use client";

import { useState } from "react";
import { Check, Play } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { NunmaiMark } from "./NunmaiMark";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./SectionHeading";

export function Mission({ t }: { t: Dictionary }) {
  const { about, explainer, ui } = t;
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <section id="about" className="mx-auto grid max-w-7xl scroll-mt-28 items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-24">
      <Reveal>
        <Eyebrow>{about.label}</Eyebrow>
        <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]">{about.title}</h2>
        <p className="mt-5 max-w-xl text-[15px] font-medium leading-[1.8] text-muted">{about.story}</p>

        <p className="mt-8 font-semibold">{about.rulesTitle}</p>
        <ul className="mt-4 max-w-md space-y-3">
          {about.rules.map((rule) => (
            <li key={rule} className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-[15px] font-medium">
              <Check className="size-4 shrink-0 text-brand-dark" />
              {rule}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={150}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-surface-2">
          {playing && !failed ? (
            <video
              className="absolute inset-0 size-full bg-black object-cover"
              src={explainer.video}
              poster={explainer.poster}
              controls
              autoPlay
              playsInline
              onError={() => setFailed(true)}
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`${ui.play}: ${explainer.title}`}
              className="group absolute inset-0 grid place-items-center"
            >
              {/* Logo backdrop, covered by the poster once it's added to public/video/ */}
              <NunmaiMark className="absolute h-3/4 w-auto text-brand/15" gap="#f0f6e8" />
              <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${explainer.poster})` }} />
              <span className="relative flex flex-col items-center gap-4">
                <span className="grid size-20 place-items-center rounded-full bg-brand text-white shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <Play className="ml-1 size-8" fill="currentColor" />
                </span>
                <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-ink shadow-sm">
                  {failed ? ui.videoUnavailable : `${explainer.title} · ${explainer.duration}`}
                </span>
              </span>
            </button>
          )}
        </div>
      </Reveal>
    </section>
  );
}
