"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import type { Dictionary } from "@/lib/dictionaries";
import { useReducedMotionPref } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { AsciiPortrait } from "./AsciiPortrait";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./SectionHeading";

const ROTATE_MS = 2500;

// Same order as `founder.people`. whitePoint lifts a grey studio background to blank space.
const PHOTOS = [
  { src: "/team/sihabutheen-haq.jpg", whitePoint: 0.8 },
];

/**
 * Founders' quote with soft ASCII-art portraits that rotate every 2.5 s.
 * Hovering the portrait shows the real photo and pauses; the name cards pick a person.
 */
export function Founder({ t }: { t: Dictionary }) {
  const { founder } = t;
  const people = founder.people;
  const [index, setIndex] = useState(0);
  const [hold, setHold] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotionPref();
  const running = inView && !hold && !reduce && people.length > 1;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % people.length), ROTATE_MS);
    return () => clearTimeout(id);
  }, [running, index, people.length]);

  // Pause for keyboard users moving through the cards, not for mouse clicks.
  const onFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target.matches(":focus-visible")) setHold(true);
  };

  return (
    <section ref={ref} id="founder" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16">
      <Reveal>
        <figure className="grid overflow-hidden rounded-[2rem] border border-ink/10 bg-surface lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex items-center justify-center border-b border-ink/10 p-8 sm:p-12 lg:border-b-0 lg:border-e">
            {/* Compact portraits with softly faded edges, like a sketch */}
            <div
              onMouseEnter={() => setHold(true)}
              onMouseLeave={() => setHold(false)}
              className="group relative aspect-[4/5] w-full max-w-[19rem] [mask-image:radial-gradient(ellipse_72%_78%_at_50%_42%,#000_55%,transparent_100%)]"
            >
              {people.map((p, i) => (
                <div
                  key={p.name}
                  aria-hidden={i !== index}
                  className={cn("absolute inset-0 transition-opacity duration-700", i === index ? "opacity-100" : "opacity-0")}
                >
                  <Image
                    src={PHOTOS[i].src}
                    alt={p.photoAlt}
                    fill
                    sizes="19rem"
                    className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <AsciiPortrait
                    src={PHOTOS[i].src}
                    whitePoint={PHOTOS[i].whitePoint}
                    className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-center p-8 sm:p-14">
            <Eyebrow>{founder.label}</Eyebrow>
            <blockquote className="mt-6 text-3xl font-medium leading-snug tracking-tight text-ink sm:text-4xl">{founder.quote}</blockquote>
            <figcaption className="mt-8 flex flex-wrap gap-3" onFocus={onFocus} onBlur={() => setHold(false)}>
              {people.map((p, i) => {
                const on = i === index;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-pressed={on}
                    className={cn(
                      "relative overflow-hidden rounded-2xl px-4 py-3 text-start transition-colors duration-300",
                      on ? "bg-white shadow-sm" : "hover:bg-white/60",
                    )}
                  >
                    <span className={cn("block font-semibold transition-colors", on ? "text-ink" : "text-ink/45")}>{p.name}</span>
                    <span className={cn("block text-sm transition-colors", on ? "text-muted" : "text-muted/60")}>{p.role}</span>
                    {on && running && (
                      <span key={index} aria-hidden className="founder-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-brand rtl:origin-right" />
                    )}
                  </button>
                );
              })}
            </figcaption>
          </div>
        </figure>
      </Reveal>
    </section>
  );
}
