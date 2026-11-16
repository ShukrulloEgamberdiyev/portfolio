import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

/**
 * The rule every landing form relies on: a success screen only when the receiver proves that
 * this submission id holds this data — with the current receiver and with an older deployment.
 */
const load = async (rel, replace = (s) => s) => {
  const src = replace(await readFile(new URL(rel, import.meta.url), 'utf8'));
  const out = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(out).toString('base64')}`);
};
const transportUrl = `data:text/javascript;base64,${Buffer.from(ts.transpileModule(await readFile(new URL('../src/lib/applicationTransport.ts', import.meta.url), 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText).toString('base64')}`;
const { submitConfirmed } = await load('../src/lib/confirmedSubmit.ts', (s) => s.replace("'./applicationTransport'", JSON.stringify(transportUrl)));

const build = (fingerprint) => (submissionId) => ({ submissionId, fingerprint, name: 'x' });
let ids = 0;
const newId = () => `QR-NEWID0${++ids}-AAAAAAAA`;
const receiver = (answers) => { const calls = []; return { calls, deliver: async (_e, p) => { calls.push(p); return answers(p, calls.length); } }; };
const rejectsWith = async (promise, detail) => assert.rejects(promise, (e) => e.code === 'bad_response' && e.detail === detail);

test('current receiver: matching fingerprint → success; fresh, duplicate and corrected rows alike', async () => {
  for (const extra of [{}, { duplicate: true }, { updated: true }]) {
    const r = receiver((p) => ({ ok: true, saved: true, submissionId: p.submissionId, fingerprint: p.fingerprint, ...extra }));
    const res = await submitConfirmed({ endpoint: 'x', build: build('fp-new'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: ['fp-old'], newId, deliver: r.deliver });
    assert.equal(res.submissionId, 'QR-AAAAAA1-BBBBBBBB');
    assert.equal(r.calls.length, 1);
  }
});

test('current receiver: the row holds other data → never a success', async () => {
  const r = receiver((p) => ({ ok: true, saved: true, duplicate: true, submissionId: p.submissionId, fingerprint: 'fp-old' }));
  await rejectsWith(submitConfirmed({ endpoint: 'x', build: build('fp-new'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: ['fp-old'], newId, deliver: r.deliver }), 'fingerprint_mismatch');
});

test('a bare {ok:true} (health answer) or an answer for another id is never a saved lead', async () => {
  for (const answer of [{ ok: true }, { ok: true, saved: true, submissionId: 'QR-OTHER00-XXXXXXXX' }, { ok: true, saved: 'yes', submissionId: 'QR-AAAAAA1-BBBBBBBB' }]) {
    const r = receiver(() => answer);
    await rejectsWith(submitConfirmed({ endpoint: 'x', build: build('fp'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: [], newId, deliver: r.deliver }), '');
  }
});

test('older receiver (no fingerprint): first save and identical retry are trusted', async () => {
  const fresh = receiver((p) => ({ ok: true, saved: true, submissionId: p.submissionId }));
  await submitConfirmed({ endpoint: 'x', build: build('fp'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: [], newId, deliver: fresh.deliver });
  assert.equal(fresh.calls.length, 1);
  const retry = receiver((p) => ({ ok: true, saved: true, duplicate: true, submissionId: p.submissionId }));
  await submitConfirmed({ endpoint: 'x', build: build('fp'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: ['fp', 'fp'], newId, deliver: retry.deliver });
  assert.equal(retry.calls.length, 1);
});

test('older receiver: reply lost, data changed, same id answers "duplicate" → the changed data is stored under a new id, not dropped', async () => {
  const stored = new Map([['QR-AAAAAA1-BBBBBBBB', 'fp-old']]);
  const r = receiver((p) => {
    if (stored.has(p.submissionId)) return { ok: true, saved: true, duplicate: true, submissionId: p.submissionId };
    stored.set(p.submissionId, p.fingerprint);
    return { ok: true, saved: true, submissionId: p.submissionId };
  });
  const switched = [];
  const res = await submitConfirmed({ endpoint: 'x', build: build('fp-new'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: ['fp-old'], newId, onNewId: (id) => switched.push(id), deliver: r.deliver });
  assert.equal(r.calls.length, 2);
  assert.notEqual(res.submissionId, 'QR-AAAAAA1-BBBBBBBB');
  assert.deepEqual(switched, [res.submissionId]);
  assert.equal(stored.get(res.submissionId), 'fp-new', 'the corrected data really reached the receiver');
});

test('older receiver: unknown history (restored draft) + "duplicate" is not trusted either', async () => {
  const r = receiver((p, n) => (n === 1 ? { ok: true, saved: true, duplicate: true, submissionId: p.submissionId } : { ok: true, saved: true, submissionId: p.submissionId }));
  await submitConfirmed({ endpoint: 'x', build: build('fp'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: [], newId, deliver: r.deliver });
  assert.equal(r.calls.length, 2);
});

test('if the second attempt is not a confirmed fresh save, the failure is reported', async () => {
  const r = receiver((p) => ({ ok: true, saved: true, duplicate: true, submissionId: p.submissionId }));
  await rejectsWith(submitConfirmed({ endpoint: 'x', build: build('fp-new'), submissionId: 'QR-AAAAAA1-BBBBBBBB', earlier: ['fp-old'], newId, deliver: r.deliver }), 'fingerprint_mismatch');
});
