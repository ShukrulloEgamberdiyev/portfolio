import { useRef } from 'react';
import DownloadResume from './DownloadResume';
import { resume, site } from './content';
import { useScrollFx } from './motion';

/** REZYUME — iliq-oq bo'lim: ulkan "REZYUME" so'zi, chapda ism va CTA, o'ngda ingichka chiziqli qatorlar. */
export default function Resume() {
  const ref = useRef<HTMLElement>(null);
  const rows = [
    { k: 'Yo‘nalishlar', v: resume.directions.map((d) => d.title), lead: true },
    ...resume.skillsUz.map((g) => ({ k: g.group, v: g.items, lead: false })),
  ];

  useScrollFx(ref, ({ gsap }) => {
    gsap.fromTo('[data-resume-word]', { xPercent: 6 }, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
  });

  return (
    <section ref={ref} id="resume" aria-labelledby="resume-title" className="section relative z-10 -mt-10 overflow-hidden rounded-t-[32px] bg-paper text-ink sm:-mt-14 sm:rounded-t-[48px]">
      <div aria-hidden className="data-grid pointer-events-none absolute inset-0 [--grid-c:rgb(11_11_16/0.045)]" />
      <div className="relative">
        <h2 id="resume-title" data-resume-word className="t-mega whitespace-nowrap text-center text-[clamp(5rem,22vw,22rem)] leading-[0.8] text-ink">
          {resume.title}
          <span aria-hidden className="grad-text">.</span>
        </h2>
      </div>

      <div className="shell relative mt-12 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <p data-reveal className="t-mega text-[clamp(2rem,1.5rem+2vw,3.25rem)]">{site.name}</p>
            <p data-reveal className="t-label mt-3 text-accent">{resume.roles}</p>
            <p data-reveal className="t-body mt-5 max-w-[38ch] text-graphite">{resume.summary}</p>
            <div data-reveal>
              <DownloadResume className="mt-8" />
            </div>
          </div>
        </div>

        <dl className="min-w-0 border-t border-ink/15 lg:col-span-7 lg:col-start-6">
          {resume.experience.length > 0 ? (
            <div data-reveal className="grid gap-3 border-b border-ink/15 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
              <dt className="t-label pt-1 text-graphite">Tajriba</dt>
              <dd className="space-y-2">
                {resume.experience.map((x) => (
                  <p key={x.role + x.company} className="t-body">
                    <span className="font-semibold">{x.role}</span> — {x.company}
                    {x.period ? <span className="text-graphite"> · {x.period}</span> : null}
                  </p>
                ))}
              </dd>
            </div>
          ) : null}
          {rows.map((r, i) => (
            <div key={r.k} data-reveal style={{ ['--d' as string]: i }} className="grid gap-4 border-b border-ink/15 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8">
              <dt className="t-label flex items-baseline gap-3 pt-1 text-graphite">
                <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                {r.k}
              </dt>
              <dd>
                {r.lead ? (
                  <ul className="space-y-1">
                    {r.v.map((t) => (
                      <li key={t} className="t-mega text-[clamp(1.75rem,1.3rem+1.6vw,2.75rem)] transition-colors hover:text-accent">
                        {t}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {r.v.map((t) => (
                      <li key={t} className="t-small rounded-full border border-ink/15 px-3 py-1.5 leading-none text-ink transition-colors hover:border-accent hover:text-accent">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
