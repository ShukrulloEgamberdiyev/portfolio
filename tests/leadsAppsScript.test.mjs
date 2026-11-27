// docs/fazo-leads-apps-script.gs in a fake Apps Script runtime (no Google calls).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../docs/fazo-leads-apps-script.gs', import.meta.url), 'utf8');
const SECRET = 's'.repeat(40);

function runtime() {
  const sheets = new Map();
  const sheet = (name) => {
    const rows = [];
    return {
      rows,
      getLastRow: () => rows.length,
      getRange: (r, c, nr, nc) => ({
        setValues: (v) => { rows[r - 1] = v[0]; return { setFontWeight: () => ({}) }; },
        createTextFinder: (text) => ({ matchEntireCell: () => ({ findNext: () => (rows.slice(0, nr).some((row) => row && row[0] === text) ? {} : null) }) }),
      }),
      setFrozenRows: () => {},
      appendRow: (row) => rows.push(row),
    };
  };
  const ss = { getSheetByName: (n) => sheets.get(n) || null, insertSheet: (n) => { const s = sheet(n); sheets.set(n, s); return s; } };
  const cache = new Map();
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => SECRET }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }) },
    CacheService: { getScriptCache: () => ({ get: (k) => cache.get(k) ?? null, put: (k, v) => cache.set(k, v) }) },
    Utilities: { formatDate: (d) => d.toISOString() },
    ContentService: { createTextOutput: (t) => ({ setMimeType: () => JSON.parse(t) }), MimeType: { JSON: 'json' } },
    console,
  };
  vm.createContext(ctx);
  vm.runInContext(source, ctx);
  return { post: (body) => ctx.doPost({ postData: { contents: JSON.stringify(body) } }), sheets };
}

let n = 0;
const lead = (o = {}) => ({
  id: `FD-MIGABCDE-${String(++n).padStart(8, '0')}`, formId: 'sayt', createdAt: '2026-11-27T10:00:00Z', receivedAt: '2026-11-27T10:00:01Z',
  page: 'https://www.fazodigital.uz/', service: 'Target reklama', name: 'Ali', phone: '+998901234567', telegram: '',
  answers: [{ id: 'service', label: 'Xizmat', value: 'Target reklama' }], utm: { source: 'ig' }, fbclid: '', referrer: '', status: 'Yangi', ...o,
});

test('writes one row per id; a repeat is a confirmed duplicate', () => {
  const rt = runtime(); const l = lead();
  assert.deepEqual(rt.post({ secret: SECRET, lead: l, delivery: 'direct' }), { ok: true, saved: true, duplicate: false, id: l.id });
  assert.deepEqual(rt.post({ secret: SECRET, lead: l, delivery: 'retry' }), { ok: true, saved: true, duplicate: true, id: l.id });
  assert.equal(rt.sheets.get('Arizalar').rows.length, 2); // header + 1
});

test('wrong secret is refused and logged', () => {
  const rt = runtime();
  assert.equal(rt.post({ secret: 'nope', lead: lead() }).error, 'forbidden');
  assert.equal(rt.sheets.get('Tizim jurnali').rows.length, 2);
});

test('formula-looking input is stored as text; phone keeps its +', () => {
  const rt = runtime();
  rt.post({ secret: SECRET, lead: lead({ name: '=HYPERLINK("x")' }), delivery: 'direct' });
  const row = rt.sheets.get('Arizalar').rows[1];
  assert.equal(row[6], '\'=HYPERLINK("x")');
  assert.equal(row[7], '\'+998901234567');
  assert.equal(row[2], 'Yangi');
});

test('per-phone limit applies to new direct leads, not to queued retries', () => {
  const rt = runtime();
  for (let i = 0; i < 3; i += 1) assert.equal(rt.post({ secret: SECRET, lead: lead(), delivery: 'direct' }).ok, true);
  assert.equal(rt.post({ secret: SECRET, lead: lead(), delivery: 'direct' }).error, 'rate_limited');
  assert.equal(rt.post({ secret: SECRET, lead: lead(), delivery: 'retry', note: 'x' }).ok, true);
});

test('malformed lead is rejected', () => {
  const rt = runtime();
  assert.equal(rt.post({ secret: SECRET, lead: lead({ phone: '123' }) }).error, 'invalid');
  assert.equal(rt.post({ secret: SECRET, lead: lead({ id: 'bad' }) }).error, 'invalid');
});
