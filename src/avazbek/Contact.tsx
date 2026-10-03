import { contact, contacts, site } from "./content";

const items = [
  { k: "Telegram", ...contacts.telegram, external: true },
  { k: "Email", ...contacts.email, external: false },
  { k: "Telefon", ...contacts.phone, external: false },
];

export default function Contact() {
  return (
    <>
      <section id="contact" className="bg-paper py-24 sm:py-32 lg:py-40">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p data-reveal className="kicker text-graphite">
              <span className="text-accent">●</span> Contact
            </p>
            <h2 data-reveal className="mt-5 text-[15vw] font-semibold leading-[0.86] tracking-[-0.065em] sm:text-[96px] lg:text-[104px]">
              Birga <span className="em">ishlaymizmi?</span>
            </h2>
            <p data-reveal className="mt-8 max-w-sm text-[16px] leading-relaxed text-graphite">{contact.text}</p>
          </div>

          <ul className="lg:col-span-6 lg:col-start-7 lg:self-end">
            {items.map((c, i) => (
              <li key={c.k} data-reveal style={{ ["--d" as string]: i }}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-end justify-between gap-4 border-t border-ink/15 py-6 transition-colors last:border-b hover:text-accent sm:py-8"
                >
                  <span className="min-w-0">
                    <span className="kicker block text-graphite group-hover:text-accent">{c.k}</span>
                    <span className="mt-2 block text-[clamp(16px,4.5vw,22px)] font-semibold tracking-[-0.03em] [overflow-wrap:anywhere] sm:text-[30px] lg:text-[28px] xl:text-[32px]">
                      {c.label}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-ink/15 text-lg transition-[transform,background-color,color,border-color] duration-500 group-hover:-rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-white"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="bg-ink text-paper">
        <div className="shell flex flex-col gap-8 py-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[28px] font-semibold tracking-[-0.04em]">
              {site.name}
              <span className="text-accent">.</span>
            </p>
            <p className="mt-1 text-[14px] text-paper/50">{site.role}</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[14px] text-paper/70">
            <li><a className="hover:text-paper" href={contacts.telegram.href} target="_blank" rel="noopener noreferrer">Telegram</a></li>
            <li><a className="hover:text-paper" href={contacts.email.href}>Email</a></li>
            <li><a className="hover:text-paper" href={contacts.phone.href}>Phone</a></li>
          </ul>
          <p className="text-[13px] text-paper/40">© 2026 {site.name}</p>
        </div>
      </footer>
    </>
  );
}
