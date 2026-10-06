import Img from './Img';
import { about, approach, network } from './content';

/** Men haqimda (ikkinchi fon): ofis rasmi + qisqa bio, ixcham yondashuv oqimi, keng jamoaviy rasm. */
export default function About() {
  return (
    <section id="about" className="section relative bg-mist">
      <div className="shell">
        {/* rasm + bio */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <figure data-reveal="image" className="lg:col-span-5">
            <div className="media relative aspect-[4/5] bg-card shadow-[var(--shadow-soft)] sm:aspect-[5/4] lg:aspect-[4/5]">
              <Img
                src="/avazbek/images/office.jpg"
                alt="Avazbek Meliqoziyev ofisda"
                width={640}
                height={640}
                fill
                className="object-cover object-[46%_28%]"
              />
            </div>
          </figure>

          <div className="lg:col-span-7">
                        <h2 data-reveal className="t-h2">{about.title}</h2>
            <p data-reveal className="t-lead mt-6 max-w-[30ch] text-ink">{about.lead}</p>
            <p data-reveal className="t-body mt-4 max-w-[48ch] text-graphite">{about.text}</p>
            <ul data-reveal className="mt-8 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
              {about.facts.map((f) => (
                <li key={f} className="t-small flex items-center gap-3 rounded-[12px] border border-line bg-card px-4 py-3 text-ink">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ishlash yondashuvi */}
        <div className="card mt-14 p-6 sm:p-8 lg:mt-20">
          <p data-reveal className="t-label text-graphite">{approach.title}</p>
          <ol className="relative mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
            <span aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-line lg:block" />
            {approach.steps.map((s, i) => {
              const last = i === approach.steps.length - 1;
              return (
                <li key={s} data-reveal style={{ ['--d' as string]: i }} className="relative">
                  <span
                    aria-hidden
                    className={`relative block h-[11px] w-[11px] rounded-full border-2 ${last ? 'border-accent bg-accent' : 'border-[#b9c6db] bg-card'}`}
                  />
                  <span className="mt-3 block font-mono text-[11px] text-graphite">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`t-h4 mt-0.5 block ${last ? 'text-accent' : ''}`}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* professional muhit */}
        <figure className="mt-14 lg:mt-20">
          <div data-reveal="image" className="media relative aspect-[4/3] bg-card shadow-[var(--shadow-soft)] sm:aspect-[16/9] lg:aspect-[21/9]">
            <Img
              src="/avazbek/images/corporate.jpg"
              srcSet="/avazbek/images/corporate-960.jpg 960w, /avazbek/images/corporate.jpg 1920w"
              sizes="(min-width: 1280px) 1184px, 100vw"
              width={1920}
              height={1440}
              alt="Avazbek Meliqoziyev hamkasblar va jamoa bilan"
              fill
              className="object-cover object-[50%_45%]"
            />
          </div>
          <figcaption className="mt-6 grid gap-2 lg:grid-cols-12 lg:gap-8">
            <span className="t-h3 lg:col-span-5">{network.title}</span>
            <span className="t-body max-w-[56ch] text-graphite lg:col-span-7 lg:pt-1">{network.text}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
