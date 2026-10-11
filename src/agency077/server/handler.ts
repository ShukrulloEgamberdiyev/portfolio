// /077agency — ariza qabul qiluvchi server mantiqi (Web Request/Response).
// Faqat 077agency'ning o‘z Google Sheets jadvaliga ("077 Agency — Leads") yozadi.
// FAZO Digital arizalari endpointi bilan hech qanday bog‘liqligi yo‘q.

import { validateLead, toSheetRow, type LeadInput } from '../lead.js';

export interface Agency077Env {
  AGENCY077_SHEETS_URL?: string; // Apps Script /exec URL (docs/077agency-apps-script.gs)
  AGENCY077_SHEETS_SECRET?: string; // Apps Script'dagi SECRET bilan bir xil
}

type Body = { ok: boolean; message: string; errors?: Record<string, string>; configured?: boolean };

const json = (status: number, body: Body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

const hits = new Map<string, number[]>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5; // 10 daqiqada 5 tadan ko‘p emas
}

const configured = (env: Agency077Env) => Boolean(env.AGENCY077_SHEETS_URL && env.AGENCY077_SHEETS_SECRET);

/** GET: integratsiya sozlanganini tekshirish (maxfiy qiymatlarni oshkor qilmaydi). */
export function handleStatus(env: Agency077Env): Response {
  return json(200, { ok: true, message: 'status', configured: configured(env) });
}

export async function handleLead(request: Request, env: Agency077Env): Promise<Response> {
  const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  const text = await request.text();
  if (text.length > 10_000) return json(413, { ok: false, message: 'So‘rov juda katta.' });
  let raw: unknown;
  try {
    raw = JSON.parse(text || '{}');
  } catch {
    return json(400, { ok: false, message: 'So‘rov noto‘g‘ri formatda.' });
  }
  if (!raw || typeof raw !== 'object') return json(400, { ok: false, message: 'So‘rov noto‘g‘ri formatda.' });
  const input = raw as LeadInput;

  // Honeypot: botlar yashirin maydonni to‘ldiradi. Hech narsa saqlanmaydi.
  if (input.website) return json(200, { ok: true, message: 'OK' });

  const errors = validateLead(input);
  if (Object.keys(errors).length) {
    return json(422, { ok: false, message: 'Ma’lumotlarni tekshiring.', errors: errors as Record<string, string> });
  }
  if (!/^[a-zA-Z0-9-]{8,64}$/.test(input.submissionId || '')) {
    return json(400, { ok: false, message: 'So‘rov identifikatori noto‘g‘ri.' });
  }
  if (rateLimited(ip)) return json(429, { ok: false, message: 'Juda ko‘p urinish. Birozdan so‘ng qayta yuboring.' });
  if (!configured(env)) {
    return json(503, {
      ok: false,
      message: 'Ariza qabul qilish vaqtincha sozlanmagan. Iltimos, keyinroq urinib ko‘ring.',
    });
  }

  const row = toSheetRow(input);
  try {
    const res = await fetch(env.AGENCY077_SHEETS_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: env.AGENCY077_SHEETS_SECRET, row }),
      redirect: 'follow',
      signal: AbortSignal.timeout(15_000),
    });
    const body = await res.text();
    let data: { ok?: boolean } = {};
    try {
      data = JSON.parse(body);
    } catch {
      /* Apps Script xato sahifasi */
    }
    if (!res.ok || !data.ok) {
      console.error('[077agency lead] sheets rejected', res.status, body.slice(0, 300));
      return json(502, { ok: false, message: 'Arizani saqlab bo‘lmadi. Iltimos, qayta urinib ko‘ring.' });
    }
    return json(200, { ok: true, message: 'Saved' });
  } catch (err) {
    console.error('[077agency lead] sheets unreachable', err);
    return json(504, { ok: false, message: 'Server javob bermadi. Iltimos, qayta urinib ko‘ring.' });
  }
}
