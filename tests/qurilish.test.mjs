import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import ts from 'typescript';

// Server option lists must match the /qurilish form options exactly.
const content = await readFile(new URL('../src/content/qurilish.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(content, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { OPT, REGIONS, pricing } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
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
  vm.runInContext(`${gs}\nthis.__QR = QR;`, sandbox);
  return { send: (p) => sandbox.doPost({ postData: { contents: JSON.stringify(p) } }), tabs, QR: JSON.parse(JSON.stringify(sandbox.__QR)) };
}

const valid = (over = {}) => ({
  formType: 'qurilish', token: 'fazo-2026-maxfiy', hp: '', elapsed: '9000', submissionId: 'QR-MFX12AB-ABCDEF1234',
  name: 'Aziz', phone: '+998 90 123 45 67', company: 'Test Qurilish', region: 'Samarqand viloyati — Samarqand',
  stage: 'Sotuv boshlangan', problem: 'Murojaatlar kam', problemOther: '', budget: '$3,000–$5,000', contactTime: 'Ertalab (9:00–12:00)',
  ...over,
});

test('server option lists match the /qurilish form options exactly', () => {
  const { QR } = receiver();
  assert.deepEqual(QR.regions, REGIONS);
  for (const k of ['stage', 'problem', 'budget', 'contactTime']) assert.deepEqual(QR[k], OPT[k], k);
});

test('agreed budget options and price are unchanged', () => {
  assert.deepEqual(OPT.budget, ['$1,000 gacha', '$1,000–$3,000', '$3,000–$5,000', '$5,000+']);
  assert.equal(pricing.price, '$5,000 – $7,000');
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
    [{ phone: '12345' }, 'phone'], [{ budget: '$10' }, 'budget'], [{ stage: 'x' }, 'stage'],
    [{ problem: 'Boshqa', problemOther: '' }, 'problemOther'], [{ region: 'Moskva' }, 'region'],
    [{ submissionId: 'AV-XXXXXX-YYYYYY' }, 'submissionId'], [{ company: 'A' }, 'company'],
  ]) {
    const res = r.send(valid(over));
    assert.equal(res.ok, false); assert.equal(res.field, field);
  }
  assert.equal(r.tabs.get('QURILISH LEADLAR'), undefined);
});

test('per-phone limit applies to new submissions', () => {
  const r = receiver();
  for (let i = 0; i < 3; i++) assert.equal(r.send(valid({ submissionId: `QR-MFX12AB-ABCDEF12${i}0` })).ok, true);
  assert.equal(r.send(valid({ submissionId: 'QR-MFX12AB-ABCDEF1299' })).error, 'contact_rate_limited');
});
