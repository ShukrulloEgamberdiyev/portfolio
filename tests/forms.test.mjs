import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const load = async (rel) => {
  const src = await readFile(new URL(rel, import.meta.url), 'utf8');
  const out = ts.transpileModule(src, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(out).toString('base64')}`);
};
const phone = await load('../src/lib/phone.ts');

test('phone: a complete number is accepted in every way people type or paste it', () => {
  for (const v of ['901234567', '90 123 45 67', '(90) 123-45-67', '+998 90 123 45 67', '998901234567', '+998901234567']) {
    assert.equal(phone.phoneError(v), '', v);
    assert.equal(phone.phoneForServer(v), '+998 90 123 45 67', v);
  }
  assert.equal(phone.phoneError('998123456'), '', 'a 9-digit number that happens to start with 998 is kept as typed');
  assert.equal(phone.phoneForServer('998123456'), '+998 99 812 34 56');
});

test('phone: extra digits are reported, never silently cut into a "valid" number', () => {
  for (const v of ['9012345678', '90 123 45 67 8', '99890123456789']) {
    assert.notEqual(phone.phoneError(v), '', v);
    assert.ok(phone.phoneDigits(v).length > 9, `${v} keeps its extra digits visible`);
    assert.ok(phone.formatPhone(phone.phoneDigits(v)).replace(/\D/g, '').length > 9);
  }
  assert.match(phone.phoneError('9012345678'), /ortiqcha/);
});

test('phone: incomplete, empty and impossible numbers are rejected with a reason', () => {
  assert.match(phone.phoneError(''), /kiriting/);
  assert.match(phone.phoneError('90 123 45'), /to‘liq emas/);
  assert.notEqual(phone.phoneError('012345678'), '');
});

/* The general application: "Telefon yoki Telegram". */
test('contact: full phone numbers and @usernames pass; bare words and cut numbers do not', async () => {
  const src = await readFile(new URL('../src/lib/submit.ts', import.meta.url), 'utf8');
  const body = src.slice(src.indexOf('export function isContact'), src.indexOf('/** Flattens the general application'));
  const js = ts.transpileModule(body, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  for (const ok of ['+998 90 123 45 67', '998901234567', '+7 900 123-45-67', '@fazo_digital', 't.me/fazo_digital', 'https://t.me/fazo_digital']) assert.equal(mod.isContact(ok), true, ok);
  for (const bad of ['', 'salom', 'fazo_digital', '@abc', '+998 90 123 45', '+998 90 123 45 67 8', '12345', 'tel: yo‘q']) assert.equal(mod.isContact(bad), false, bad);
});

test('general form: only an explicit confirmation counts — the health-check answer is never a success', async () => {
  const src = await readFile(new URL('../src/lib/submit.ts', import.meta.url), 'utf8');
  const body = src.slice(src.indexOf('export function isSiteConfirmation'));
  const js = ts.transpileModule(body, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
  const { isSiteConfirmation } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  const id = 'SA-MUH60GB01-A1B2C3D4E5';
  assert.equal(isSiteConfirmation({ ok: true, saved: true, submissionId: id }, id), true);
  assert.equal(isSiteConfirmation({ ok: true }, id), true, 'older deployment');
  assert.equal(isSiteConfirmation({ ok: true, status: 'FAZO application endpoint' }, id), false, 'health check');
  assert.equal(isSiteConfirmation({ ok: true, saved: true, submissionId: 'SA-OTHER-ID' }, id), false);
  assert.equal(isSiteConfirmation({ ok: true, saved: false, submissionId: id }, id), false);
});
