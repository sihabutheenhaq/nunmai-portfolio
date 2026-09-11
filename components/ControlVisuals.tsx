import type { ComponentType, CSSProperties, ReactNode } from "react";
import {
  Bot,
  Brain,
  Check,
  Cloud,
  Cpu,
  EyeOff,
  FileText,
  Fingerprint,
  KeyRound,
  Lock,
  Server,
  ShieldCheck,
  Workflow,
  X,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";

// Small looping illustrations for the engine-control cards. Each fills a dark
// green panel; `.seq` items fade in one after another (see globals.css).
// Labels come from the dictionary (`visuals`), so they follow the page language.

type VisualProps = { v: Dictionary["visuals"]; rtl: boolean };

const at = (s: number): CSSProperties => ({ animationDelay: `${s}s` });
const LIME = "#c8ee93";
const DEEP = "#0b2413";

function Chip({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <span
      style={style}
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white ring-1 ring-white/15 backdrop-blur ${className}`}
    >
      {children}
    </span>
  );
}

function Identity({ v }: VisualProps) {
  return (
    <div className="flex h-full items-center justify-center gap-6 px-6">
      <div className="relative grid size-24 shrink-0 place-items-center overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/20">
        <Fingerprint className="size-14 text-brand-light" strokeWidth={1.25} />
        <span className="scan-line absolute inset-x-2 h-0.5 rounded-full bg-brand-light shadow-[0_0_14px_#c8ee93]" />
      </div>
      <div className="flex flex-col items-start gap-2">
        <Chip className="seq bg-brand/40">{v.identity.role}</Chip>
        {v.identity.rows.map((r, i) => (
          <div
            key={r.label}
            style={at(0.6 + i * 0.5)}
            className="seq flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs text-white ring-1 ring-white/10"
          >
            {r.ok ? <Check className="size-3.5 text-brand-light" /> : <Lock className="size-3.5 text-red-300" />}
            <span className={r.ok ? "" : "text-white/50 line-through"}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Knowledge({ v }: VisualProps) {
  return (
    <div className="flex h-full items-center justify-center gap-3 px-6">
      <div className="space-y-2">
        {v.knowledge.files.map((f, i) => (
          <div
            key={f}
            style={at(i * 0.4)}
            className="seq flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[11px] text-white ring-1 ring-white/10"
          >
            <FileText className="size-3.5 text-brand-light" />
            <bdi>{f}</bdi>
            <span className="rounded bg-brand/50 px-1 text-[9px] font-bold">{i + 1}</span>
          </div>
        ))}
      </div>
      <svg viewBox="0 0 40 60" className="h-16 w-8 shrink-0 rtl:-scale-x-100" aria-hidden>
        <path
          d="M2 10 C20 10 20 30 38 30 M2 30 H38 M2 50 C20 50 20 30 38 30"
          fill="none"
          stroke={LIME}
          strokeWidth={1.5}
          strokeDasharray="3 4"
          className="flow-dash"
        />
      </svg>
      <div style={at(1.4)} className="seq w-36 rounded-2xl rounded-es-sm bg-white p-3 shadow-lg">
        <div className="h-1.5 w-full rounded bg-ink/15" />
        <div className="mt-1.5 h-1.5 w-4/5 rounded bg-ink/15" />
        <div className="mt-1.5 h-1.5 w-3/5 rounded bg-ink/15" />
        <div className="mt-2.5 flex gap-1">
          {[1, 2, 3].map((n) => (
            <span key={n} className="rounded bg-surface-2 px-1.5 text-[10px] font-bold text-brand-dark">
              [{n}]
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// SVG diagrams keep a left-to-right layout in both languages; only the labels change.
function Routing({ v, rtl }: VisualProps) {
  const icons = [Cpu, Server, Cloud];
  const ys = [60, 122, 184];
  return (
    <svg viewBox="0 0 400 240" direction="ltr" className="size-full" aria-hidden>
      {ys.map((y, i) => {
        const path = `M140 122 C200 122 196 ${y} 250 ${y}`;
        return (
          <g key={y}>
            <path d={path} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
            {i === 0 && (
              <>
                <path d={path} fill="none" stroke={LIME} strokeWidth={2.5} strokeDasharray="5 7" className="flow-dash" />
                <circle r={4} fill={LIME}>
                  <animateMotion dur="1.6s" repeatCount="indefinite" path={path} />
                </circle>
              </>
            )}
          </g>
        );
      })}
      <rect x={24} y={102} width={116} height={40} rx={20} fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.25)" />
      <Lock x={40} y={114} size={16} color={LIME} />
      <text x={62} y={126} fill="white" fontSize={11} fontWeight={600}>
        {v.routing.request}
      </text>
      {v.routing.models.map((label, i) => {
        const Icon = icons[i];
        const y = ys[i];
        return (
          <g key={label}>
            <rect
              x={250}
              y={y - 18}
              width={134}
              height={36}
              rx={12}
              fill={i === 0 ? LIME : "rgba(255,255,255,0.08)"}
              stroke={i === 0 ? "none" : "rgba(255,255,255,0.18)"}
            />
            <Icon x={262} y={y - 8} size={16} color={i === 0 ? DEEP : "rgba(255,255,255,0.7)"} />
            <text x={286} y={y + 4} fontSize={11} fontWeight={600} fill={i === 0 ? DEEP : "rgba(255,255,255,0.75)"}>
              {label}
            </text>
          </g>
        );
      })}
      <text x={317} y={30} textAnchor="middle" fontSize={rtl ? 10 : 9} fontWeight={700} fill={LIME} letterSpacing={rtl ? 0 : 1.5}>
        {v.routing.chosen}
      </text>
    </svg>
  );
}

function Orchestration({ v, rtl }: VisualProps) {
  const spots = [
    { x: 82, y: 56 },
    { x: 318, y: 56 },
    { x: 82, y: 186 },
    { x: 318, y: 186 },
  ];
  return (
    <svg viewBox="0 0 400 240" direction="ltr" className="size-full" aria-hidden>
      {spots.map((a, i) => {
        const path = `M200 121 L${a.x} ${a.y}`;
        return (
          <g key={i}>
            <path d={path} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={2} strokeDasharray="4 6" className="flow-dash" />
            <circle r={4} fill={LIME}>
              <animateMotion
                dur="2.4s"
                begin={`${-i * 0.6}s`}
                repeatCount="indefinite"
                keyPoints="0;1;0"
                keyTimes="0;0.5;1"
                calcMode="linear"
                path={path}
              />
            </circle>
          </g>
        );
      })}
      <circle cx={200} cy={121} r={36} fill="none" stroke={LIME} strokeWidth={2}>
        <animate attributeName="r" values="36;54" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;0" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx={200} cy={121} r={36} fill={LIME} />
      <Workflow x={188} y={100} size={24} color={DEEP} />
      <text x={200} y={142} textAnchor="middle" fontSize={rtl ? 10 : 9} fontWeight={700} fill={DEEP} letterSpacing={rtl ? 0 : 1}>
        {v.orchestration.planner}
      </text>
      {spots.map((a, i) => (
        <g key={`agent-${i}`}>
          <rect x={a.x - 48} y={a.y - 18} width={96} height={36} rx={18} fill="rgba(11,36,19,0.9)" stroke="rgba(255,255,255,0.25)" />
          <Bot x={a.x - 38} y={a.y - 8} size={16} color={LIME} />
          <text x={a.x - 16} y={a.y + 4} fontSize={11} fontWeight={600} fill="white">
            {v.orchestration.agents[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Tools() {
  // A terminal reads left to right in any language.
  return (
    <div className="flex h-full items-center justify-center px-6" dir="ltr">
      <div className="w-full max-w-xs overflow-hidden rounded-2xl bg-[#07140c] font-mono text-[11px] text-white/85 shadow-xl ring-1 ring-white/10">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
          <span className="size-2 rounded-full bg-red-400/80" />
          <span className="size-2 rounded-full bg-amber-300/80" />
          <span className="size-2 rounded-full bg-brand-light/80" />
          <span className="ml-2 text-white/40">approved-tools</span>
        </div>
        <div className="space-y-1.5 p-3">
          <p className="seq">
            <span className="text-brand-light">$</span> contract_register.lookup
          </p>
          <p style={at(0.6)} className="seq text-white/55">
            → GET /contracts?renewal=next_quarter
          </p>
          <p style={at(1.2)} className="seq text-brand-light">
            ✓ 200 OK · 4 records
          </p>
          <p style={at(1.8)} className="seq">
            <span className="text-brand-light">$</span> <span className="blink">▍</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Memory({ v }: VisualProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-2.5 px-7">
      <p className="seq ms-auto max-w-[75%] rounded-2xl rounded-ee-sm bg-brand px-3 py-2 text-xs text-white">{v.memory.user}</p>
      <Chip style={at(0.7)} className="seq mx-auto">
        <Brain className="size-3.5 text-brand-light" /> {v.memory.remembered}
      </Chip>
      <p style={at(1.4)} className="seq max-w-[80%] rounded-2xl rounded-es-sm bg-white px-3 py-2 text-xs text-ink">
        {v.memory.reply}
      </p>
    </div>
  );
}

function Approval({ v }: VisualProps) {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="relative w-full max-w-[16rem] rounded-2xl bg-white p-4 text-ink shadow-xl">
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
          {v.approval.badge}
        </span>
        <p className="mt-2 text-sm font-semibold leading-snug">{v.approval.task}</p>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-muted">
          <span className="grid size-6 place-items-center rounded-full bg-surface-2 text-[10px] font-bold text-brand-dark">
            {v.approval.initials}
          </span>
          {v.approval.approver}
        </div>
        <div className="mt-3 flex gap-2">
          <span className="flex-1 rounded-full border border-ink/10 py-1.5 text-center text-xs font-semibold text-muted">
            {v.approval.reject}
          </span>
          <span className="relative flex-1 rounded-full bg-brand py-1.5 text-center text-xs font-semibold text-white">
            <span className="absolute inset-0 animate-ping rounded-full bg-brand/40 [animation-duration:1.8s]" />
            {v.approval.approve}
          </span>
        </div>
        <span
          style={at(1.6)}
          className="seq absolute -bottom-3 -end-3 inline-flex items-center gap-1 rounded-full bg-[#0b2413] px-2.5 py-1 text-[11px] font-semibold text-brand-light shadow-lg ring-1 ring-brand-light/40"
        >
          <Check className="size-3.5" /> {v.approval.done}
        </span>
      </div>
    </div>
  );
}

function Audit({ v }: VisualProps) {
  return (
    <div className="flex h-full items-center justify-center px-6">
      <div className="w-full max-w-xs rounded-2xl bg-[#07140c]/80 p-3 ring-1 ring-white/10">
        <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
          {v.audit.title}
          <span className="flex items-center gap-1 text-red-300">
            <span className="size-1.5 animate-pulse rounded-full bg-red-400" /> {v.audit.rec}
          </span>
        </div>
        <ul className="space-y-1">
          {v.audit.rows.map(([time, event], i) => (
            <li key={time} style={at(i * 0.45)} className="seq flex gap-3 rounded-lg bg-white/5 px-2 py-1.5 text-[10.5px]">
              <span className="font-mono text-brand-light" dir="ltr">
                {time}
              </span>
              <span className="text-white/80">{event}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Security({ v }: VisualProps) {
  const [masked, encrypted, blocked] = v.security;
  return (
    <div className="relative flex h-full items-center justify-center">
      <span className="absolute size-28 animate-ping rounded-full bg-brand-light/20 [animation-duration:2.5s]" />
      <span className="relative grid size-24 place-items-center rounded-full bg-brand-light text-[#0b2413] shadow-[0_0_40px_rgba(200,238,147,0.5)]">
        <ShieldCheck className="size-11" strokeWidth={1.5} />
      </span>
      <Chip className="seq absolute start-5 top-8">
        <EyeOff className="size-3.5 text-brand-light" /> {masked}
      </Chip>
      <Chip style={at(0.6)} className="seq absolute end-5 top-16">
        <KeyRound className="size-3.5 text-brand-light" /> {encrypted}
      </Chip>
      <Chip style={at(1.2)} className="seq absolute bottom-8 start-8">
        <X className="size-3.5 text-red-300" /> {blocked}
      </Chip>
    </div>
  );
}

export const controlVisuals: Record<string, ComponentType<VisualProps>> = {
  identity: Identity,
  knowledge: Knowledge,
  routing: Routing,
  orchestration: Orchestration,
  tools: Tools,
  memory: Memory,
  approval: Approval,
  audit: Audit,
  security: Security,
};
