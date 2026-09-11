import { BookOpen, DoorOpen, KeyRound, Laptop, Mail, Server, Ticket, UserPlus, Wrench } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons = [UserPlus, KeyRound, Mail, DoorOpen, Laptop, Server, BookOpen, Ticket, Wrench];

export function Operations({ t }: { t: Dictionary }) {
  const { operations } = t;
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading eyebrow={operations.eyebrow} title={operations.title} text={operations.text} center />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {operations.items.map((item, i) => {
          const Icon = icons[i % icons.length];
          return (
            <Reveal key={item} delay={(i % 3) * 100} className="h-full">
              <div className="group flex h-full items-center gap-4 rounded-[1.75rem] bg-surface px-6 py-5 transition-colors duration-300 hover:bg-surface-2">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white text-brand-dark shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
                  <Icon className="size-6" strokeWidth={1.75} />
                </span>
                <div>
                  <p className="text-xs font-bold text-brand">{String(i + 1).padStart(2, "0")}</p>
                  <p className="text-lg font-medium">{item}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
