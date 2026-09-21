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
  await assert.rejects(deliverApplication(endpoint, {}), SyntaxError);
  mocked.mock.mockImplementation(async () => { throw new TypeError('network failed'); });
  await assert.rejects(deliverApplication(endpoint, {}), /network failed/);
});
