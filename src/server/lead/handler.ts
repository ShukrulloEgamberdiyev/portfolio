// /api/lead — receives every fazodigital.uz lead form and writes it to the "FAZO Digital" Google Sheet.
//
// Delivery guarantee: the visitor is told "received" only when the lead is durably stored — either the
// Apps Script confirmed the row for THIS id, or (Sheets unavailable) it was written to the private
// retry queue. Queued leads are re-sent later with the same id; the Apps Script keeps one row per id,
// so a retry never creates a duplicate. When neither store works the visitor gets an error and keeps
// their answers in the form.
//
// Secrets (Apps Script URL + secret, Blob token, admin key) live only in server env — never in the bundle.

import { validateLead, type Lead } from './validate.js';

export interface LeadEnv {
  LEADS_SHEETS_URL?: string;
  LEADS_SHEETS_SECRET?: string;
  /** Bearer key for GET /api/lead?status and manual /api/lead-retry. */
  LEADS_ADMIN_KEY?: string;
  /** Sent by Vercel Cron as "Authorization: Bearer …". */
  CRON_SECRET?: string;
}

export type QueuedLead = { lead: Lead; queuedAt: string; attempts: number; lastError: string };

export interface LeadQueue {
  readonly available: boolean;
  put(entry: QueuedLead): Promise<void>;
  list(limit: number): Promise<QueuedLead[]>;
  remove(id: string): Promise<void>;
}

export type SheetsResult = { ok: true; duplicate: boolean } | { ok: false; reason: string; retryable: boolean };

type Json = Record<string, unknown>;

const json = (status: number, body: Json) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });

export const sheetsConfigured = (env: LeadEnv) => Boolean(env.LEADS_SHEETS_URL && env.LEADS_SHEETS_SECRET);

/* ───────── Google Sheets (Apps Script web app) ───────── */

export async function sendToSheets(env: LeadEnv, lead: Lead, delivery: 'direct' | 'retry', note = '', fetchImpl: typeof fetch = fetch): Promise<SheetsResult> {
  if (!sheetsConfigured(env)) return { ok: false, reason: 'sheets_not_configured', retryable: true };
  let res: Response;
  try {
    res = await fetchImpl(env.LEADS_SHEETS_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: env.LEADS_SHEETS_SECRET, lead, delivery, note }),
      redirect: 'follow',
      signal: AbortSignal.timeout(12_000),
    });
  } catch (err) {
    return { ok: false, reason: `network: ${String((err as Error)?.name || err)}`.slice(0, 200), retryable: true };
  }
  const text = await res.text().catch(() => '');
  let data: Json = {};
  try { data = JSON.parse(text) as Json; } catch { /* Apps Script HTML error page */ }
  if (res.ok && data.ok === true && data.saved === true && data.id === lead.id) {
    return { ok: true, duplicate: data.duplicate === true };
  }
  const reason = typeof data.error === 'string' ? data.error : `http_${res.status}${text ? '_non_json' : ''}`;
  // A rate limit or validation answer from the sheet is final for this request; anything else may heal.
  const final = reason === 'rate_limited' || reason === 'invalid';
  return { ok: false, reason: reason.slice(0, 200), retryable: !final };
}

/* ───────── Abuse limits (per function instance; the Apps Script also limits per phone) ───────── */

const hits = new Map<string, number[]>();
function limited(key: string, max: number, windowMs: number, now: number): boolean {
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}
export function resetLimits() { hits.clear(); }

const seen = new Map<string, string>(); // id → status, so a quick double submit is answered from memory
function remember(id: string, status: string) {
  seen.set(id, status);
  if (seen.size > 2000) seen.delete(seen.keys().next().value as string);
}

function originAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true; // server-to-server or old browsers; other checks still apply
  try {
    const o = new URL(origin).host;
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
    return o === host || o === 'www.fazodigital.uz' || o === 'fazodigital.uz' || /^localhost(:\d+)?$/.test(o) || /^127\.0\.0\.1(:\d+)?$/.test(o);
  } catch {
    return false;
  }
}

/* ───────── POST /api/lead ───────── */

export type HandleOptions = { queue: LeadQueue; fetchImpl?: typeof fetch; now?: () => Date; afterResponse?: (p: Promise<unknown>) => void };

