import DownloadResume from "./DownloadResume";
import { resume, site, contacts } from "./content";

export default function Resume() {
  const rows = [
    { k: "Yo‘nalishlar", items: resume.directions.map((d) => d.title), lead: true },
    ...resume.skills.map((g) => ({ k: g.group === "Marketing" ? "Skills" : g.group, items: g.items, lead: false })),
  ];

  return (
    <section id="resume" className="bg-paper py-24 sm:py-32 lg:py-40">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-8">
        {/* chap: profil */}
        <div className="min-w-0 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p data-reveal className="kicker text-graphite">
              <span className="text-accent">●</span> Curriculum vitae
            </p>
            <h2 data-reveal className="mt-5 text-[22vw] font-semibold leading-[0.8] tracking-[-0.07em] sm:text-[120px] lg:text-[136px]">
              Re<span className="em">sume</span>
            </h2>
            <div data-reveal className="mt-10 border-t border-ink pt-6">
              <p className="text-[24px] font-semibold tracking-[-0.03em]">{site.name}</p>
              <p className="mt-1 text-[14px] text-accent">{resume.roles}</p>
              <p className="mt-5 max-w-md text-[16px] leading-relaxed text-graphite">{resume.summary}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <DownloadResume />
                <a href={contacts.telegram.href} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Telegram ↗
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* o'ng: editorial ro'yxat */}
        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          {resume.experience.length > 0 ? (
            <div data-reveal className="grid gap-4 border-t border-ink/15 py-8 sm:grid-cols-[140px_1fr]">
              <p className="kicker pt-1 text-graphite">Experience</p>
              <ul className="space-y-3">
                {resume.experience.map((x) => (
                  <li key={x.role + x.company}>
                    <p className="text-[20px] font-semibold tracking-[-0.02em]">{x.role}</p>
                    <p className="text-[15px] text-graphite">
                      {x.company}
                      {x.period ? ` · ${x.period}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {rows.map((r, i) => (
            <div
              key={r.k}
              data-reveal
              style={{ ["--d" as string]: i }}
              className="grid gap-4 border-t border-ink/15 py-8 sm:grid-cols-[140px_1fr] last:border-b"
            >
              <p className="kicker pt-1.5 text-graphite">
                <span className="text-ink/30">{String(i + 1).padStart(2, "0")}</span> {r.k}
              </p>
              {r.lead ? (
                <ul className="space-y-1">
                  {r.items.map((t) => (
                    <li key={t} className="text-[28px] font-semibold leading-tight tracking-[-0.035em] sm:text-[34px]">
                      {t}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[19px] leading-[1.55] tracking-[-0.01em] text-ink/85 sm:text-[21px]">
                  {r.items.map((t, j) => (
                    <span key={t}>
                      <span className="whitespace-nowrap">{t}</span>
                      {j < r.items.length - 1 ? (
                        <>
                          {" "}
                          <span className="text-accent">/</span>{" "}
                        </>
                      ) : null}
                    </span>
                  ))}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
