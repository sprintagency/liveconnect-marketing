import Image from "next/image";
import { links } from "@/lib/links";

const PRODUCT = [
  { href: "/#how", label: "How it works" },
  { href: "/#directory", label: "The room" },
  { href: "/#usecases", label: "Use cases" },
  { href: "/#cities", label: "Cities" },
];

const COMPANY = [
  { href: "/#organizers", label: "For organizers" },
  { href: "/#", label: "About" },
  { href: "/#", label: "Privacy" },
  { href: links.contact, label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-footer px-5 pb-10 pt-14 text-[#8ba0ba] md:px-7">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap justify-between gap-10">
          <div className="max-w-[300px]">
            <Image
              src="/assets/liveconnect_clr_w.svg"
              alt="LiveConnect"
              width={140}
              height={28}
              style={{ height: 28, width: "auto" }}
            />
            <p className="mt-4 text-[14.5px] leading-[1.4]">
              The live networking app that turns every event into an open room.
              Build connections. Meet the room.
            </p>
          </div>
          <div className="flex flex-wrap gap-16">
            <div>
              <div className="text-[12.5px] font-extrabold tracking-[1.5px] text-cream">
                PRODUCT
              </div>
              <div className="mt-4 flex flex-col gap-[11px] text-[14.5px]">
                {PRODUCT.map((l) => (
                  <a key={l.label} href={l.href} className="hover:text-cream">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[12.5px] font-extrabold tracking-[1.5px] text-cream">
                COMPANY
              </div>
              <div className="mt-4 flex flex-col gap-[11px] text-[14.5px]">
                {COMPANY.map((l) => (
                  <a key={l.label} href={l.href} className="hover:text-cream">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
          <span className="text-[13.5px]">
            © 2026 Live Connect. All rights reserved.
          </span>
          <div className="flex items-center gap-[11px] text-[13px]">
            <span>Built by</span>
            <Image
              src="/assets/sprint-logo.svg"
              alt="Sprint"
              width={70}
              height={19}
              style={{ height: 19, width: "auto" }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
