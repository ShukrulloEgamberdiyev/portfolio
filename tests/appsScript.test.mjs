import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const source = await readFile(new URL('../docs/apps-script.gs', import.meta.url), 'utf8');
const WORKBOOK = '1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo';

/**
 * In-memory stand-in for the Apps Script services the receiver uses. `tabs` and `cache` can be shared
 * between receivers to simulate a new execution (fresh cache = "cache lost") against the same workbook.
 */
function receiver({ wrongSheet = false, failWrite = false, silentWriteLoss = false, preset = null, hour = '2026092204', tabs = null, cache = null, lockBusy = false } = {}) {
  cache = cache ?? new Map();
  tabs = tabs ?? new Map();
  let held = false;
  const makeTab = (name, filler = 0, initial = []) => {
    const tab = {
      name, rows: initial.map((r) => [...r]), filler,
      appendRow(row) { if (failWrite) throw Error('failed'); if (!silentWriteLoss) tab.rows.push(row); },
      getLastRow: () => tab.filler + tab.rows.length,
      getLastColumn: () => tab.rows.reduce((m, r) => Math.max(m, r.length), 0),
      getRange: (r, c, nr = 1, nc = 1) => {
        const api = {
          getValues: () => [(tab.rows[r - 1 - tab.filler] || []).slice(c - 1, c - 1 + nc)],
          setValues: (v) => { tab.rows[r - 1 - tab.filler] = v[0]; return api; },
          setFontWeight: () => api,
          createTextFinder: (text) => ({
            matchEntireCell() { return this; },
            findNext() {
              for (let i = r; i < r + nr; i++) {
                const row = tab.rows[i - 1 - tab.filler];
                if (row && String(row[c - 1]) === text) return { getRow: () => i };
              }
              return null;
            },
          }),
        };
        return api;
      },
      setFrozenRows() {},
    };
    tabs.set(name, tab);
    return tab;
  };
  if (!tabs.size) {
    if (preset) makeTab('AVTOSALON LEADLAR', 0, preset);
    makeTab('Sayt arizalari', 5);
  }
  const sandbox = {
    console: { error() {} },
    SpreadsheetApp: {
      getActiveSpreadsheet: () => ({ getId: () => (wrongSheet ? 'other' : WORKBOOK), getSheetByName: (n) => tabs.get(n) || null, insertSheet: (n) => makeTab(n) }),
      flush() {},
    },
    LockService: { getScriptLock: () => ({
      waitLock() { held = true; }, tryLock() { if (lockBusy) return false; held = true; return true; },
      hasLock: () => held, releaseLock() { held = false; },
    }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache.get(k), put: (k, v) => cache.set(k, v) }) },
    Utilities: {
      DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (alg, v) => createHash(alg).update(v).digest(),
      base64EncodeWebSafe: (v) => v.toString('base64url'),
      formatDate: () => hour,
    },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (text) => ({ setMimeType: () => JSON.parse(text) }) },
  };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  const send = (payload) => sandbox.doPost({ postData: { contents: JSON.stringify(payload) } });
  const siteRows = () => tabs.get('Sayt arizalari').rows;
  const avtoTab = () => tabs.get('AVTOSALON LEADLAR');
  const avtoRows = () => (avtoTab() ? avtoTab().rows.slice(1) : []);
  return { send, tabs, cache, siteRows, avtoTab, avtoRows, get: sandbox.doGet };
}

/* ───────── general site form (behaviour unchanged) ───────── */

const site = { token: 'fazo-2026-maxfiy', elapsed: '5000', name: 'TEST', company: '=bad()', industry: 'auto', revenue: 'private', spend: '<1k', budget: '2.5-4k', problem: 'strategy', objective: 'revenue', decision: 'yes', contact: '@test_only' };

