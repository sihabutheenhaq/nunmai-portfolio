"use client";

import { useSyncExternalStore } from "react";

// One shared clock for every <LocalTime>, ticking every 15 s while any is mounted.
let now = 0;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  if (!timer) {
    now = Date.now();
    timer = setInterval(() => {
      now = Date.now();
      listeners.forEach((l) => l());
    }, 15_000);
  }
  return () => {
    listeners.delete(onChange);
    if (!listeners.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };
}

/** Current time in a city's time zone. Renders "--:--" on the server, then the live time. */
export function LocalTime({ timeZone, locale }: { timeZone: string; locale: string }) {
  const time = useSyncExternalStore(
    subscribe,
    () => now,
    () => 0,
  );
  if (!time) return <span aria-hidden>--:--</span>;

  const formatted = new Intl.DateTimeFormat(locale === "ar" ? "ar-u-nu-latn" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone,
  }).format(time);
  return <time dateTime={new Date(time).toISOString()}>{formatted}</time>;
}
