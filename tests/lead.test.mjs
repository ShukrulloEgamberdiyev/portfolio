// Lead pipeline: contact normalisation, conditional questions, /api/lead handler, retry queue.
// Sheets and the Blob queue are in-memory fakes — no real spreadsheet is touched.
import { test, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { normalizePhone, normalizeTelegram, normalizeName } from '../src/forms/contact.ts';
import { FORMS, FORM_IDS, visibleQuestions } from '../src/forms/defs.ts';
import { QUESTION_TEXT } from '../src/forms/i18n.ts';
import { validateLead } from '../src/server/lead/validate.ts';
import { handleLead, handleStatus, handleRetry, flushQueue, resetLimits } from '../src/server/lead/handler.ts';

/* ───────── contact ───────── */

test('phone: Uzbek numbers in pasted and typed shapes become +998XXXXXXXXX', () => {
  for (const raw of ['90 123 45 67', '901234567', '+998 90 123 45 67', '+998 (90) 123-45-67', '998901234567', '00998901234567', 'tel:+998901234567', '8 90 123 45 67', '+998 90 1234567']) {
    const r = normalizePhone(raw);
    assert.equal(r.ok, true, raw);
    assert.equal(r.e164, '+998901234567', raw);
  }
});

test('phone: clear errors, nothing cut silently', () => {
  assert.match(normalizePhone('').error, /kiriting/);
  assert.match(normalizePhone('90 123 45').error, /to‘liq emas/);
  assert.match(normalizePhone('+998 90 123 45 678').error, /ortiqcha/);
  assert.match(normalizePhone('012345678').error, /0 bilan/);
  assert.match(normalizePhone('90-abc-45').error, /faqat raqamlar/);
  assert.match(normalizePhone('12345678901').error, /Xorijiy/);
});

test('phone: foreign numbers need + or 00 and are kept as typed digits', () => {
  assert.deepEqual(normalizePhone('+7 916 123 45 67'), { ok: true, e164: '+79161234567', display: '+79161234567', foreign: true });
  assert.equal(normalizePhone('0079161234567').e164, '+79161234567');
  assert.equal(normalizePhone('+1 23').ok, false);
});

test('telegram: optional, normalised to @name', () => {
  assert.deepEqual(normalizeTelegram(''), { ok: true, value: '' });
  for (const raw of ['fazo_digital', '@fazo_digital', 't.me/fazo_digital', 'https://t.me/fazo_digital/']) assert.equal(normalizeTelegram(raw).value, '@fazo_digital', raw);
  for (const raw of ['@ab', '@1abcde', 'hello world', '@name_']) assert.equal(normalizeTelegram(raw).ok, false, raw);
});

test('name: trimmed, 2–60 letters, no markup', () => {
  assert.equal(normalizeName('  Ali   Valiyev ').value, 'Ali Valiyev');
  assert.equal(normalizeName('A').ok, false);
  assert.equal(normalizeName('<b>x</b>').ok, false);
});

/* ───────── form definitions ───────── */

test('every form: Instagram has "Yo‘q", budget has "Hali aniqlamaganman", conditions point to earlier questions', () => {
  for (const id of FORM_IDS) {
    const qs = FORMS[id].questions;
    const ig = qs.find((q) => q.id === 'instagram');
    assert.ok(ig && ig.options.includes('Yo‘q'), `${id}: instagram`);
    const budget = qs.find((q) => q.id === 'adBudget');
    assert.ok(budget && budget.options.includes('Hali aniqlamaganman'), `${id}: budget`);
    qs.forEach((q, i) => {
      for (const dep of Object.keys(q.showIf ?? {})) assert.ok(qs.slice(0, i).some((x) => x.id === dep), `${id}.${q.id} depends on later ${dep}`);
    });
  }
});

test('conditional path: Instagram link only after "Ha"; "Boşqa" asks for text; budget only for ad services', () => {
  const f = FORMS.sayt;
  const ids = (a) => visibleQuestions(f, a).map((q) => q.id);
  assert.ok(!ids({ instagram: 'Yo‘q' }).includes('instagramLink'));
  assert.ok(ids({ instagram: 'Ha' }).includes('instagramLink'));
  assert.ok(ids({ industry: 'Boşqa' }).includes('industryOther'));
  assert.ok(!ids({ service: 'SMM, kontent va Reels' }).includes('adBudget'));
  assert.ok(ids({ service: 'Target reklama' }).includes('adBudget'));
  assert.ok(ids({ service: 'CRM va sotuv jarayoni' }).includes('leadsWhere'));
});

test('RU/EN text exists for every main-site question and option', () => {
  for (const lang of ['ru', 'en']) {
    for (const q of FORMS.sayt.questions) {
      const t = QUESTION_TEXT[lang][q.id];
      assert.ok(t?.label, `${lang} ${q.id}`);
      if (q.kind === 'choice') assert.equal(t.options?.length, q.options.length, `${lang} ${q.id} options`);
    }
  }
});

/* ───────── server ───────── */

const NOW = new Date('2026-11-27T10:00:00Z');
let seq = 0;
const lead = (over = {}) => ({
  id: `FD-MIGABCDE-${String(++seq).padStart(8, '0')}`,
  formId: 'card',
  createdAt: '2026-11-27T09:59:00Z',
  answers: { need: 'Targeting', instagram: 'Ha', instagramLink: '@brand', adBudget: 'Hali aniqlamaganman' },
  name: 'Test Foydalanuvchi',
  phone: '+998901234567',
  telegram: '@test_user',
  website: '',
  elapsedMs: 12000,
  page: 'https://www.fazodigital.uz/card?utm_source=ig',
  referrer: '',
  utm: { utm_source: 'ig', utm_medium: 'story', utm_campaign: 'nov', utm_content: '', utm_term: '', fbclid: 'abc' },
  ...over,
});
const req = (body, headers = {}) => new Request('https://www.fazodigital.uz/api/lead', {
  method: 'POST', body: JSON.stringify(body),
  headers: { 'content-type': 'application/json', origin: 'https://www.fazodigital.uz', host: 'www.fazodigital.uz', 'x-forwarded-for': `10.0.0.${seq % 250}`, ...headers },
});
const ENV = { LEADS_SHEETS_URL: 'https://script.example/exec', LEADS_SHEETS_SECRET: 'x'.repeat(40), LEADS_ADMIN_KEY: 'admin-key-123', CRON_SECRET: 'cron-123' };

/** Fake Apps Script: one row per id, like docs/fazo-leads-apps-script.gs. `down` simulates an outage. */
function fakeSheet() {
  const rows = new Map();
  const s = {
    rows, down: false, calls: 0,
    fetch: async (_url, init) => {
      s.calls += 1;
      if (s.down) return new Response('<html>Service unavailable</html>', { status: 503 });
      const { secret, lead: l, delivery } = JSON.parse(init.body);
      if (secret !== ENV.LEADS_SHEETS_SECRET) return Response.json({ ok: false, error: 'forbidden' });
      const duplicate = rows.has(l.id);
      if (!duplicate) rows.set(l.id, { ...l, delivery });
      return Response.json({ ok: true, saved: true, duplicate, id: l.id });
    },
  };
  return s;
}
function fakeQueue(available = true) {
  const m = new Map();
  return { m, available, failPut: false,
    async put(e) { if (this.failPut) throw new Error('blob down'); m.set(e.lead.id, structuredClone(e)); },
    async list(n) { return [...m.values()].slice(0, n); },
    async remove(id) { m.delete(id); } };
}

beforeEach(() => resetLimits());

test('valid lead is written once and confirmed with its id', async () => {
  const sheet = fakeSheet(); const q = fakeQueue(); const body = lead();
  const r = await handleLead(req(body), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW });
  assert.equal(r.status, 200);
  assert.deepEqual(await r.json(), { ok: true, status: 'saved', id: body.id, duplicate: false });
  const row = sheet.rows.get(body.id);
  assert.equal(row.phone, '+998901234567');
  assert.equal(row.service, 'Targeting');
  assert.equal(row.utm.source, 'ig');
  assert.equal(row.status, 'Yangi');
  assert.deepEqual(row.answers.map((a) => a.id), ['need', 'instagram', 'instagramLink', 'adBudget']);
});

