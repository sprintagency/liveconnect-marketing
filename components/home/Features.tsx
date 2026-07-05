import type { ReactNode } from "react";
import { Users, Search, Bolt, Broadcast, Message, IdCard } from "@/components/icons";

type Feature = { icon: ReactNode; title: string; body: string };

const FEATURES: Feature[] = [
  {
    icon: <Users size={24} />,
    title: "Live attendee directory",
    body: "Everyone checked in to your event, in one scrollable, always-current list.",
  },
  {
    icon: <Search size={24} />,
    title: "Search the room",
    body: "Search by name, company, or role, then filter the whole room by industry.",
  },
  {
    icon: <Bolt size={24} />,
    title: "Save contacts instantly",
    body: "Save anyone as a contact with a downloadable vCard, and tap to text them on the spot.",
  },
  {
    icon: <Broadcast size={24} />,
    title: "Who's here now",
    body: "A live headcount shows how full the room is and who just checked in.",
  },
  {
    icon: <Message size={24} />,
    title: "Private messaging",
    body: "Send one intro message; the thread opens the moment they reply, all signal, no spam.",
  },
  {
    icon: <IdCard size={24} />,
    title: "One profile, every event",
    body: "Build it once, it travels to every event you attend, and you choose who sees your contact details.",
  },
];

export default function Features() {
  return (
    <section className="bg-cream px-5 py-16 md:px-7 md:py-24">
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[680px] text-center">
          <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
            FULL-FEATURED
          </div>
          <h2 className="mt-[14px] font-display text-[32px] font-normal tracking-[-1px] text-ink-text md:text-[44px]">
            Everything you need to work the room
          </h2>
        </div>

        <div className="mt-[52px] grid grid-cols-1 gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-[20px] border border-border px-[26px] py-[30px]"
            >
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-[13px] bg-teal/10 text-teal">
                {f.icon}
              </div>
              <h3 className="mb-[14px] mt-[18px] font-display text-[19px] font-normal leading-[1.2] text-ink-text">
                {f.title}
              </h3>
              <p className="text-[15px] leading-[1.4] text-body">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
