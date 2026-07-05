import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";

const TEAL = "#08c888";
const NAVY = "#1a1912";
const INK = "#14130d";
const DISP = "Nexa, var(--font-montserrat), Montserrat, sans-serif";
const MONO = "var(--font-montserrat), Montserrat, sans-serif";

type Dir = "right" | "up" | "scale";

/** Directional enter/exit animation for a card, driven by the active step. */
function anim(idx: number, active: number, seq: number, dir: Dir): CSSProperties {
  let opacity = 1;
  let transform = "translate3d(0,0,0) scale(1)";
  if (idx > active) {
    opacity = 0;
    transform =
      dir === "right"
        ? "translate3d(95px,0,0) scale(.92)"
        : dir === "up"
          ? "translate3d(0,75px,0) scale(.92)"
          : "scale(.7)";
  } else if (idx < active) {
    opacity = 0;
    transform =
      dir === "right"
        ? "translate3d(-75px,0,0) scale(.92)"
        : dir === "up"
          ? "translate3d(0,-85px,0) scale(.92)"
          : "scale(1.18)";
  }
  return {
    opacity,
    transform,
    transition:
      "transform .6s cubic-bezier(.16,.84,.28,1), opacity .45s ease",
    transitionDelay: `${idx === active ? 0.06 * seq : 0}s`,
    willChange: "transform, opacity",
  };
}

function card(
  idx: number,
  active: number,
  seq: number,
  dir: Dir,
  style: CSSProperties,
  children: ReactNode,
) {
  return (
    <div
      style={{
        position: "absolute",
        boxSizing: "border-box",
        ...style,
        ...anim(idx, active, seq, dir),
      }}
    >
      {children}
    </div>
  );
}

function Check({ size, stroke = "#f4f0e8" }: { size: number; stroke?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={stroke} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l4 4 10-10" />
    </svg>
  );
}

function Qr() {
  const finders = [
    [6, 6],
    [68, 6],
    [6, 68],
  ];
  const mods = [
    [42, 10], [52, 10], [62, 10], [42, 20], [62, 30], [10, 44], [20, 44],
    [10, 54], [30, 54], [44, 44], [54, 50], [64, 44], [74, 54], [44, 64],
    [54, 64], [64, 74], [74, 64], [40, 74], [50, 84], [84, 44], [84, 64], [74, 84],
  ];
  return (
    <svg viewBox="0 0 100 100" width={104} height={104}>
      {finders.map(([x, y]) => (
        <g key={`fp${x}${y}`}>
          <rect x={x} y={y} width={26} height={26} rx={5} fill={NAVY} />
          <rect x={x + 6} y={y + 6} width={14} height={14} rx={2} fill="#f4f0e8" />
          <rect x={x + 9} y={y + 9} width={8} height={8} rx={1.5} fill={NAVY} />
        </g>
      ))}
      {mods.map(([x, y], i) => (
        <rect key={`m${i}`} x={x} y={y} width={7} height={7} rx={1.5} fill={NAVY} />
      ))}
    </svg>
  );
}

function Row({
  active,
  seq,
  face,
  name,
  role,
}: {
  active: number;
  seq: number;
  face: string;
  name: string;
  role: string;
}) {
  return card(1, active, seq, "right", {
    top: 110 + (seq - 2) * 76,
    left: 16,
    right: 16,
    height: 64,
    background: "#f4f0e8",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    gap: 11,
    padding: "0 12px",
    boxShadow: "0 6px 16px rgba(0,0,0,.14)",
  }, (
    <>
      <Image src={face} alt="" width={42} height={42} style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", flex: "none" }} />
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.3 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: NAVY, fontFamily: DISP, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
        <div style={{ fontSize: 11.5, color: "#7a7468", fontFamily: MONO, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{role}</div>
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color: INK, background: TEAL, padding: "7px 14px", borderRadius: 9, fontFamily: MONO, flex: "none", display: "inline-flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>Connect</span>
    </>
  ));
}

function Chip({ label, on }: { label: string; on: boolean }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: on ? INK : "#cec7b8", background: on ? TEAL : "rgba(255,255,255,.08)", border: on ? "none" : "1px solid rgba(255,255,255,.16)", padding: "6px 13px", borderRadius: 999, fontFamily: MONO }}>{label}</span>
  );
}

