"use client";

import { useState } from "react";
import Image from "next/image";
import { links } from "@/lib/links";

const NAV_LINKS = [
  { href: "/#how", label: "How it works" },
  { href: "/#directory", label: "The room" },
  { href: "/#signalscore", label: "signalscore" },
  { href: "/#usecases", label: "Use cases" },
  { href: "/#cities", label: "Cities" },
  { href: "/#organizers", label: "For organizers" },
] as const;

function SignalScoreLabel() {
  return (
    <>
      Signal<span className="font-bold">Score</span>
      <span className="relative -top-[0.32em] ml-[0.5px] inline-block text-[0.7em] font-bold">
        ™
      </span>
    </>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[rgba(10,10,11,0.9)] backdrop-blur-[14px]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-5 py-[15px] md:px-7">
        <a href="/#top" className="flex items-center" aria-label="LiveConnect home">
          <Image
            src="/assets/liveconnect_clr_w.svg"
            alt="LiveConnect"
            width={150}
            height={30}
            priority
            style={{ height: 30, width: "auto" }}
          />
        </a>

        {/* Center links (desktop) */}
        <nav className="hidden items-center gap-[30px] lg:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-display text-[15px] font-normal text-light-dark transition-colors hover:text-teal"
            >
              {l.label === "signalscore" ? <SignalScoreLabel /> : l.label}
            </a>
          ))}
        </nav>

        {/* Right actions (desktop) */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={links.signIn}
            className="font-display text-[15px] font-bold text-cream transition-colors hover:text-teal"
          >
            Sign in
          </a>
          <a
            href={links.getStarted}
            className="inline-flex items-center justify-center rounded-full bg-teal px-5 py-[11px] font-display text-[15px] font-bold leading-none text-ink shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5"
          >
            Get started
          </a>
        </div>

        {/* Hamburger (mobile) */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-cream lg:hidden"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile slide-down menu */}
      {open && (
        <div className="border-t border-white/8 bg-[rgba(10,10,11,0.97)] px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 font-display text-[16px] font-medium text-light-dark hover:bg-white/5"
              >
                {l.label === "signalscore" ? <SignalScoreLabel /> : l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-3 border-t border-white/8 pt-4">
              <a
                href={links.signIn}
                className="rounded-full border border-white/20 py-3 text-center font-display text-[15px] font-bold text-cream"
              >
                Sign in
              </a>
              <a
                href={links.getStarted}
                className="rounded-full bg-teal py-3 text-center font-display text-[15px] font-bold text-ink"
              >
                Get started
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
