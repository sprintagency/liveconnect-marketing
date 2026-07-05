import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle } from "@/components/icons";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Talk to our team",
  description:
    "Bring LiveConnect to your events. Tell us about your organization and we'll set you up with a white-label room of your own.",
};

const BENEFITS = [
  "Your branding, from splash screen to profile card",
  "Live check in, exports, and attendance stats",
  "A dedicated contact on our team",
];

export default function ContactPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.92fr_1.08fr]">
      {/* Left value panel */}
      <div
        className="relative flex flex-col justify-between overflow-hidden px-8 py-12 text-cream md:px-[52px] md:py-[48px]"
        style={{
          background:
            "linear-gradient(165deg,#16150f 0%,#100f0a 60%,#0b0b08 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute -bottom-[140px] -left-[100px] h-[460px] w-[460px] rounded-full"
          style={{
            background:
              "radial-gradient(circle,rgba(8,200,136,0.15),transparent 62%)",
          }}
        />
        <a href="/" className="relative inline-flex items-center">
          <Image
            src="/assets/liveconnect_clr_w.svg"
            alt="LiveConnect"
            width={150}
            height={30}
            style={{ height: 30, width: "auto" }}
          />
        </a>
        <div className="relative mt-12 max-w-[420px] lg:mt-0">
          <div className="text-[12.5px] font-extrabold tracking-[2px] text-teal">
            FOR ORGANIZERS
          </div>
          <h1 className="mt-[14px] font-display text-[32px] font-normal leading-[1.14] tracking-[-1px] md:text-[40px]">
            Let&apos;s bring LiveConnect to your events.
          </h1>
          <p className="mt-5 text-[17px] leading-[1.4] text-on-dark">
            Tell us about your organization and the events you run. Our team will
            get you set up with a white label room of your own, usually within a
            few days.
          </p>
          <div className="mt-[34px] flex flex-col gap-4">
            {BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-3 text-[15px] text-light-dark-2">
                <CheckCircle size={20} className="flex-none text-teal" />
                {b}
              </div>
            ))}
          </div>
        </div>
        <div className="relative hidden lg:block" />
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center bg-cream px-6 py-12 md:px-10">
        <div className="w-full max-w-[460px]">
          <h2 className="font-display text-[30px] font-normal tracking-[-0.5px] text-ink-text">
            Talk to our team
          </h2>
          <p className="mt-[10px] text-[15px] text-body">
            We&apos;ll reply within one business day.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
