# LiveConnect — Brand & Build Style Guide

A complete, self-contained spec for building a **new** website in the exact visual
style of **liveconnectusa.com**. Hand this whole `brand-kit/` folder to a fresh
Claude Code session; everything needed (tokens, typography rules, component
recipes, logos, fonts) is here. Copy values verbatim — the look depends on the
details (especially the typography rules in §3).

- **Logos**: `brand-kit/logos/` (see §11 for which is which)
- **Fonts**: `brand-kit/fonts/` (for OG image generation / offline use)
- **The whole stylesheet to copy**: §5

---

## 1. Brand in one line

Stark **cream + near-black enterprise** palette (Uber-like restraint) with a single
**teal** accent used sparingly — primary buttons, eyebrows, active states, live
dots. Avoid large teal fills. Display type is **Nexa** (light, tight, confident);
body/UI is **Montserrat**. Dark sections use a warm near-black gradient, not pure
black. Rounded corners everywhere (14–30px). Soft, low, warm shadows.

Voice: plain, direct, benefit-first. Short sentences. No hype words, no jargon.

---

## 2. Tech stack (what the reference site uses)

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**
- **Tailwind CSS v4** (CSS-first config via `@theme` in the stylesheet — there is
  **no `tailwind.config.js`**; tokens are CSS variables)
- Fonts: **Montserrat** via `next/font/google`; **Nexa** via a licensed Adobe
  Fonts (Typekit) `<link>` in the `<head>`
- Icons: hand-rolled inline SVG components (stroke style, see §9)
- Deploy: Vercel

You can rebuild the same look in any framework — the design system is plain CSS +
utility classes. If not using Tailwind, translate the utilities to equivalent CSS
using the tokens in §4.

---

## 3. Typography — READ THIS, it's the make-or-break

Three rules give the site its "designed" feel. Skipping them is why generated
sites look off.

### 3a. Two families
| Role | Family | Notes |
|---|---|---|
| Display (h1–h4, numbers, wordmarks, CTA labels) | **Nexa** | Used at `font-weight: 400` ("normal") for that light, airy display look. Falls back to Montserrat. |
| Body, paragraphs, UI, chips, form fields | **Montserrat** | Weights 400/500/600/700/800. |

- Tailwind classes: `font-display` (Nexa) and the default body font (Montserrat).
- **Headings use `font-normal` (400), not bold** — Nexa at 400 is the signature look.
  Only wordmarks mix weights (e.g. "Signal**Score**": normal + bold).

### 3b. Tight line-height on display type
Headings must be **`line-height: 1.08`** by default (set once on `h1–h4` in base
CSS — see §5). Browser-default 1.5 on a 44px heading looks amateur. Hero/large
display can go tighter (`1.02–1.05`). Body copy is **`1.5`** (never 1.6+).

Spacing rhythm (eyebrow → heading → paragraph):
- eyebrow label → `mt-[14px]` → heading
- heading → `mt-4` to `mt-[26px]` → paragraph (bigger gap under bigger headings)
- card title → body: `mb-[10px]` (give titles breathing room; cramped = undesigned)

### 3c. Optical vertical-centering via `text-box-trim` (the secret sauce)
Nexa renders glyphs **above** the line-box center, so text in buttons/pills/chips
looks too high without help. The fix, applied globally (see §5):

```css
@supports (text-box-trim: trim-both) {
  h1,h2,h3,h4,p,li,a,span,button,label,input,select,textarea,.font-display {
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
  }
  /* MUST opt out anything inside overflow:hidden, or descenders (y,g,p) clip */
  .no-trim, .truncate { text-box-trim: none; }
}
```

This lets you use plain **symmetric padding** on buttons/chips (e.g. `py-[11px]`)
and have the text land centered — no per-element padding hacks.

**Gotchas (both learned the hard way):**
- Any trimmed element inside `overflow:hidden` (marquees, `truncate` names) will
  have its descenders clipped. Add `no-trim` (or rely on the `.truncate` opt-out).
- `text-box-trim: normal` is **invalid** — the reset value is `none`.

---

## 4. Color tokens

