import Backdrop from './Backdrop';
import { contact, contacts, site } from './content';

const items = [
  { k: 'Telegram', ...contacts.telegram, external: true },
  { k: 'Email', ...contacts.email, external: false },
  { k: 'Telefon', ...contacts.phone, external: false },
];

/** Yakuniy kompozitsiya: chapda sarlavha va izoh, o‘ngda uchta katta, bosiladigan aloqa qatori. Footer minimal. */
export default function Contact() {
  return (
    <>
      <section id="contact" className="section relative overflow-hidden bg-paper">
        <Backdrop variant="rings" className="hidden md:block" />
        <div className="shell relative grid gap-12 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-6">
            <p data-reveal className="t-label eyebrow text-graphite">Bog‘lanish</p>
            <h2 data-reveal className="t-closing mt-5">
              Birga <br />
              ishlaymizmi?
            </h2>
            <p data-reveal className="t-body mt-8 max-w-[38ch] text-graphite">{contact.text}</p>
          </div>

          <ul className="card px-5 sm:px-7 lg:col-span-6">
            {items.map((c, i) => (
              <li key={c.k} data-reveal style={{ ['--d' as string]: i }} className="[&:last-child>a]:border-b-0">
                <a
                  href={c.href}
                  {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group flex min-h-[88px] items-center justify-between gap-4 border-b border-line py-5"
                >
                  <span className="min-w-0">
                    <span className="t-label block text-graphite transition-colors group-hover:text-accent">{c.k}</span>
                    <span className="mt-2 block text-[clamp(0.9375rem,0.6rem+1.4vw,1.5rem)] font-semibold leading-tight tracking-[-0.03em] text-ink transition-colors group-hover:text-accent [overflow-wrap:break-word]">
                      {c.label.includes('@') && !c.label.startsWith('@') ? (
                        <>
                          {c.label.split('@')[0]}
                          <wbr />@{c.label.split('@')[1]}
                        </>
                      ) : (
                        c.label
                      )}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-accent transition-colors duration-200 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                  >
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M3 11L11 3M4.5 3H11v6.5" />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="border-t border-line bg-paper text-ink">
        <div className="shell flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="t-small">
            <span className="font-semibold">{site.name}</span>
            <span className="text-graphite"> — {site.role}</span>
          </p>
          <p className="t-small flex items-center gap-6 text-graphite">
            <a
              href={contacts.telegram.href}
              target="_blank"
              rel="noopener noreferrer"
              className="u-link inline-flex min-h-[44px] items-center text-accent"
            >
              Telegram ↗
            </a>
            <span>© 2026</span>
          </p>
        </div>
      </footer>
    </>
  );
}