test('site: appends to Sayt arizalari and sanitises formula prefixes', () => {
  const r = receiver();
  assert.equal(r.send(site).ok, true);
  assert.equal(r.siteRows().length, 1);
  assert.equal(r.siteRows()[0][2], "'=bad()");
  assert.equal(r.siteRows()[0].at(-1), 'Yangi');
});
test('site: identical retry is acknowledged without a duplicate row', () => {
  const r = receiver(); r.send(site);
  assert.equal(r.send(site).duplicate, true);
  assert.equal(r.siteRows().length, 1);
});
test('site: rejected, spam and malformed requests never report success', () => {
  const r = receiver();
  for (const patch of [{ token: 'wrong' }, { name: '' }, { hp: 'bot' }, { elapsed: '1' }, { elapsed: 'abc' }, { elapsed: undefined }, { hp: 1 }]) {
    assert.equal(r.send({ ...site, ...patch }).ok, false, JSON.stringify(patch));
  }
  assert.equal(r.siteRows().length, 0);
});
test('site: wrong workbook or failed append never reports success', () => {
  for (const config of [{ wrongSheet: true }, { failWrite: true }]) {
    const r = receiver(config);
    assert.equal(r.send(site).ok, false);
    assert.equal(r.siteRows().length, 0);
  }
});
test('health check answer is not an application confirmation', () => {
  const res = receiver().get();
  assert.equal(res.ok, true);
  assert.equal(res.saved, undefined);
  assert.equal(res.submissionId, undefined);
});

/* ───────── avtosalon form ───────── */

let n = 0;
const nextId = () => `AV-MUH60GB${String(++n).padStart(2, '0')}-A1B2C3D4E5`;
const avto = (patch = {}) => ({
  token: 'fazo-2026-maxfiy', elapsed: '9000', formType: 'avtosalon',
  dealer: 'TEST — AVTOSALON QA', region: 'Toshkent shahri — Chirchiq', instagram: '@test_avto', website: '',
  carTypes: 'Yangi avtomobillar, Premium segment · Brendlar: Chery, Haval', branches: '1', stock: '10–29',
  marketingOwner: 'Agentlik', targetStatus: 'Ha', budget: '$3,000–5,000', monthlyLeads: '120', monthlySales: '10–29',
  salesStaff: '3–5', rop: 'Yo‘q', crm: 'Yo‘q', leadSystem: 'Telegram',
  goals: 'CRM va lead nazoratini yo‘lga qo‘yish; Boshqa', goalsOther: 'Test maqsad', problem: '=cmd() o‘zbekcha matn',
  name: 'TEST', position: 'Direktor', phone: '+998 90 123 45 67', telegram: '@test_only',
  utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'avto', utm_content: 'reel1', utm_term: 't', fbclid: 'FB1',
  page: 'https://fazodigital.uz/avtosalon?utm_source=facebook', referrer: 'https://l.instagram.com/', submissionId: nextId(),
  ...patch,
});
const col = (r, name) => r.avtoTab().rows[0].indexOf(name);

test('9. avtosalon rows go to AVTOSALON LEADLAR with full mapping; site rows stay in Sayt arizalari', () => {
  const r = receiver();
  const a = avto();
  const res = r.send(a);
  assert.deepEqual({ ok: res.ok, saved: res.saved, submissionId: res.submissionId }, { ok: true, saved: true, submissionId: a.submissionId });
  assert.equal(r.send(site).ok, true);
  assert.equal(r.siteRows().length, 1);
  assert.equal(r.avtoRows().length, 1);
  const [header] = r.avtoTab().rows; const row = r.avtoRows()[0];
  assert.equal(header.at(-1), 'Lead status');
  assert.equal(row[col(r, 'Lead status')], 'Yangi');
  assert.equal(Object.prototype.toString.call(row[col(r, 'Sana va vaqt')]), '[object Date]');
  assert.equal(row[col(r, 'Avtosalon nomi')], 'TEST — AVTOSALON QA');
  assert.equal(row[col(r, 'Avtomobil turi')], 'Yangi avtomobillar, Premium segment · Brendlar: Chery, Haval');
  assert.equal(row[col(r, 'Telefon')], "'+998 90 123 45 67");
  assert.equal(row[col(r, 'Eng katta muammo')], "'=cmd() o‘zbekcha matn");
  for (const [h, v] of [['UTM Source', 'facebook'], ['UTM Medium', 'paid'], ['UTM Campaign', 'avto'], ['UTM Content', 'reel1'], ['UTM Term', 't'], ['fbclid', 'FB1'], ['Ariza ID', a.submissionId], ['Landing / sahifa manbasi', a.page]]) {
    assert.equal(row[col(r, h)], v, h);
  }
  assert.equal(row.length, header.length);
});

