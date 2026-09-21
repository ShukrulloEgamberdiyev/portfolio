import { deliverApplication } from './applicationTransport';

export type Application = Record<string, string>;

function utm(): Record<string, string> {
  const q = new URLSearchParams(location.search);
  const out: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'fbclid']) {
    const v = q.get(k);
    if (v) out[k] = v;
  }
  return out;
}

/**
 * Sends an application to the endpoint in VITE_APPLICATION_ENDPOINT — the Apps Script
 * web app bound to the "Targeting Xizmat" spreadsheet (see docs/apps-script.gs).
 * A configured endpoint and an explicit successful server response are required.
 *
 * Sent as text/plain on purpose: Apps Script web apps reject the CORS preflight that
 * an application/json POST triggers.
 */
export async function submitApplication(data: Application, lang = 'uz', guard: { hp: string; elapsed: number } = { hp: '', elapsed: 0 }): Promise<void> {
  const endpoint = (import.meta.env.VITE_APPLICATION_ENDPOINT as string | undefined)
    || 'https://script.google.com/macros/s/AKfycbzBvnC8i5tglLCg_7ZX2op1BuAQ79c2mRHAYtX__XJfQa4aD3htuXs9lUYWWam_mylr1Q/exec';
  const payload = {
    ...data,
    ...utm(),
    lang,
    hp: guard.hp,
    elapsed: String(guard.elapsed),
    submittedAt: new Date().toISOString(),
    source: 'fazodigital.uz',
    page: location.href,
    // Public identifier, not a secret: the Apps Script validates and limits writes.
    token: import.meta.env.VITE_APPLICATION_TOKEN || 'fazo-2026-maxfiy',
  };
  await deliverApplication(endpoint, payload);
}
