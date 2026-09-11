import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  text?: ReactNode;
  center?: boolean;
}) {
  return (
    <Reveal className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={`${eyebrow ? "mt-4" : ""} text-4xl font-semibold leading-tight tracking-tight sm:text-[2.75rem]`}>
        {title}
      </h2>
      {text && <p className="mt-4 text-[15px] font-medium leading-relaxed text-muted">{text}</p>}
    </Reveal>
  );
}