test('double click / retry with the same id does not create a second row', async () => {
  const sheet = fakeSheet(); const q = fakeQueue(); const body = lead();
  const [a, b] = await Promise.all([1, 2].map(() => handleLead(req(body), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW })));
  assert.equal(a.status, 200); assert.equal(b.status, 200);
  assert.equal(sheet.rows.size, 1);
  const c = await handleLead(req(body), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW });
  assert.equal((await c.json()).status, 'saved');
  assert.equal(sheet.rows.size, 1);
});

test('Sheets outage: lead is queued (visitor told "received"), later flushed once, never duplicated', async () => {
  const sheet = fakeSheet(); const q = fakeQueue(); const body = lead();
  sheet.down = true;
  const r = await handleLead(req(body), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW });
  assert.deepEqual(await r.json(), { ok: true, status: 'queued', id: body.id });
  assert.equal(q.m.size, 1); assert.equal(sheet.rows.size, 0);

  // still down: retry keeps it queued and counts attempts
  await flushQueue(ENV, q, { fetchImpl: sheet.fetch });
  assert.equal(q.m.get(body.id).attempts, 2);

  sheet.down = false;
  const f = await flushQueue(ENV, q, { fetchImpl: sheet.fetch });
  assert.equal(f.delivered, 1); assert.equal(q.m.size, 0); assert.equal(sheet.rows.size, 1);
  assert.equal(sheet.rows.get(body.id).delivery, 'retry');

  // the same lead arriving again (e.g. browser retry) is not a second row
  q.m.set(body.id, { lead: sheet.rows.get(body.id), queuedAt: NOW.toISOString(), attempts: 1, lastError: 'x' });
  await flushQueue(ENV, q, { fetchImpl: sheet.fetch });
  assert.equal(sheet.rows.size, 1); assert.equal(q.m.size, 0);
});

