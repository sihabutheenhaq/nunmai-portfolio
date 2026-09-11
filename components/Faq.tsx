"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { SectionHeading } from "./SectionHeading";

export function Faq({ t }: { t: Dictionary }) {
  const { faq, contact } = t;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-7xl scroll-mt-28 px-6 py-16">
      <SectionHeading
        eyebrow={faq.label}
        title={faq.title}
        center
        text={
          <>
            {faq.intro}{" "}
            <a href={`mailto:${contact.email}`} dir="ltr" className="font-semibold text-brand-dark hover:underline">
              {contact.email}
            </a>{" "}
            {faq.introAfter}
          </>
        }
      />
      <div className="mx-auto mt-12 max-w-4xl rounded-[2rem] bg-surface px-6 py-4 sm:px-12">
        {faq.items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-surface-2 last:border-b-0">
              <h3>
                <button
                  type="button"
                  id={`faq-q-${i}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start text-lg font-medium sm:text-xl"
                >
                  {item.q}
                  <ChevronDown
                    className={`size-5 shrink-0 text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
              </h3>
              <div
                id={`faq-a-${i}`}
                role="region"
                aria-labelledby={`faq-q-${i}`}
                className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <p className="overflow-hidden text-muted">
                  <span className="block pb-6 leading-relaxed">{item.a}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
