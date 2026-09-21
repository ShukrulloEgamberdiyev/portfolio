import { useLang } from '../i18n';
import { CONTACT, SIGNATURE } from '../data/site';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  const { t } = useLang();
  const nav = [
    { to: '/expertise', label: t.nav.expertise }, { to: '/work', label: t.nav.work },
    { to: '/process', label: t.nav.process }, { to: '/about', label: t.nav.about },
    { to: '/insights', label: t.nav.insights }, { to: '/apply', label: t.apply.label },
  ];
  const linkCls = 'text-mist transition-colors hover:text-bone';
  return (
    <footer className="relative overflow-hidden border-t border-line pt-16" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="shell relative">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="text-[18px]" />
            <p className="mt-3 text-mist">{t.footer.tagline}</p>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.16em] text-ash">{SIGNATURE}</p>
          </div>
          <nav aria-label={t.footer.navLabel} className="md:col-span-3">
            <p className="eyebrow">{t.footer.navLabel}</p>
            <ul className="mt-5 space-y-2.5">
              {nav.map((n) => <li key={n.to}><Link to={n.to} className={linkCls}>{n.label}</Link></li>)}
            </ul>
          </nav>
          <div className="md:col-span-2">
            <p className="eyebrow">{t.footer.socialLabel}</p>
            <ul className="mt-5 space-y-2.5">
              <li><a className={linkCls} href={CONTACT.instagram.url} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a className={linkCls} href={CONTACT.telegram.url} target="_blank" rel="noopener noreferrer">Telegram</a></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="eyebrow">{t.footer.legalLabel}</p>
            <ul className="mt-5 space-y-2.5"><li><Link className={linkCls} to="/privacy">{t.footer.privacy}</Link></li></ul>
          </div>
        </div>

        <p aria-hidden className="pointer-events-none outline-text-faint mt-20 select-none whitespace-nowrap text-center text-[24vw] font-bold uppercase leading-[0.75] tracking-[-0.07em] lg:mt-28">
          FAZO
        </p>

        <div className="flex flex-col justify-between gap-3 border-t border-line py-6 font-mono text-[11px] uppercase tracking-[0.14em] text-ash sm:flex-row">
          <span>{t.footer.rights}</span>
          <span>{t.footer.location}</span>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left uppercase tracking-[0.14em] hover:text-bone sm:text-right">{t.footer.top} ↑</button>
        </div>
      </div>
    </footer>
  );
}
