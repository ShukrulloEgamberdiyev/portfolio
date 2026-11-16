import { chromium } from 'playwright';
import fs from 'node:fs';
const BASE='http://localhost:4173';
const routes = process.env.ROUTES.split(',');
const widths = (process.env.WIDTHS||'360,375,390,430,768,1024,1440').split(',').map(Number);
const js = process.env.NOJS !== '1';
const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox'] });
const out=[];
for (const w of widths) {
  const ctx = await browser.newContext({ viewport:{width:w,height:w<700?780:900}, javaScriptEnabled:js, isMobile:w<700, hasTouch:w<700, reducedMotion: process.env.RM==='1'?'reduce':'no-preference' });
  for (const r of routes) {
    const page = await ctx.newPage();
    const errs=[], bad=[];
    page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,200)); });
    page.on('pageerror', e=>errs.push('PAGEERR '+String(e).slice(0,200)));
    page.on('response', res=>{ if(res.status()>=400) bad.push(res.status()+' '+res.url()); });
    page.on('requestfailed', q=>bad.push('FAIL '+q.url()));
    await page.goto(BASE+r, {waitUntil:'load'}); await page.waitForTimeout(Number(process.env.WAIT||(js?1800:300)));
    const info = await page.evaluate(()=>{
      const de=document.documentElement; const vw=de.clientWidth;
      const over=[]; 
      for(const el of document.querySelectorAll('body *')){ const b=el.getBoundingClientRect(); if(b.width>0 && (b.right>vw+1||b.left<-1)){ const cs=getComputedStyle(el); let p=el,clipped=false; while(p=p.parentElement){const o=getComputedStyle(p); if(/hidden|clip|auto|scroll/.test(o.overflowX)){clipped=true;break;}} if(!clipped && cs.position!=='fixed') over.push(el.tagName+'.'+String(el.className).slice(0,50)+' r='+Math.round(b.right)); } }
      const h1=[...document.querySelectorAll('h1')].map(h=>h.innerText.replace(/\s+/g,' ').slice(0,70));
      // hidden text in first viewport
      const hidden=[]; for(const el of document.querySelectorAll('h1,h2,p,a,button')){ const b=el.getBoundingClientRect(); if(b.top<innerHeight&&b.bottom>0&&b.width>0){ let p=el,op=1; while(p&&p!==document.body){op*=parseFloat(getComputedStyle(p).opacity);p=p.parentElement;} if(op<0.3&&el.innerText.trim()) hidden.push(el.tagName+':'+el.innerText.trim().slice(0,30)+' op='+op.toFixed(2)); } }
      const small=[]; for(const el of document.querySelectorAll('a,button,select,input:not([type=hidden])')){ const b=el.getBoundingClientRect(); if(b.width>0&&b.height>0&&(b.height<32)&&getComputedStyle(el).display!=='inline'&&!el.closest('[aria-hidden=true]')) small.push(el.tagName+':'+(el.innerText||el.getAttribute('aria-label')||'').trim().slice(0,20)+' '+Math.round(b.width)+'x'+Math.round(b.height)); }
      const imgs=[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src);
      return {scrollW:de.scrollWidth,vw,over:over.slice(0,6),h1,hidden:hidden.slice(0,6),small:[...new Set(small)].slice(0,8),imgs,title:document.title};
    });
    out.push({w,r,hs:info.scrollW>info.vw, ...info, errs:[...new Set(errs)].slice(0,5), bad:[...new Set(bad)].slice(0,5)});
    if(process.env.SHOT) await page.screenshot({path:`./audit-shots/${process.env.SHOT}-${r.replace(/\//g,'_')||'home'}-${w}.png`, fullPage:process.env.FULL==='1'});
    await page.close();
  }
  await ctx.close();
}
await browser.close();
for(const o of out){ const flags=[]; if(o.hs)flags.push('HSCROLL '+o.scrollW+'>'+o.vw+' '+o.over.join(' | ')); if(o.h1.length!==1)flags.push('H1='+o.h1.length); if(o.hidden.length)flags.push('HIDDEN '+o.hidden.join(' | ')); if(o.errs.length)flags.push('ERR '+o.errs.join(' | ')); if(o.bad.length)flags.push('BAD '+o.bad.join(' | ')); if(o.imgs.length)flags.push('IMG '+o.imgs.join(',')); if(process.env.SMALL&&o.small.length)flags.push('SMALL '+o.small.join(' | ')); console.log(o.w, o.r, flags.length?flags.join(' ## '):'ok'); }