Copy the `@theme` block from §5. Reference:

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#14130d` | Text on teal buttons, darkest ink |
| `ink-text` | `#1a1912` | Primary text on light surfaces |
| `charcoal` | `#16150f` | Dark section bg, phone body |
| `charcoal-2` | `#1b1a13` | CTA band bg |
| `charcoal-3` | `#201d15` | Dark cards / gradient stop |
| `nav` | `#0a0a0b` | Nav bar bg |
| `footer` | `#100f0a` | Footer bg |
| `cream` | `#f4f0e8` | **Primary page bg**, light cards |
| `cream-2` | `#e9e4da` | Alt section bg |
| `cream-3` | `#e3ddd1` | Alt section bg (darker) |
| `border` | `#ddd6c8` | Borders on light cards/inputs |
| `border-2` | `#dbd4c6` | Alt border |
| `body` | `#7a7468` | Body copy on light |
| `muted` / `muted-2` | `#a29c8e` / `#928c7f` | Secondary/tertiary text |
| `on-dark` / `on-dark-2` | `#aaa497` / `#b1aa9c` | Body copy on dark |
| `light-dark` / `light-dark-2` | `#cec7b8` / `#d9d3c6` | Nav links, list text on dark |
| **`teal`** | **`#08c888`** | **Primary accent** — buttons, eyebrows, active |
| `teal-dark` | `#05a870` | CTA gradient end |
| `live` | `#37d67a` | Online / presence dots |

**Signature gradients**
- Dark hero: `linear-gradient(165deg,#16150f 0%,#201d15 52%,#16150f 100%)`
- Dark section: `linear-gradient(180deg,#201d15,#16150f)`
- Ambient glow (absolute, behind content): `radial-gradient(circle,rgba(8,200,136,0.12),transparent 62%)` on a large blurred circle, top-right or bottom-left.
- Light alt sections: `linear-gradient(180deg,#e9e4da,#e3ddd1)`

**Shadows** (warm, low, soft): teal CTA glow `0 16px 34px rgba(8,200,136,0.42)`;
card `0 12px 30px rgba(13,36,68,0.06)`; dark elevation `0 40px 80px rgba(3,12,26,0.55)`.

---

## 5. The stylesheet — copy verbatim (`app/globals.css`)

This is the entire backbone: Tailwind v4 import, tokens, base rules, the
text-box-trim system, all keyframes, animation classes, edge masks, and
reduced-motion. Copy it as-is into your project's global stylesheet.

