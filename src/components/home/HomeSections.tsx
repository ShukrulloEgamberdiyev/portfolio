import { useState } from 'react';
import { useLang } from '../../i18n';
import { useHome } from '../../i18n/home';
import { SECTION_IDS } from '../../data/site';
import { ctaClick } from '../../lib/analytics';
import { onAnchorClick } from '../../lib/scroll';
import { LeadForm } from '../../forms/LeadForm';
import { Button } from '../../ui/Button';
import { Headline } from '../../ui/Headline';
import { Label } from '../../ui/Label';
import { Reveal, riseStyle } from '../../ui/Reveal';

const toApply = (location: string) => (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
  ctaClick(location);
  onAnchorClick(e as React.MouseEvent<HTMLAnchorElement>, SECTION_IDS.apply);
};

/* ───────── Hero: who, what problem, what benefit, one CTA ───────── */

export function HomeHero() {
  const h = useHome().hero;
  const { lang } = useLang();
  return (
    <section id="top" className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24 lg:pt-40">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[14%] h-[60vh] w-[90vw] -translate-x-1/2 rounded-full opacity-30 blur-[110px]"
        style={{ background: 'radial-gradient(closest-side, rgba(50,91,255,0.55), rgba(31,63,217,0.15) 60%, transparent)' }} />
      <div className="shell relative">
        <p className="eyebrow fade-in" style={riseStyle(0.2, 0, 1)}>
          <span className="mr-2 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-violet" />
          {h.eyebrow}
        </p>
        <Headline key={lang} as="h1" immediate delay={0.15} lines={h.lines} className="display-xl mt-6 lg:mt-10" />

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-end">
          <div className="rise lg:col-span-6" style={riseStyle(0.7, 20, 1)}>
            <p className="text-[1.05rem] font-medium text-bone sm:text-[1.15rem]">{h.audience}</p>
            <p className="lead mt-4 max-w-[52ch]">{h.sub}</p>
          </div>
          <div className="rise flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-6 lg:justify-end" style={riseStyle(0.85, 20, 1)}>
            <Button href={`#${SECTION_IDS.apply}`} onClick={toApply('hero')}>{h.cta}</Button>
            <a href="#tizim" onClick={(e) => onAnchorClick(e, 'tizim')} className="tap text-[0.95rem] text-mist underline decoration-line-strong underline-offset-4 transition-colors hover:text-bone">
              {h.secondary}
            </a>
          </div>
        </div>

        {/* The chain, as a single readable line — the whole offer at a glance. */}
        <div className="rise mt-14 border-t border-line pt-6 lg:mt-20" style={riseStyle(1, 16, 1)}>
          <p className="eyebrow">{h.chainLabel}</p>
          <ol className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 font-mono text-[11.5px] uppercase tracking-[0.1em] text-bone/85 sm:text-[12px]">
            {h.chain.map((c, i) => (
              <li key={c} className="flex items-center gap-2">
                <span className={`border px-2.5 py-1.5 ${i === 4 ? 'border-violet text-bone' : 'border-line-strong'}`}>{c}</span>
                {i < h.chain.length - 1 && <span aria-hidden className="text-violet">→</span>}
              </li>
            ))}
          </ol>
        </div>

        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3 lg:mt-16">
          {h.benefits.map((b, i) => (
            <li key={b.t} className="rise bg-ink p-6 lg:p-8" style={riseStyle(1.1 + i * 0.08, 16, 0.9)}>
              <p className="font-mono text-[11px] text-violet">0{i + 1}</p>
              <h2 className="mt-3 text-[1.2rem] font-semibold tracking-[-0.015em]">{b.t}</h2>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{b.d}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Problems a business owner recognises ───────── */

export function HomeProblems() {
  const p = useHome().problems;
  return (
    <section aria-labelledby="problems-title" className="border-t border-line py-20 lg:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label>{p.label}</Label>
          <Headline id="problems-title" lines={p.title} className="display-md mt-6" />
          <Reveal><p className="lead mt-8">{p.intro}</p></Reveal>
        </div>
        <ol className="lg:col-span-7 lg:pt-14">
          {p.items.map((it, i) => (
            <Reveal as="li" key={it.t} delay={i * 0.06} className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-line py-7 last:border-b">
              <span className="font-mono text-[12px] text-ash">0{i + 1}</span>
              <div>
                <h3 className="text-[1.2rem] font-semibold leading-snug tracking-[-0.015em] sm:text-[1.35rem]">{it.t}</h3>
                <p className="mt-2 max-w-[60ch] text-[0.98rem] leading-relaxed text-mist">{it.d}</p>
              </div>
            </Reveal>
          ))}
          <Reveal as="li" className="mt-8 list-none text-[1.05rem] font-medium text-bone"><span className="mr-2 text-violet">→</span>{p.closing}</Reveal>
        </ol>
      </div>
    </section>
  );
}

/* ───────── Services: an index with expandable detail, not a wall of equal cards ───────── */

export function HomeServices() {
  const s = useHome().services;
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id={SECTION_IDS.expertise} aria-labelledby="services-title" className="border-t border-line py-20 lg:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>{s.label}</Label>
            <Headline id="services-title" lines={s.title} className="display-md mt-6" />
          </div>
          <Reveal className="lg:col-span-5"><p className="lead">{s.intro}</p></Reveal>
        </div>
        <ul className="mt-14 border-t border-line">
          {s.items.map((it, i) => {
            const on = open === i;
            const panel = `svc-panel-${i}`;
            return (
              <li key={it.name} className="border-b border-line">
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={panel} onClick={() => setOpen(on ? null : i)}
                    className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-start gap-4 py-6 text-left sm:grid-cols-[3.5rem_1fr_1fr_auto] sm:items-center">
                    <span className="pt-1 font-mono text-[12px] text-ash sm:pt-0">{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[1.25rem] font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-white sm:text-[1.5rem]">{it.name}</span>
                    <span className="col-start-2 text-[0.95rem] leading-relaxed text-mist sm:col-start-3">{it.summary}</span>
                    <span aria-hidden className={`col-start-3 row-start-1 flex h-9 w-9 items-center justify-center border border-line-strong font-mono text-[14px] transition-transform duration-300 sm:col-start-4 ${on ? 'rotate-45 border-violet text-violet' : ''}`}>+</span>
                    <span className="sr-only">{on ? s.close : s.open}</span>
                  </button>
                </h3>
                <div id={panel} hidden={!on} className="pb-8 sm:pl-[4.5rem]">
                  <dl className="grid gap-x-10 gap-y-6 md:grid-cols-2">
                    <div>
                      <dt className="eyebrow">{s.parts.does}</dt>
                      <dd className="mt-3">
                        <ul className="space-y-1.5 text-[0.97rem] text-bone/90">
                          {it.does.map((d) => <li key={d} className="flex gap-2"><span aria-hidden className="text-violet">—</span>{d}</li>)}
                        </ul>
                      </dd>
                    </div>
                    <div>
                      <dt className="eyebrow">{s.parts.gets}</dt>
                      <dd className="mt-3 text-[0.97rem] leading-relaxed text-bone/90">{it.gets}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow">{s.parts.needs}</dt>
                      <dd className="mt-3 text-[0.97rem] leading-relaxed text-mist">{it.needs}</dd>
                    </div>
                    <div>
                      <dt className="eyebrow">{s.parts.limits}</dt>
                      <dd className="mt-3 text-[0.97rem] leading-relaxed text-mist">{it.limits}</dd>
                    </div>
                  </dl>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────── CRM + Meta CAPI: the chain as a diagram, then what is ready and what is configured ───────── */

function Chain({ steps, loop, badge }: { steps: { t: string; d: string }[]; loop: string; badge: string }) {
  return (
    <figure className="relative">
      <ol className="relative grid gap-0 lg:grid-cols-7">
        {steps.map((s, i) => {
          const crm = i === 4;
          const capi = i === steps.length - 1;
          return (
            <li key={s.t} className="relative flex lg:block">
              {/* connector: vertical on phones, horizontal on desktop */}
              <span aria-hidden className="absolute left-[15px] top-8 bottom-0 w-px bg-line-strong lg:left-auto lg:right-0 lg:top-[15px] lg:h-px lg:w-full lg:translate-x-1/2" style={{ display: i === steps.length - 1 ? 'none' : undefined }} />
              <span aria-hidden className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[11px] ${crm ? 'border-violet bg-violet text-white' : capi ? 'border-violet text-violet' : 'border-line-strong bg-ink text-mist'}`}>
                {i + 1}
              </span>
              <div className="pb-7 pl-4 pr-3 lg:pl-0 lg:pt-5">
                <p className={`text-[1rem] font-semibold leading-tight ${crm || capi ? 'text-bone' : 'text-bone/90'}`}>{s.t}</p>
                {crm && <p className="mt-1 inline-block bg-violet/15 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-bone">{badge}</p>}
                <p className="mt-1.5 text-[0.86rem] leading-snug text-mist">{s.d}</p>
              </div>
            </li>
          );
        })}
      </ol>
      {/* Feedback loop: CAPI → Ads */}
      <figcaption className="mt-2 flex items-center gap-3 border border-dashed border-violet/50 px-4 py-3 text-[0.9rem] text-bone/90">
        <svg width="28" height="16" viewBox="0 0 28 16" fill="none" aria-hidden className="shrink-0 text-violet">
          <path d="M26 4H6a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h3" stroke="currentColor" strokeWidth="1.4" />
          <path d="M7 8l3 3-3 3" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        {loop}
      </figcaption>
    </figure>
  );
}

export function HomeCrm() {
  const c = useHome().crm;
  return (
    <section id="tizim" aria-labelledby="crm-title" className="relative overflow-hidden border-t border-line py-20 lg:py-32">
      <div aria-hidden className="pointer-events-none absolute -right-[20vw] top-0 h-[70vh] w-[70vw] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(closest-side, rgba(50,91,255,0.6), transparent)' }} />
      <div className="shell relative">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>{c.label}</Label>
            <Headline id="crm-title" lines={c.title} className="display-md mt-6" />
          </div>
          <Reveal className="lg:col-span-5"><p className="lead">{c.intro}</p></Reveal>
        </div>

        <Reveal className="mt-14 border border-line bg-surface-1/60 p-5 sm:p-8 lg:mt-20">
          <p className="eyebrow mb-6">{c.diagram.label}</p>
          <Chain steps={c.diagram.steps} loop={c.diagram.loop} badge={c.diagram.crmBadge} />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h3 className="eyebrow flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-full bg-emerald-400" />{c.readyLabel}</h3>
            <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
              {c.ready.map((r, i) => (
                <Reveal as="li" key={r.t} delay={(i % 2) * 0.05} className="border-t border-line py-5">
                  <p className="text-[1.05rem] font-semibold tracking-[-0.01em]">{r.t}</p>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-mist">{r.d}</p>
                </Reveal>
              ))}
            </ul>
            <h3 className="eyebrow mt-10 flex items-center gap-2"><span aria-hidden className="h-2 w-2 rounded-full border border-violet" />{c.setupLabel}</h3>
            <ul className="mt-4">
              {c.setup.map((r) => (
                <li key={r.t} className="border-t border-dashed border-line-strong py-5">
                  <p className="text-[1.05rem] font-semibold tracking-[-0.01em]">{r.t}</p>
                  <p className="mt-2 text-[0.93rem] leading-relaxed text-mist">{r.d}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-6 lg:col-span-5">
            <Reveal className="border border-violet/40 bg-violet/[0.06] p-6 sm:p-8">
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.015em]">{c.capi.title}</h3>
              <p className="mt-4 text-[0.97rem] leading-relaxed text-bone/85">{c.capi.text}</p>
              <p className="mt-4 border-t border-line pt-4 text-[0.9rem] leading-relaxed text-mist">{c.capi.not}</p>
            </Reveal>
            <Reveal delay={0.08} className="border border-line p-6 sm:p-8">
              <h3 className="text-[1.25rem] font-semibold tracking-[-0.015em]">{c.pricing.title}</h3>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-mist">{c.pricing.text}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Cases: problem → work → result → term (result/term only when verified) ───────── */

export function HomeCases() {
  const c = useHome().cases;
  return (
    <section id={SECTION_IDS.work} aria-labelledby="cases-title" className="border-t border-line py-20 lg:py-32">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>{c.label}</Label>
            <Headline id="cases-title" lines={c.title} className="display-md mt-6" />
          </div>
          <Reveal className="lg:col-span-5"><p className="lead">{c.intro}</p></Reveal>
        </div>
        <div className="mt-14 overflow-hidden border-t border-line">
          {c.items.map((it, i) => (
            <Reveal key={it.name} delay={i * 0.04} className="grid gap-4 border-b border-line py-8 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-3">
                <p className="text-[1.2rem] font-semibold tracking-[-0.015em]">{it.name}</p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ash">{it.industry}</p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-2 lg:col-span-9 lg:grid-cols-3">
                <div>
                  <dt className="eyebrow">{c.fields.problem}</dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed text-bone/90">{it.problem}</dd>
                </div>
                <div>
                  <dt className="eyebrow">{c.fields.work}</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {it.work.map((w) => <span key={w} className="border border-line-strong px-2 py-1 text-[0.82rem] text-bone/85">{w}</span>)}
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">{c.fields.result}{it.term ? ` · ${c.fields.term}` : ''}</dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed">
                    {it.result ? <span className="text-bone">{it.result}{it.term ? ` · ${it.term}` : ''}</span> : <span className="text-ash">{c.noResult}</span>}
                  </dd>
                </div>
              </dl>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── Process ───────── */

export function HomeProcess() {
  const p = useHome().process;
  return (
    <section id={SECTION_IDS.process} aria-labelledby="process-title" className="border-t border-line py-20 lg:py-32">
      <div className="shell">
        <Label>{p.label}</Label>
        <Headline id="process-title" lines={p.title} className="display-md mt-6" />
        <ol className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
          {p.steps.map((s, i) => (
            <Reveal as="li" key={s.t} delay={i * 0.06} className="flex flex-col bg-ink p-6 lg:min-h-[300px]">
              <span className="font-mono text-[12px] text-violet">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-4 text-[1.2rem] font-semibold tracking-[-0.015em]">{s.t}</h3>
              <p className="mt-3 text-[0.93rem] leading-relaxed text-mist">{s.d}</p>
              <p className="mt-auto pt-6 text-[0.85rem] leading-snug text-bone/80"><span className="eyebrow mr-2">{p.youLabel}:</span>{s.you}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────── Fit ───────── */

export function HomeFit() {
  const f = useHome().fit;
  return (
    <section aria-labelledby="fit-title" className="border-t border-line py-20 lg:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Label>{f.label}</Label>
          <Headline id="fit-title" lines={f.title} className="display-md mt-6" />
        </div>
        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8">
          <Reveal>
            <h3 className="eyebrow">{f.industriesLabel}</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {f.industries.map((x) => <li key={x} className="border border-line-strong px-3 py-2 text-[0.95rem]">{x}</li>)}
            </ul>
            <h3 className="eyebrow mt-10">{f.notLabel}</h3>
            <ul className="mt-4 space-y-2 text-[0.95rem] text-mist">
              {f.not.map((x) => <li key={x} className="flex gap-2"><span aria-hidden>×</span>{x}</li>)}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h3 className="eyebrow">{f.needLabel}</h3>
            <ul className="mt-4 space-y-2.5 text-[0.97rem] text-bone/90">
              {f.need.map((x) => <li key={x} className="flex gap-2"><span aria-hidden className="text-violet">✓</span>{x}</li>)}
            </ul>
            <p className="mt-8 border-t border-line pt-6 text-[0.93rem] leading-relaxed text-mist">{f.price}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */

export function HomeFaq() {
  const f = useHome().faq;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="savollar" aria-labelledby="faq-title" className="border-t border-line py-20 lg:py-32">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Label>{f.label}</Label>
          <Headline id="faq-title" lines={f.title} className="display-md mt-6" />
        </div>
        <ul className="border-t border-line lg:col-span-8">
          {f.items.map((it, i) => {
            const on = open === i;
            return (
              <li key={it.q} className="border-b border-line">
                <h3>
                  <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} onClick={() => setOpen(on ? null : i)}
                    className="flex w-full items-start justify-between gap-6 py-5 text-left text-[1.08rem] font-medium leading-snug hover:text-white">
                    {it.q}
                    <span aria-hidden className={`mt-0.5 font-mono text-[16px] text-violet transition-transform duration-300 ${on ? 'rotate-45' : ''}`}>+</span>
                  </button>
                </h3>
                <div id={`faq-${i}`} hidden={!on} className="pb-6 pr-8 text-[0.97rem] leading-relaxed text-mist">{it.a}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Application ───────── */

export function HomeApply({ compact = false }: { compact?: boolean }) {
  const a = useHome().apply;
  const { lang } = useLang();
  return (
    <section id={SECTION_IDS.apply} aria-labelledby="apply-title" className={`scroll-mt-20 border-t border-line ${compact ? 'py-16 lg:py-24' : 'py-20 lg:py-32'}`}>
      <div className="shell grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Label>{a.label}</Label>
          <Headline id="apply-title" lines={a.title} className="display-md mt-6" />
          <p className="lead mt-8">{a.text}</p>
          <ul className="mt-8 space-y-2.5 text-[0.95rem] text-bone/85">
            {a.points.map((p) => <li key={p} className="flex gap-2"><span aria-hidden className="text-violet">✓</span>{p}</li>)}
          </ul>
        </div>
        <div className="border border-line bg-surface-1/70 p-5 sm:p-8 lg:col-span-7">
          <LeadForm formId="sayt" lang={lang} />
        </div>
      </div>
    </section>
  );
}
