"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { links } from "@/lib/links";

/* ============================================================
   SignalScore™ explainer — interactive walkthrough.

   Ported from the Claude Design handoff, with one deliberate change:
   the page never prints the actual scoring weights, the literal
   equation, or the exact abuse caps. The math still runs live so the
   demo behaves honestly, but relative importance is shown as
   qualitative tiers (HEAVIEST / MAJOR / …) rather than coefficients,
   so the recipe can't be read straight off the page. Copy calls the
   playgrounds a "live model", never "the exact formula".
   ============================================================ */

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/* Ring geometry shared by every score dial (r = 54). */
const RING_C = 339.29;

/* ---------- small presentational helpers ---------- */

/** SignalScore wordmark with a correctly-sized ™. */
function Tm({ caps = false }: { caps?: boolean }) {
  return (
    <sup
      style={{
        fontSize: caps ? "0.6em" : "0.5em",
        verticalAlign: "super",
        fontWeight: 400,
        letterSpacing: 0,
      }}
    >
      ™
    </sup>
  );
}
function Ss({ caps = false }: { caps?: boolean }) {
  return (
    <>
      {caps ? "SIGNALSCORE" : "SignalScore"}
      <Tm caps={caps} />
    </>
  );
}

/** Fades + lifts its children into view once, respecting reduced motion. */
function Reveal({
  children,
  className = "",
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      const raf = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(raf);
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Comp = Tag as "div";
  return (
    <Comp
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(24px)",
        transition:
          "opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1)",
        transitionDelay: `${delay}s`,
      }}
    >
      {children}
    </Comp>
  );
}

/** Numbered eyebrow row: 01 —— WHY IT EXISTS */
function Eyebrow({
  n,
  label,
  tone = "teal",
}: {
  n: string;
  label: React.ReactNode;
  tone?: "teal" | "tealDeep" | "gold";
}) {
  const num =
    tone === "gold" ? "#c9a24b" : tone === "tealDeep" ? "#0a8f62" : "#08c888";
  const rule =
    tone === "gold"
      ? "rgba(201,162,75,.45)"
      : tone === "tealDeep"
        ? "rgba(10,143,98,.4)"
        : "rgba(8,200,136,.4)";
  const lab = tone === "gold" ? "#d4b876" : tone === "tealDeep" ? "#8a877f" : "#6b6860";
  return (
    <div className="mb-[22px] flex items-center gap-[14px]">
      <span
        className="font-display text-[14px] font-bold tracking-[1px]"
        style={{ color: num }}
      >
        {n}
      </span>
      <span className="h-px w-[56px]" style={{ background: rule }} />
      <span
        className="text-[11.5px] font-semibold uppercase tracking-[2px]"
        style={{ color: lab }}
      >
        {label}
      </span>
    </div>
  );
}

/** Circular score dial. */
function ScoreRing({
  score,
  suffix,
  size = 142,
  strokeWidth = 10,
  animateFast = false,
  showTm = false,
}: {
  score: number | string;
  suffix?: string;
  size?: number;
  strokeWidth?: number;
  animateFast?: boolean;
  showTm?: boolean;
}) {
  const numeric = typeof score === "number" ? score : 0;
  const off = RING_C * (1 - numeric / 100);
  return (
    <div className="relative flex-none" style={{ width: size, height: size }}>
      <svg viewBox="0 0 140 140" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        <circle cx="70" cy="70" r="54" fill="none" stroke="rgba(255,255,255,.1)" strokeWidth={strokeWidth} />
        <circle
          cx="70"
          cy="70"
          r="54"
          fill="none"
          stroke="#08c888"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={RING_C}
          strokeDashoffset={off}
          style={{
            transition: animateFast
              ? "stroke-dashoffset .1s linear"
              : "stroke-dashoffset .4s cubic-bezier(.2,.7,.2,1)",
            filter: "drop-shadow(0 0 7px rgba(8,200,136,.42))",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-display text-[46px] font-normal leading-none">
          {score}
          {suffix && <span className="text-[22px] text-[#7d7a72]">{suffix}</span>}
        </div>
        {showTm && (
          <div className="mt-[2px] text-[10px] tracking-[1.5px] text-[#7d7a72]">
            <Ss caps />
          </div>
        )}
      </div>
    </div>
  );
}

/** Qualitative weight chip — conveys relative importance without a number. */
function TierChip({ tier }: { tier: string }) {
  return (
    <span className="rounded-full bg-[rgba(8,200,136,.1)] px-[9px] py-[3px] text-[10px] font-semibold uppercase tracking-[1.2px] text-[#4be0ab]">
      {tier}
    </span>
  );
}

/* ---------- graph model ---------- */

type Edge = { a: number; b: number; s: 0 | 1 | 2 };
const INITIALS = ["AM", "JT", "RK", "SP", "LC", "DN", "MO", "FB"];
const GRAPH_START: Edge[] = [
  { a: 0, b: 1, s: 2 },
  { a: 2, b: 3, s: 2 },
  { a: 1, b: 4, s: 1 },
  { a: 5, b: 6, s: 2 },
  { a: 3, b: 6, s: 1 },
  { a: 0, b: 7, s: 0 },
  { a: 4, b: 7, s: 0 },
  { a: 2, b: 5, s: 0 },
];
const GRAPH_SPAM: Edge[] = [
  { a: 0, b: 1, s: 1 },
  { a: 0, b: 2, s: 1 },
  { a: 0, b: 3, s: 1 },
  { a: 0, b: 4, s: 1 },
  { a: 0, b: 5, s: 1 },
  { a: 0, b: 6, s: 1 },
  { a: 0, b: 7, s: 1 },
  { a: 2, b: 5, s: 0 },
];
const GRAPH_TIES: Edge[] = [
  { a: 0, b: 1, s: 2 },
  { a: 2, b: 3, s: 2 },
  { a: 0, b: 2, s: 1 },
  { a: 5, b: 6, s: 0 },
  { a: 3, b: 6, s: 0 },
  { a: 1, b: 4, s: 0 },
  { a: 4, b: 7, s: 0 },
  { a: 0, b: 7, s: 0 },
];

function nodePos() {
  const cx = 200,
    cy = 175,
    rx = 155,
    ry = 132,
    N = 8;
  return Array.from({ length: N }, (_, i) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / N;
    return { x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) };
  });
}

