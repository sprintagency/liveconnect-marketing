import { wallA, wallB, wallC, type Person } from "@/lib/people";
import PersonCard from "./PersonCard";
import { Search } from "@/components/icons";

function Column({
  people,
  anim,
  className = "",
}: {
  people: Person[];
  anim: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col ${anim} ${className}`}>
      {[...people, ...people].map((p, i) => (
        <PersonCard key={p.name + i} p={p} />
      ))}
    </div>
  );
}

export default function DirectoryWall() {
  return (
    <section
      id="directory"
      className="px-5 py-16 md:px-7 md:py-24"
      style={{ background: "linear-gradient(180deg,#e9e4da,#e3ddd1)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2 text-[12.5px] font-extrabold tracking-[2px] text-teal">
              <span className="h-2 w-2 rounded-full bg-live shadow-[0_0_0_4px_rgba(55,214,122,0.2)]" />
              LIVE · 238 IN THE ROOM
            </div>
            <h2 className="mt-[14px] font-display text-[32px] font-normal tracking-[-1px] text-ink-text md:text-[44px]">
              See who&apos;s in the room
            </h2>
            <p className="mt-4 text-[17px] leading-[1.55] text-body md:text-[18px]">
              Real people, really here, updated the moment they check in. This
              is what the directory looks like from your phone.
            </p>
          </div>
          <div className="flex min-w-[280px] items-center gap-[10px] rounded-full border border-border-2 bg-cream px-[18px] py-3 text-[15px] font-medium text-muted">
            <Search size={18} strokeWidth={2} />
            Search by name, company, or role
          </div>
        </div>

        <div className="mask-y relative mt-11 grid h-[660px] grid-cols-1 gap-5 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          <Column people={wallA} anim="wall-col-a" />
          <Column people={wallB} anim="wall-col-b" className="hidden sm:flex" />
          <Column people={wallC} anim="wall-col-c" className="hidden lg:flex" />
        </div>
      </div>
    </section>
  );
}