```css
@import "tailwindcss";

/* ============================================================
   Design tokens. Stark cream + near-black; teal as accent.
   ============================================================ */
@theme {
  --color-ink: #14130d;
  --color-ink-text: #1a1912;
  --color-charcoal: #16150f;
  --color-charcoal-2: #1b1a13;
  --color-charcoal-3: #201d15;
  --color-nav: #0a0a0b;
  --color-footer: #100f0a;

  --color-cream: #f4f0e8;
  --color-cream-2: #e9e4da;
  --color-cream-3: #e3ddd1;

  --color-border: #ddd6c8;
  --color-border-2: #dbd4c6;

  --color-body: #7a7468;
  --color-muted: #a29c8e;
  --color-muted-2: #928c7f;
  --color-on-dark: #aaa497;
  --color-on-dark-2: #b1aa9c;
  --color-light-dark: #cec7b8;
  --color-light-dark-2: #d9d3c6;

  --color-teal: #08c888;
  --color-teal-dark: #05a870;
  --color-live: #37d67a;

  --font-display: "nexa", var(--font-montserrat), "Montserrat", sans-serif;
  --font-body: var(--font-montserrat), "Montserrat", sans-serif;
}

@layer base {
  html { scroll-behavior: smooth; }
  body {
    background: var(--color-cream);
    color: var(--color-ink-text);
    font-family: var(--font-body);
    -webkit-font-smoothing: antialiased;
  }
  h1, h2, h3, h4 {
    text-wrap: balance;
    line-height: 1.08; /* tight display leading; utilities override */
  }
  p, li { text-wrap: pretty; }
  a { color: inherit; text-decoration: none; }
  input, textarea, select { font-family: var(--font-body); }
  input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--color-teal) !important;
    box-shadow: 0 0 0 3px rgba(8, 200, 136, 0.18) !important;
  }
  ::placeholder { color: var(--color-muted); }
}

/* ============================================================
   Optical vertical-centering. Nexa sits high in the line box;
   trim to cap-height/baseline so symmetric padding centers glyphs.
   ============================================================ */
@supports (text-box-trim: trim-both) {
  h1, h2, h3, h4, p, li, a, span, button, label, input, select, textarea,
  .font-display {
    text-box-trim: trim-both;
    text-box-edge: cap alphabetic;
  }
  /* Opt out inside overflow:hidden or descenders (y,g,p) get clipped. */
  .no-trim, .truncate { text-box-trim: none; }
}

/* ============================================================
   Keyframes
   ============================================================ */
@keyframes lcpulse {
  0% { transform: scale(0.9); opacity: 0.9; }
  70% { transform: scale(2.4); opacity: 0; }
  100% { opacity: 0; }
}
@keyframes lcfloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes lcUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
@keyframes lcDown {
  0% { transform: translateY(-50%); }
  100% { transform: translateY(0); }
}
@keyframes lcMarqueeX {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes lcLiveGlow {
  0%, 100% {
    box-shadow: 0 0 0 1px rgba(8,200,136,0.55), 0 0 14px 0 rgba(8,200,136,0.35);
  }
  50% {
    box-shadow: 0 0 0 1px rgba(8,200,136,0.9), 0 0 26px 4px rgba(8,200,136,0.6);
  }
}
@keyframes lcLiveDot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(55,214,122,0.55); opacity: 1; }
  50% { box-shadow: 0 0 10px 2px rgba(55,214,122,0.9); opacity: 0.85; }
}

.anim-float { animation: lcfloat 6s ease-in-out infinite; }
.anim-pulse { animation: lcpulse 2s ease-out infinite; }
.live-chip { animation: lcLiveGlow 2.6s ease-in-out infinite; }
.live-chip-dot { animation: lcLiveDot 2.6s ease-in-out infinite; }
.marquee-track { animation: lcMarqueeX 42s linear infinite; }
.wall-col-a { animation: lcUp 55s linear infinite; will-change: transform; }
.wall-col-b { animation: lcDown 67s linear infinite; will-change: transform; }
.wall-col-c { animation: lcUp 47s linear infinite; will-change: transform; }

/* Edge-fade masks (marquee L/R, scrolling wall T/B) */
.mask-x {
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
}
.mask-y {
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 13%, #000 87%, transparent 100%);
}

@media (prefers-reduced-motion: reduce) {
  .anim-float, .anim-pulse, .live-chip, .live-chip-dot,
  .marquee-track, .wall-col-a, .wall-col-b, .wall-col-c {
    animation: none !important;
  }
}
```

---

## 6. Font wiring (Next.js example)

**`app/layout.tsx`** — Montserrat via `next/font`, Nexa via Typekit link:

