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
 * Without an endpoint it resolves after a short delay so the flow can be reviewed.
 *
 * Sent as text/plain on purpose: Apps Script web apps reject the CORS preflight that
 * an application/json POST triggers.
 */
export async function submitApplication(data: Application, lang = 'uz'): Promise<void> {
  const endpoint = import.meta.env.VITE_APPLICATION_ENDPOINT as string | undefined;
  const payload = {
    ...data,
    ...utm(),
    lang,
    submittedAt: new Date().toISOString(),
    source: 'fazodigital.uz',
    page: location.href,
    token: import.meta.env.VITE_APPLICATION_TOKEN ?? '',
  };
  if (!endpoint) { await new Promise((r) => setTimeout(r, 900)); return; }
  const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(`Application failed: ${res.status}`);
}
