import DownloadResume from './DownloadResume';
import { resume, site } from './content';

/** Rezyume — chapda profil va CTA, o‘ngda ingichka chiziqli tipografik qatorlar. Kartochka yo‘q. */
export default function Resume() {
  const rows = [
    { k: 'Yo‘nalishlar', v: resume.directions.map((d) => d.title), lead: true },
    ...resume.skillsUz.map((g) => ({ k: g.group, v: g.items, lead: false })),
  ];

  return (
    <section id="resume" className="section bg-paper">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        {/* profil */}
        <div className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <span aria-hidden data-reveal className="block h-px w-7 bg-accent" />
            <h2 data-reveal className="t-h2 mt-5">{resume.title}</h2>
            <div data-reveal className="mt-8 border-t border-ink/15 pt-6">
              <p className="t-h4">{site.name}</p>
              <p className="t-label mt-2 text-accent-ink">{resume.roles}</p>
              <p className="t-body mt-5 max-w-[38ch] text-graphite">{resume.summary}</p>
              <DownloadResume className="mt-8" />
            </div>
          </div>
        </div>

        {/* qatorlar */}
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
            <div
              key={r.k}
              data-reveal
              style={{ ['--d' as string]: i }}
              className="grid gap-3 border-b border-ink/15 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8"
            >
              <dt className="t-label flex items-baseline gap-3 pt-1 text-graphite">
                <span className="text-accent-ink">{String(i + 1).padStart(2, '0')}</span>
                {r.k}
              </dt>
              {r.lead ? (
                <dd>
                  <ul className="space-y-1.5">
                    {r.v.map((t) => (
                      <li key={t} className="t-h3">
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              ) : (
                <dd>
                  <ul className="flex flex-wrap gap-x-2 gap-y-2.5">
                    {r.v.map((t) => (
                      <li
                        key={t}
                        className="t-small rounded-full border border-ink/15 px-3 py-1.5 leading-none text-ink/85"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </dd>
              )}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