/* ---------- content constants ---------- */

const CYCLE_WORDS = ["RELEVANT", "RECIPROCATED", "SUSTAINED"];

const PRINCIPLES = [
  {
    n: "01",
    t: "Quality over volume",
    b: "The system caps how many people one attendee can reach. You cannot buy a high score by working the whole room.",
  },
  {
    n: "02",
    t: "Reciprocity is the signal",
    b: "A one-way save is noise. A mutual tie — both saved each other, or both replied — is the atomic unit of a real connection.",
  },
  {
    n: "03",
    t: "Nobody leaves alone",
    b: "The heaviest weight of all is inclusion: the fraction of the room that left with at least one real tie. Not a place where the popular get more popular.",
  },
  {
    n: "04",
    t: "Always explainable",
    b: "Every score ships with its sub-scores. Never a black box. Personal scores stay private, never a leaderboard.",
  },
];

const GLOSSARY = [
  { t: "Edge", d: "Any sign of interest — a save, a profile view, an intro. One direction only." },
  { t: "Tie", d: "A reciprocated edge. Both people saved each other, or both replied. This is a real connection." },
  { t: "Reciprocity", d: "How much of the interest in the room turned mutual instead of staying one-way." },
  { t: "Inclusion", d: "The share of attendees who left with at least one real tie. The thing that matters most." },
  { t: "Relevance", d: "How well two people actually fit — what one offers against what the other needs." },
  { t: "Follow-through", d: "How far a connection travelled: from just showing up, to a two-way conversation." },
];

const PERSONAL_BARS = [
  { key: "rq", label: "Reciprocity quality", tier: "HEAVIEST" },
  { key: "cd", label: "Connection depth", tier: "MAJOR" },
  { key: "rel", label: "Relevance", tier: "MODERATE" },
  { key: "ft", label: "Follow-through", tier: "MODERATE" },
] as const;

const FUNNEL_STAGES = [
  { v: 0.2, label: "Checked in" },
  { v: 0.4, label: "Profile viewed" },
  { v: 0.6, label: "Contact saved" },
  { v: 0.8, label: "Intro sent" },
  { v: 1.0, label: "Reply received" },
];

const EVENT_INPUTS = [
  {
    key: "eIncl",
    label: "Inclusion",
    tier: "HEAVIEST",
    hint: "Fraction of the room who made at least one mutual tie.",
  },
  {
    key: "eRecip",
    label: "Reciprocity rate",
    tier: "MAJOR",
    hint: "Of pairs who interacted at all, the fraction that went mutual.",
  },
  {
    key: "eRel",
    label: "Relevance",
    tier: "MAJOR",
    hint: "Average fit of the mutual ties that formed.",
  },
  {
    key: "eConn",
    label: "Connectivity",
    tier: "SUPPORTING",
    hint: "Largest connected cluster over the whole room. One web, or scattered cliques.",
  },
  {
    key: "eConv",
    label: "Conversion",
    tier: "SUPPORTING",
    hint: "Of conversations started, the fraction that got a reply.",
  },
] as const;

const GUARDRAILS = [
  {
    t: "Weights sum to one",
    b: "Enforced at startup. Break the sum and the app refuses to run. No silent miscalibration.",
  },
  {
    t: "Volume is capped",
    b: "Strict per-person limits on how many people anyone can reach. The score can't be brute-forced by working the room.",
  },
  {
    t: "Pure and unit-tested",
    b: "The scoring core does zero input or output. Hand-calculated fixtures verify every result.",
  },
  {
    t: "One tuning surface",
    b: "Every weight and threshold lives in one reviewed config. Re-tuning is a single, auditable change.",
  },
];

const SEGMENTS = [
  { t: "Hub", d: "A natural connector, many mutual ties.", c: "#08c888" },
  { t: "Broker", d: "Bridges otherwise separate clusters.", c: "#4be0ab" },
  { t: "Specialist", d: "Few ties, but high relevance. Quiet value.", c: "#7de3c0" },
  { t: "Wallflower", d: "Present, no tie yet. The person to help next.", c: "#c9a24b" },
  { t: "Connected", d: "A healthy, ordinary middle.", c: "#5f5d56" },
];

const ROADMAP = [
  {
    t: "Trust score",
    b: "A blend of five repeated signals — familiarity, similarity, competence, reciprocity and reliability — built over time.",
  },
  {
    t: "Business opportunity",
    b: "Trust times relevance times timing. Multiplicative on purpose: if any factor is zero, business doesn't happen.",
  },
  {
    t: "Post-event survey",
    b: "Two automated waves capture real outcomes and off-platform follow-up. Non-response never penalizes anyone.",
  },
];

const FAQ = [
  {
    q: "Can someone game their way to a high score?",
    a: "It's built to resist exactly that. Volume is capped per person, and only reciprocated ties move the number — blasting the whole room with one-way saves does almost nothing. Depth beats breadth by design.",
  },
  {
    q: "Is my personal score private?",
    a: "Always. A personal SignalScore™ is shown to one person only, never as a public ranking. It's enforced at the database with row-level security, scoped per organization, and computed server-side — attendees never see anyone else's raw activity.",
  },
  {
    q: "Do you publish the exact weights?",
    a: "No. Every score is fully explainable through its sub-scores, so you always know why it moved. But we keep the precise weighting private, so it can't be gamed or copied.",
  },
  {
    q: "What if the AI relevance signal isn't available?",
    a: "The score never breaks. Relevance's share is redistributed across the remaining components, which are rescaled so everything still sums to one and stays on the same 0–100 scale. The system falls back to a deterministic heuristic with zero API calls.",
  },
  {
    q: "Why doesn't a tiny event get a score?",
    a: "Below a minimum number of check-ins, SignalScore™ returns no number at all. A very small room produces a misleading figure, so we show nothing rather than something fake.",
  },
];

/* ============================================================
   Component
   ============================================================ */

type State = {
  pTies: number;
  pReach: number;
  pRel: number;
  pFunnel: number;
  relAvail: boolean;
  eIncl: number;
  eRecip: number;
  eRel: number;
  eConn: number;
  eConv: number;
  edges: Edge[];
  lastAction: null | "spam" | "ties";
};

