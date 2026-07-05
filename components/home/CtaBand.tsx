import { links } from "@/lib/links";

export default function CtaBand() {
  return (
    <section id="cta" className="bg-cream-2 px-5 pb-[88px] pt-5 md:px-7">
      <div className="relative mx-auto max-w-[1120px] overflow-hidden rounded-[30px] bg-charcoal-2 px-6 py-14 text-center shadow-[0_30px_72px_rgba(0,0,0,0.4)] md:px-12 md:py-[66px]">
        <div className="pointer-events-none absolute -left-10 -top-20 h-[300px] w-[300px] rounded-full bg-white/10" />
        <div className="relative">
          <h2 className="font-display text-[34px] font-normal tracking-[-1px] text-cream md:text-[46px]">
            Ready to meet the room?
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[17px] leading-[1.5] text-white/92 md:text-[18px]">
            Create your profile in under a minute, then pull it up at your next
            event.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-[14px]">
            <a
              href={links.getStarted}
              className="inline-flex items-center justify-center rounded-full bg-teal px-[30px] py-[16px] text-[16px] font-extrabold leading-none text-ink shadow-[0_14px_30px_rgba(8,200,136,0.32)] transition-transform hover:-translate-y-0.5"
            >
              Get started free
            </a>
            <a
              href={links.contact}
              className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/15 px-7 py-[16px] text-[16px] font-bold leading-none text-cream transition-colors hover:bg-white/25"
            >
              I&apos;m an organizer
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
