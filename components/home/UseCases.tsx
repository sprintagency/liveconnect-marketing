import Image from "next/image";

const CASES = [
  {
    img: "event-keynote",
    title: "Conferences & summits",
    body: "Turn a 2,000-seat keynote into a directory you can actually work.",
  },
  {
    img: "event-mixer",
    title: "Corporate gatherings",
    body: "Mixers, galas, and client nights where the right hello changes everything.",
  },
  {
    img: "event-expo",
    title: "Trade shows & expos",
    body: "Find buyers and partners on the floor before you walk past their booth.",
  },
  {
    img: "event-hero",
    title: "Chambers & mixers",
    body: "Recurring community events where members finally know who else showed up.",
  },
];

export default function UseCases() {
  return (
    <section
      id="usecases"
      className="px-5 py-16 text-cream md:px-7 md:py-24"
      style={{ background: "linear-gradient(180deg,#201d15,#16150f)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-[700px] text-center">
          <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
            USE CASES
          </div>
          <h2 className="mt-[14px] font-display text-[32px] font-normal tracking-[-1px] md:text-[44px]">
            Built for every kind of room
          </h2>
          <p className="mt-6 text-[17px] leading-[1.4] text-on-dark-2 md:text-[18px]">
            Wherever people gather to do business, Live Connect makes the room
            searchable.
          </p>
        </div>

        <div className="mt-[52px] grid grid-cols-1 gap-[22px] md:grid-cols-2">
          {CASES.map((c) => (
            <div
              key={c.title}
              className="relative h-[300px] overflow-hidden rounded-[22px] border border-white/8"
            >
              <Image
                src={`/assets/${c.img}.png`}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 100vw, 590px"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(6,18,34,0.92),rgba(6,18,34,0.15) 60%,transparent)",
                }}
              />
              <div className="absolute bottom-6 left-[26px] right-[26px]">
                <h3 className="font-display text-[24px] font-normal leading-[1.15]">
                  {c.title}
                </h3>
                <p className="mt-[14px] text-[15px] leading-[1.4] text-light-dark">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
