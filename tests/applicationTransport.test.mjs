import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/lib/applicationTransport.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { deliverApplication } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const endpoint = 'https://example.invalid/applications';

test('missing endpoint never sends or reports success', async (t) => {
  const fetch = t.mock.method(globalThis, 'fetch', () => assert.fail('must not send'));
  await assert.rejects(deliverApplication(undefined, {}), /not configured/);
  await assert.rejects(deliverApplication(' ', {}), /not configured/);
  assert.equal(fetch.mock.callCount(), 0);
});

test('explicit receiver acceptance succeeds and preserves the payload', async (t) => {
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, endpoint);
    assert.equal(options.method, 'POST');
    assert.equal(options.headers['Content-Type'], 'text/plain;charset=utf-8');
    assert.deepEqual(JSON.parse(options.body), { name: 'Test', lang: 'uz' });
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  });
  await deliverApplication(endpoint, { name: 'Test', lang: 'uz' });
});

for (const body of [{ ok: false, error: 'forbidden' }, { ok: false, error: 'rate_limited' }, {}, null, { ok: 'true' }]) {
  test(`HTTP 200 does not hide receiver rejection: ${JSON.stringify(body)}`, async (t) => {
    t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify(body)));
    await assert.rejects(deliverApplication(endpoint, {}), /not accepted/);
  });
}

test('HTTP errors, invalid JSON and network failures never report success', async (t) => {
  const mocked = t.mock.method(globalThis, 'fetch', async () => new Response('unavailable', { status: 503 }));
  await assert.rejects(deliverApplication(endpoint, {}), /503/);
  mocked.mock.mockImplementation(async () => new Response('<html>Sign in</html>'));
  await assert.rejects(deliverApplication(endpoint, {}), (e) => e.code === 'bad_response' && /SyntaxError/.test(e.message));
  mocked.mock.mockImplementation(async () => { throw new TypeError('network failed'); });
  await assert.rejects(deliverApplication(endpoint, {}), /network failed/);
});

test('timeouts and rejections carry a machine-readable reason', async (t) => {
  t.mock.method(globalThis, 'fetch', (url, options) => new Promise((_, reject) => options.signal.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))));
  await assert.rejects(deliverApplication(endpoint, {}, 30), (e) => e.code === 'timeout');
  t.mock.restoreAll();
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ ok: false, error: 'rate_limited' })));
  await assert.rejects(deliverApplication(endpoint, {}), (e) => e.code === 'rejected' && e.detail === 'rate_limited');
});

test('a duplicate acknowledgement is still a confirmed success', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ ok: true, duplicate: true })));
  const res = await deliverApplication(endpoint, {});
  assert.equal(res.duplicate, true);
});

test('6. a body that stalls after the headers still times out, and the timer is cleared', async (t) => {
  let cancelled = false;
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    const body = new ReadableStream({ start(c) { c.enqueue(new TextEncoder().encode('{"ok":')); }, cancel() { cancelled = true; } });
    options.signal.addEventListener('abort', () => { cancelled = true; });
    return new Response(body, { status: 200, headers: { 'Content-Type': 'application/json' } });
  });
  const started = Date.now();
  await assert.rejects(deliverApplication(endpoint, {}, 60), (e) => e.code === 'timeout');
  assert.ok(Date.now() - started < 1000, 'must not hang');
  assert.ok(cancelled, 'request is aborted');
});

test('a json() that never settles (non-abortable body) is still cut off by the time limit', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => ({ ok: true, status: 200, json: () => new Promise(() => {}) }));
  await assert.rejects(deliverApplication(endpoint, {}, 40), (e) => e.code === 'timeout');
});

test('server rejection carries the offending field', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ ok: false, error: 'invalid', field: 'phone' })));
  await assert.rejects(deliverApplication(endpoint, {}), (e) => e.code === 'rejected' && e.detail === 'invalid' && e.field === 'phone');
});

test('network failure is distinguished from timeout', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('Failed to fetch'); });
  await assert.rejects(deliverApplication(endpoint, {}, 1000), (e) => e.code === 'network');
});