export async function handleLead(request: Request, env: LeadEnv, o: HandleOptions): Promise<Response> {
  const now = o.now?.() ?? new Date();
  if (!originAllowed(request)) return json(403, { ok: false, error: 'forbidden' });

  const text = await request.text();
  if (text.length > 20_000) return json(413, { ok: false, error: 'too_large' });
  let body: unknown;
  try { body = JSON.parse(text || '{}'); } catch { return json(400, { ok: false, error: 'invalid', field: 'body' }); }

  const v = validateLead(body, now);
  if (!v.ok) return json(422, { ok: false, error: 'invalid', field: v.field });
  const { lead } = v;

  // Bots fill the hidden field: answer like a success, store nothing.
  if (v.honeypot) return json(200, { ok: true, status: 'saved', id: lead.id });
  if (v.tooFast) return json(422, { ok: false, error: 'too_fast' });

  const known = seen.get(lead.id);
  if (known) return json(200, { ok: true, status: known, id: lead.id, duplicate: true });

  const ip = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown').split(',')[0].trim();
  const t = now.getTime();
  if (limited(`ip:${ip}`, 8, 10 * 60_000, t) || limited(`ph:${lead.phone}`, 4, 60 * 60_000, t)) {
    return json(429, { ok: false, error: 'rate_limited' });
  }

  const sent = await sendToSheets(env, lead, 'direct', '', o.fetchImpl);
  if (sent.ok) {
    remember(lead.id, 'saved');
    if (o.queue.available) o.afterResponse?.(flushQueue(env, o.queue, { max: 5, budgetMs: 8000, fetchImpl: o.fetchImpl }).catch(() => undefined));
    return json(200, { ok: true, status: 'saved', id: lead.id, duplicate: sent.duplicate });
  }
  if (!sent.retryable) {
    return json(sent.reason === 'rate_limited' ? 429 : 422, { ok: false, error: sent.reason === 'rate_limited' ? 'rate_limited' : 'invalid' });
  }

  console.error('[lead] sheets failed, queueing', lead.id, sent.reason);
  if (o.queue.available) {
    try {
      await o.queue.put({ lead, queuedAt: now.toISOString(), attempts: 1, lastError: sent.reason });
      remember(lead.id, 'queued');
      return json(200, { ok: true, status: 'queued', id: lead.id });
    } catch (err) {
      console.error('[lead] queue write failed', lead.id, String(err));
    }
  }
  return json(503, { ok: false, error: 'unavailable' });
}

/* ───────── Retry queue ───────── */

export type FlushResult = { tried: number; delivered: number; failed: number; remaining: number | null };

export async function flushQueue(env: LeadEnv, queue: LeadQueue, opts: { max?: number; budgetMs?: number; fetchImpl?: typeof fetch } = {}): Promise<FlushResult> {
  const started = Date.now();
  const max = opts.max ?? 50;
  const out: FlushResult = { tried: 0, delivered: 0, failed: 0, remaining: null };
  if (!queue.available || !sheetsConfigured(env)) return out;
  const entries = await queue.list(max);
  for (const entry of entries) {
    if (opts.budgetMs && Date.now() - started > opts.budgetMs) break;
    out.tried += 1;
    const note = `Navbatdan qayta yuborildi (${entry.attempts} urinishdan keyin). Birinchi xato: ${entry.lastError}`;
    const r = await sendToSheets(env, entry.lead, 'retry', note, opts.fetchImpl);
    if (r.ok) {
      await queue.remove(entry.lead.id);
      out.delivered += 1;
    } else {
      out.failed += 1;
      console.error('[lead] retry failed', entry.lead.id, r.reason);
      await queue.put({ ...entry, attempts: entry.attempts + 1, lastError: r.reason }).catch(() => undefined);
    }
  }
  return out;
}

const bearer = (request: Request) => (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');

function isAdmin(request: Request, env: LeadEnv, allowCron = false): boolean {
  const key = bearer(request);
  if (!key) return false;
  if (env.LEADS_ADMIN_KEY && safeEqual(key, env.LEADS_ADMIN_KEY)) return true;
  return allowCron && !!env.CRON_SECRET && safeEqual(key, env.CRON_SECRET);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** GET /api/lead — public: which stores are configured (booleans only). With the admin key: the retry queue. */
export async function handleStatus(request: Request, env: LeadEnv, queue: LeadQueue): Promise<Response> {
  const configured = { sheets: sheetsConfigured(env), queue: queue.available };
  if (!isAdmin(request, env)) return json(200, { ok: true, configured });
  const entries = queue.available ? await queue.list(100) : [];
  return json(200, {
    ok: true,
    configured,
    queued: entries.length,
    // No names or phone numbers here — the id is enough to find the lead once it reaches the sheet.
    items: entries.map((e) => ({ id: e.lead.id, formId: e.lead.formId, createdAt: e.lead.createdAt, queuedAt: e.queuedAt, attempts: e.attempts, lastError: e.lastError })),
  });
}

/** GET|POST /api/lead-retry — Vercel Cron (CRON_SECRET) or an admin re-sends queued leads. */
export async function handleRetry(request: Request, env: LeadEnv, queue: LeadQueue, fetchImpl?: typeof fetch): Promise<Response> {
  if (!isAdmin(request, env, true)) return json(401, { ok: false, error: 'unauthorized' });
  const r = await flushQueue(env, queue, { max: 100, budgetMs: 50_000, fetchImpl });
  const left = queue.available ? (await queue.list(100)).length : 0;
  return json(200, { ok: true, ...r, remaining: left });
}