```tsx
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link rel="preconnect" href="https://use.typekit.net" />
        <link rel="preconnect" href="https://p.typekit.net" />
        {/* Replace with YOUR Adobe Fonts (Typekit) Nexa kit URL */}
        <link rel="stylesheet" href="https://use.typekit.net/own8wil.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

> **Nexa licensing:** Nexa is a commercial font. The reference site loads it from a
> licensed Adobe Fonts kit (`use.typekit.net/own8wil.css`). For a new project, use
> **your own** Typekit kit that includes Nexa. The `brand-kit/fonts/*.woff` files
> here are for **build-time OG image rendering only** (see §12) — do not self-host
> them on the web without a license. If you have no Nexa license, the stack falls
> back to Montserrat cleanly (headings just render in Montserrat 400).

---

## 7. Layout conventions

- Content max width: **`max-width: 1200px`** (some centered text blocks 680–920px),
  centered with `mx-auto`.
- Section padding: `px-5 py-16` on mobile, `md:px-7 md:py-24` on desktop
  (dark feature sections sometimes `py-[100px]`).
- Primary responsive breakpoint is **`lg`** (desktop two-column layouts); below
  that, stack to one column.
- Two-column hero/feature grids: `grid lg:grid-cols-[1.05fr_0.95fr]` or `lg:grid-cols-2`, `gap-14`.
- Corner radii: cards `20–24px`, big panels `26–30px`, phones `40–44px`, pills `999px`, small chips `8–12px`.

---

## 8. Component recipes (Tailwind classes)

**Eyebrow label** (above every section heading):
```html
<div class="text-[12.5px] font-extrabold tracking-[2px] text-teal">FULL-FEATURED</div>
```

**Section heading + intro**:
```html
<h2 class="mt-[14px] font-display text-[32px] font-normal tracking-[-1px] text-ink-text md:text-[44px]">
  Everything you need to work the room
</h2>
<p class="mt-4 text-[17px] leading-[1.5] text-body md:text-[18px]">…</p>
```

**Primary button** (teal, ink text, glow, lift on hover):
```html
<a class="inline-flex items-center gap-[10px] rounded-full bg-teal px-7 py-[16px]
          text-[16px] font-bold leading-none text-ink
          shadow-[0_16px_34px_rgba(8,200,136,0.42)]
          transition-transform hover:-translate-y-0.5">Get started free →</a>
```

**Secondary button** (glass on dark):
```html
<a class="inline-flex items-center justify-center rounded-full border border-white/20
          bg-white/8 px-[26px] py-[16px] text-[16px] font-bold leading-none text-cream
          transition-colors hover:bg-white/12">See how it works</a>
```

**Feature card** (light):
```html
<div class="rounded-[20px] border border-border px-[26px] py-[30px]">
  <div class="flex h-[50px] w-[50px] items-center justify-center rounded-[13px] bg-teal/10 text-teal">
    <!-- icon -->
  </div>
  <h3 class="mb-[10px] mt-[18px] font-display text-[19px] font-normal leading-[1.2] text-ink-text">Title</h3>
  <p class="text-[15px] leading-[1.5] text-body">Body copy.</p>
</div>
```

**Static "info" chip** (looks like a label, NOT an input — icon + muted text on surface):
```html
<div class="flex items-center gap-[9px] text-[14px] font-semibold text-muted-2">
  <!-- search icon --> Search by name, company, or role
</div>
```

**Neutral pill / tag**:
```html
<span class="inline-flex items-center justify-center rounded-full border border-white/15
             bg-white/6 px-5 py-[11px] text-[15px] font-semibold leading-none text-light-dark">Dallas</span>
```

**Live "glowing + pulsing" chip** (the signature accent — dark inner, teal glow, pulsing green dot, light teal text):
```html
<span class="live-chip inline-flex items-center gap-[9px] rounded-full border border-teal/60
             bg-[#0f1a14] px-5 py-[11px] text-[15px] font-bold leading-none text-teal">
  <span class="live-chip-dot h-2 w-2 rounded-full bg-live"></span>
  Fort Worth · Live
</span>
```

**Nav** (sticky, blurred near-black, Nexa links):
```html
<header class="sticky top-0 z-50 border-b border-white/8 bg-[rgba(10,10,11,0.9)] backdrop-blur-[14px]">
  <!-- links: font-display text-[15px] font-normal text-light-dark hover:text-teal -->
  <!-- CTA:  rounded-full bg-teal px-5 py-[11px] font-display text-[15px] font-bold text-ink -->
</header>
```
> Nav text is **Nexa** (`font-display`) — links, "Sign in", and the "Get started" button.

**Presence dot** (live indicator with ring):
```html
<span class="h-2 w-2 rounded-full bg-live shadow-[0_0_0_4px_rgba(55,214,122,0.25)]"></span>
```

Recurring motifs: numbered step badges (`rounded-[15px]`, Nexa number), a phone
mockup with animated screens, a scrolling "directory wall" (3 columns, `mask-y`,
`wall-col-a/b/c`), and a horizontal "BUILT FOR EVENTS LIKE" marquee (`marquee-track`,
`mask-x`, remember `no-trim` on the text).

---

## 9. Icons

Inline SVG React components, `viewBox="0 0 24 24"`, `fill="none"`,
`stroke="currentColor"`, `stroke-width: 2` (2.4 for arrows/checks),
round line caps/joins. So icons inherit `text-*` color (usually `text-teal`).
Set used on the reference site: Arrow, Search, Users, UsersPlus, Bolt (filled),
Broadcast, Message, IdCard, Mic, PlusCircle, Lock, Star, Download, Wifi,
CheckCircle. Use [lucide](https://lucide.dev) equivalents or copy the same paths —
the visual weight (2px round stroke) is what matters.

---

## 10. Motion

Subtle and slow. Use the classes from §5:
- `anim-float` (6s) — floating cards; `anim-pulse` (2s) — expanding ring on a dot.
- `live-chip` + `live-chip-dot` — the glowing live pill.
- `marquee-track` (42s) — horizontal logo/word marquee (duplicate content, translateX -50%).
- `wall-col-a/b/c` — infinite vertical scroll columns (duplicate list, translateY -50%).
- Hover: `hover:-translate-y-0.5` lift on buttons; color fades on links.
- **Always** respect `prefers-reduced-motion` (the block in §5 disables all of these).

---

## 11. Assets (`brand-kit/logos/`)

| File | What it is | Use on |
|---|---|---|
| `liveconnect_clr_w.svg` | Full logo (pin + wordmark), **light** version | dark backgrounds (nav, footer, hero) |
| `liveconnect_clr_drk.svg` | Full logo, **dark** version | light/cream backgrounds |
| `live_connect_white.svg` | White monochrome logo | dark, single-color contexts |
| `live_connect_lockup.svg` | Alternate lockup | flexible |
| `signal_score_logo.svg` | "SignalScore™" wordmark | product feature section |
| `signal_score_W.svg` | SignalScore wordmark, light | dark sections |
| `favicon.svg` / `icon.svg` | Favicon / app icon (teal pin) | browser tab / `app/icon.svg` |

Logos keep aspect ratio: set a fixed `height` and `width:auto` (e.g. nav logo
`height:30px`). Photography on the reference site (event crowds, headshots) is
project-specific stock — **swap in your own imagery**; keep the treatment (cover
crop, dark gradient overlay `linear-gradient(to top,rgba(6,18,34,0.92),…transparent)`
for text legibility, rounded `22px` corners).

---

## 12. Open Graph / social image

Generated at build with `next/og` (`ImageResponse`), 1200×630, Node runtime,
reading local font + image files. The design: dark brand gradient (left) with a
**Nexa** headline + subhead, event photo (right) under a left-fade gradient, and a
glassy "N people here now" pill top-right. Fonts are read from disk
(`brand-kit/fonts/Nexa-Light.woff` as Nexa 400, `Montserrat-400.ttf` /
`Montserrat-700.ttf`) and passed to `ImageResponse({ fonts: [...] })`.

Key implementation notes:
- File conventions: `app/opengraph-image.tsx` (+ `app/twitter-image.tsx` that
  re-exports `{ default, alt, size, contentType }`).
- Inside `ImageResponse` you **must** use `<img>` (not `next/image`), every element
  with >1 child needs `display:flex`, and images are embedded as base64 data URIs
  read from disk with `node:fs/promises`.
- `export const size = { width: 1200, height: 630 }`, `contentType = "image/png"`.
- Add `twitter: { card: "summary_large_image", … }` to root `metadata`.

(The reference project's `app/opengraph-image.tsx` is a working copy of this pattern.)

---

## 13. Quick-start checklist for the new site

1. Scaffold Next.js 16 + Tailwind v4 + TS.
2. Paste §5 into `app/globals.css`. Wire fonts per §6 (use your own Nexa Typekit kit).
3. Drop `brand-kit/logos/*` into `public/assets/` and set `app/icon.svg` + `public/favicon.svg`.
4. Build sections using §8 recipes; obey the typography rules in §3 (leading 1.08 headings / 1.5 body; `text-box-trim`; `no-trim` inside overflow).
5. Add the OG image per §12 (fonts from `brand-kit/fonts/`).
6. Keep teal for accents only; use the gradients/shadows from §4; respect reduced motion.
