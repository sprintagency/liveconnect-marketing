import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Contact form handler for the marketing site. Emails both recipients
 * server-side via Resend. Self-contained: no shared DB or app coupling.
 *
 * Env required in this project (Vercel):
 *   RESEND_API_KEY   - Resend API key
 *   CONTACT_FROM     - verified sender, e.g. "LiveConnect <hello@liveconnectusa.com>"
 *   CONTACT_TO       - comma-separated recipients (defaults below)
 */
const TO = (
  process.env.CONTACT_TO ??
  "graham@madebysprint.com,isabel.cable@accessfortworth.com"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const FROM = process.env.CONTACT_FROM ?? "LiveConnect <hello@liveconnectusa.com>";

const isEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const clean = (v: unknown, max = 4000): string =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — surface an error so the form shows the mailto fallback.
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Email service not configured." },
      { status: 503 },
    );
  }

  const subject = `LiveConnect enquiry${org ? ` — ${org}` : ""}`;
  const rows: [string, string][] = [
    ["Name", name],
    ["Email", email],
    ["Organization", org || "—"],
    ["Event type", etype || "—"],
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
      return NextResponse.json({ error: "Send failed." }, { status: 502 });
    }
  } catch (err) {
    console.error("[contact] send threw", err);
    return NextResponse.json({ error: "Send failed." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
