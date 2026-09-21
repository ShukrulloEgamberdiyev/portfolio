import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LANGS, useLang } from '../i18n';
import { Button } from '../ui/Button';
import { Logo } from './Logo';

export function Nav() {
  const { t, lang, setLang } = useLang();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, 'change', (v) => setCompact(v > 40));

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const { pathname } = useLocation();
  const links = [
    { to: '/expertise', label: t.nav.expertise },
    { to: '/work', label: t.nav.work },
    { to: '/process', label: t.nav.process },
    { to: '/about', label: t.nav.about },
    { to: '/insights', label: t.nav.insights },
  ];
  const close = () => setOpen(false);
  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${compact ? 'border-b border-line bg-ink/70 backdrop-blur-xl' : 'border-b border-transparent'}`}
        style={{ top: 0, paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <nav aria-label="Primary" className={`shell flex items-center justify-between transition-[height] duration-500 ${compact ? 'h-16' : 'h-20 lg:h-24'}`}>
          <Link to="/" onClick={close} aria-label="FAZO Digital" data-cursor="hover"><Logo /></Link>

          <ul className="hidden items-center gap-7 whitespace-nowrap xl:flex 2xl:gap-9">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} onClick={close} className={`group relative text-[14px] transition-colors hover:text-bone ${isActive(l.to) ? 'text-bone' : 'text-mist'}`}>
                  {l.label}
                  <span className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-bone transition-transform duration-500 group-hover:scale-x-100 ${isActive(l.to) ? 'scale-x-100' : 'scale-x-0'}`} />
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden items-center gap-1 font-mono text-[11px] uppercase tracking-[0.12em] sm:flex" role="group" aria-label={t.nav.language}>
              {LANGS.map((l) => (
                <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l}
                  className={`px-1.5 py-1 transition-colors ${lang === l ? 'text-bone' : 'text-ash hover:text-mist'}`}>{l}</button>
              ))}
            </div>
            <div className="hidden md:block">
              <Button to="/apply" onClick={close} className={`${compact ? 'h-10' : 'h-11'} min-h-0! py-0! px-5 text-[11px] whitespace-nowrap`}>{t.nav.cta}</Button>
            </div>
            <button onClick={() => setOpen(true)} className="flex h-11 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] xl:hidden" aria-expanded={open} aria-controls="mobile-menu">
              {t.nav.menu}
              <span aria-hidden className="flex flex-col gap-[5px]"><span className="block h-px w-5 bg-bone" /><span className="block h-px w-3 self-end bg-bone" /></span>
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-menu" role="dialog" aria-modal="true"
            initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[70] flex flex-col bg-surface-1"
            style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <div className="shell flex h-20 items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="h-11 font-mono text-[11px] uppercase tracking-[0.14em]">{t.nav.close} ✕</button>
            </div>
            <ul className="shell mt-6 flex flex-1 flex-col justify-center gap-1">
              {links.map((l, i) => (
                <motion.li key={l.to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                  <Link to={l.to} onClick={close} className="flex items-baseline justify-between border-b border-line py-4 text-[2.4rem] font-bold uppercase leading-none tracking-[-0.04em]">
                    {l.label}<span className="font-mono text-[11px] font-normal text-ash">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="shell flex items-center justify-between gap-4 pb-8 pt-6">
              <div className="flex gap-1 font-mono text-[12px] uppercase tracking-[0.12em]">
                {LANGS.map((l) => (
                  <button key={l} onClick={() => setLang(l)} aria-pressed={lang === l} className={`px-2 py-2 ${lang === l ? 'text-bone' : 'text-ash'}`}>{l}</button>
                ))}
              </div>
              <Button to="/apply" onClick={close} magnetic={false} className="h-12 min-h-0! py-0! px-5 text-[11px]">{t.nav.cta}</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
