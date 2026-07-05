"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "@/components/icons";

const EVENT_TYPES = [
  "Conference or summit",
  "Corporate gathering",
  "Trade show or expo",
  "Chamber or member network",
  "Fundraiser or charity event",
  "Something else",
];

const FALLBACK_MAILTO =
  "mailto:graham@madebysprint.com,isabel.cable@accessfortworth.com";

type Status = "idle" | "submitting" | "sent" | "error";

const labelCls = "text-[13px] font-bold text-[#3a3a30]";
const fieldCls =
  "w-full rounded-[11px] border-[1.5px] border-border bg-white px-[15px] py-[13px] text-[15px] text-ink-text";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="mt-[26px] flex items-start gap-[14px] rounded-[16px] border border-border bg-white p-[26px]">
        <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-teal">
          <CheckCircle size={18} className="text-ink" strokeWidth={3} />
        </span>
        <div>
          <div className="font-display text-[18px] font-normal text-ink-text">
            Thanks, your message is on its way
          </div>
          <p className="mt-2 text-[14px] leading-[1.5] text-body">
            Our team will get back to you within one business day. If you need
            us sooner, email us directly at{" "}
            <a
              href={FALLBACK_MAILTO}
              className="font-bold text-[#0a8f5f]"
            >
              graham@madebysprint.com
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-[26px] flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <label className="flex flex-col gap-[7px]">
          <span className={labelCls}>Full name</span>
          <input name="name" type="text" required placeholder="Jane Doe" className={fieldCls} />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className={labelCls}>Work email</span>
          <input name="email" type="email" required placeholder="you@org.com" className={fieldCls} />
        </label>
      </div>
      <div className="grid grid-cols-1 gap-[14px] sm:grid-cols-2">
        <label className="flex flex-col gap-[7px]">
          <span className={labelCls}>Organization</span>
          <input name="org" type="text" placeholder="Your company or chamber" className={fieldCls} />
        </label>
        <label className="flex flex-col gap-[7px]">
          <span className={labelCls}>Event type</span>
          <select name="etype" className={fieldCls} defaultValue={EVENT_TYPES[0]}>
            {EVENT_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-[7px]">
        <span className={labelCls}>How can we help?</span>
        <textarea
          name="message"
          rows={4}
          placeholder="Tell us about your events and what you're looking for."
          className={`${fieldCls} resize-y`}
        />
      </label>

      {status === "error" && (
        <p className="text-[13px] font-semibold text-[#b3402f]">
          Something went wrong sending your message. Please email us directly at{" "}
          <a href={FALLBACK_MAILTO} className="underline">
            graham@madebysprint.com
          </a>
          .
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-1 flex w-full items-center justify-center gap-[9px] rounded-[12px] bg-teal py-[15px] font-display text-[16px] font-normal leading-none text-ink shadow-[0_12px_26px_rgba(8,200,136,0.3)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? "Sending…" : "Send to our team"}
        {status !== "submitting" && <ArrowRight />}
      </button>
      <p className="mt-1.5 text-[12.5px] leading-[1.5] text-muted-2">
        You&apos;ll hear back within 24 hours from a LiveConnect representative.
      </p>
    </form>
  );
}
