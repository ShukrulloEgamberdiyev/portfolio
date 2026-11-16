import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import ts from 'typescript';

// Server option lists must match the /qurilish form options exactly.
const content = await readFile(new URL('../src/content/qurilish.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(content, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { OPT, REGIONS, offer } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
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
          setValues: (v) => { const row = [...(tab.rows[r - 1] || [])]; v[0].forEach((x, k) => { row[c - 1 + k] = x; }); tab.rows[r - 1] = row; return api; },
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
  vm.runInContext(`${gs}\nthis.__QR = QR;`, sandbox);
  return { send: (p) => sandbox.doPost({ postData: { contents: JSON.stringify(p) } }), tabs, QR: JSON.parse(JSON.stringify(sandbox.__QR)) };
}

const valid = (over = {}) => ({
  formType: 'qurilish', token: 'fazo-2026-maxfiy', hp: '', elapsed: '9000', submissionId: 'QR-MFX12AB-ABCDEF1234',
  name: 'Aziz', phone: '+998 90 123 45 67', company: 'Test Qurilish', region: 'Samarqand viloyati — Samarqand',
  stage: 'Sotuv boshlangan', problem: 'Murojaatlar kam', problemOther: '', budget: '', contactTime: '',
  ...over,
});

test('server option lists match the /qurilish form options exactly', () => {
  const { QR } = receiver();
  assert.deepEqual(QR.regions, REGIONS);
  for (const k of ['stage', 'problem', 'budget', 'contactTime']) assert.deepEqual(QR[k], OPT[k], k);
});

test('agreed price is unchanged and the ad budget is separate', () => {
  assert.equal(offer.price, '$5,000–$7,000');
  assert.equal(offer.per, '/ oy');
  assert.match(offer.adBudget, /alohida/);
});

test('valid qurilish lead goes to QURILISH LEADLAR only, retry does not duplicate', () => {
  const r = receiver();
  const a = r.send(valid());
  assert.equal(a.ok, true); assert.equal(a.saved, true); assert.equal(a.submissionId, 'QR-MFX12AB-ABCDEF1234');
  const tab = r.tabs.get('QURILISH LEADLAR');
  assert.ok(tab); assert.equal(tab.rows.length, 2);
  assert.equal(r.tabs.get('AVTOSALON LEADLAR'), undefined);
  const header = tab.rows[0];
  assert.equal(tab.rows[1][header.indexOf('Kompaniya')], 'Test Qurilish');
  assert.equal(tab.rows[1][header.indexOf('Lead status')], 'Yangi');
  const b = r.send(valid());
  assert.equal(b.duplicate, true); assert.equal(tab.rows.length, 2);
});

test('invalid fields are rejected with the field name and no row', () => {
  const r = receiver();
  for (const [over, field] of [
    [{ phone: '12345' }, 'phone'], [{ budget: '$10' }, 'budget'], [{ problem: 'x' }, 'problem'], [{ stage: 'x' }, 'stage'],
    [{ problem: 'Boshqa', problemOther: '' }, 'problemOther'], [{ region: 'Moskva' }, 'region'],
    [{ submissionId: 'AV-XXXXXX-YYYYYY' }, 'submissionId'], [{ company: 'A' }, 'company'],
  ]) {
    const res = r.send(valid(over));
    assert.equal(res.ok, false); assert.equal(res.field, field);
  }
  assert.equal(r.tabs.get('QURILISH LEADLAR'), undefined);
});

test('contact time is optional (no longer asked), but must be a known option when sent', () => {
  const r = receiver();
  assert.equal(r.send(valid({ contactTime: '' })).ok, true);
  assert.equal(r.send(valid({ submissionId: 'QR-MFX12AB-ABCDEF9999', contactTime: undefined })).ok, true);
  assert.equal(r.send(valid({ submissionId: 'QR-MFX12AB-ABCDEF8888', contactTime: 'har doim' })).field, 'contactTime');
});

test('per-phone limit applies to new submissions', () => {
  const r = receiver();
  for (let i = 0; i < 3; i++) assert.equal(r.send(valid({ submissionId: `QR-MFX12AB-ABCDEF12${i}0` })).ok, true);
  assert.equal(r.send(valid({ submissionId: 'QR-MFX12AB-ABCDEF1299' })).error, 'contact_rate_limited');
});

test('budget is optional now (6-field form), older payloads with budget and old labels still save', () => {
  const r = receiver();
  assert.equal(r.send(valid({ submissionId: 'QR-MFX12AB-BUDGET0001', budget: undefined })).ok, true);
  const old = r.send(valid({ submissionId: 'QR-MFX12AB-OLDFORM001', phone: '+998 91 000 00 01', budget: '$3,000–$5,000', contactTime: 'Ertalab (9:00–12:00)',
    stage: 'Qurilish tugagan / sotuv davom etmoqda', problem: 'Reklama ishlayapti, lekin natija qoniqtirmaydi' }));
  assert.equal(old.ok, true); assert.equal(old.saved, true);
  assert.equal(r.send(valid({ submissionId: 'QR-MFX12AB-NEWSTAGE01', phone: '+998 91 000 00 02', stage: 'Qurilish tugagan, sotuv davom etmoqda' })).ok, true);
});

/* ───────── lost reply, changed data, long URLs ───────── */

const tsModule = async (rel) => {
  const src = await readFile(new URL(rel, import.meta.url), 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(out).toString('base64')}`);
};
const fp = await tsModule('../src/lib/leadFingerprint.ts');

test('client and server compute the same fingerprint for a qurilish lead', () => {
  const r = receiver();
  const res = r.send(valid());
  assert.equal(res.fingerprint, fp.leadFingerprint(fp.QR_FINGERPRINT_FIELDS, valid()));
  // formatting and attribution do not change it; a real change does
  assert.equal(fp.leadFingerprint(fp.QR_FINGERPRINT_FIELDS, valid({ name: '  Aziz ', phone: '+998901234567', page: 'x' })), res.fingerprint);
  assert.notEqual(fp.leadFingerprint(fp.QR_FINGERPRINT_FIELDS, valid({ phone: '+998 90 123 45 68' })), res.fingerprint);
});

test('lost reply, then the visitor changes the data: the same id is corrected in place and confirmed with the NEW data', () => {
  const r = receiver();
  const first = r.send(valid()); // stored, but the answer never reaches the browser
  const second = r.send(valid({ phone: '+998 91 765 43 21', company: 'To‘g‘ri nom' }));
  assert.deepEqual([second.ok, second.saved, second.updated], [true, true, true]);
  assert.notEqual(second.fingerprint, first.fingerprint);
  assert.equal(second.fingerprint, fp.leadFingerprint(fp.QR_FINGERPRINT_FIELDS, valid({ phone: '+998 91 765 43 21', company: 'To‘g‘ri nom' })));
  const tab = r.tabs.get('QURILISH LEADLAR'); const h = tab.rows[0];
  assert.equal(tab.rows.length, 2, 'still one lead');
  assert.equal(tab.rows[1][h.indexOf('Telefon')], "'+998 91 765 43 21");
  assert.equal(tab.rows[1][h.indexOf('Kompaniya')], 'To‘g‘ri nom');
  assert.equal(tab.rows[1][h.indexOf('Tuzatishlar soni')], 1);
  // the identical request again is a plain duplicate
  assert.equal(r.send(valid({ phone: '+998 91 765 43 21', company: 'To‘g‘ri nom' })).duplicate, true);
});

test('corrections are capped; the cap is reported, not hidden behind a success', () => {
  const r = receiver(); r.send(valid());
  for (let i = 0; i < 5; i++) assert.equal(r.send(valid({ company: `Nom ${i}` })).updated, true);
  const over = r.send(valid({ company: 'Yana' }));
  assert.deepEqual([over.ok, over.error], [false, 'too_many_corrections']);
});

test('a long ad URL in the hidden page field never blocks a valid application', () => {
  const r = receiver();
  const res = r.send(valid({ page: 'https://www.fazodigital.uz/qurilish?fbclid=' + 'a'.repeat(6000), utm_campaign: 'c'.repeat(700), referrer: 'r'.repeat(900) }));
  assert.equal(res.saved, true, JSON.stringify(res));
  const tab = r.tabs.get('QURILISH LEADLAR'); const h = tab.rows[0];
  assert.equal(tab.rows[1][h.indexOf('Landing / sahifa manbasi')].length, 1000);
  assert.equal(tab.rows[1][h.indexOf('UTM Campaign')].length, 200);
});
