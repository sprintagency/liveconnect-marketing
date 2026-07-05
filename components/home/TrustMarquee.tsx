import { eventTypes } from "@/lib/people";

function Group() {
  return (
    <div className="flex flex-none items-center" aria-hidden="false">
      {eventTypes.map((t, i) => (
        <span key={t + i} className="flex flex-none items-center">
          <span className="whitespace-nowrap px-[22px] text-[19px] font-bold tracking-[-0.3px] text-light-dark">
            {t}
          </span>
          <span className="mb-[3px] h-[5px] w-[5px] flex-none rounded-full bg-teal" />
        </span>
      ))}
    </div>
  );
}

export default function TrustMarquee() {
  return (
    <section className="border-t border-white/6 bg-charcoal py-[34px]">
      <div className="mb-[22px] text-center">
        <span className="text-[12.5px] font-bold tracking-[2px] text-muted-2">
          BUILT FOR EVENTS LIKE
        </span>
      </div>
      <div className="mask-x relative overflow-hidden">
        <div className="marquee-track flex w-max">
          <Group />
          <div aria-hidden="true">
            <Group />
          </div>
        </div>
      </div>
    </section>
  );
}
