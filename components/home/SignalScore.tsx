import { CheckCircle } from "@/components/icons";

const POINTS = [
  { title: "Quality over volume", rest: ", real intros beat empty saves." },
  { title: "Always explained", rest: ", five sub scores show why." },
  { title: "Comparable event to event", rest: ", track it over time." },
  { title: "Private by design", rest: ", only you ever see it." },
];

const BARS = [
  { label: "Inclusion", value: 61 },
  { label: "Reciprocity", value: 78 },
  { label: "Relevance", value: 84 },
  { label: "Connectivity", value: 72 },
  { label: "Conversion", value: 66 },
];

export default function SignalScore() {
  return (
    <section
      id="signalscore"
      className="bg-charcoal px-5 py-[100px] text-cream md:px-7"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy */}
        <div>
          <div className="font-display text-[27px] leading-none tracking-[-0.5px] text-cream">
            <span className="font-normal">Signal</span>
            <span className="font-bold">Score</span>
            <span className="relative -top-[9px] ml-[2px] inline-block text-[14px] font-bold">
              ™
            </span>
          </div>
          <h2 className="mt-10 font-display text-[32px] font-normal tracking-[-1px] text-cream md:text-[44px]">
            Did the room actually connect?
          </h2>
          <p className="mt-8 text-[18px] leading-[1.4] text-on-dark">
            SignalScore™ turns a night of networking into one explainable 0–100
            number, for the whole event, and privately for each attendee. It
            rewards mutual, relevant, followed-through introductions over raw
            activity, so you see real connection, not noise.
          </p>
          <div className="mt-[30px] flex flex-col gap-[15px]">
            {POINTS.map((p) => (
              <div key={p.title} className="flex items-center gap-3">
                <CheckCircle size={21} className="flex-none text-teal" />
                <span className="text-[15.5px] leading-[1.4] text-light-dark-2">
                  <strong className="font-bold text-cream">{p.title}</strong>
                  {p.rest}
                </span>
              </div>
            ))}
          </div>
          <a
            href="/signalscore"
            className="group mt-9 inline-flex items-center gap-2 font-display text-[15px] font-bold text-teal"
          >
            See how SignalScore™ works
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>

        {/* Score card */}
        <div className="rounded-[24px] border border-[#34301f] bg-[#1c1a13] p-[30px] shadow-[0_30px_70px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold tracking-[1.5px] text-muted">
              EVENT SIGNALSCORE
            </span>
            <span className="inline-flex items-center gap-[5px] rounded-full bg-live/12 px-[11px] py-[5px] text-[12px] font-bold leading-none text-live">
              ▲ 6 vs last event
            </span>
          </div>

          <div className="mt-[18px] flex items-center gap-[22px]">
            <svg width="128" height="128" viewBox="0 0 120 120" className="flex-none">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#34301f" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#08c888"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="326.7"
                strokeDashoffset="58.8"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="58" textAnchor="middle" fontSize="37" fontWeight="700" fill="#f4f0e8" fontFamily="nexa, Montserrat, sans-serif">
                82
              </text>
              <text x="60" y="77" textAnchor="middle" fontSize="9.5" fill="#a29c8e" letterSpacing="1.5" fontFamily="Montserrat, sans-serif">
                / 100
              </text>
            </svg>
            <div>
              <div className="font-display text-[17px] font-bold text-cream">
                Strong room
              </div>
              <div className="mt-[5px] text-[13px] leading-[1.45] text-muted">
                Most people left with at least one mutual, relevant connection.
              </div>
            </div>
          </div>

          <div className="my-6 mb-0.5 h-px bg-[#34301f]" />

          {BARS.map((b) => (
            <div key={b.label} className="mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] font-semibold text-light-dark">
                  {b.label}
                </span>
                <span className="font-display text-[13px] font-bold text-cream">
                  {b.value}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#34301f]">
                <div
                  className="h-full rounded-full bg-teal"
                  style={{ width: `${b.value}%` }}
                />
              </div>
            </div>
          ))}

          <div className="mt-[22px] text-[11.5px] leading-[1.4] text-[#78725f]">
            Personal SignalScore is shown privately to each attendee, never as a
            public ranking.
          </div>
        </div>
      </div>
    </section>
  );
}
