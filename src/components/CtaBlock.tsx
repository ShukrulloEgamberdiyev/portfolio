import { useLang } from '../i18n';
import { CONTACT } from '../data/site';
import { Button } from '../ui/Button';
import { Headline } from '../ui/Headline';
import { Reveal } from '../ui/Reveal';

/** Closing call to action used on every inner page. */
export function CtaBlock() {
  const { p } = useLang();
  return (
    <section className="relative overflow-hidden border-t border-line py-24 lg:py-36">
      <span aria-hidden className="pointer-events-none absolute -bottom-[40vh] left-1/2 h-[80vh] w-[110vw] -translate-x-1/2 rounded-[50%] opacity-30 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(91,77,255,0.5), transparent)' }} />
      <div className="shell relative grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <Headline lines={[{ t: p.common.ctaTitle, accent: true }]} className="display-md" />
          <Reveal><p className="lead mt-6">{p.common.ctaText}</p></Reveal>
        </div>
        <Reveal className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end" delay={0.1}>
          <Button to="/apply">{p.common.ctaButton}</Button>
          <Button variant="ghost" href={CONTACT.telegram.url} external>{p.common.ctaSecondary}</Button>
        </Reveal>
      </div>
    </section>
  );
}
