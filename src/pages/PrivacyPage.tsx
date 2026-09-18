import { useLang } from '../i18n';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../ui/Reveal';

export default function PrivacyPage() {
  const { p } = useLang();
  return (
    <>
      <PageHeader label={p.privacy.updated} title={p.privacy.title} />
      <section className="shell mt-16 lg:mt-24">
        <div className="max-w-[68ch] border-t border-line">
          {p.privacy.sections.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.04} className="border-b border-line py-8">
              <h2 className="text-[1.3rem] font-bold tracking-[-0.03em] sm:text-[1.6rem]">{s.h}</h2>
              <p className="mt-3 leading-relaxed text-mist">{s.body}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <div className="h-24 lg:h-36" />
    </>
  );
}