test('Sheets and queue both down: no false success, visitor keeps answers (503)', async () => {
  const sheet = fakeSheet(); sheet.down = true; const q = fakeQueue(); q.failPut = true;
  const r = await handleLead(req(lead()), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW });
  assert.equal(r.status, 503);
  assert.deepEqual(await r.json(), { ok: false, error: 'unavailable' });
  const r2 = await handleLead(req(lead()), {}, { queue: fakeQueue(false), fetchImpl: sheet.fetch, now: () => NOW });
  assert.equal(r2.status, 503);
});

test('spam: honeypot answers OK without storing; too fast is refused; foreign origin refused', async () => {
  const sheet = fakeSheet(); const q = fakeQueue();
  const hp = await handleLead(req(lead({ website: 'http://spam' })), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW });
  assert.equal((await hp.json()).ok, true); assert.equal(sheet.calls, 0);
  const fast = await handleLead(req(lead({ elapsedMs: 300 })), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW });
  assert.equal(fast.status, 422); assert.equal((await fast.json()).error, 'too_fast');
  const foreign = await handleLead(req(lead(), { origin: 'https://evil.example' }), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW });
  assert.equal(foreign.status, 403);
});

test('rate limit per phone', async () => {
  const sheet = fakeSheet(); const q = fakeQueue();
  const codes = [];
  for (let i = 0; i < 6; i += 1) codes.push((await handleLead(req(lead()), ENV, { queue: q, fetchImpl: sheet.fetch, now: () => NOW })).status);
  assert.deepEqual(codes.slice(0, 4), [200, 200, 200, 200]);
  assert.equal(codes[5], 429);
});

test('validation: unknown option, hidden-question answers dropped, bad phone, bad id', async () => {
  assert.deepEqual(validateLead(lead({ answers: { need: 'Nimadir' } }), NOW), { ok: false, error: 'invalid', field: 'need' });
  const v = validateLead(lead({ answers: { need: 'SMM', instagram: 'Yo‘q', instagramLink: '@x', adBudget: 'Hali aniqlamaganman' } }), NOW);
  assert.equal(v.ok, true);
  assert.deepEqual(v.lead.answers.map((a) => a.id), ['need', 'instagram']);
  assert.equal(validateLead(lead({ phone: '123' }), NOW).field, 'phone');
  assert.equal(validateLead(lead({ id: 'x' }), NOW).field, 'id');
  assert.equal(validateLead(lead({ formId: 'nope' }), NOW).field, 'formId');
});

test('every form accepts a full valid path', () => {
  for (const id of FORM_IDS) {
    const answers = {};
    for (;;) {
      const next = visibleQuestions(FORMS[id], answers).find((q) => !(q.id in answers));
      if (!next) break;
      answers[next.id] = next.kind === 'choice' ? next.options[0] : 'Test';
    }
    const v = validateLead(lead({ formId: id, answers }), NOW);
    assert.equal(v.ok, true, `${id}: ${JSON.stringify(v)}`);
  }
});

test('status endpoint: booleans for everyone, queue only with the admin key and without personal data', async () => {
  const q = fakeQueue(); const body = lead();
  await q.put({ lead: validateLead(body, NOW).lead, queuedAt: NOW.toISOString(), attempts: 1, lastError: 'http_503' });
  const pub = await (await handleStatus(new Request('https://x/api/lead'), ENV, q)).json();
  assert.deepEqual(pub, { ok: true, configured: { sheets: true, queue: true } });
  const adm = await (await handleStatus(new Request('https://x/api/lead', { headers: { authorization: 'Bearer admin-key-123' } }), ENV, q)).json();
  assert.equal(adm.queued, 1);
  assert.doesNotMatch(JSON.stringify(adm), /998901234567|Test Foydalanuvchi/);
  const denied = await handleRetry(new Request('https://x/api/lead-retry'), ENV, q);
  assert.equal(denied.status, 401);
  const cron = await handleRetry(new Request('https://x/api/lead-retry', { headers: { authorization: 'Bearer cron-123' } }), ENV, q, fakeSheet().fetch);
  assert.equal((await cron.json()).delivered, 1);
});
