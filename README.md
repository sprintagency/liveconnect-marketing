# LiveConnect — Marketing Site

The public marketing/sales site for LiveConnect (`www.liveconnectusa.com` + apex).
Standalone Next.js app, **fully isolated** from the product app: no database, no
auth, no shared deployment. Built from the design handoff in
`design_handoff_liveconnect`.

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (design tokens in `app/globals.css`)
- Fonts: Inter (`next/font`), Nexa (licensed, via Adobe Fonts / Typekit)
- Resend for the contact form email

## Pages

- `/` — home (hero, event marquee, scroll-pinned "how it works" phone, live
  directory wall, features, SignalScore, live screen, use cases, white-label,
  cities, CTA)
- `/contact` — "Talk to our team" form → `POST /api/contact` (Resend)

## Local dev

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev
```

## Auth / the master account

Sign-up and sign-in are **not** in this project. They live on the product app at
`app.liveconnectusa.com`, where the cross-subdomain SSO cookie (scoped to
`.liveconnectusa.com`) and Supabase auth already exist. The nav / hero / CTA
buttons deep-link there via `NEXT_PUBLIC_APP_URL` (`lib/links.ts`).

## Deploy (its own Vercel project)

This is a **separate** Vercel project from the product app, so deploys here never
touch the app or its database.

1. Create a new Vercel project pointed at this repo.
2. Set env vars (see `.env.example`): `RESEND_API_KEY`, `CONTACT_FROM`,
   `CONTACT_TO`, `NEXT_PUBLIC_APP_URL`.
3. Assign domains `www.liveconnectusa.com` + apex `liveconnectusa.com` to this
   project. Tenant subdomains (`*.liveconnectusa.com`) and `app.` stay on the
   product app's Vercel project.

## Notes / TODO before production

- **Nexa** is served (licensed) via Adobe Fonts / Typekit — kit
  `https://use.typekit.net/own8wil.css`, family `"nexa"` (weights 400/700),
  linked in `app/layout.tsx`. Vertical centering is handled systemically with
  `text-box-trim` in `globals.css` (no per-element padding hacks).
- **Contact form** returns HTTP 503 until `RESEND_API_KEY` is set; the form then
  shows a `mailto:` fallback. Verify the `CONTACT_FROM` domain in Resend.
- Directory names/companies are placeholder sample data (`lib/people.ts`).
- Replace `/public/assets` imagery with final licensed assets.
