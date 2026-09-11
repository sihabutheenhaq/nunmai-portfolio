import { Building2, GraduationCap, HeartPulse, Landmark, Scale, Umbrella, Wallet } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";

const icons = [Wallet, Landmark, HeartPulse, Umbrella, Scale, GraduationCap, Building2];

export function SectorMarquee({ t }: { t: Dictionary }) {
  const { about } = t;
  return (
    <section className="pb-8 pt-20" aria-label={about.sectorsTitle}>
      <p className="text-center text-lg font-medium">{about.sectorsTitle}</p>
      <div className="marquee-mask mx-auto mt-8 max-w-5xl overflow-hidden">
        <div className="marquee-track flex w-max">
          {[0, 1].map((copy) =>
            about.sectors.map((s, i) => {
              const Icon = icons[i % icons.length];
              return (
                <span
                  key={`${copy}-${s}`}
                  aria-hidden={copy === 1}
                  className="flex shrink-0 items-center gap-2.5 px-8 text-xl font-bold tracking-tight text-neutral-400"
                >
                  <Icon className="size-6" />
                  {s}
                </span>
              );
            }),
          )}
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-2xl px-6 text-center text-[15px] font-medium leading-relaxed text-muted">{about.lab}</p>
    </section>
  );
}
