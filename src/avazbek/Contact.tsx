import { useRef } from 'react';
import { contact, contacts, site } from './content';
import { useScrollFx } from './motion';
import { Spark } from './Hero';

const items = [
  { k: 'Telegram', ...contacts.telegram, external: true },
  { k: 'Email', ...contacts.email, external: false },
  { k: 'Telefon', ...contacts.phone, external: false },
];

/** BOG'LANISH — qora yakun: ulkan binafsha gradient sarlavha va uchta katta matnli havola. Kartochka yo'q. */
export default function Contact() {
  const ref = useRef<HTMLElement>(null);

  useScrollFx(ref, ({ gsap }) => {
    gsap.from('[data-ct-line]', { yPercent: 110, stagger: 0.12, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: ref.current, start: 'top 70%' } });
    gsap.fromTo('[data-ct-glow]', { scale: 0.7, opacity: 0.4 }, { scale: 1.15, opacity: 1, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 } });
  });

  return (
    <>
      <section ref={ref} id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-night pb-16 pt-[clamp(6rem,4rem+8vw,11rem)] text-paper">
        <div data-ct-glow aria-hidden className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[90vmin] w-[120vmin] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgb(124_58_237/0.38),rgb(76_29_149/0.12)_45%,transparent_70%)] blur-2xl" />
        <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_bottom,#000_20%,transparent_70%)]" />

        <div className="shell relative">
          <p data-reveal className="t-label flex items-center gap-2 text-violet-4">
            <Spark className="h-3.5 w-3.5" /> Bog‘lanish
          </p>
          <h2 id="contact-title" className="t-mega mt-6 text-[clamp(3.5rem,13.5vw,14rem)] leading-[0.84]">
            <span className="block overflow-hidden pb-[0.04em]"><span data-ct-line className="block text-paper">Birga</span></span>
            <span className="block overflow-hidden pb-[0.06em]"><span data-ct-line className="grad-text block">ishlaymizmi?</span></span>
          </h2>
          <p data-reveal className="t-body mt-8 max-w-[44ch] text-muted">{contact.text}</p>

          <ul className="mt-14 border-t border-white/12 lg:mt-20">
            {items.map((c, i) => (
              <li key={c.k} data-reveal style={{ ['--d' as string]: i }}>
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group grid min-h-[88px] grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 border-b border-white/12 py-6 sm:grid-cols-[9rem_1fr_auto] lg:py-8"
                >
                  <span className="t-label text-muted transition-colors group-hover:text-violet-4">{c.k}</span>
                  <span className="col-start-1 row-start-2 min-w-0 text-[clamp(1.25rem,0.6rem+3.2vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-paper transition-colors duration-300 [overflow-wrap:anywhere] group-hover:text-violet-4 sm:col-start-2 sm:row-start-1">
                    {c.label.includes('@') && !c.label.startsWith('@') ? (
                      <>
                        {c.label.split('@')[0]}
                        <wbr />@{c.label.split('@')[1]}
                      </>
                    ) : (
                      c.label
                    )}
                  </span>
                  <span
                    aria-hidden
                    className="col-start-2 row-span-2 row-start-1 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-paper transition-[background-color,border-color,transform] duration-300 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-violet-2 sm:col-start-3 sm:row-span-1 lg:h-16 lg:w-16"
                  >
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 11L11 3M4.5 3H11v6.5" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-night text-paper">
        <div className="shell flex flex-col gap-3 py-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="t-small">
            <span className="t-mega text-lg tracking-wide">{site.shortName.replace('.', '')}<span className="text-violet-3">.</span></span>
            <span className="text-muted"> — {site.role}</span>
          </p>
          <p className="t-small flex items-center gap-6 text-muted">
            <a href="#top" className="u-link inline-flex min-h-[44px] items-center text-paper">Yuqoriga ↑</a>
            <span>© 2026</span>
          </p>
        </div>
      </footer>
    </>
  );
}
