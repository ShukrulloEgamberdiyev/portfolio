import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

// The server validates against its own copy of the answer options: keep both lists identical.
const content = await readFile(new URL('../src/content/avtosalon.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(content, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } }).outputText;
const { OPT, REGIONS } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const gs = await readFile(new URL('../docs/apps-script.gs', import.meta.url), 'utf8');
const sandbox = {}; vm.createContext(sandbox); vm.runInContext(`${gs}\nthis.__AV = AV;`, sandbox);
const AV = JSON.parse(JSON.stringify(sandbox.__AV));

test('server option lists match the form options exactly', () => {
  assert.deepEqual(AV.regions, REGIONS);
  for (const key of ['carTypes', 'branches', 'stock', 'marketingOwner', 'targetStatus', 'budget', 'monthlySales', 'salesStaff', 'rop', 'crm', 'leadSystem', 'goals']) {
    assert.deepEqual(AV[key], OPT[key], key);
  }
});

test('agreed marketing + advertising budget options are unchanged', () => {
  assert.deepEqual(OPT.budget, ['$2,000–3,000', '$3,000–5,000', '$5,000–7,000', '$7,000–10,000+']);
});
