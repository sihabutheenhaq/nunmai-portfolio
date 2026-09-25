"use client";

import { useEffect, useRef, useState, type FocusEvent } from "react";
import Image from "next/image";
import { useInView } from "motion/react";
import type { Dictionary } from "@/lib/dictionaries";
import { useReducedMotionPref } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./SectionHeading";

const ROTATE_MS = 2500;
const ORDER = [0, 2, 1];
const PHOTO_BY_NAME: Record<string, string> = {
  "Imran Khan": "/team/imran-khan.jpg",
  "Samsul Hameed.S.A": "/team/samsul-hameed.jpg",
  "Sihabutheen Haq": "/team/sihabutheen-haq.jpg",
};

/** Founders' quote with rotating portraits. Hovering the portrait pauses rotation. */
export function Founder({ t }: { t: Dictionary }) {
  const { founder } = t;
  const people = ORDER.map((i) => founder.people[i]).filter((p): p is NonNullable<typeof p> => Boolean(p));
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

  const onFocus = (e: FocusEvent<HTMLElement>) => {
    if (e.target.matches(":focus-visible")) setHold(true);
  };

  return (
    <section ref={ref} id="founder" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16">
      <Reveal>
        <figure className="grid overflow-hidden rounded-[2rem] border border-ink/10 bg-surface lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="flex items-center justify-center border-b border-ink/10 p-8 sm:p-12 lg:border-b-0 lg:border-e">
            <div
              onMouseEnter={() => setHold(true)}
              onMouseLeave={() => setHold(false)}
              className="group relative aspect-[4/5] w-full max-w-[19rem] [mask-image:linear-gradient(to_bottom,#000_88%,transparent_100%)]"
            >
              {people.map((p, i) => (
                <div
                  key={p.name}
                  aria-hidden={i !== index}
                  className={cn("absolute inset-0 transition-opacity duration-700", i === index ? "opacity-100" : "opacity-0")}
                >
                  <Image
                    src={PHOTO_BY_NAME[p.name]}
                    alt={p.photoAlt}
                    fill
                    sizes="19rem"
                    className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <Image
                    src={PHOTO_BY_NAME[p.name]}
                    alt=""
                    aria-hidden="true"
                    fill
                    sizes="19rem"
                    className="object-cover opacity-100 transition-opacity duration-700 group-hover:opacity-0"
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
