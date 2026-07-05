/**
 * Outbound links to the product app. The master sign-up / sign-in lives on the
 * app side at app.liveconnectusa.com (where the cross-subdomain SSO cookie +
 * Supabase auth already live), NOT in this marketing project. These are
 * env-overridable so the app dev can point them at the real auth paths.
 */
const APP_BASE =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://app.liveconnectusa.com";

export const links = {
  signIn: `${APP_BASE}/signin`,
  getStarted: `${APP_BASE}/signup`,
  contact: "/contact",
};
