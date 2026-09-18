import { useLang } from '../i18n';
import { CLIENTS } from '../data/site';

function Row({ items, reverse = false, duration }: { items: typeof CLIENTS; reverse?: boolean; duration: number }) {
  const doubled = [...items, ...items];
  return (
    <div className="group/row marquee-mask overflow-hidden">
      <ul className="flex w-max items-center group-hover/row:[animation-play-state:paused]"
        style={{ animation: `marquee ${duration}s linear infinite`, animationDirection: reverse ? 'reverse' : 'normal' }}>
        {doubled.map((c, i) => (
          <li key={i} aria-hidden={i >= items.length} className="flex items-center">
            <span className="whitespace-nowrap px-6 text-[1.6rem] font-semibold uppercase tracking-[-0.03em] text-ash/70 grayscale transition-colors duration-500 hover:text-bone sm:px-10 sm:text-[2.4rem] lg:text-[3rem]">
              {c.logo ? <img src={c.logo} alt={c.name} className="h-10 w-auto opacity-50 grayscale transition hover:opacity-100 hover:grayscale-0" /> : c.name}
            </span>
            <span aria-hidden className="h-1.5 w-1.5 bg-line-strong" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ClientMarquee() {
  const { t } = useLang();
  const half = Math.ceil(CLIENTS.length / 2);
  return (
    <section aria-labelledby="clients-title" className="relative py-20 lg:py-28">
      <div className="shell mb-10 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <h2 id="clients-title" className="eyebrow">{t.clients.title}</h2>
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ash">{t.clients.note}</p>
      </div>
      <div className="space-y-3 sm:space-y-5">
        <Row items={CLIENTS.slice(0, half)} duration={48} />
        <Row items={CLIENTS.slice(half)} duration={54} reverse />
      </div>
    </section>
  );
}
