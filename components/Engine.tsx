import type { Dictionary } from "@/lib/dictionaries";
import { EngineFlow } from "./EngineFlow";
import { EnginePanorama } from "./EnginePanorama";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Engine({ t, rtl }: { t: Dictionary; rtl: boolean }) {
  const { engine } = t;
  return (
    <>
      <section id="engine" className="mx-auto max-w-7xl scroll-mt-28 px-6 pb-4 pt-16">
        <SectionHeading eyebrow={engine.label} title={engine.title} text={engine.text} />
        <Reveal className="mt-10">
          <EngineFlow t={t} />
          <p className="mt-4 text-center text-sm font-medium text-muted">{engine.connectorsNote}</p>
        </Reveal>
      </section>
      <EnginePanorama t={t} rtl={rtl} />
    </>
  );
}