test('1. plain retry with the same id → one row', () => {
  const r = receiver(); const a = avto();
  assert.equal(r.send(a).saved, true);
  const again = r.send(a);
  assert.deepEqual([again.ok, again.saved, again.duplicate, again.submissionId], [true, true, true, a.submissionId]);
  assert.equal(r.avtoRows().length, 1);
});

test('2. same id with a changed payload → still one row', () => {
  const r = receiver(); const a = avto();
  r.send(a);
  assert.equal(r.send({ ...a, dealer: 'Boshqa nom', budget: '$5,000–7,000' }).duplicate, true);
  assert.equal(r.avtoRows().length, 1);
  assert.equal(r.avtoRows()[0][col(r, 'Avtosalon nomi')], 'TEST — AVTOSALON QA');
});

test('3. retry after the cache was lost → found by Ariza ID in the sheet, one row', () => {
  const first = receiver(); const a = avto();
  first.send(a);
  const fresh = receiver({ tabs: first.tabs, cache: new Map() });
  assert.equal(fresh.send(a).duplicate, true);
  assert.equal(fresh.avtoRows().length, 1);
});

test('4. row saved but the answer never reached the client → retry creates no second row', () => {
  const r = receiver(); const a = avto();
  r.send(a); // response "lost": the client never saw it
  const retry = r.send({ ...a, elapsed: '15000' });
  assert.equal(retry.ok, true); assert.equal(retry.duplicate, true);
  assert.equal(r.avtoRows().length, 1);
});

test('5. invalid phone / budget / option / goalsOther / id → rejected with the field, no row', () => {
  const r = receiver();
  const cases = [
    [{ phone: '+998 90 123 45' }, 'phone'], [{ phone: '+7 900 123 45 67' }, 'phone'],
    [{ budget: '$1,000–2,000' }, 'budget'], [{ stock: '10–30' }, 'stock'], [{ rop: 'Balki' }, 'rop'],
    [{ region: 'Moskva' }, 'region'], [{ carTypes: 'Yangi avtomobillar, Velosiped' }, 'carTypes'],
    [{ goals: 'Boshqa', goalsOther: '' }, 'goalsOther'], [{ goals: 'Noma’lum maqsad' }, 'goals'], [{ goals: '' }, 'goals'],
    [{ monthlyLeads: '-5' }, 'monthlyLeads'], [{ monthlyLeads: '12.5' }, 'monthlyLeads'],
    [{ telegram: '@abc' }, 'telegram'], [{ telegram: 'no_at_sign' }, 'telegram'],
    [{ instagram: 'bad handle!' }, 'instagram'], [{ website: 'not a site' }, 'website'],
    [{ dealer: 'x'.repeat(161) }, 'dealer'], [{ dealer: 42 }, 'dealer'], [{ problem: 'abc' }, 'problem'],
    [{ submissionId: 'AV-TEST-1' }, 'submissionId'], [{ submissionId: undefined }, 'submissionId'],
    [{ utm_source: 'x'.repeat(201) }, 'utm_source'],
  ];
  for (const [patch, field] of cases) {
    const res = r.send(avto(patch));
    assert.deepEqual([res.ok, res.error, res.field], [false, 'invalid', field], JSON.stringify(patch));
  }
  assert.equal(r.avtoRows().length, 0);
});

