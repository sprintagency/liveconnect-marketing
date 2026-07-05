import Image from "next/image";
import { links } from "@/lib/links";
import { ArrowRight } from "@/components/icons";

const PROOF_FACES = ["face-3", "face-6", "face-1", "face-9"];

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden text-cream"
      style={{
        background:
          "linear-gradient(165deg,#16150f 0%,#201d15 52%,#16150f 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-[120px] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(8,200,136,0.12),transparent 62%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -left-[120px] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle,rgba(255,255,255,0.05),transparent 62%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 px-5 pb-16 pt-16 md:px-7 md:pb-24 md:pt-[88px] lg:grid-cols-[1.05fr_0.95fr]">
        {/* Copy column */}
        <div>
          <h1 className="font-display text-[40px] font-normal leading-[1.04] tracking-[-1px] md:text-[60px] md:tracking-[-1.5px]">
            Meet the room.
            <br />
            <span className="text-teal">Not just a name tag.</span>
          </h1>

          <p className="mt-[26px] max-w-[490px] text-[17px] leading-[1.4] text-on-dark-2 md:text-[19px]">
            Live Connect turns every event into an open door. See exactly who&apos;s
            in the room, find the people who matter, and connect or save their
            details in a single tap.
          </p>

          <div className="mt-[34px] flex flex-wrap gap-[14px]">
            <a
              href={links.getStarted}
              className="inline-flex items-center gap-[10px] rounded-full bg-teal px-7 py-[16px] text-[16px] font-bold leading-none text-ink shadow-[0_16px_34px_rgba(8,200,136,0.42)] transition-transform hover:-translate-y-0.5"
            >
              Get started free
              <ArrowRight />
            </a>
            <a
              href="/#how"
              className="inline-flex items-center justify-center gap-[10px] rounded-full border border-white/20 bg-white/8 px-[26px] py-[16px] text-[16px] font-bold leading-none text-cream transition-colors hover:bg-white/12"
            >
              See how it works
            </a>
          </div>

          <div className="mt-[38px] flex items-center gap-4">
            <div className="flex">
              {PROOF_FACES.map((f, i) => (
                <Image
                  key={f + i}
                  src={`/assets/${f}.png`}
                  alt=""
                  width={42}
                  height={42}
                  className="h-[42px] w-[42px] rounded-full border-[2.5px] border-[#201d15] object-cover"
                  style={{ marginRight: i < PROOF_FACES.length - 1 ? -12 : 0 }}
                />
              ))}
            </div>
            <div className="text-[14px] leading-[1.4] text-on-dark-2">
              <strong className="text-cream">Thousands of professionals</strong>
              <br />
              already connecting in the room.
            </div>
          </div>
        </div>

        {/* Visual column */}
        <div className="relative">
          <div className="overflow-hidden rounded-[26px] border border-white/10 shadow-[0_40px_80px_rgba(3,12,26,0.55)]">
            <div className="relative h-[340px] w-full md:h-[440px]">
              <Image
                src="/assets/event-hero.png"
                alt="Attendees networking at a LiveConnect event"
                fill
                sizes="(max-width: 1024px) 100vw, 540px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Floating attendee card */}
          <div className="anim-float absolute -bottom-[26px] -left-[26px] w-[270px] rounded-[18px] bg-white/96 p-4 shadow-[0_24px_50px_rgba(3,12,26,0.4)] backdrop-blur-[8px]">
            <div className="flex items-center gap-3">
              <Image
                src="/assets/face-3.png"
                alt=""
                width={50}
                height={50}
                className="h-[50px] w-[50px] rounded-full object-cover"
              />
              <div className="leading-[1.25]">
                <div className="text-[15px] font-extrabold text-ink-text">
                  Aiko Tanaka
                </div>
                <div className="text-[12.5px] font-semibold text-[#827c70]">
                  Head of Product · Harlow Software
                </div>
              </div>
            </div>
            <div className="mt-[14px] flex gap-2">
              <span className="flex flex-1 items-center justify-center rounded-[10px] bg-teal py-[10px] text-[13px] font-bold leading-none text-ink">
                Connect
              </span>
              <span className="flex items-center justify-center rounded-[10px] border-[1.5px] border-border-2 px-[18px] py-[10px] text-[13px] font-bold text-ink-text">
                Save
              </span>
            </div>
          </div>

          {/* Presence pill */}
          <div className="absolute right-[18px] top-[18px] inline-flex items-center gap-2 rounded-full border border-white/15 px-[14px] py-[9px] text-[12.5px] font-bold leading-none text-cream backdrop-blur-[6px]" style={{ background: "rgba(10,33,64,0.72)" }}>
            <span className="h-2 w-2 rounded-full bg-live shadow-[0_0_0_4px_rgba(55,214,122,0.25)]" />
            238 people here now
          </div>
        </div>
      </div>
    </section>
  );
}
