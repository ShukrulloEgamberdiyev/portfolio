import DownloadResume from './DownloadResume';
import { resume, site } from './content';

/** Resume — print-dizayn hissi: chapda nom va CTA, o'ngda ingichka chiziqli qatorlar. Card yo'q. */
export default function Resume() {
  const rows = [
    { k: 'Yo‘nalishlar', v: resume.directions.map((d) => d.title) },
    ...resume.skills.map((g) => ({ k: g.group === 'Marketing' ? 'Skills' : g.group, v: g.items })),
  ];

  return (
    <section id="resume" className="bg-paper py-20 sm:py-28">
      <div className="shell">
        <div className="grid gap-12 border-t-2 border-ink pt-8 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-4">
            <p data-reveal className="kicker text-graphite">(03) / Resume</p>
            <h2 data-reveal className="mt-6 text-[clamp(56px,14vw,112px)] font-semibold leading-[0.82] tracking-[-0.07em]">
              Resume
            </h2>
            <div data-reveal className="mt-8">
              <p className="text-[22px] font-semibold tracking-[-0.03em]">{site.name}</p>
              <p className="mt-1 text-[14px] text-graphite">{resume.roles}</p>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-graphite">{resume.summary}</p>
              <DownloadResume className="mt-8" />
            </div>
          </div>

          <dl className="min-w-0 lg:col-span-7 lg:col-start-6">
            {resume.experience.length > 0 ? (
              <div data-reveal className="grid gap-3 border-b border-ink/15 py-6 sm:grid-cols-[150px_1fr]">
                <dt className="kicker pt-1 text-graphite">Experience</dt>
                <dd className="space-y-2">
                  {resume.experience.map((x) => (
                    <p key={x.role + x.company} className="text-[18px]">
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
                className="grid gap-3 border-b border-ink/15 py-6 first:pt-0 sm:grid-cols-[150px_1fr]"
              >
                <dt className="kicker pt-1.5 text-graphite">
                  <span className="text-ink/30">{String(i + 1).padStart(2, '0')}</span>&nbsp;&nbsp;{r.k}
                </dt>
                <dd
                  className={
                    i === 0
                      ? 'text-[26px] font-semibold leading-[1.15] tracking-[-0.035em] sm:text-[32px]'
                      : 'text-[17px] leading-[1.6] text-ink/85 sm:text-[19px]'
                  }
                >
                  {r.v.map((t, j) => (
                    <span key={t}>
                      <span className="whitespace-nowrap">{t}</span>
                      {j < r.v.length - 1 ? (i === 0 ? <br /> : <span className="text-ink/25"> / </span>) : null}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
