import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Contact form handler for the marketing site. Persists each submission to
 * Supabase and emails both recipients via Resend. Both sinks are best-effort:
 * a submission succeeds if it lands in at least one of them.
 *
 * Env required in this project (Vercel):
 *   RESEND_API_KEY             - Resend API key
 *   CONTACT_FROM               - verified sender, e.g. "LiveConnect <hello@liveconnectusa.com>"
 *   CONTACT_TO                 - comma-separated recipients (defaults below)
 *   SUPABASE_URL               - Supabase project URL, e.g. https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  - service-role key (server-only; bypasses RLS)
 *
 * Table (see supabase/schema.sql):
 *   contact_submissions(name, email, org, event_type, message, created_at)
 */
const TO = (
  process.env.CONTACT_TO ??
  "graham@madebysprint.com,isabel.cable@accessfortworth.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const FROM =
  process.env.CONTACT_FROM ?? "LiveConnect <noreply@liveconnectusa.com>";

const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const clean = (v: unknown, max = 4000): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type Submission = {
  name: string;
  email: string;
  org: string;
  event_type: string;
  message: string;
};

/** Persist the submission to Supabase via PostgREST. Best-effort. */
async function saveToSupabase(rec: Submission): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  try {
    const res = await fetch(`${url}/rest/v1/contact_submissions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rec),
    });
    if (!res.ok) {
      console.error("[contact] Supabase insert failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[contact] Supabase insert threw", err);
    return false;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = clean(body.name, 200);
  const email = clean(body.email, 200);
  const org = clean(body.org, 200);
  const etype = clean(body.etype, 120);
  const message = clean(body.message);

  if (!name || !isEmail(email)) {
    return NextResponse.json(
      { error: "Name and a valid email are required." },
      { status: 422 },
    );
  }

  // Persist first so a submission is never lost, even if email is down.
  const saved = await saveToSupabase({
    name,
    email,
    org,
    event_type: etype,
    message,
  });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    // If we at least recorded it, treat the submission as accepted.
    if (saved) return NextResponse.json({ ok: true });
    return NextResponse.json(
      { error: "Contact service not configured." },
      { status: 503 },
    );
  }

  const subject = `LiveConnect enquiry${org ? `: ${org}` : ""}`;
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Organization", org || "Not provided"],
    ["Event type", etype || "Not provided"],
  ];
  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\n${message || "(no message)"}`;
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1912;font-size:15px;line-height:1.6">
      <h2 style="margin:0 0 12px">New LiveConnect enquiry</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:2px 14px 2px 0;color:#7a7468">${k}</td><td style="padding:2px 0"><strong>${esc(v)}</strong></td></tr>`,
          )
          .join("")}
      </table>
      <p style="white-space:pre-wrap;margin-top:16px">${esc(message) || "(no message)"}</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject,
      text,
      html,
    });
    if (error) {
      console.error("[contact] Resend error", error);
      if (saved) return NextResponse.json({ ok: true });
      return NextResponse.json({ error: "Send failed." }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] send threw", err);
    if (saved) return NextResponse.json({ ok: true });
    return NextResponse.json({ error: "Send failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
