"use client";

import { useEffect, useRef, useState } from "react";
import Phone from "./Phone";

const STEPS = [
  {
    n: "1",
    eyebrow: "STEP ONE",
    title: "Check in to the room",
    body: "Scan the code at the door to check in, you appear on that event's live directory instantly. It's a web app, so there's nothing to install.",
  },
  {
    n: "2",
    eyebrow: "STEP TWO",
    title: "Find who matters",
    body: "Search the room by name, company, or industry, and see exactly who's here right now, updated the moment they walk in.",
  },
  {
    n: "3",
    eyebrow: "STEP THREE",
    title: "Connect in one tap",
    body: "Message, save a contact, or swap details instantly. The follow up is done before you've left the room.",
  },
];

export default function HowItWorks() {
  const colRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = 0;
      const col = colRef.current;
      if (!col) return;
      const blocks = col.children;
      if (blocks.length < 3) return;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < blocks.length; i++) {
        const r = blocks[i].getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      setActive((prev) => (best !== prev ? best : prev));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    tick();
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="how" className="bg-cream">
      <div className="mx-auto max-w-[1100px] px-5 pb-2 pt-16 text-center md:px-7 md:pt-24">
        <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
          HOW IT WORKS
        </div>
        <h2 className="mt-[14px] font-display text-[32px] font-normal tracking-[-1px] text-ink-text md:text-[44px]">
          From walking in to following up
        </h2>
        <p className="mx-auto mt-8 max-w-[560px] text-[17px] leading-[1.4] text-body md:text-[18px]">
          Keep scrolling, watch the whole thing happen on one screen, one tap
          from the door to the follow up.
        </p>
      </div>

      {/* Desktop: scroll-pinned phone */}
      <div className="mx-auto hidden max-w-[1120px] grid-cols-2 gap-12 px-7 lg:grid">
        <div ref={colRef}>
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="flex h-screen max-w-[440px] flex-col justify-center"
            >
              <div className="flex items-center gap-[14px]">
                <div
                  className="flex h-[52px] w-[52px] items-center justify-center rounded-[15px] font-display text-[20px] font-bold leading-none text-cream"
                  style={{ background: i === 2 ? "#08c888" : "#16150f" }}
                >
                  {s.n}
                </div>
                <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
                  {s.eyebrow}
                </div>
              </div>
              <h3 className="mt-6 font-display text-[38px] font-normal tracking-[-0.5px] text-ink-text">
                {s.title}
              </h3>
              <p className="mt-5 text-[18px] leading-[1.4] text-body">
                {s.body}
              </p>
            </div>
          ))}
        </div>
        <div>
          <div className="sticky top-0 flex h-screen flex-col items-center justify-center">
            <Phone active={active} />
            <div className="mt-[26px] flex justify-center gap-[10px]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-[10px] rounded-full transition-all duration-300"
                  style={{
                    width: i === active ? 26 : 10,
                    background: i === active ? "#08c888" : "#cec7b8",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked numbered cards */}
      <div className="mx-auto flex max-w-[560px] flex-col gap-4 px-5 pb-4 pt-8 lg:hidden">
        {STEPS.map((s, i) => (
          <div
            key={s.n}
            className="rounded-[20px] border border-border bg-cream p-6"
          >
            <div className="flex items-center gap-[14px]">
              <div
                className="flex h-[46px] w-[46px] items-center justify-center rounded-[14px] font-display text-[19px] font-bold leading-none text-cream"
                style={{ background: i === 2 ? "#08c888" : "#16150f" }}
              >
                {s.n}
              </div>
              <div className="text-[12px] font-extrabold tracking-[2px] text-teal">
                {s.eyebrow}
              </div>
            </div>
            <h3 className="mt-4 font-display text-[22px] font-normal tracking-[-0.5px] text-ink-text">
              {s.title}
            </h3>
            <p className="mt-[14px] text-[16px] leading-[1.4] text-body">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
