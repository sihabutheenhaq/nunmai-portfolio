import { Check } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { Reveal } from "./Reveal";
import { Eyebrow } from "./SectionHeading";

export function Mission({ t }: { t: Dictionary }) {
  const { about } = t;

  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16">
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
    </section>
  );
}