type Action =
  | { type: "set"; key: keyof State; value: number }
  | { type: "cycleEdge"; idx: number }
  | { type: "graph"; edges: Edge[]; last: State["lastAction"] }
  | { type: "toggleRel" };

const INITIAL: State = {
  pTies: 2,
  pReach: 2,
  pRel: 0.9,
  pFunnel: 1.0,
  relAvail: true,
  eIncl: 0.75,
  eRecip: 0.556,
  eRel: 0.7,
  eConn: 0.7,
  eConv: 0.6,
  edges: GRAPH_START,
  lastAction: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "set":
      return { ...state, [action.key]: action.value };
    case "cycleEdge":
      return {
        ...state,
        lastAction: null,
        edges: state.edges.map((e, i) =>
          i === action.idx ? { ...e, s: ((e.s + 1) % 3) as Edge["s"] } : e,
        ),
      };
    case "graph":
      return { ...state, edges: action.edges, lastAction: action.last };
    case "toggleRel":
      return { ...state, relAvail: !state.relAvail };
  }
}

export default function SignalScoreExplainer() {
  const [st, dispatch] = useReducer(reducer, INITIAL);

  /* hero count-up + cycling eyebrow */
  const [heroScore, setHeroScore] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const target = 86;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    // rAF gives a smooth count-up when the tab is visible; the timeout is a
    // floor that guarantees the final value even where rAF never fires
    // (hidden tabs, reduced motion, heavy throttling).
    const settle = setTimeout(() => setHeroScore(target), reduce ? 0 : 1500);
    if (!reduce) {
      const dur = 1500;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const e = 1 - Math.pow(1 - p, 3);
        setHeroScore(Math.round(target * e));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    const cyc = setInterval(() => setCycle((c) => (c + 1) % 3), 1700);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(settle);
      clearInterval(cyc);
    };
  }, []);

  /* ---- derived: graph ---- */
  const ties = st.edges.filter((e) => e.s === 2);
  const oneWay = st.edges.filter((e) => e.s === 1);
  const tiePeople = new Set<number>();
  ties.forEach((e) => {
    tiePeople.add(e.a);
    tiePeople.add(e.b);
  });
  const gIncl = tiePeople.size;
  const gInclRate = gIncl / 8;
  const gRecipRate =
    ties.length + oneWay.length > 0
      ? ties.length / (ties.length + oneWay.length)
      : 0;
  const gScore = Math.round(100 * clamp01(0.55 * gInclRate + 0.45 * gRecipRate));

  let gMsg = "Only reciprocated ties move the number. One-way reach is just interest.";
  if (st.lastAction === "spam")
    gMsg =
      "One person blasted everyone — seven one-way reaches, zero real ties. The room signal barely registers. You can't game it.";
  if (st.lastAction === "ties")
    gMsg =
      "Just two reciprocated ties, and the room signal jumps. Depth beats breadth, every time.";

  /* ---- derived: personal (weights kept internal, never rendered) ---- */
  const rq = clamp01(st.pTies / Math.max(1, st.pReach));
  const cd = Math.min(st.pTies / 4, 1);
  const rel = clamp01(st.pRel);
  const ft = clamp01(st.pFunnel);
  const pw = st.relAvail
    ? { rq: 0.35, cd: 0.25, rel: 0.2, ft: 0.2 }
    : (() => {
        const f = 1 / 0.8;
        return { rq: 0.35 * f, cd: 0.25 * f, rel: 0, ft: 0.2 * f };
      })();
  const pSum = pw.rq * rq + pw.cd * cd + pw.rel * rel + pw.ft * ft;
  const pScore = Math.round(100 * clamp01(pSum));
  const pRaw: Record<string, number> = { rq, cd, rel, ft };

  const pVerdict =
    pScore >= 80
      ? "Real, mutual, followed through. This is what quality looks like."
      : pScore >= 55
        ? "A solid showing. A couple more reciprocated ties would lift it fast."
        : "Plenty of reach, not enough of it mutual. Depth is where the score lives.";

  // plain-language readout of the biggest driver (no numbers)
  const drivers: { key: string; label: string; contrib: number }[] = [
    { key: "rq", label: "turning reach into mutual ties", contrib: pw.rq * rq },
    { key: "cd", label: "the number of real ties you built", contrib: pw.cd * cd },
    { key: "rel", label: "how relevant those ties were", contrib: st.relAvail ? pw.rel * rel : 0 },
    { key: "ft", label: "how far you followed through", contrib: pw.ft * ft },
  ];
  const topDriver = drivers.reduce((m, d) => (d.contrib > m.contrib ? d : m), drivers[0]);
  const pReadout =
    pScore === 0
      ? "Move the sliders to build a connection."
      : `Right now, most of your score comes from ${topDriver.label}.`;

  const funnelLabel = (v: number) =>
    v <= 0.21
      ? "Checked in"
      : v <= 0.41
        ? "Viewed"
        : v <= 0.61
          ? "Saved"
          : v <= 0.81
            ? "Intro sent"
            : "Replied";

  /* ---- derived: event ---- */
  const eComps = [
    { k: "eIncl", label: "Inclusion", v: st.eIncl, w: 0.3, advice: "Seed introductions for the quiet attendees so no one leaves without a tie." },
    { k: "eRecip", label: "Reciprocity rate", v: st.eRecip, w: 0.2, advice: "Nudge replies so one-way reaches turn into two-way conversations." },
    { k: "eRel", label: "Relevance", v: st.eRel, w: 0.2, advice: "Improve matchmaking so people meet the right people, not just more people." },
    { k: "eConn", label: "Connectivity", v: st.eConn, w: 0.15, advice: "Bridge separate clusters so the room becomes one connected web." },
    { k: "eConv", label: "Conversion", v: st.eConv, w: 0.15, advice: "Make first messages easier to answer so more conversations get a reply." },
  ];
  const eSum = eComps.reduce((s, c) => s + c.v * c.w, 0);
  const eScore = Math.round(100 * clamp01(eSum));
  const eWeak = eComps.reduce((m, c) => (c.v < m.v ? c : m), eComps[0]);

  /* ---- redistribution donut ---- */
  const pieSlices = [
    { label: "Reciprocity quality", w: pw.rq, color: "#08c888" },
    { label: "Connection depth", w: pw.cd, color: "#4be0ab" },
    { label: "Relevance", w: pw.rel, color: "#b9f0dd" },
    { label: "Follow-through", w: pw.ft, color: "#0a6b49" },
  ].filter((s) => s.w > 0.0001);
  const PIE_R = 62;
  const PIE_C = 2 * Math.PI * PIE_R;
  let cum = 0;

  const positions = nodePos();

  return (
    <div className="overflow-x-clip bg-[#0b0b0c] font-body text-[#f4f0e8] antialiased">
      {/* range thumb styling, scoped to this page */}
      <style>{`
        .ss-range{-webkit-appearance:none;appearance:none;width:100%;height:4px;border-radius:99px;background:rgba(255,255,255,.14);outline:none;cursor:pointer;}
        .ss-range.onlight{background:rgba(20,19,13,.16);}
        .ss-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:#08c888;border:3px solid #0b0b0c;box-shadow:0 2px 10px rgba(8,200,136,.5);cursor:pointer;transition:transform .12s;}
        .ss-range.onlight::-webkit-slider-thumb{border-color:#f4f0e8;}
        .ss-range::-webkit-slider-thumb:hover{transform:scale(1.13);}
        .ss-range::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#08c888;border:3px solid #0b0b0c;cursor:pointer;}
        .ss-range.onlight::-moz-range-thumb{border-color:#f4f0e8;}
      `}</style>

      {/* ============ HERO ============ */}
      <section
        className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 pb-[72px] pt-[76px] text-center"
        style={{ background: "radial-gradient(120% 90% at 50% 0%,#16150f 0%,#0b0b0c 62%)" }}
      >
        <div
          className="pointer-events-none absolute left-1/2 top-[-32%] h-[900px] w-[min(900px,130vw)] -translate-x-1/2"
          style={{ background: "radial-gradient(circle,rgba(8,200,136,.15),transparent 62%)" }}
        />
        <Image
          src="/assets/liveconnect_clr_w.svg"
          alt="LiveConnect"
          width={140}
          height={25}
          priority
          className="relative z-[2] mb-[46px]"
          style={{ height: 25, width: "auto" }}
        />
        <Reveal className="relative z-[2] mb-8 inline-flex flex-wrap items-center justify-center gap-3 text-[13px] tracking-[.2px]">
          {CYCLE_WORDS.map((w, i) => (
            <span key={w} className="contents">
              {i > 0 && <span className="text-[#3a3833]">/</span>}
              <span
                className="font-semibold tracking-[1.5px] transition-colors duration-[550ms]"
                style={{ color: cycle === i ? "#4be0ab" : "#56544d" }}
              >
                {w}
              </span>
            </span>
          ))}
        </Reveal>
        <Reveal className="relative z-[2]">
          <h1 className="m-0 max-w-[15ch] font-display text-[clamp(40px,8vw,88px)] font-normal leading-[0.98] tracking-[-0.03em]">
            A single number for the quality of a room.
          </h1>
        </Reveal>
        <Reveal className="relative z-[2] mt-[26px]" delay={0.05}>
          <p className="m-0 max-w-[58ch] text-[clamp(16px,2.4vw,20px)] leading-[1.55] text-[#a7a49b]">
            <Ss /> measures relevant, reciprocated, followed-through connections.
            Computed from what actually happened in the room, never from
            headcount, badge scans or app opens.
          </p>
        </Reveal>
        <Reveal className="relative z-[2] mt-12 flex flex-col items-center gap-[18px]" delay={0.1}>
          <ScoreRing score={heroScore} size={224} strokeWidth={9} animateFast showTm />
          <p className="m-0 max-w-[34ch] text-[14px] leading-[1.5] text-[#8b887f]">
            Two connections. Both mutual, both relevant, both replied to. That is
            an 86. Depth beats breadth.
          </p>
        </Reveal>
      </section>

      {/* ============ 01 PHILOSOPHY ============ */}
      <section className="bg-[#0b0b0c] px-6 py-[clamp(80px,12vw,140px)]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-[60px] max-w-[64ch]">
            <Eyebrow n="01" label="Why it exists" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              Most tools measure volume. Volume is easy to game and tells you
              nothing.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#a7a49b]">
              Tickets sold, badges scanned, messages sent. None of it says whether
              the room worked — whether people left with connections that matter.{" "}
              <Ss /> is built on four principles.
            </p>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(255px,1fr))] gap-5">
            {PRINCIPLES.map((p, i) => (
              <Reveal
                key={p.n}
                delay={i * 0.08}
                className="rounded-[20px] border border-white/[0.07] bg-[#141310] px-7 py-8"
              >
                <div className="mb-[18px] font-display text-[30px] font-normal text-[#08c888]">
                  {p.n}
                </div>
                <h3 className="m-0 mb-[10px] font-display text-[21px] font-bold tracking-[-0.01em]">
                  {p.t}
                </h3>
                <p className="m-0 text-[14.5px] leading-[1.6] text-[#9a978f]">{p.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 02 EDGES VS TIES (GRAPH) ============ */}
      <section
        className="px-6 py-[clamp(80px,12vw,140px)]"
        style={{ background: "linear-gradient(180deg,#0b0b0c,#100f0c)" }}
      >
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-[44px] max-w-[64ch]">
            <Eyebrow n="02" label="The crux of the model" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              An edge is interest. A tie is a connection.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#a7a49b]">
              Tap any link in the room to cycle it: nothing, a one-way reach (a
              save or an intro), then a reciprocated tie (both saved, or both
              replied). Only ties move the score.
            </p>
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-7">
            <Reveal className="rounded-[24px] border border-white/[0.07] bg-[#141310] px-[14px] pb-1 pt-[14px]">
              <svg viewBox="0 0 400 350" style={{ width: "100%", height: "auto", display: "block" }}>
                {st.edges.map((e, idx) => {
                  const A = positions[e.a];
                  const B = positions[e.b];
                  return (
                    <g key={idx}>
                      {e.s === 2 ? (
                        <line
                          x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                          stroke="#08c888" strokeWidth={4.5} strokeLinecap="round"
                          style={{ filter: "drop-shadow(0 0 4px rgba(8,200,136,.55))" }}
                        />
                      ) : e.s === 1 ? (
                        <line
                          x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                          stroke="#6d6a62" strokeWidth={2} strokeDasharray="2 6" strokeLinecap="round"
                        />
                      ) : (
                        <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,.09)" strokeWidth={1.5} />
                      )}
                      <line
                        x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                        stroke="transparent" strokeWidth={20}
                        style={{ cursor: "pointer" }}
                        onClick={() => dispatch({ type: "cycleEdge", idx })}
                      />
                    </g>
                  );
                })}
                {positions.map((P, i) => {
                  const hasTie = st.edges.some((e) => e.s === 2 && (e.a === i || e.b === i));
                  return (
                    <g key={`n${i}`}>
                      <circle
                        cx={P.x} cy={P.y} r={20}
                        fill={hasTie ? "#08c888" : "#26241d"}
                        stroke={hasTie ? "#08c888" : "rgba(255,255,255,.14)"}
                        strokeWidth={2}
                        style={hasTie ? { filter: "drop-shadow(0 0 6px rgba(8,200,136,.5))" } : undefined}
                      />
                      <text
                        x={P.x} y={P.y + 4} textAnchor="middle"
                        fontSize={12} fontWeight={700} fontFamily="Montserrat, sans-serif"
                        fill={hasTie ? "#14130d" : "#c9c6bd"}
                        style={{ pointerEvents: "none" }}
                      >
                        {INITIALS[i]}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <div className="flex flex-wrap justify-center gap-4 px-2 pb-[14px] pt-[2px]">
                <span className="inline-flex items-center gap-[7px] text-[12px] text-[#8b887f]">
                  <span className="w-5 border-t-2 border-dashed border-[#6d6a62]" /> one-way reach
                </span>
                <span className="inline-flex items-center gap-[7px] text-[12px] text-[#8b887f]">
                  <span className="h-1 w-5 rounded-sm bg-[#08c888]" /> reciprocated tie
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mb-[22px] flex flex-wrap gap-4">
                <div className="min-w-[130px] flex-1 rounded-[18px] border border-white/[0.07] bg-[#141310] px-[22px] py-5">
                  <div className="font-display text-[44px] font-normal leading-none text-[#08c888]">{ties.length}</div>
                  <div className="mt-[6px] text-[13px] text-[#9a978f]">reciprocated ties</div>
                </div>
                <div className="min-w-[130px] flex-1 rounded-[18px] border border-white/[0.07] bg-[#141310] px-[22px] py-5">
                  <div className="font-display text-[44px] font-normal leading-none">
                    {gIncl}
                    <span className="text-[22px] text-[#7d7a72]">/8</span>
                  </div>
                  <div className="mt-[6px] text-[13px] text-[#9a978f]">left with a real tie</div>
                </div>
              </div>

              <div className="mb-[26px] rounded-[18px] border border-[rgba(8,200,136,.22)] bg-[rgba(8,200,136,.06)] px-[22px] py-5">
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="text-[12.5px] tracking-[1.5px] text-[#4be0ab]">ROOM SIGNAL</span>
                  <span className="font-display text-[34px] font-normal leading-none">{gScore}</span>
                </div>
                <div className="h-[7px] overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[#08c888] transition-[width] duration-500"
                    style={{ width: `${gScore}%`, transitionTimingFunction: "cubic-bezier(.2,.7,.2,1)" }}
                  />
                </div>
              </div>

              <div className="mb-3 text-[11.5px] tracking-[1.5px] text-[#7d7a72]">SEE THE POINT IN ONE TAP</div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => dispatch({ type: "graph", edges: GRAPH_SPAM, last: "spam" })}
                  className="min-w-[150px] flex-1 rounded-full border border-white/[0.16] bg-transparent px-[18px] py-[14px] text-[14px] font-semibold leading-none text-[#f4f0e8] transition-colors hover:border-white/40"
                >
                  Spam the whole room
                </button>
                <button
                  onClick={() => dispatch({ type: "graph", edges: GRAPH_TIES, last: "ties" })}
                  className="min-w-[150px] flex-1 rounded-full bg-[#08c888] px-[18px] py-[14px] text-[14px] font-bold leading-none text-[#14130d] transition-transform hover:-translate-y-0.5"
                >
                  Build two real ties
                </button>
              </div>
              <button
                onClick={() => dispatch({ type: "graph", edges: GRAPH_START, last: null })}
                className="mt-3 cursor-pointer border-none bg-none p-1 text-[13px] text-[#7d7a72] underline"
              >
                reset the room
              </button>
              <p className="m-0 mt-[14px] text-[13.5px] leading-[1.55] text-[#8b887f]">{gMsg}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ GLOSSARY (added helper) ============ */}
      <section className="bg-[#0b0b0c] px-6 pb-[clamp(60px,9vw,90px)]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-8 flex items-center gap-[14px]">
            <span className="text-[11.5px] font-semibold uppercase tracking-[2px] text-[#6b6860]">
              The words we use
            </span>
            <span className="h-px flex-1 bg-white/[0.08]" />
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-8 gap-y-6">
            {GLOSSARY.map((g, i) => (
              <Reveal key={g.t} delay={i * 0.05} className="border-l-2 border-[rgba(8,200,136,.4)] pl-4">
                <div className="font-display text-[17px] font-bold text-[#f4f0e8]">{g.t}</div>
                <p className="m-0 mt-1 text-[13.5px] leading-[1.55] text-[#9a978f]">{g.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 03 PERSONAL PLAYGROUND ============ */}
      <section className="bg-[#f4f0e8] px-6 py-[clamp(80px,12vw,140px)] text-[#14130d]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-[52px] max-w-[64ch]">
            <Eyebrow n="03" label={<>Personal <Ss caps />, live</>} tone="tealDeep" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              How well did I network? Four inputs, one honest number.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#5f5d56]">
              Move the sliders and watch a live model of the score respond. It
              shows what each input <em>does</em> — the exact weighting stays under
              the hood.
            </p>
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-10">
            {/* inputs */}
            <Reveal>
              <PlaygroundSlider
                label="Reciprocated ties" onLight
                value={st.pTies} display={String(st.pTies)}
                min={0} max={8} step={1}
                onChange={(v) => dispatch({ type: "set", key: "pTies", value: v })}
                hint="Mutual connections you actually built."
              />
              <PlaygroundSlider
                label="People you reached" onLight
                value={st.pReach} display={String(st.pReach)}
                min={1} max={15} step={1}
                onChange={(v) => dispatch({ type: "set", key: "pReach", value: v })}
                hint="Everyone you saved or messaged. Reciprocity quality is ties over reach."
              />
              <PlaygroundSlider
                label="Relevance of your ties" onLight
                value={st.pRel} display={st.pRel.toFixed(2)}
                min={0} max={1} step={0.05}
                onChange={(v) => dispatch({ type: "set", key: "pRel", value: v })}
                hint="AI-scored fit between what you offer and what they need."
              />
              <PlaygroundSlider
                label="Follow-through" onLight last
                value={st.pFunnel} display={funnelLabel(st.pFunnel)}
                min={0.2} max={1} step={0.2}
                onChange={(v) => dispatch({ type: "set", key: "pFunnel", value: v })}
                hint="The furthest stage you reached. Set it in the funnel below, too."
              />
            </Reveal>

            {/* result card */}
            <Reveal delay={0.1} className="rounded-[26px] bg-[#14130d] p-[clamp(26px,4vw,38px)] text-[#f4f0e8]">
              <div className="mb-7 flex flex-wrap items-center gap-6">
                <ScoreRing score={pScore} size={142} />
                <div className="min-w-[150px] flex-1">
                  <div className="mb-[6px] text-[12px] tracking-[1.5px] text-[#7d7a72]">
                    PERSONAL <Ss caps />
                  </div>
                  <div className="text-[14px] leading-[1.5] text-[#a7a49b]">{pVerdict}</div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {PERSONAL_BARS.map((b) => {
                  const dim = b.key === "rel" && !st.relAvail;
                  const pct = Math.round((pRaw[b.key] ?? 0) * 100);
                  return (
                    <div key={b.key} style={{ opacity: dim ? 0.32 : 1, transition: "opacity .3s" }}>
                      <div className="mb-[6px] flex items-center justify-between gap-3 text-[13px]">
                        <span className="flex items-center gap-2 text-[#c9c6bd]">
                          {b.label} <TierChip tier={b.tier} />
                        </span>
                        <span className="font-display text-[#4be0ab]">{dim ? "—" : `${pct}%`}</span>
                      </div>
                      <div className="h-[6px] overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          className="h-full bg-[#08c888] transition-[width] duration-[350ms]"
                          style={{ width: dim ? "0%" : `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 border-t border-white/[0.08] pt-5 font-display text-[clamp(13px,2.4vw,15px)] leading-[1.7] tracking-[.2px] text-[#8b887f]">
                {pReadout}
              </div>
            </Reveal>
          </div>

          {/* worked example (added helper) */}
          <Reveal className="mt-12 rounded-[22px] border border-[rgba(20,19,13,.1)] bg-white px-7 py-8" delay={0.05}>
            <div className="mb-3 text-[11.5px] font-semibold uppercase tracking-[2px] text-[#0a8f62]">
              A worked example
            </div>
            <p className="m-0 max-w-[68ch] text-[15.5px] leading-[1.65] text-[#5f5d56]">
              <strong className="text-[#14130d]">Dana at a 40-person founder dinner.</strong>{" "}
              She reaches out to six people over the night. Three of them save her
              back or reply — three real ties from six attempts, so her reciprocity
              quality is high. Two of those ties are a genuine fit for what
              she&apos;s building, and she gets a reply from one before she&apos;s
              even left. Modest
              reach, but deep and mutual: Dana walks away with a strong personal
              score, and the app can tell her exactly which of the four inputs earned
              it. The person who added forty contacts and heard back from none scores
              far lower.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 04 FUNNEL ============ */}
      <section className="bg-[#0b0b0c] px-6 py-[clamp(80px,12vw,130px)]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-[46px] max-w-[64ch]">
            <Eyebrow n="04" label="The follow-through funnel" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              A ratchet, not a sum. You get credit for the furthest point you
              reached.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#a7a49b]">
              Tap a stage. It mirrors a real relationship funnel: showing up,
              noticing someone, saving them, reaching out, then a two-way
              conversation. This feeds follow-through in the score above.
            </p>
          </Reveal>
          <Reveal className="flex flex-wrap gap-[10px]">
            {FUNNEL_STAGES.map((s) => {
              const on = s.v <= st.pFunnel + 0.001;
              return (
                <button
                  key={s.v}
                  onClick={() => dispatch({ type: "set", key: "pFunnel", value: s.v })}
                  className="min-w-[150px] flex-1 rounded-[16px] border border-white/[0.08] p-5 text-left transition-all duration-[250ms]"
                  style={{ background: on ? "rgba(8,200,136,.12)" : "rgba(255,255,255,.03)" }}
                >
                  <div
                    className="mb-[10px] font-display text-[26px] leading-none"
                    style={{ color: on ? "#08c888" : "#5f5d56" }}
                  >
                    {s.v.toFixed(1)}
                  </div>
                  <div className="text-[14px] font-semibold" style={{ color: on ? "#f4f0e8" : "#7d7a72" }}>
                    {s.label}
                  </div>
                </button>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* ============ 05 EVENT PLAYGROUND ============ */}
      <section className="bg-[#f4f0e8] px-6 py-[clamp(80px,12vw,140px)] text-[#14130d]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-[52px] max-w-[64ch]">
            <Eyebrow n="05" label={<>Event <Ss caps />, live</>} tone="tealDeep" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              How well did the room connect? Five rates, comparable across any
              size.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#5f5d56]">
              Inclusion carries the heaviest weight. The dashboard always surfaces
              the weakest link, so an organizer knows exactly what to fix next.
            </p>
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-10">
            <Reveal>
              {EVENT_INPUTS.map((inp, i) => (
                <PlaygroundSlider
                  key={inp.key}
                  label={inp.label}
                  tier={inp.tier}
                  onLight
                  last={i === EVENT_INPUTS.length - 1}
                  value={st[inp.key] as number}
                  display={`${Math.round((st[inp.key] as number) * 100)}%`}
                  min={0} max={1} step={0.01}
                  onChange={(v) => dispatch({ type: "set", key: inp.key, value: v })}
                  hint={inp.hint}
                />
              ))}
            </Reveal>

            <Reveal delay={0.1} className="rounded-[26px] bg-[#14130d] p-[clamp(26px,4vw,38px)] text-[#f4f0e8]">
              <div className="mb-[26px] flex flex-wrap items-center gap-6">
                <ScoreRing score={eScore} size={142} />
                <div className="min-w-[150px] flex-1">
                  <div className="mb-[6px] text-[12px] tracking-[1.5px] text-[#7d7a72]">
                    EVENT <Ss caps />
                  </div>
                  <div className="text-[14px] leading-[1.5] text-[#a7a49b]">
                    Drag the rates and watch the number respond. What counts as a
                    good score depends on the room, not a fixed bar.
                  </div>
                </div>
              </div>

              <div className="rounded-[16px] border border-[rgba(8,200,136,.22)] bg-[rgba(8,200,136,.06)] px-[22px] py-5">
                <div className="mb-2 text-[11.5px] tracking-[1.5px] text-[#4be0ab]">WEAKEST LINK</div>
                <div className="mb-2 font-display text-[20px] font-bold">{eWeak.label}</div>
                <div className="text-[13.5px] leading-[1.55] text-[#a7a49b]">{eWeak.advice}</div>
              </div>

              <div className="mt-[22px] border-t border-white/[0.08] pt-5">
                <div className="mb-3 text-[11.5px] tracking-[1.5px] text-[#7d7a72]">SAFETY GATE</div>
                <div className="text-[13.5px] leading-[1.55] text-[#8b887f]">
                  Below a minimum number of check-ins, <Ss /> returns no number at
                  all. A tiny room produces a misleading figure, so we show nothing
                  rather than something fake.
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 06 WEIGHT REDISTRIBUTION ============ */}
      <section className="bg-[#0b0b0c] px-6 py-[clamp(80px,12vw,140px)]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-12 max-w-[64ch]">
            <Eyebrow n="06" label="Never undefined" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              If relevance is unavailable, its share is redistributed, not dropped.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#a7a49b]">
              Turn the AI relevance signal off. Its share is spread proportionally
              across the other three components, so they still sum to one and the
              score stays on the same 0–100 scale.
            </p>
          </Reveal>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-center gap-10">
            <Reveal className="flex justify-center">
              <div className="relative w-[min(320px,80vw)]">
                <svg viewBox="0 0 180 180" style={{ width: "100%", height: "auto", transform: "rotate(-90deg)" }}>
                  <circle cx={90} cy={90} r={PIE_R} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={22} />
                  {pieSlices.map((s, i) => {
                    const len = s.w * PIE_C;
                    const el = (
                      <circle
                        key={i}
                        cx={90} cy={90} r={PIE_R} fill="none" stroke={s.color} strokeWidth={22}
                        strokeDasharray={`${len} ${PIE_C - len}`}
                        strokeDashoffset={-cum * PIE_C}
                        style={{ transition: "stroke-dasharray .4s, stroke-dashoffset .4s" }}
                      />
                    );
                    cum += s.w;
                    return el;
                  })}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="font-display text-[46px] font-normal leading-none">{pScore}</div>
                  <div className="mt-[2px] text-[10px] tracking-[1.5px] text-[#7d7a72]">
                    <Ss caps />
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mb-[26px] inline-flex items-center gap-[14px] rounded-[16px] border border-white/[0.08] bg-[#141310] px-[22px] py-4">
                <span className="text-[14px] font-semibold text-[#f4f0e8]">AI relevance signal</span>
                <button
                  onClick={() => dispatch({ type: "toggleRel" })}
                  className="relative h-[30px] w-[52px] cursor-pointer rounded-full border-none transition-colors duration-[250ms]"
                  style={{ background: st.relAvail ? "#08c888" : "rgba(255,255,255,.16)" }}
                  aria-pressed={st.relAvail}
                  aria-label="Toggle AI relevance signal"
                >
                  <span
                    className="absolute top-[3px] h-6 w-6 rounded-full bg-white transition-[left] duration-[250ms]"
                    style={{ left: st.relAvail ? 25 : 3 }}
                  />
                </button>
                <span
                  className="min-w-[26px] text-[13px] font-semibold"
                  style={{ color: st.relAvail ? "#08c888" : "#7d7a72" }}
                >
                  {st.relAvail ? "On" : "Off"}
                </span>
              </div>

              {/* legend — names + relative order, deliberately no coefficients */}
              <div className="flex flex-col gap-[10px]">
                {pieSlices.map((s) => (
                  <div key={s.label} className="flex items-center gap-3">
                    <span className="h-[10px] w-[10px] flex-none rounded-full" style={{ background: s.color }} />
                    <span className="font-display text-[15px] text-[#c9c6bd]">{s.label}</span>
                  </div>
                ))}
              </div>

              <p className="m-0 mt-5 text-[14px] leading-[1.6] text-[#8b887f]">
                {st.relAvail
                  ? "Four components share the score. With the AI signal on, relevance takes its own slice of the ring."
                  : "Relevance is off — its slice is gone, and the other three grow to fill the ring. The score never becomes undefined and never leaves the 0–100 scale."}{" "}
                The same graceful degradation protects every AI input: if the model
                is off, the system falls back to a deterministic heuristic with zero
                API calls, and the rest of the score runs unchanged.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ 07 GUARDRAILS + SEGMENTS ============ */}
      <section className="bg-[#f4f0e8] px-6 py-[clamp(80px,12vw,140px)] text-[#14130d]">
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-[52px] max-w-[64ch]">
            <Eyebrow n="07" label="Why you can trust the number" tone="tealDeep" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              A metric you can defend, line by line, in front of a board.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#5f5d56]">
              Deterministic, unit-tested, and tuned from a single reviewed file.
              Every guardrail exists so the number holds up under scrutiny.
            </p>
          </Reveal>

          <div className="mb-[60px] grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
            {GUARDRAILS.map((g, i) => (
              <Reveal key={g.t} delay={i * 0.06} className="rounded-[18px] border border-[rgba(20,19,13,.08)] bg-white p-[26px]">
                <h3 className="m-0 mb-2 font-display text-[17px] font-bold">{g.t}</h3>
                <p className="m-0 text-[13.5px] leading-[1.55] text-[#6b6860]">{g.b}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mb-9 max-w-[64ch]">
            <h2 className="m-0 mb-[14px] font-display text-[clamp(26px,4vw,40px)] font-normal leading-[1.08] tracking-[-0.02em]">
              The score becomes action. Every attendee gets a segment.
            </h2>
            <p className="m-0 text-[clamp(14px,1.8vw,17px)] leading-[1.6] text-[#5f5d56]">
              Classified by the room&apos;s own distribution, so thresholds scale with
              size and never hard-code a popularity bar. This is what tells an
              organizer who to seat next to whom, and who nearly slipped through.
            </p>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-4">
            {SEGMENTS.map((s, i) => (
              <Reveal key={s.t} delay={i * 0.05} className="rounded-[18px] bg-[#14130d] p-6 text-[#f4f0e8]">
                <div className="mb-4 h-8 w-8 rounded-full" style={{ background: s.c }} />
                <h3 className="m-0 mb-[6px] font-display text-[17px] font-bold">{s.t}</h3>
                <p className="m-0 text-[13px] leading-[1.5] text-[#9a978f]">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRIVACY ============ */}
      <section className="bg-[#0b0b0c] px-6 py-[clamp(80px,12vw,130px)]">
        <div className="mx-auto max-w-[820px] text-center">
          <Reveal>
            <h2 className="m-0 mb-[22px] font-display text-[clamp(28px,5vw,48px)] font-normal leading-[1.08] tracking-[-0.02em]">
              Personal scores are for one person only. Never a public ranking.
            </h2>
            <p className="m-0 mx-auto max-w-[56ch] text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#a7a49b]">
              Enforced at the database with row-level security. Every table is
              scoped per organization, all computation runs server-side, and
              attendees never receive anyone else&apos;s raw activity. Explainable to the
              person it belongs to, invisible to everyone else.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ============ 08 ROADMAP ============ */}
      <section
        className="px-6 py-[clamp(80px,12vw,140px)]"
        style={{ background: "linear-gradient(180deg,#100f0c,#0b0b0c)" }}
      >
        <div className="mx-auto max-w-[1120px]">
          <Reveal className="mb-12 max-w-[64ch]">
            <Eyebrow n="08" label="Beyond a single room" />
            <h2 className="m-0 mb-[22px] font-display text-[clamp(30px,5vw,52px)] font-normal leading-[1.05] tracking-[-0.02em]">
              A cross-event, human-verified layer: trust, opportunity, and real
              outcomes.
            </h2>
            <p className="m-0 text-[clamp(15px,2vw,18px)] leading-[1.6] text-[#a7a49b]">
              The scores above read a single event from behavior. This layer adds
              what behavior alone can&apos;t see — off-platform follow-up, real
              outcomes, and trust built over repeated events — plus a longitudinal
              trend that shows whether your events are getting better at connecting
              people over time.
            </p>
          </Reveal>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(255px,1fr))] gap-5">
            {ROADMAP.map((r, i) => (
              <Reveal
                key={r.t}
                delay={i * 0.08}
                className="rounded-[20px] border border-white/[0.07] bg-[#141310] px-7 py-8"
              >
                <h3 className="m-0 mb-3 font-display text-[20px] font-bold text-[#f4f0e8]">{r.t}</h3>
                <p className="m-0 text-[14px] leading-[1.6] text-[#9a978f]">{r.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ (added helper) ============ */}
      <section className="bg-[#0b0b0c] px-6 pb-[clamp(80px,12vw,120px)]">
        <div className="mx-auto max-w-[820px]">
          <Reveal className="mb-9">
            <Eyebrow n="09" label="Straight answers" />
            <h2 className="m-0 font-display text-[clamp(28px,4.5vw,44px)] font-normal leading-[1.08] tracking-[-0.02em]">
              The questions people ask first.
            </h2>
          </Reveal>
          <div className="flex flex-col gap-3">
            {FAQ.map((f, i) => (
              <Reveal key={f.q} delay={i * 0.04}>
                <details className="group rounded-[16px] border border-white/[0.08] bg-[#141310] px-6 py-5 [&_summary]:list-none">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-display text-[17px] font-bold text-[#f4f0e8]">
                    {f.q}
                    <span className="flex-none text-[#08c888] transition-transform duration-300 group-open:rotate-45">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="m-0 mt-3 text-[14.5px] leading-[1.6] text-[#9a978f]">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="bg-[#0b0b0c] px-6 py-[clamp(90px,13vw,150px)] text-center">
        <Reveal className="mx-auto max-w-[720px]">
          <h2 className="m-0 mb-6 font-display text-[clamp(32px,6vw,60px)] font-normal leading-[1.02] tracking-[-0.03em]">
            Measure what a room is really worth.
          </h2>
          <p className="m-0 mx-auto mb-10 max-w-[52ch] text-[clamp(16px,2.2vw,19px)] leading-[1.55] text-[#a7a49b]">
            See <Ss /> run on your own events, with a report you can hand to a
            sponsor or a board.
          </p>
          <div className="flex flex-wrap justify-center gap-[14px]">
            <a
              href={links.contact}
              className="inline-flex items-center justify-center rounded-full bg-[#08c888] px-[34px] py-[17px] text-[15px] font-bold leading-none text-[#14130d] transition-transform hover:-translate-y-0.5"
            >
              Talk to our team
            </a>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-[34px] py-[17px] text-[15px] font-semibold leading-none text-[#f4f0e8] transition-colors hover:border-white/40"
            >
              Back to LiveConnect
            </Link>
          </div>
          <div className="mt-16 flex justify-center">
            <Image
              src="/assets/liveconnect_clr_w.svg"
              alt="LiveConnect"
              width={125}
              height={22}
              style={{ height: 22, width: "auto" }}
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}

/* ---------- slider row (shared by both playgrounds) ---------- */
function PlaygroundSlider({
  label,
  tier,
  value,
  display,
  min,
  max,
  step,
  onChange,
  hint,
  onLight = false,
  last = false,
}: {
  label: string;
  tier?: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint: string;
  onLight?: boolean;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-7"}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="flex items-center gap-2 text-[15px] font-semibold">
          {label}
          {tier && (
            <span className="rounded-full bg-[rgba(10,143,98,.12)] px-[8px] py-[2px] text-[9.5px] font-semibold uppercase tracking-[1px] text-[#0a8f62]">
              {tier}
            </span>
          )}
        </span>
        <span className="font-display text-[20px] text-[#0a8f62]">{display}</span>
      </div>
      <input
        type="range"
        className={onLight ? "ss-range onlight" : "ss-range"}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
      <p className="m-0 mt-[9px] text-[12.5px] text-[#8a877f]">{hint}</p>
    </div>
  );
}
