import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const source = await readFile(new URL('../docs/apps-script.gs', import.meta.url), 'utf8');
function receiver({ wrongSheet = false, failWrite = false } = {}) {
  const rows = [], cache = new Map(); let held = false;
  const sheet = { appendRow(row) { if (failWrite) throw Error('failed'); rows.push(row); } };
  const sandbox = {
    console: { error() {} },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getId: () => wrongSheet ? 'other' : '1pGD_lRrl9cz_CWWRQgRncFoJwShUz3K1qpiFFrcywYo', getSheetByName(name) { assert.equal(name,'Sayt arizalari'); return sheet; } }), flush() {} },
    LockService: { getScriptLock: () => ({ waitLock() { held = true; }, hasLock: () => held, releaseLock() { held = false; } }) },
    CacheService: { getScriptCache: () => ({ get: key => cache.get(key), put: (key,val) => cache.set(key,val) }) },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (alg,v) => createHash(alg).update(v).digest(), base64EncodeWebSafe: v=>v.toString('base64url'), formatDate: ()=>'2026092204' },
    ContentService: { MimeType: { JSON:'json' }, createTextOutput: text => ({ setMimeType: () => JSON.parse(text) }) },
  };
  vm.createContext(sandbox);vm.runInContext(source,sandbox);
  const send = data=>sandbox.doPost({postData:{contents:JSON.stringify(data)}});
  return {send,rows};
}
const data={token:'fazo-2026-maxfiy',elapsed:'5000',name:'TEST',company:'=bad()',industry:'auto',revenue:'private',spend:'<1k',budget:'2.5-4k',problem:'strategy',objective:'revenue',decision:'yes',contact:'@test_only'};
test('receiver appends to the selected tab and sanitises formula prefixes',()=>{ const r=receiver();assert.equal(r.send(data).ok,true);assert.equal(r.rows.length,1);assert.equal(r.rows[0][2],"'=bad()"); });
test('retries are acknowledged without adding a duplicate',()=>{ const r=receiver();r.send(data);assert.equal(r.send(data).duplicate,true);assert.equal(r.rows.length,1); });
test('rejected and malformed requests never report success',()=>{ const r=receiver(); for(const patch of [{token:'wrong'},{name:''},{hp:'bot'},{elapsed:'1'}])assert.equal(r.send({...data,...patch}).ok,false);assert.equal(r.rows.length,0); });
test('wrong workbook or failed append never reports success',()=>{for(const config of [{wrongSheet:true},{failWrite:true}]){const r=receiver(config);assert.equal(r.send(data).ok,false);assert.equal(r.rows.length,0);} });
