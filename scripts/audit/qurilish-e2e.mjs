import { chromium } from 'playwright';
const B='http://localhost:4173';
const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
const log=(k,v)=>console.log((v===true?'PASS':v===false?'FAIL':'INFO')+' '+k+(v!==true&&v!==false?': '+v:''));
async function fresh(url='/qurilish', w=390){
  const ctx = await browser.newContext({ viewport:{width:w,height:780}, isMobile:w<700, hasTouch:w<700 });
  const page = await ctx.newPage(); const reqs=[]; let mode='ok'; const store={};
  await page.route('**/script.google.com/**', async route=>{
    const p = JSON.parse(route.request().postData()); reqs.push(p);
    const m = typeof mode==='function'?mode(reqs.length,p):mode;
    if(m==='lost'){ store[p.submissionId]=p.fingerprint; return route.abort('connectionreset'); }
    if(m==='offline') return route.abort('internetdisconnected');
    if(m==='500') return route.fulfill({status:500,body:'err'});
    if(m==='html') return route.fulfill({status:200,contentType:'text/html',body:'<html>login</html>'});
    if(m==='health') return route.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"status":"x"}'});
    if(m==='old-dup') return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(store[p.submissionId]?{ok:true,saved:true,duplicate:true,submissionId:p.submissionId}:(store[p.submissionId]=p.fingerprint,{ok:true,saved:true,submissionId:p.submissionId}))});
    if(m==='slow') await new Promise(r=>setTimeout(r,3000));
    const had=store[p.submissionId]; store[p.submissionId]=p.fingerprint;
    return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,saved:true,submissionId:p.submissionId,fingerprint:p.fingerprint,...(had?(had===p.fingerprint?{duplicate:true}:{updated:true}):{})})});
  });
  await page.goto(B+url,{waitUntil:'load'}); await page.waitForTimeout(1500);
  return {ctx,page,reqs,setMode:m=>mode=m};
}
const fill=async(page,name='Test Sinov')=>{
  await page.fill('#name',name); await page.fill('#phone','901234567'); await page.fill('#company','Sinov Qurilish');
  await page.selectOption('#region','Toshkent shahri'); await page.locator('label:has-text("Sotuv boshlangan")').click(); await page.locator('label:has-text("Murojaatlar kam")').first().click();
};
const submit=page=>page.locator('form button[type=submit]').click();
const ok=page=>page.locator('text=Ro‘yxatdan o‘tdingiz').count();

// 1 /qurilish ataylab menyusiz (reklama landingi). Birinchi ekrandagi CTA formaga olib boradimi?
{ const {ctx,page}=await fresh();
  log('no site menu (by design)', (await page.locator('header button[aria-expanded], nav').count())===0);
  const cta=page.locator('a[href="#loyiha"]').first(); log('hero CTA visible on first screen', await cta.isVisible() && ((await cta.boundingBox())?.y ?? 9999) < 780);
  await cta.click(); await page.waitForTimeout(1500);
  const r=await page.locator('#loyiha-card').boundingBox(); log('CTA → form in viewport', !!r && r.y<780 && r.y+r.height>0);
  await ctx.close(); }
// 2 empty submit + aria
{ const {ctx,page,reqs}=await fresh(); await page.locator('#loyiha-card').scrollIntoViewIfNeeded(); await submit(page); await page.waitForTimeout(500);
  log('empty: no request', reqs.length===0);
  const a=await page.evaluate(()=>['name','phone','company','region'].map(id=>{const el=document.getElementById(id);const d=el.getAttribute('aria-describedby');return el.getAttribute('aria-invalid')==='true'&&!!d&&!!document.getElementById(d.split(' ').pop())}));
  log('aria-invalid+describedby on inputs', a.every(Boolean));
  log('focus on first error', await page.evaluate(()=>document.activeElement.id==='name'));
  await page.fill('#phone','9012345678'); await page.waitForTimeout(200);
  log('phone 10 digits kept visible', (await page.inputValue('#phone')).replace(/\D/g,'').length===10);
  log('phone 10 digits error', (await page.locator('#phone-err').innerText()).includes('ortiqcha'));
  await page.fill('#phone','+998 90 123 45 67'); log('paste +998 normalises', (await page.inputValue('#phone'))==='90 123 45 67');
  await page.screenshot({path:'./audit-shots/qr-errors.png'}); await ctx.close(); }
// 3 success + double click + payload
{ const {ctx,page,reqs}=await fresh('/qurilish?utm_source=meta&utm_campaign=test&utm_content='+'x'.repeat(3000)+'&fbclid='+'f'.repeat(1500)+'&junk='+'j'.repeat(2000));
  await fill(page); await page.locator('form button[type=submit]').dblclick(); await page.waitForTimeout(6500);
  log('double click → one request', reqs.length===1); log('success shown', (await ok(page))>0);
  const p=reqs[0]||{}; log('payload page<=1000', (p.page||'').length<=1000); log('utm_source', p.utm_source==='meta'); log('utm_content<=200', (p.utm_content||'').length<=200);
  log('phone canonical', p.phone==='+998 90 123 45 67'); log('formType/source', p.formType==='qurilish'&&p.source==='fazodigital.uz/qurilish'); log('page value', (p.page||'').slice(0,80));
  await ctx.close(); }
// 4 failures keep data, no success
for (const m of ['offline','500','html','health']) { const {ctx,page,reqs,setMode}=await fresh(); setMode(m); await fill(page); await submit(page); await page.waitForTimeout(6500);
  log(m+': no success', (await ok(page))===0); log(m+': alert shown', (await page.locator('[role=alert]').count())>0); log(m+': data kept', (await page.inputValue('#name'))==='Test Sinov');
  if(m==='500'){ const t=await page.locator('[role=alert]').innerText(); log('500: no tech detail', !/500|http|json|script\.google/i.test(t)); setMode('ok'); await submit(page); await page.waitForTimeout(2500); log('retry after error succeeds, same id', (await ok(page))>0 && reqs[0].submissionId===reqs[1].submissionId); }
  await ctx.close(); }
// 5 lost reply then changed data (new server)
{ const {ctx,page,reqs,setMode}=await fresh(); setMode('lost'); await fill(page); await submit(page); await page.waitForTimeout(6500);
  log('lost: no success', (await ok(page))===0); await page.fill('#name','Yangi Ism'); setMode('ok'); await submit(page); await page.waitForTimeout(2500);
  log('lost+changed: success', (await ok(page))>0); log('same id reused', reqs[0].submissionId===reqs[1].submissionId); log('second carries new data', reqs[1].name==='Yangi Ism' && reqs[1].fingerprint!==reqs[0].fingerprint); await ctx.close(); }
// 6 lost reply then changed data (OLD server: duplicate without fingerprint)
{ const {ctx,page,reqs,setMode}=await fresh(); setMode('lost'); await fill(page); await submit(page); await page.waitForTimeout(6500);
  await page.fill('#name','Yangi Ism'); setMode('old-dup'); await submit(page); await page.waitForTimeout(3000);
  log('old server: requests', String(reqs.length)); log('old server: resent under NEW id with new data', reqs.length===3 && reqs[2].submissionId!==reqs[0].submissionId && reqs[2].name==='Yangi Ism'); log('old server: success only after', (await ok(page))>0); await ctx.close(); }
// 7 slow + reload keeps draft
{ const {ctx,page}=await fresh(); await fill(page); await page.reload(); await page.waitForTimeout(1500); log('draft survives reload', (await page.inputValue('#name'))==='Test Sinov'); await ctx.close(); }
await browser.close();
