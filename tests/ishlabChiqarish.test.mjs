import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import ts from 'typescript';

// Server option lists must match the /ishlab-chiqarish form options exactly; case figures must stay verified.
const content = await readFile(new URL('../src/content/ishlab.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(content, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { OPT, caseStudy } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const tsModule = async (rel) => {
  const src = await readFile(new URL(rel, import.meta.url), 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(out).toString('base64')}`);
};
const { icFingerprint } = await tsModule('../src/lib/leadFingerprint.ts');
const attr = await tsModule('../src/lib/attribution.ts');
const gs = await readFile(new URL('../docs/apps-script.gs', import.meta.url), 'utf8');

function receiver() {
  const tabs = new Map();
  const cache = new Map();
  const makeTab = (name) => {
    const tab = {
      rows: [],
      appendRow(r) { tab.rows.push(r); },
      getLastRow: () => tab.rows.length,
      getLastColumn: () => tab.rows.reduce((m, r) => Math.max(m, r.length), 0),
      getRange: (r, c, nr = 1, nc = 1) => {
        const api = {
          getValues: () => [(tab.rows[r - 1] || []).slice(c - 1, c - 1 + nc)],
          setValues: (v) => { tab.rows[r - 1] = v[0]; return api; },
          setFontWeight: () => api,
          createTextFinder: (text) => ({ matchEntireCell() { return this; }, findNext() {
            for (let i = r; i < r + nr; i++) if (tab.rows[i - 1] && String(tab.rows[i - 1][c - 1]) === text) return { getRow: () => i };
            return null;
          } }),
        };
        return api;
      },
      setFrozenRows() {},
    };
    tabs.set(name, tab);
    return tab;
  };
  let held = false;
  const sandbox = {
    console: { error() {} },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getId: () => '1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo', getSheetByName: (n) => tabs.get(n) || null, insertSheet: makeTab }), flush() {} },
    LockService: { getScriptLock: () => ({ waitLock() { held = true; }, tryLock() { held = true; return true; }, hasLock: () => held, releaseLock() { held = false; } }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache.get(k), put: (k, v) => cache.set(k, v) }) },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (a, v) => createHash(a).update(v).digest(), base64EncodeWebSafe: (v) => v.toString('base64url'), formatDate: () => '2026092610' },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: (t) => ({ setMimeType: () => JSON.parse(t) }) },
  };
  vm.createContext(sandbox);
  vm.runInContext(`${gs}\nthis.__IC = IC; this.__fp = icFingerprint;`, sandbox);
  return { send: (p) => sandbox.doPost({ postData: { contents: JSON.stringify(p) } }), tabs, IC: JSON.parse(JSON.stringify(sandbox.__IC)), serverFp: sandbox.__fp };
}

const valid = (over = {}) => ({
  formType: 'ishlab_chiqarish', token: 'fazo-2026-maxfiy', hp: '', elapsed: '9000', submissionId: 'IC-MFX12AB-ABCDEF1234',
  name: 'Aziz', phone: '+998 90 123 45 67', product: 'Krovat va shkaflar', region: 'Namangan',
  channel: 'Chakana + Optom', budget: '$1,000–$3,000', problem: 'Optom mijozlar kam',
  page: 'https://fazodigital.uz/ishlab-chiqarish?utm_source=facebook',
  ...over,
});
const clientFp = (p) => icFingerprint(p);
const col = (tab, name) => tab.rows[0].indexOf(name);

test('server option lists match the /ishlab-chiqarish form options exactly', () => {
  const { IC } = receiver();
  for (const k of ['channel', 'budget']) assert.deepEqual(IC[k], OPT[k], k);
  assert.deepEqual(OPT.budget, ['$500–$1,000', '$1,000–$3,000', '$3,000+', 'Budjet bo‘yicha tavsiya kerak']);
  assert.deepEqual(OPT.channel, ['Chakana', 'Optom / B2B', 'Chakana + Optom']);
});

test('verified case figures are unchanged', () => {
  assert.deepEqual(caseStudy.metrics.map((m) => m.v), ['$902', '190', '404 dona']);
  assert.equal(caseStudy.period, '15–28 avgust 2026');
});

test('client and server fingerprints are identical (and ignore formatting/attribution)', () => {
  const { serverFp } = receiver();
  const samples = [
    valid(), valid({ problem: '' }), valid({ name: '  Ozodbek  O‘g‘li ', region: 'Farg‘ona\n vodiysi' }),
    valid({ phone: '+998901234567' }), valid({ product: 'Матрас va eshik 🚪', budget: 'Budjet bo‘yicha tavsiya kerak' }),
  ];
  for (const p of samples) assert.equal(serverFp(p), clientFp(p), JSON.stringify(p));
  assert.equal(clientFp(valid({ phone: '+998901234567' })), clientFp(valid({ phone: '90 123 45 67' })), 'phone format');
  assert.equal(clientFp(valid({ page: 'https://x.uz?a=1', utm_source: 'ig' })), clientFp(valid()), 'attribution excluded');
  assert.notEqual(clientFp(valid({ phone: '+998 90 123 45 68' })), clientFp(valid()), 'phone change');
  assert.match(clientFp(valid()), /^[0-9a-f]{16}$/);
});

test('valid lead goes to ISHLAB CHIQARISH LEADLAR only and confirms the stored fingerprint', () => {
  const r = receiver();
  const a = r.send(valid());
  assert.equal(a.ok, true); assert.equal(a.saved, true); assert.equal(a.submissionId, 'IC-MFX12AB-ABCDEF1234');
  assert.equal(a.fingerprint, clientFp(valid()));
  const tab = r.tabs.get('ISHLAB CHIQARISH LEADLAR');
  assert.ok(tab); assert.equal(tab.rows.length, 2);
  assert.equal(r.tabs.get('QURILISH LEADLAR'), undefined);
  assert.equal(r.tabs.get('Sayt arizalari'), undefined);
  assert.equal(tab.rows[1][col(tab, 'Nima ishlab chiqaradi')], 'Krovat va shkaflar');
  assert.equal(tab.rows[1][col(tab, 'Sotuv yo‘nalishi')], 'Chakana + Optom');
  assert.equal(tab.rows[1][col(tab, 'Lead status')], 'Yangi');
  assert.equal(tab.rows[1][col(tab, 'Ma’lumot izi')], clientFp(valid()));
});

test('lost reply: resending the identical payload with the same id is idempotent (one row, same confirmation)', () => {
  const r = receiver();
  const first = r.send(valid()); // stored, but imagine the reply never reached the browser
  const retry = r.send(valid({ elapsed: '15000', page: 'https://fazodigital.uz/ishlab-chiqarish' }));
  assert.equal(retry.ok, true); assert.equal(retry.duplicate, true); assert.equal(retry.updated, undefined);
  assert.equal(retry.fingerprint, first.fingerprint);
  assert.equal(r.tabs.get('ISHLAB CHIQARISH LEADLAR').rows.length, 2);
});

test('changed payload with the same id is saved as a correction — never a silent success for old data, never a 2nd lead', () => {
  const r = receiver();
  r.send(valid());
  const tab = r.tabs.get('ISHLAB CHIQARISH LEADLAR');
  const createdAt = tab.rows[1][col(tab, 'Sana va vaqt')];
  const changed = valid({ phone: '+998 91 765 43 21', budget: 'Budjet bo‘yicha tavsiya kerak', page: 'https://other.example/' });
  const res = r.send(changed);
  assert.equal(res.ok, true); assert.equal(res.saved, true); assert.equal(res.updated, true);
  assert.equal(res.fingerprint, clientFp(changed));
  assert.notEqual(res.fingerprint, clientFp(valid()));
  assert.equal(tab.rows.length, 2, 'still one lead');
  const row = tab.rows[1];
  assert.equal(row[col(tab, 'Telefon')], "'+998 91 765 43 21");
  assert.equal(row[col(tab, 'Oylik reklama budjeti')], 'Budjet bo‘yicha tavsiya kerak');
  assert.equal(row[col(tab, 'Ma’lumot izi')], clientFp(changed));
  assert.equal(Number(row[col(tab, 'Tuzatishlar soni')]), 1);
  assert.equal(Object.prototype.toString.call(row[col(tab, 'Tuzatilgan vaqt')]), '[object Date]');
  assert.equal(row[col(tab, 'Sana va vaqt')], createdAt, 'original date kept');
  assert.equal(row[col(tab, 'Landing / sahifa manbasi')], 'https://fazodigital.uz/ishlab-chiqarish?utm_source=facebook', 'attribution kept');
  // retrying the corrected payload is idempotent again
  const again = r.send(changed);
  assert.equal(again.duplicate, true); assert.equal(Number(tab.rows[1][col(tab, 'Tuzatishlar soni')]), 1);
});

test('corrections are capped per submission', () => {
  const r = receiver();
  r.send(valid());
  for (let i = 1; i <= 5; i++) assert.equal(r.send(valid({ problem: `tuzatish ${i}` })).updated, true);
  const res = r.send(valid({ problem: 'oltinchi' }));
  assert.equal(res.ok, false); assert.equal(res.error, 'too_many_corrections');
  const tab = r.tabs.get('ISHLAB CHIQARISH LEADLAR');
  assert.equal(tab.rows.length, 2); assert.equal(tab.rows[1][col(tab, 'Asosiy muammo')], 'tuzatish 5');
});

test('oversized attribution is truncated by the server, never rejects the lead', () => {
  const r = receiver();
  const res = r.send(valid({
    page: 'https://fazodigital.uz/ishlab-chiqarish?utm_source=fb&x=' + 'y'.repeat(5000),
    utm_campaign: 'c'.repeat(700), fbclid: 'F'.repeat(900), referrer: 'https://l.instagram.com/?u=' + 'z'.repeat(2000), utm_term: 42,
  }));
  assert.equal(res.ok, true, JSON.stringify(res));
  const tab = r.tabs.get('ISHLAB CHIQARISH LEADLAR');
  assert.equal(tab.rows[1][col(tab, 'Landing / sahifa manbasi')].length, 1000);
  assert.equal(tab.rows[1][col(tab, 'UTM Campaign')].length, 200);
  assert.equal(tab.rows[1][col(tab, 'fbclid')].length, 500);
  assert.equal(tab.rows[1][col(tab, 'UTM Term')], '');
});

test('frontend attribution normaliser keeps key UTMs and stays within server limits', () => {
  const long = 'https://fazodigital.uz/ishlab-chiqarish?utm_source=facebook&utm_medium=paid&utm_campaign=ic_mebel&utm_content=reel_1'
    + '&junk=' + 'j'.repeat(3000) + '&fbclid=' + 'F'.repeat(900) + '#ariza';
  const landing = attr.normalizeLanding(long);
  assert.ok(landing.length <= 1000, String(landing.length));
  const q = new URL(landing).searchParams;
  assert.equal(q.get('utm_source'), 'facebook'); assert.equal(q.get('utm_campaign'), 'ic_mebel'); assert.equal(q.get('utm_content'), 'reel_1');
  assert.equal(q.get('junk'), null, 'non-tracking params dropped');
  assert.ok(!landing.includes('#'), 'hash dropped');
  // a very long utm value: capped at 200 so the landing still fits; fbclid is dropped first when it does not
  const huge = attr.normalizeLanding('https://fazodigital.uz/x?' + ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map((k) => `${k}=${'u'.repeat(400)}`).join('&') + '&fbclid=' + 'F'.repeat(500));
  assert.ok(huge.length <= 1000); assert.equal(new URL(huge).searchParams.get('utm_source').length, 200); assert.equal(new URL(huge).searchParams.get('fbclid'), null);
  const c = attr.clampAttribution({ utm_source: 's'.repeat(300), fbclid: 'f'.repeat(800), landing: long, referrer: 'https://t.co/abc?' + 'q'.repeat(900) });
  assert.equal(c.utm_source.length, 200); assert.equal(c.fbclid.length, 500);
  assert.ok(c.landing.length <= 1000); assert.equal(c.referrer, 'https://t.co/abc');
  assert.deepEqual(attr.utmFromSearch('?utm_source=%20ig%20&foo=1&utm_term=' + 't'.repeat(250)), { utm_source: 'ig', utm_term: 't'.repeat(200) });
  assert.equal(attr.normalizeLanding('not a url ' + 'x'.repeat(2000)).length, 1000);
});

test('problem is optional; recommendation budget accepted; invalid fields rejected with the field name and no row', () => {
  const r = receiver();
  assert.equal(r.send(valid({ problem: '', submissionId: 'IC-MFX12AB-OPTIONAL01' })).ok, true);
  assert.equal(r.send(valid({ budget: 'Budjet bo‘yicha tavsiya kerak', phone: '+998 93 111 22 33', submissionId: 'IC-MFX12AB-RECOMMEND1' })).ok, true);
  const r2 = receiver();
  for (const [over, field] of [
    [{ phone: '12345' }, 'phone'], [{ budget: '$10' }, 'budget'], [{ budget: '$0–$500' }, 'budget'], [{ channel: 'x' }, 'channel'],
    [{ product: 'A' }, 'product'], [{ region: '' }, 'region'], [{ name: '' }, 'name'],
    [{ submissionId: 'QR-XXXXXX-YYYYYY' }, 'submissionId'],
  ]) {
    const res = r2.send(valid(over));
    assert.equal(res.ok, false); assert.equal(res.field, field);
  }
  assert.equal(r2.tabs.get('ISHLAB CHIQARISH LEADLAR'), undefined);
});

test('per-phone limit applies to new submissions, not to retries or corrections', () => {
  const r = receiver();
  for (let i = 0; i < 3; i++) assert.equal(r.send(valid({ submissionId: `IC-MFX12AB-ABCDEF12${i}0` })).ok, true);
  assert.equal(r.send(valid({ submissionId: 'IC-MFX12AB-ABCDEF1200', problem: 'tuzatildi' })).updated, true);
  assert.equal(r.send(valid({ submissionId: 'IC-MFX12AB-ABCDEF1299' })).error, 'contact_rate_limited');
});
