import Image from "next/image";
import { links } from "@/lib/links";
import { CheckCircle, ArrowRight } from "@/components/icons";

const CHECKS = [
  "Your branding, from splash screen to profile card",
  'Sponsor placements, like "Presented by"',
  "Live check in, exports, and attendance stats",
];

const DIR_ROWS = [
  { face: "face-6", name: "Marcus Bell", role: "Sales · Ellison Health" },
  { face: "face-7", name: "Priya Nair", role: "Ops · Ridgeway Freight" },
];

export default function Organizers() {
  return (
    <section id="organizers" className="bg-cream px-5 py-16 md:px-7 md:py-24">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 lg:grid-cols-2">
        {/* Copy */}
        <div>
          <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
            FOR ORGANIZERS
          </div>
          <h2 className="mt-[14px] font-display text-[32px] font-normal tracking-[-1px] text-ink-text md:text-[42px]">
            Run it under your own brand
          </h2>
          <p className="mt-8 text-[18px] leading-[1.4] text-body">
            Live Connect is fully white label. Your logo, your colors, your
            event, powered by the same live directory attendees already love.
          </p>
          <div className="mt-7 flex flex-col gap-4">
            {CHECKS.map((c) => (
              <div key={c} className="flex items-center gap-3 text-[16px] font-bold text-ink-text">
                <CheckCircle size={22} className="flex-none text-teal" />
                {c}
              </div>
            ))}
          </div>
          <a
            href={links.contact}
            className="mt-8 inline-flex items-center gap-[10px] rounded-full bg-teal px-[26px] py-[16px] text-[16px] font-bold leading-none text-ink transition-transform hover:-translate-y-0.5"
          >
            Talk to our team
            <ArrowRight />
          </a>
        </div>

        {/* Phone mock */}
        <div className="flex justify-center">
          <div className="w-[320px] rounded-[40px] border border-border bg-charcoal-3 p-3 shadow-[0_40px_80px_rgba(13,36,68,0.28)]">
            <div className="overflow-hidden rounded-[28px] bg-[#f3f6fb] p-[18px]">
                <div className="rounded-[16px] border border-border bg-cream p-4">
                  <div className="flex items-center gap-2 text-[14px] font-extrabold text-ink-text">
                    <CheckCircle size={18} className="brand-text text-[#37b866]" strokeWidth={2.2} />
                    You&apos;re checked in
                  </div>
                  <p className="mb-3 mt-2 text-[12px] leading-[1.45] text-[#827c70]">
                    238 people are in the room. Browse who&apos;s here and start
                    connecting.
                  </p>
                  <div className="brand-bg rounded-[11px] bg-teal py-[11px] text-center text-[13px] font-bold text-ink">
                    View the directory
                  </div>
                </div>
                <div className="mt-3 flex flex-col gap-[10px]">
                  {DIR_ROWS.map((r) => (
                    <div key={r.name} className="flex items-center gap-[11px] rounded-[14px] border border-border bg-cream p-[11px]">
                      <Image src={`/assets/${r.face}.png`} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
                      <div className="min-w-0 flex-1 leading-[1.25]">
                        <div className="truncate text-[13.5px] font-extrabold text-ink-text">
                          {r.name}
                        </div>
                        <div className="truncate text-[11.5px] text-[#827c70]">{r.role}</div>
                      </div>
                      <span className="brand-bg inline-flex items-center justify-center rounded-[8px] bg-teal px-[13px] py-[6px] text-[11px] font-bold leading-none text-ink">
                        Connect
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
}
