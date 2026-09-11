"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import type { Locale } from "@/lib/i18n";
import { LocalTime } from "./LocalTime";
import { LocationGlobe, type GlobePlace } from "./LocationGlobe";
import { Reveal } from "./Reveal";

// Coordinates, time zones and which side of the marker the city tag sits (language-independent).
// Riyadh's tag goes left so it doesn't collide with nearby Dubai.
const PLACES: Record<string, { lat: number; lon: number; tz: string; offset: string; side: "left" | "right" }> = {
  riyadh: { lat: 24.7136, lon: 46.6753, tz: "Asia/Riyadh", offset: "GMT+3", side: "left" },
  dubai: { lat: 25.2048, lon: 55.2708, tz: "Asia/Dubai", offset: "GMT+4", side: "right" },
  tenkasi: { lat: 8.9591, lon: 77.3152, tz: "Asia/Kolkata", offset: "GMT+5:30", side: "right" },
};

export function Locations({ t, locale }: { t: Dictionary; locale: Locale }) {
  const { locations } = t;
  const [active, setActive] = useState<number | null>(null);
  const places: GlobePlace[] = locations.items.map((l) => ({ ...PLACES[l.id], label: l.city }));

  return (
    <section id="locations" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16">
      <Reveal>
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[2rem] bg-[#0b2413] p-6 text-white sm:p-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-light">{locations.label}</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]">{locations.title}</h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">{locations.text}</p>

            {/* Hovering, focusing or tapping a card turns the globe to that city. */}
            <ul className="mt-8 space-y-3" onMouseLeave={() => setActive(null)}>
              {locations.items.map((l, i) => {
                const place = PLACES[l.id];
                const on = active === i;
                return (
                  <li key={l.id}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-start transition-colors sm:gap-4 sm:px-5 ${
                        on ? "border-brand-light/60 bg-white/10" : "border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <span
                        className={`grid size-10 shrink-0 place-items-center rounded-xl transition-colors ${
                          on ? "bg-brand-light text-[#0b2413]" : "bg-white/10 text-brand-light"
                        }`}
                      >
                        <MapPin className="size-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-semibold">{l.city}</span>
                        <span className="block text-sm text-white/60">{l.country}</span>
                      </span>
                      <span className="shrink-0 text-end">
                        <span className="block text-lg font-semibold tabular-nums">
                          <LocalTime timeZone={place.tz} locale={locale} />
                        </span>
                        <span className="block text-xs text-white/50">
                          {/* The "Local time" prefix is dropped on phones so country names don't wrap. */}
                          <span className="hidden sm:inline">{locations.localTime} · </span>
                          <span dir="ltr">{place.offset}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <LocationGlobe places={places} active={active} className="mx-auto aspect-square w-full max-w-[560px]" />
        </div>
      </Reveal>
    </section>
  );
}
