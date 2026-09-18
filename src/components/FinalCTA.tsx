import { useLang } from '../i18n';
import { CONTACT, SECTION_IDS } from '../data/site';
import { onAnchorClick } from '../lib/scroll';
import { Button } from '../ui/Button';
import { Headline } from '../ui/Headline';
import { Reveal } from '../ui/Reveal';

export function FinalCTA() {
  const { t } = useLang();
  const f = t.final;
  const contacts = [
    { label: f.labels.telegram, value: CONTACT.telegram.handle, href: CONTACT.telegram.url, external: true },
    { label: f.labels.instagram, value: CONTACT.instagram.handle, href: CONTACT.instagram.url, external: true },
    { label: f.labels.phone, value: CONTACT.phone.display, href: CONTACT.phone.url },
    { label: f.labels.location, value: f.location },
    { label: f.labels.web, value: CONTACT.domain, href: `https://${CONTACT.domain}` },
  ];

  return (
    <section id={SECTION_IDS.contact} aria-labelledby="final-title" className="relative overflow-hidden border-t border-line pb-16 pt-28 lg:pb-24 lg:pt-48">
      <span aria-hidden className="pointer-events-none absolute -bottom-[40vh] left-1/2 h-[90vh] w-[120vw] -translate-x-1/2 rounded-[50%] opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(91,77,255,0.55), rgba(47,69,255,0.2) 55%, transparent)' }} />
      <div className="shell relative">
        <Headline id="final-title" lines={f.title} className="display-xl" />
        <div className="mt-14 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-5"><p className="lead">{f.sub}</p></Reveal>
          <Reveal className="flex flex-wrap gap-3 lg:col-span-7 lg:justify-end" delay={0.1}>
            <Button href={`#${SECTION_IDS.apply}`} onClick={(e) => onAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, SECTION_IDS.apply)}>{f.cta}</Button>
            <Button variant="ghost" href={CONTACT.telegram.url} external>{f.telegram}</Button>
          </Reveal>
        </div>

        <dl className="mt-20 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:mt-28 lg:grid-cols-5">
          {contacts.map((c) => (
            <div key={c.label} className="border-b border-line py-6 sm:pr-6 lg:border-b-0">
              <dt className="eyebrow">{c.label}</dt>
              <dd className="mt-3 text-[1.1rem] font-medium tracking-[-0.01em]">
                {c.href ? (
                  <a href={c.href} data-cursor="hover" className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 hover:bg-[length:100%_1px]" {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{c.value}</a>
                ) : c.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
