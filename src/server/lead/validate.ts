// Server-side validation of a lead from any fazodigital.uz form. Same definitions as the browser.
import { FORMS, serviceOf, visibleQuestions, type FormId } from '../../forms/defs.js';
import { normalizeName, normalizePhone, normalizeTelegram } from '../../forms/contact.js';

export type Lead = {
  id: string;
  /** Moment the visitor first pressed "send" (browser clock, sanity-checked) — stays the same on every retry. */
  createdAt: string;
  /** Moment the server accepted it. */
  receivedAt: string;
  formId: FormId;
  page: string;
  service: string;
  answers: { id: string; label: string; value: string }[];
  name: string;
  phone: string;
  telegram: string;
  utm: { source: string; medium: string; campaign: string; content: string; term: string };
  fbclid: string;
  referrer: string;
  status: string;
};

export type ValidationResult =
  | { ok: true; lead: Lead; honeypot: boolean; tooFast: boolean }
  | { ok: false; error: 'invalid'; field: string };

export const ID_PATTERN = /^FD-[A-Z0-9]{6,12}-[A-Z0-9]{8,16}$/;
export const MIN_FILL_MS = 2500;
export const INITIAL_STATUS = 'Yangi';

const clip = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');

/** Only an http(s) URL on our own site is a valid "page"; anything else is reduced to the path or dropped. */
function cleanPage(v: unknown): string {
  const s = clip(v, 1000);
  try {
    const u = new URL(s);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return '';
    return (u.origin + u.pathname + u.search).slice(0, 1000);
  } catch {
    return s.startsWith('/') ? s.slice(0, 300) : '';
  }
}

export function validateLead(body: unknown, now = new Date()): ValidationResult {
  const fail = (field: string): ValidationResult => ({ ok: false, error: 'invalid', field });
  if (!body || typeof body !== 'object') return fail('body');
  const b = body as Record<string, unknown>;

  const id = typeof b.id === 'string' ? b.id : '';
  if (!ID_PATTERN.test(id)) return fail('id');

  const formId = typeof b.formId === 'string' ? b.formId : '';
  const def = (FORMS as Record<string, (typeof FORMS)[FormId] | undefined>)[formId];
  if (!def) return fail('formId');

  const raw = b.answers && typeof b.answers === 'object' && !Array.isArray(b.answers) ? (b.answers as Record<string, unknown>) : null;
  if (!raw) return fail('answers');
  const answers: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) if (typeof v === 'string') answers[k] = v.trim();

  const shown = visibleQuestions(def, answers);
  // An answer to a question that was not shown is not an error (the visitor may have changed an
  // earlier answer); it is simply not stored.
  const out: Lead['answers'] = [];
  for (const q of shown) {
    const v = answers[q.id] ?? '';
    if (q.kind === 'choice') {
      if (!q.options.includes(v)) return fail(q.id);
    } else {
      const max = q.max ?? 300;
      if (!v && !q.optional) return fail(q.id);
      if (v.length > max) return fail(q.id);
    }
    if (v) out.push({ id: q.id, label: q.label, value: clip(v, q.kind === 'text' ? (q.max ?? 300) : 200) });
  }

  const name = normalizeName(typeof b.name === 'string' ? b.name : '');
  if (!name.ok) return fail('name');
  const phone = normalizePhone(typeof b.phone === 'string' ? b.phone : '');
  if (!phone.ok) return fail('phone');
  const telegram = normalizeTelegram(typeof b.telegram === 'string' ? b.telegram : '');
  if (!telegram.ok) return fail('telegram');

  // The browser's first-attempt time is kept (so retries carry the original time) unless it is implausible.
  const sent = typeof b.createdAt === 'string' ? Date.parse(b.createdAt) : NaN;
  const plausible = Number.isFinite(sent) && sent <= now.getTime() + 5 * 60_000 && sent >= now.getTime() - 7 * 24 * 3600_000;
  const createdAt = new Date(plausible ? sent : now.getTime()).toISOString();

  const u = (b.utm && typeof b.utm === 'object' ? b.utm : {}) as Record<string, unknown>;
  const elapsed = typeof b.elapsedMs === 'number' ? b.elapsedMs : 0;

  return {
    ok: true,
    honeypot: typeof b.website === 'string' && b.website.trim() !== '',
    tooFast: elapsed < MIN_FILL_MS,
    lead: {
      id,
      createdAt,
      receivedAt: now.toISOString(),
      formId: def.id,
      page: cleanPage(b.page),
      service: serviceOf(def, answers),
      answers: out,
      name: name.value,
      phone: phone.e164,
      telegram: telegram.value,
      utm: {
        source: clip(u.utm_source, 200),
        medium: clip(u.utm_medium, 200),
        campaign: clip(u.utm_campaign, 200),
        content: clip(u.utm_content, 200),
        term: clip(u.utm_term, 200),
      },
      fbclid: clip(u.fbclid, 500),
      referrer: clip(b.referrer, 500),
      status: INITIAL_STATUS,
    },
  };
}
