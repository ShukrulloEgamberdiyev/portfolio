import { useLang } from '../i18n';
import { STATS } from '../data/site';
import { CountUp } from '../ui/CountUp';
import { Reveal } from '../ui/Reveal';

export function AuthorityStrip() {
  const { t } = useLang();
  const items = [
    { value: <CountUp to={STATS.campaigns} suffix="+" />, label: t.stats.campaigns },
    { value: <CountUp to={STATS.clients} suffix="+" />, label: t.stats.clients },
    { value: <CountUp to={STATS.brands} suffix="+" />, label: t.stats.brands },
    { value: <span>{t.stats.funnelTop}</span>, label: t.stats.funnelBottom, small: true },
  ];
  return (
    <section aria-label="FAZO in numbers" className="relative mt-20 lg:mt-28">
      <div className="shell">
        <dl className="grid grid-cols-2 border-t border-line lg:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={i} delay={i * 0.08}
              className={`flex min-h-[150px] flex-col justify-between gap-6 border-line py-7 pr-4 lg:min-h-[190px] lg:py-9 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b lg:border-b-0' : ''} lg:border-r ${i === 3 ? 'lg:border-r-0' : ''} ${i % 2 === 1 ? 'pl-4 lg:pl-8' : 'lg:pl-8'} ${i === 0 ? 'lg:pl-0!' : ''}`}>
              <dt className="order-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mist">{it.label}</dt>
              <dd className={`order-1 font-bold uppercase leading-none tracking-[-0.045em] ${it.small ? 'text-[1.6rem] sm:text-[2.2rem] lg:text-[2.6rem]' : 'text-[3rem] sm:text-[4rem] lg:text-[5.25rem]'}`}>
                {it.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
