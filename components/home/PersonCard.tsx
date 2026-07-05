import Image from "next/image";
import type { Person } from "@/lib/people";

export default function PersonCard({ p }: { p: Person }) {
  return (
    <div className="mb-4 rounded-[16px] border border-border bg-cream p-4 shadow-[0_8px_20px_rgba(13,36,68,0.05)]">
      <div className="flex items-center gap-3">
        <div className="relative flex-none">
          <Image
            src={p.face}
            alt=""
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          {p.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-cream bg-live" />
          )}
        </div>
        <div className="min-w-0 flex-1 leading-[1.3]">
          <div className="truncate text-[15px] font-extrabold text-ink-text">
            {p.name}
          </div>
          <div className="truncate text-[12.5px] font-semibold text-body">
            {p.role}
          </div>
          <div className="truncate text-[12px] text-muted">{p.company}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="inline-flex items-center whitespace-nowrap rounded-full bg-[rgba(11,42,74,0.06)] px-[11px] py-[5px] text-[11.5px] font-bold leading-none text-[#26231a]">
          {p.industry}
        </span>
        <span className="inline-flex items-center justify-center rounded-[9px] bg-teal px-[15px] py-[6px] text-[12px] font-bold leading-none text-ink">
          Connect
        </span>
      </div>
    </div>
  );
}
