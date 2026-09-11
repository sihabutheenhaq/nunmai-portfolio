"use client";

import { useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import {
  CheckCircle2,
  Clock3,
  Code2,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { useReducedMotionPref, useTicker } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { AnimatedListItem } from "./ui/animated-list";
import { BorderBeam } from "./ui/border-beam";

type Product = Dictionary["platform"]["products"][number];
type FeedItem = NonNullable<Product["feed"]>[number];
type Chart = NonNullable<Product["chart"]>;

/** Magic UI border beam in brand greens, travelling round the product card. */
export function CardBeam({ delay = 0 }: { delay?: number }) {
  const reduce = useReducedMotionPref();
  if (reduce) return null;
  return <BorderBeam size={180} duration={14} delay={delay} borderWidth={1.5} colorFrom="#96c35d" colorTo="#c8ee93" />;
}

/** Dark "product window" with a live demo of the product inside. */
export function ProductVisual({ product, ui }: { product: Product; ui: Dictionary["ui"] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.35 });
  const reduce = useReducedMotionPref();

  let body: ReactNode = null;
  if (product.feed) {
    body = <WorkerFeed items={product.feed} channels={product.channels ?? []} ariaChannels={ui.channels} active={inView && !reduce} />;
  } else if (product.chart) {
    body = (
      <Foresight chart={product.chart} journey={product.journey ?? []} ariaJourney={ui.journey} active={inView && !reduce} reduce={reduce} inView={inView} />
    );
  }

  return (
    <div ref={ref} className="relative mt-7 overflow-hidden rounded-3xl bg-deep text-white shadow-2xl shadow-deep/25">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_-10%,rgba(150,195,93,0.28),transparent_60%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:18px_18px]" />

      <div className="relative flex items-center gap-3 border-b border-white/10 px-4 py-3">
        <span className="hidden gap-1.5 sm:flex" aria-hidden>
          <i className="size-2.5 rounded-full bg-white/20" />
          <i className="size-2.5 rounded-full bg-white/20" />
          <i className="size-2.5 rounded-full bg-white/20" />
        </span>
        <span className="min-w-0 truncate text-xs font-semibold text-white/85">{product.window}</span>
        <span className="ms-auto flex shrink-0 items-center gap-3 whitespace-nowrap text-[11px] font-medium">
          <span className="text-white/40">{ui.sample}</span>
          <span className="flex items-center gap-1.5 rounded-full bg-brand/15 px-2 py-0.5 text-brand-light">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-light opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex size-1.5 rounded-full bg-brand-light" />
            </span>
            {ui.live}
          </span>
        </span>
      </div>

      <div className="relative h-[22rem]">{body}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AI Workforce: requests from every channel, handled by AI workers    */
/* ------------------------------------------------------------------ */

const FEED_MS = 2200;
const FEED_VISIBLE = 4;

const channelIcons: Record<FeedItem["via"], LucideIcon> = {
  web: Globe,
  teams: Users,
  whatsapp: MessageCircle,
  telegram: Send,
  email: Mail,
  api: Code2,
};

const stateStyles: Record<FeedItem["state"], { icon: LucideIcon; className: string }> = {
  done: { icon: CheckCircle2, className: "text-brand-light" },
  review: { icon: Clock3, className: "text-amber-300" },
  working: { icon: Loader2, className: "text-white/70" },
};

function WorkerFeed({
  items,
  channels,
  ariaChannels,
  active,
}: {
  items: FeedItem[];
  channels: string[];
  ariaChannels: string;
  active: boolean;
}) {
  const tick = useTicker(FEED_MS, active);
  // Sequence numbers, newest first; each new tick pushes a fresh task in at the top.
  const shown = Array.from({ length: FEED_VISIBLE }, (_, k) => tick + FEED_VISIBLE - 1 - k);

  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden px-4 pt-4" aria-hidden>
        <div className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {shown.map((seq) => (
              <AnimatedListItem key={seq}>
                <FeedCard item={items[seq % items.length]} />
              </AnimatedListItem>
            ))}
          </AnimatePresence>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-deep to-transparent" />
      </div>
      <ul aria-label={ariaChannels} className="relative flex flex-wrap gap-1.5 border-t border-white/10 px-4 py-3">
        {channels.map((c) => (
          <li key={c} className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/75">
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  const Icon = channelIcons[item.via];
  const { icon: StateIcon, className } = stateStyles[item.state];
  return (
    <div className="flex gap-3 rounded-2xl bg-white/[0.06] p-3 ring-1 ring-inset ring-white/10 backdrop-blur-sm">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-brand-light">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-white/45">
          {item.label} · {item.team}
        </p>
        <p className="truncate text-sm font-medium text-white">{item.text}</p>
        <p className={cn("mt-1 flex items-center gap-1.5 text-xs font-medium", className)}>
          <StateIcon className={cn("size-3.5 shrink-0", item.state === "working" && "animate-spin motion-reduce:animate-none")} />
          {item.status}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Business Intelligence: what happened → why → what's next → what to do */
/* ------------------------------------------------------------------ */

const STEP_MS = 2800;
// Illustrative weekly series: a dip at week 8 (index 7), then a forecast peak.
const ACTUAL = [60, 64, 62, 68, 71, 69, 74, 56, 61, 67, 72, 76];
const FORECAST = [76, 80, 85, 91, 96, 93, 89]; // starts at the last actual point
const SPREAD = [0, 3, 5, 7, 9, 11, 12];
const TODAY = ACTUAL.length - 1;
const DIP = 7;
const PEAK = TODAY + 4;
const COUNT = TODAY + FORECAST.length;
const W = 400;
const H = 200;
const [LO, HI] = [30, 110];

const px = (i: number) => 12 + (i * (W - 24)) / (COUNT - 1);
const py = (v: number) => H - 12 - ((v - LO) / (HI - LO)) * (H - 24);
const path = (pts: number[][]) => pts.map(([a, b], k) => `${k ? "L" : "M"}${a.toFixed(1)} ${b.toFixed(1)}`).join(" ");
const pct = (x: number, y: number) => ({ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` });

const actualPts = ACTUAL.map((v, i) => [px(i), py(v)]);
const forecastPts = FORECAST.map((v, k) => [px(TODAY + k), py(v)]);
const bandPts = [
  ...FORECAST.map((v, k) => [px(TODAY + k), py(v + SPREAD[k])]),
  ...FORECAST.map((v, k) => [px(TODAY + k), py(v - SPREAD[k])]).reverse(),
];
const actualLine = path(actualPts);
const actualArea = `${actualLine} L${px(TODAY).toFixed(1)} ${H} L${px(0).toFixed(1)} ${H} Z`;
const forecastLine = path(forecastPts);
const band = `${path(bandPts)} Z`;
const todayInset = `${(100 - (px(TODAY) / W) * 100).toFixed(2)}%`;

const HIDDEN = "inset(0 100% 0 0)";
const SHOWN = "inset(0 0% 0 0)";

function Foresight({
  chart,
  journey,
  ariaJourney,
  active,
  reduce,
  inView,
}: {
  chart: Chart;
  journey: string[];
  ariaJourney: string;
  active: boolean;
  reduce: boolean;
  inView: boolean;
}) {
  const tick = useTicker(STEP_MS, active);
  const step = reduce ? 3 : tick % 4;
  const cycle = reduce ? 0 : Math.floor(tick / 4);
  const fade = (from: number) => ({ opacity: step >= from ? 1 : 0 });
  const t = reduce ? { duration: 0 } : { duration: 0.6 };

  return (
    <div className="flex h-full flex-col p-5">
      <div className="flex items-center justify-between gap-3 text-[11px] font-medium text-white/50">
        <span>{chart.metric}</span>
        <span className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <i className="h-0.5 w-4 rounded-full bg-brand-light" />
            {chart.actual}
          </span>
          <span className="flex items-center gap-1.5">
            <i className="w-4 border-t-2 border-dashed border-brand" />
            {chart.forecast}
          </span>
        </span>
      </div>

      <div className="relative mt-1 h-7 overflow-hidden" aria-live="off">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={step}
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="truncate text-lg font-semibold"
          >
            {chart.insights[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Time runs left to right in both languages, like most dashboards */}
      <div dir="ltr" className="relative mt-3 min-h-0 flex-1" aria-hidden>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 size-full">
          {[50, 100, 150].map((y) => (
            <line key={y} x1="0" x2={W} y1={y} y2={y} stroke="white" strokeOpacity="0.08" vectorEffect="non-scaling-stroke" />
          ))}
          <line x1={px(TODAY)} x2={px(TODAY)} y1="0" y2={H} stroke="white" strokeOpacity="0.25" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
          <motion.rect
            x={px(DIP) - 12}
            width="24"
            y="0"
            height={H}
            fill="#c8ee93"
            fillOpacity="0.1"
            initial={false}
            animate={fade(1)}
            transition={t}
          />
        </svg>

        {/* Actual: redraws at the start of each cycle */}
        <motion.div
          key={cycle}
          className="absolute inset-0"
          initial={reduce ? false : { clipPath: HIDDEN }}
          animate={{ clipPath: inView || reduce ? SHOWN : HIDDEN }}
          transition={reduce ? { duration: 0 } : { duration: 1.4, ease: "easeInOut" }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full">
            <defs>
              <linearGradient id="fs-area" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#96c35d" stopOpacity="0.35" />
                <stop offset="1" stopColor="#96c35d" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={actualArea} fill="url(#fs-area)" />
            <path d={actualLine} fill="none" stroke="#c8ee93" strokeWidth="2.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          </svg>
        </motion.div>

        {/* Forecast with confidence band */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ clipPath: step >= 2 ? SHOWN : `inset(0 ${todayInset} 0 0)` }}
          transition={reduce ? { duration: 0 } : { duration: step >= 2 ? 1.2 : 0.3, ease: "easeInOut" }}
        >
          <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="size-full">
            <path d={band} fill="#96c35d" fillOpacity="0.14" />
            <path
              d={forecastLine}
              fill="none"
              stroke="#96c35d"
              strokeWidth="2.5"
              strokeDasharray="6 5"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </motion.div>

        {/* Today marker */}
        <span className="absolute -translate-x-1/2 -translate-y-1/2" style={pct(px(TODAY), py(ACTUAL[TODAY]))}>
          <span className="block size-2.5 rounded-full bg-white ring-4 ring-white/15" />
        </span>
        <span className="absolute bottom-0 -translate-x-1/2 text-[10px] font-medium text-white/45" style={{ left: pct(px(TODAY), 0).left }}>
          {chart.today}
        </span>

        {/* Why: the dip */}
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={pct(px(DIP), py(ACTUAL[DIP]))}
          initial={false}
          animate={fade(1)}
          transition={t}
        >
          <span className="block size-3 rounded-full bg-brand-light ring-4 ring-brand-light/25" />
          <span
            dir="auto"
            className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-sm"
          >
            {chart.why}
          </span>
        </motion.span>

        {/* What's next: the risk at the forecast peak */}
        <motion.span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={pct(px(PEAK), py(FORECAST[PEAK - TODAY]))}
          initial={false}
          animate={fade(2)}
          transition={reduce ? { duration: 0 } : { duration: 0.5, delay: step === 2 ? 0.8 : 0 }}
        >
          <span className="relative block size-3">
            <span className="absolute inset-0 animate-ping rounded-full bg-amber-300 opacity-70 motion-reduce:hidden" />
            <span className="relative block size-3 rounded-full bg-amber-300" />
          </span>
          <span
            dir="auto"
            className="absolute bottom-5 right-0 translate-x-1/3 whitespace-nowrap rounded-full bg-amber-300 px-2 py-0.5 text-[11px] font-semibold text-deep"
          >
            {chart.risk}
          </span>
        </motion.span>

        {/* What to do: the recommended action, sent to a person for approval */}
        <AnimatePresence>
          {step >= 3 && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4 }}
              dir="auto"
              className="absolute left-0 top-0 max-w-[62%] rounded-2xl bg-white p-3 text-ink shadow-xl"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-dark">{chart.actionTitle}</p>
              <p className="mt-1 text-sm font-semibold leading-snug">{chart.action}</p>
              <span className="mt-2 inline-flex rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-white">
                {chart.approve}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ol aria-label={ariaJourney} className="mt-4 grid grid-cols-4 gap-1.5">
        {journey.map((s, k) => (
          <li
            key={s}
            aria-current={k === step ? "step" : undefined}
            className={cn(
              "relative overflow-hidden rounded-full px-1.5 py-1.5 text-center text-[11px] font-semibold transition-colors duration-500",
              k === step ? "bg-brand text-white" : k < step ? "bg-white/15 text-white" : "bg-white/5 text-white/45",
            )}
          >
            {s}
            {k === step && active && (
              <motion.span
                key={tick}
                className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/70 rtl:origin-right"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: STEP_MS / 1000, ease: "linear" }}
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
