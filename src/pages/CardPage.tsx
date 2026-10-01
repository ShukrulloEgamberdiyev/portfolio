import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import mark from '../assets/fazo-mark.png';
import { CardForm } from '../components/card/CardForm';
import { CONTACT } from '../data/site';
import { contactBlock as C, identity as I, servicesBlock as S } from '../content/card';
import { captureAttribution } from '../lib/tracking';

/* ───────── kichik ikonlar (bir xil chiziq qalinligi) ───────── */
const ic = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true } as const;
const IconInstagram = () => <svg {...ic}><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" /></svg>;
const IconTelegram = () => <svg {...ic}><path d="M21 4.5 3.5 11.3l5.6 2 2 6.2 3.1-3.9 4.8 3.6L21 4.5Z" strokeLinejoin="round" /><path d="m9.1 13.3 7.4-5.2" /></svg>;
const IconPhone = () => <svg {...ic}><path d="M5 4h3.5l1.6 4.2-2.1 1.4a11 11 0 0 0 6.4 6.4l1.4-2.1L20 15.5V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.6 1.5 1.5 0 0 1 5 4Z" strokeLinejoin="round" /></svg>;
const IconOut = ({ className = '' }: { className?: string }) => <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden className={className}><path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.4" /></svg>;

/* ───────── 1. Brend ───────── */
function Identity() {
  return (
    <header className="flex flex-col items-center text-center">
      <img src={mark} alt="FAZO Digital" width={466} height={440} className="h-[52px] w-auto sm:h-[60px]" />
      <h1 className="mt-5 flex items-baseline gap-[0.3em] text-[1.65rem] font-bold uppercase leading-none tracking-[-0.03em] sm:text-[1.9rem]">
        FAZO<span className="font-light tracking-[0.01em] text-mist">DIGITAL</span>
      </h1>
      <p className="mt-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-mist">
        {I.services.map((s, i) => (
          <span key={s}>{i > 0 && <span aria-hidden className="mx-2 text-violet">•</span>}{s}</span>
        ))}
      </p>
      <p className="mt-5 max-w-[30ch] text-[1.02rem] leading-[1.5] text-bone/85">{I.positioning}</p>
    </header>
  );
}