export default function Phone({ active }: { active: number }) {
  return (
    <div style={{ position: "relative", width: 300, height: 620, background: "#16150f", borderRadius: 44, padding: 11, boxShadow: "0 40px 90px rgba(6,18,34,.5)", flex: "none" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", background: "linear-gradient(180deg,#201d15,#201d15)", borderRadius: 34, overflow: "hidden" }}>
        {/* notch */}
        <div style={{ position: "absolute", top: 11, left: "50%", transform: "translateX(-50%)", width: 116, height: 26, background: "#16150f", borderRadius: 14, zIndex: 6 }} />
        {/* header */}
        <div style={{ position: "absolute", top: 44, left: 0, right: 0, height: 26, display: "flex", alignItems: "center", padding: "0 18px", zIndex: 4 }}>
          <Image src="/assets/liveconnect_clr_w.svg" alt="LiveConnect" width={90} height={17} style={{ height: 17, width: "auto", display: "block" }} />
        </div>
        {/* content */}
        <div style={{ position: "absolute", top: 82, left: 0, right: 0, bottom: 0, pointerEvents: "none" }}>
          {/* Screen 0: check in */}
          {card(0, active, 0, "scale", { top: 24, left: "50%", marginLeft: -72, width: 144, height: 144, background: "#f4f0e8", borderRadius: 22, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 26px rgba(0,0,0,.28)" }, <Qr />)}
          {card(0, active, 1, "up", { top: 180, left: 0, right: 0, textAlign: "center", color: "#aaa497", fontSize: 12.5, fontWeight: 600, fontFamily: MONO }, "Point at the door code")}
          {card(0, active, 2, "scale", { top: 214, left: "50%", marginLeft: -33, width: 66, height: 66, borderRadius: "50%", background: "#37d67a", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 22px rgba(55,214,122,.45)" }, <Check size={34} />)}
          {card(0, active, 3, "up", { top: 294, left: 0, right: 0, textAlign: "center", color: "#f4f0e8", fontSize: 20, fontWeight: 600, fontFamily: DISP }, "You're checked in")}
          {card(0, active, 4, "up", { top: 336, left: 16, right: 16, height: 66, borderRadius: 16, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.14)", display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }, (
            <>
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#37d67a", flex: "none" }} />
              <div style={{ lineHeight: 1.25 }}>
                <div style={{ color: "#f4f0e8", fontWeight: 700, fontSize: 15, fontFamily: DISP }}>238 in the room</div>
                <div style={{ color: "#aaa497", fontSize: 11.5, fontFamily: MONO }}>Access Fort Worth · Live</div>
              </div>
            </>
          ))}

          {/* Screen 1: find who matters */}
          {card(1, active, 0, "up", { top: 14, left: 16, right: 16, height: 44, background: "#f4f0e8", borderRadius: 12, display: "flex", alignItems: "center", gap: 9, padding: "0 14px", boxShadow: "0 6px 16px rgba(0,0,0,.14)" }, (
            <>
              <svg viewBox="0 0 24 24" width={17} height={17} fill="none" stroke="#a29c8e" strokeWidth={2} strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
              <span style={{ color: NAVY, fontSize: 14, fontWeight: 600, fontFamily: MONO }}>Marketing</span>
            </>
          ))}
          {card(1, active, 1, "right", { top: 66, left: 16, right: 16, height: 30, display: "flex", gap: 8 }, (
            <>
              <Chip label="Marketing" on />
              <Chip label="Finance" on={false} />
              <Chip label="Tech" on={false} />
            </>
          ))}
          <Row active={active} seq={2} face="/assets/face-1.png" name="Maya Thompson" role="VP Marketing · Talbot Media" />
          <Row active={active} seq={3} face="/assets/face-3.png" name="Aiko Tanaka" role="Head of Product · Harlow Software" />
          <Row active={active} seq={4} face="/assets/face-6.png" name="Marcus Bell" role="Sales Director · Ellison Health" />

          {/* Screen 2: connect */}
          {card(2, active, 0, "scale", { top: 16, left: 16, right: 16, height: 186, background: "#f4f0e8", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 28px rgba(0,0,0,.2)" }, (
            <>
              <Image src="/assets/face-9.png" alt="" width={66} height={66} style={{ width: 66, height: 66, borderRadius: "50%", objectFit: "cover" }} />
              <div style={{ marginTop: 12, fontSize: 17, fontWeight: 700, color: NAVY, fontFamily: DISP }}>Kevin Park</div>
              <div style={{ marginTop: 3, fontSize: 12.5, color: "#a29c8e", fontFamily: MONO }}>Investment Partner · Summit</div>
              <span style={{ marginTop: 10, fontSize: 11, fontWeight: 700, color: "#26231a", background: "rgba(11,42,74,.06)", padding: "6px 12px", borderRadius: 999, fontFamily: MONO, display: "inline-flex", alignItems: "center", lineHeight: 1 }}>Venture Capital</span>
            </>
          ))}
          {card(2, active, 1, "up", { top: 214, left: 16, right: 16, height: 48, background: TEAL, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, gap: 8, color: INK, fontWeight: 700, fontSize: 15, fontFamily: DISP, boxShadow: "0 10px 22px rgba(8,200,136,.42)" }, (
            <>
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M19 8v6M22 11h-6" /></svg>
              Connect
            </>
          ))}
          {card(2, active, 2, "up", { top: 272, left: 16, right: 16, height: 44, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#f4f0e8", fontWeight: 600, fontSize: 14, fontFamily: MONO }, "Save contact")}
          {card(2, active, 3, "up", { top: 334, left: 16, right: 16, height: 50, background: "#26231a", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, padding: "0 14px", boxShadow: "0 10px 22px rgba(0,0,0,.32)" }, (
            <>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#37d67a", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><Check size={13} /></span>
              <span style={{ color: "#f4f0e8", fontSize: 13, fontWeight: 600, fontFamily: MONO }}>Contact saved to your list</span>
            </>
          ))}
          {card(2, active, 4, "right", { top: 400, left: 42, right: 16, height: 42, background: "#f4f0e8", borderRadius: "14px 14px 14px 4px", display: "flex", alignItems: "center", padding: "0 14px", boxShadow: "0 6px 16px rgba(0,0,0,.16)" }, (
            <span style={{ fontSize: 12.5, color: NAVY, fontFamily: MONO }}>&ldquo;Great meeting you!&rdquo;</span>
          ))}
        </div>
      </div>
    </div>
  );
}
