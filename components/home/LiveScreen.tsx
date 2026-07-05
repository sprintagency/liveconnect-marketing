import Image from "next/image";
import type { ReactNode } from "react";
import { Mic, PlusCircle, Broadcast, Lock, Star, UsersPlus, Download, Wifi } from "@/components/icons";

const MODULES: { icon: ReactNode; title: string; body: string }[] = [
  { icon: <Broadcast size={21} />, title: "Pushed in real time", body: "The takeover hits every signed-in phone in the room the instant you flip it on." },
  { icon: <Lock size={21} />, title: "Locked, full-screen", body: "Undismissable by attendees, so the whole room looks up at the same moment." },
  { icon: <Star size={21} />, title: "Sponsor 'Presented by'", body: "Your sponsor's logo and link stay in the header for the whole event." },
  { icon: <UsersPlus size={21} />, title: "Join requests feed", body: "Every tap on your CTA is captured for organized post event follow up." },
  { icon: <Download size={21} />, title: "Stats & CSV exports", body: "Live check in stats, plus attendee, connection-graph, and join-request exports." },
  { icon: <Wifi size={21} />, title: "Works on venue wifi", body: "Even when the wifi is patchy, the room list and your badge keep updating instead of freezing." },
];

export default function LiveScreen() {
  return (
    <section
      id="custom"
      className="px-5 py-16 md:px-7 md:py-24"
      style={{ background: "linear-gradient(180deg,#e9e4da,#e3ddd1)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[720px] text-center">
          <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
            THE LIVE SCREEN
          </div>
          <h2 className="mt-[14px] font-display text-[32px] font-normal tracking-[-1px] text-ink-text md:text-[44px]">
            Own the room&apos;s attention
          </h2>
          <p className="mx-auto mt-8 max-w-[600px] text-[17px] leading-[1.4] text-body md:text-[18px]">
            When it counts, organizers take over every phone in the room in real
            time, spotlight the speaker, or invite the whole room to join.
          </p>
        </div>

        <div className="mt-[52px] grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Speaking Now */}
          <div className="rounded-[24px] border border-border bg-cream p-7 shadow-[0_12px_30px_rgba(13,36,68,0.06)]">
            <div className="flex items-center gap-[11px]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-teal/10 text-teal">
                <Mic size={22} />
              </div>
              <div>
                <h3 className="font-display text-[20px] font-normal text-ink-text">
                  Speaking Now
                </h3>
                <div className="mt-2 text-[13.5px] font-semibold text-muted">
                  Spotlight up to 5 speakers, live
                </div>
              </div>
            </div>
            <div className="relative mt-5 flex h-[236px] flex-col items-center justify-center rounded-[16px] bg-charcoal p-[18px]">
              <div className="inline-flex items-center gap-[7px] rounded-full bg-teal px-[14px] py-[6px] leading-none shadow-[0_6px_16px_rgba(8,200,136,0.4)]">
                <span className="h-[7px] w-[7px] rounded-full bg-ink" />
                <span className="text-[11px] font-bold leading-none tracking-[1.2px] text-ink">
                  NOW SPEAKING
                </span>
              </div>
              <Image src="/assets/face-3.png" alt="" width={70} height={70} className="mt-4 h-[70px] w-[70px] rounded-full border-2 border-white/20 object-cover" />
              <div className="mt-[11px] font-display text-[18px] font-semibold text-cream">
                Aiko Tanaka
              </div>
              <div className="mt-0.5 text-[12.5px] text-on-dark">
                Head of Product · Harlow Software
              </div>
              <div className="mt-4 flex gap-1.5">
                <span className="h-1.5 w-5 rounded-full bg-teal" />
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/30" />
                ))}
              </div>
            </div>
          </div>

          {/* One tap join */}
          <div className="rounded-[24px] border border-border bg-cream p-7 shadow-[0_12px_30px_rgba(13,36,68,0.06)]">
            <div className="flex items-center gap-[11px]">
              <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-teal/10 text-teal">
                <PlusCircle size={22} />
              </div>
              <div>
                <h3 className="font-display text-[20px] font-normal text-ink-text">
                  One tap join
                </h3>
                <div className="mt-2 text-[13.5px] font-semibold text-muted">
                  Turn attention into follow ups
                </div>
              </div>
            </div>
            <div className="relative mt-5 flex h-[236px] flex-col items-center justify-center rounded-[16px] bg-charcoal p-6 text-center">
              <div className="font-display text-[21px] font-semibold text-cream">
                Join the room
              </div>
              <div className="mt-2 max-w-[230px] text-[13px] leading-[1.4] text-on-dark">
                Members only mixers and summits, all year round.
              </div>
              <div className="mt-[18px] inline-flex items-center justify-center rounded-[12px] bg-teal px-[26px] py-[11px] text-[14px] font-bold leading-none text-ink shadow-[0_10px_22px_rgba(8,200,136,0.4)]">
                Count me in
              </div>
              <div className="mt-[14px] text-[11px] text-muted-2">
                → saved to your join requests feed
              </div>
            </div>
          </div>
        </div>

        {/* Supporting modules */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {MODULES.map((m) => (
            <div
              key={m.title}
              className="flex items-start gap-[15px] rounded-[18px] border border-border bg-cream p-6"
            >
              <div className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-[11px] bg-[rgba(13,42,76,0.06)] text-charcoal">
                {m.icon}
              </div>
              <div>
                <div className="font-display text-[16px] font-bold leading-[1.2] text-ink-text">
                  {m.title}
                </div>
                <div className="mt-3 text-[13.5px] leading-[1.4] text-body">
                  {m.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
