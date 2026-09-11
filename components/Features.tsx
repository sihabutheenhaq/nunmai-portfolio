import { BookOpen, FileSearch, ListChecks, Telescope } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons = [FileSearch, Telescope, ListChecks, BookOpen];

export function Features({ t }: { t: Dictionary }) {
  const { about } = t;
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading title={about.principlesTitle} center />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {about.principles.map((p, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal key={p.title} delay={i * 100} className="h-full">
              <div className="group h-full rounded-[2rem] bg-surface px-6 py-8 text-center transition-colors duration-300 hover:bg-surface-2">
                <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-white text-brand-dark shadow-sm transition-transform duration-300 group-hover:-translate-y-1">
                  <Icon className="size-8" strokeWidth={1.75} />
                </span>
                <p className="mt-6 text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-xl font-medium">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