test('5b. valid edge values are accepted (Aniq bilmayman, no Boshqa, website URL, instagram URL, no brand text)', () => {
  const r = receiver();
  const res = r.send(avto({ monthlyLeads: 'Aniq bilmayman', goals: 'Target reklamani kuchaytirish', goalsOther: '', website: 'https://avto.uz', instagram: 'https://instagram.com/avto.uz', carTypes: 'Tijorat transporti', region: 'Samarqand viloyati', phone: '+998901234567' }));
  assert.equal(res.saved, true, JSON.stringify(res));
});

test('spam: honeypot, short or non-numeric elapsed never write', () => {
  const r = receiver();
  for (const patch of [{ hp: 'x' }, { elapsed: '100' }, { elapsed: 'NaN' }, { elapsed: '' }, { elapsed: null }]) {
    assert.equal(r.send(avto(patch)).error, 'spam', JSON.stringify(patch));
  }
  assert.equal(r.avtoRows().length, 0);
});

test('7. per-contact limit blocks the same phone/Telegram but not another contact', () => {
  const r = receiver();
  for (let i = 0; i < 3; i++) assert.equal(r.send(avto()).saved, true);
  const blocked = r.send(avto());
  assert.deepEqual([blocked.ok, blocked.error], [false, 'contact_rate_limited']);
  assert.equal(r.send(avto({ telegram: '@test_only', phone: '+998 91 000 00 00' })).error, 'contact_rate_limited'); // same Telegram
  assert.equal(r.send(avto({ phone: '+998 93 111 22 33', telegram: '@another_one' })).saved, true);
  assert.equal(r.avtoRows().length, 4);
});

test('8. retries with the same id do not consume the limit', () => {
  const r = receiver(); const a = avto();
  for (let i = 0; i < 10; i++) assert.equal(r.send(a).ok, true);
  assert.equal(r.send(avto()).saved, true);
  assert.equal(r.send(avto()).saved, true);
  assert.equal(r.avtoRows().length, 3);
});

test('global avtosalon cap is separate from the site form', () => {
  const r = receiver();
  for (let i = 0; i < 200; i++) {
    const res = r.send(avto({ phone: `+998 90 ${String(1000000 + i).slice(-7, -4)} ${String(i).padStart(4, '0').slice(0, 2)} ${String(i).padStart(4, '0').slice(2)}`, telegram: `@contact_${i}x` }));
    assert.equal(res.saved, true, `#${i} ${JSON.stringify(res)}`);
  }
  assert.equal(r.send(avto({ phone: '+998 99 999 99 99', telegram: '@last_one' })).error, 'rate_limited');
  assert.equal(r.send(site).ok, true);
});

test('10. existing tab with reordered/manual columns: written by header name, nothing moved', () => {
  const r = receiver({ preset: [['Ism', 'Izoh (qo‘lda)', 'Ariza ID', 'Telefon', 'Sana va vaqt']] });
  const a = avto();
  assert.equal(r.send(a).saved, true);
  const [header, row] = r.avtoTab().rows;
  assert.deepEqual(header.slice(0, 5), ['Ism', 'Izoh (qo‘lda)', 'Ariza ID', 'Telefon', 'Sana va vaqt']);
  assert.equal(row[0], 'TEST'); assert.equal(row[1], ''); assert.equal(row[2], a.submissionId); assert.equal(row[3], "'+998 90 123 45 67");
  assert.equal(row[header.indexOf('Avtosalon nomi')], 'TEST — AVTOSALON QA');
  assert.equal(r.send(a).duplicate, true);
  assert.equal(r.avtoRows().length, 1);
});

test('write failure, silent write loss, busy lock or wrong workbook never report success', () => {
  for (const config of [{ failWrite: true }, { silentWriteLoss: true }, { wrongSheet: true }]) {
    const res = receiver(config).send(avto());
    assert.deepEqual([res.ok, res.error], [false, 'storage_failed'], JSON.stringify(config));
  }
  assert.deepEqual(receiver({ lockBusy: true }).send(avto()).error, 'busy');
});
