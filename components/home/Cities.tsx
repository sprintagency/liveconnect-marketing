import { cities } from "@/lib/people";

export default function Cities() {
  return (
    <section
      id="cities"
      className="relative overflow-hidden px-5 py-16 text-cream md:px-7 md:py-24"
      style={{ background: "linear-gradient(165deg,#16150f,#16150f)" }}
    >
      <div
        className="pointer-events-none absolute -right-[60px] top-10 h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(8,200,136,0.16),transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-[920px] text-center">
        <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
          GOING NATIONAL
        </div>
        <h2 className="mt-[14px] font-display text-[34px] font-normal tracking-[-1px] md:text-[46px]">
          Fort Worth today.
          <br />
          The country next.
        </h2>
        <p className="mx-auto mt-6 max-w-[600px] text-[17px] leading-[1.4] text-on-dark-2 md:text-[18px]">
          We&apos;re live in Fort Worth and rolling into cities across the U.S.
          Be the first room we open in yours.
        </p>
        <div className="mt-[38px] flex flex-wrap justify-center gap-3">
          <span className="live-chip inline-flex items-center gap-[9px] rounded-full border border-teal/60 bg-[#0f1a14] px-5 py-[11px] text-[15px] font-bold leading-none text-teal">
            <span className="live-chip-dot h-2 w-2 rounded-full bg-live" />
            Fort Worth · Live
          </span>
          {cities.map((c) => (
            <span
              key={c}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/6 px-5 py-[11px] text-[15px] font-semibold leading-none text-light-dark"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
