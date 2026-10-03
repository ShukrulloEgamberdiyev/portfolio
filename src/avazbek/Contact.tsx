import { contact, contacts, site } from './content';

const items = [
  { k: 'Telegram', ...contacts.telegram, external: true },
  { k: 'Email', ...contacts.email, external: false },
  { k: 'Telefon', ...contacts.phone, external: false },
];

/** Yakuniy ekran: katta sarlavha + katta matnli havolalar. Footer minimal. */
export default function Contact() {
  return (
    <>
      <section id="contact" className="bg-paper pb-16 pt-24 sm:pt-32 lg:pt-40">
        <div className="shell">
          <p data-reveal className="kicker flex items-center gap-2.5 text-graphite">
            <span className="h-px w-8 bg-accent" aria-hidden />
            Bog‘lanish
          </p>
          <h2 data-reveal className="mt-6 text-[clamp(30px,10vw,150px)] font-semibold uppercase leading-[0.86] tracking-[-0.06em]">
            Birga <br />
            ishlaymizmi?
          </h2>
          <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-8">
            <p data-reveal className="max-w-sm text-[16px] leading-relaxed text-graphite lg:col-span-4">{contact.text}</p>
            <ul className="lg:col-span-8">
              {items.map((c, i) => (
                <li key={c.k} data-reveal style={{ ['--d' as string]: i }}>
                  <a
                    href={c.href}
                    {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-t border-ink/15 py-6 last:border-b sm:py-7"
                  >
                    <span className="kicker w-full shrink-0 text-graphite sm:w-24">{c.k}</span>
                    <span className="u-link min-w-0 flex-1 text-[clamp(15px,4.6vw,44px)] font-semibold tracking-[-0.04em] [overflow-wrap:anywhere]">
                      {c.label}
                    </span>
                    <span aria-hidden className="shrink-0 text-[22px] transition-transform duration-500 text-accent group-hover:-translate-y-1 group-hover:translate-x-1">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="bg-coal text-paper">
        <div className="shell flex flex-col gap-4 py-8 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            <span className="font-semibold">{site.name}</span>
            <span className="text-paper/45"> — {site.role}</span>
          </p>
          <p className="flex items-center gap-6 text-paper/45">
            <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="u-link inline-flex min-h-[44px] items-center text-paper/80 hover:text-paper">
              Telegram ↗
            </a>
            <span>© 2026</span>
          </p>
        </div>
      </footer>
    </>
  );
}