/* ───────── 3. Biz nima qilamiz? — bitta matn maydoni, uchta tab ───────── */
function Services() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const n = S.tabs.length;
    const to = e.key === 'ArrowRight' ? (active + 1) % n : e.key === 'ArrowLeft' ? (active - 1 + n) % n : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    setActive(to);
    tabRefs.current[to]?.focus();
  };
  return (
    <section aria-labelledby="card-services" className="mt-11">
      <h2 id="card-services" className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-mist">{S.heading}</h2>
      <div role="tablist" aria-labelledby="card-services" className="mt-4 grid grid-cols-3 gap-1.5 border border-line p-1.5">
        {S.tabs.map((t, i) => {
          const on = i === active;
          return (
            <button key={t.id} ref={(el) => { tabRefs.current[i] = el; }} type="button" role="tab" id={`tab-${t.id}`}
              aria-selected={on} aria-controls="card-services-panel" tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)} onKeyDown={onKey} data-cursor="hover"
              className={`min-h-11 px-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 min-[360px]:text-[11.5px] min-[360px]:tracking-[0.12em] ${on ? 'bg-bone text-ink' : 'text-bone/75 hover:bg-bone/[0.05] hover:text-bone'}`}>
              {t.label}
            </button>
          );
        })}
      </div>
      {/* Uchala matn bitta katakda ustma-ust turadi: balandlik eng uzun matnga teng, tab almashganda sahifa sakramaydi. */}
      <div id="card-services-panel" role="tabpanel" aria-labelledby={`tab-${S.tabs[active].id}`} tabIndex={0}
        className="grid border-x border-b border-line px-4 py-5 outline-none sm:px-5">
        {S.tabs.map((t, i) => {
          const on = i === active;
          return (
            <p key={t.id} aria-hidden={!on}
              className={`[grid-area:1/1] text-[0.97rem] leading-[1.6] text-bone/85 transition-[opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] ${on ? 'visible translate-y-0 opacity-100' : 'invisible translate-y-1 opacity-0'}`}>
              {t.text}
            </p>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── 4. Aloqa ───────── */
function ContactRow({ href, icon, label, value, external }: { href: string; icon: ReactNode; label: string; value: string; external?: boolean }) {
  return (
    <a href={href} data-cursor="hover" {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex min-h-[60px] items-center gap-3.5 border-b border-line px-1 py-2.5 transition-colors last:border-b-0 hover:bg-bone/[0.03]">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-line-strong text-bone/90 transition-colors group-hover:border-violet group-hover:text-bone">{icon}</span>
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-mono text-[11px] font-medium uppercase leading-none tracking-[0.12em] text-bone">{label}</span>
        <span className="whitespace-nowrap text-[0.92rem] leading-none text-mist">{value}</span>
      </span>
      <IconOut className="shrink-0 text-ash transition-colors group-hover:text-bone" />
    </a>
  );
}

function Contact({ onRegister }: { onRegister: () => void }) {
  return (
    <section aria-labelledby="card-contact" className="mt-11">
      <h2 id="card-contact" className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-mist">{C.heading}</h2>
      <button type="button" onClick={onRegister} data-cursor="hover" aria-haspopup="dialog"
        className="group relative mt-4 inline-flex min-h-[60px] w-full items-center justify-center gap-4 overflow-hidden bg-bone px-6 font-mono text-[12.5px] font-semibold uppercase tracking-[0.16em] text-ink">
        <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-violet transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
        <span className="relative group-hover:text-white">{C.register}</span>
        <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">→</span>
      </button>
      <div className="mt-3 border border-line px-3">
        <ContactRow href={CONTACT.instagram.url} external icon={<IconInstagram />} label={C.instagram} value={CONTACT.instagram.handle} />
        <ContactRow href={CONTACT.telegram.url} external icon={<IconTelegram />} label={C.telegram} value={CONTACT.telegram.handle} />
        <ContactRow href={CONTACT.phone.url} icon={<IconPhone />} label={C.call} value={CONTACT.phone.display} />
      </div>
    </section>
  );
}

/* ───────── Sahifa ───────── */
export default function CardPage() {
  const [open, setOpen] = useState(false);
  useEffect(() => { captureAttribution(); }, []);
  const openForm = useCallback(() => setOpen(true), []);
  const closeForm = useCallback(() => setOpen(false), []);

  return (
    <>
      {/* Yengil statik yorug‘lik — asosiy saytdagi binafsha "atmosfera"ning sokin varianti. */}
      <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-0 h-[70vh] opacity-60"
        style={{ background: 'radial-gradient(60% 55% at 50% 0%, rgba(91,77,255,0.22), rgba(47,69,255,0.06) 55%, transparent 80%)' }} />

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[460px] flex-col px-4 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-10 sm:px-6 sm:pt-16">
        <Identity />

        {/* 2. Asosiy sayt — ikkinchi darajali tugma */}
        <a href={I.siteUrl} data-cursor="hover"
          className="group relative mt-7 inline-flex min-h-[52px] w-full items-center justify-center gap-3 overflow-hidden border border-line-strong px-6 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone/60">
          <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-bone/[0.06] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100" />
          <span className="relative">{I.siteLabel}</span>
          <IconOut className="relative text-mist transition-colors group-hover:text-bone" />
        </a>

        <Services />
        <Contact onRegister={openForm} />

        {/* 5. Footer */}
        <footer className="mt-auto flex items-center justify-between gap-3 pt-12 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ash">
          <span>FAZO Digital © 2026</span>
          <a href={I.siteUrl} className="transition-colors hover:text-bone">fazodigital.uz</a>
        </footer>
      </div>

      <CardForm open={open} onClose={closeForm} />
    </>
  );
}
