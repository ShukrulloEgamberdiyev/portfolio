import Img from './Img';
import { about, approach, network } from './content';

/**
 * Men haqimda (to‘q ko‘k): ofis rasmi + qisqa bio, ixcham yondashuv oqimi, keng jamoaviy rasm.
 * Barcha rasmlar bir xil konteyner kengligida va bir xil burchak (6px) bilan.
 */
export default function About() {
  return (
    <section id="about" className="section relative bg-coal text-paper">
      <div className="shell">
        {/* rasm + bio */}
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <figure data-reveal="image" className="lg:col-span-5">
            <div className="media relative aspect-[4/5] bg-paper/10 sm:aspect-[5/4] lg:aspect-[4/5]">
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

          <div className="lg:col-span-6 lg:col-start-7">
            <span aria-hidden data-reveal className="block h-px w-7 bg-accent" />
            <h2 data-reveal className="t-h2 mt-5">{about.title}</h2>
            <p data-reveal className="t-h3 mt-8 max-w-[26ch] font-medium text-paper">{about.lead}</p>
            <p data-reveal className="t-body mt-5 max-w-[46ch] text-paper/65">{about.text}</p>
            <ul data-reveal className="t-small mt-10 grid grid-cols-1 border-t border-paper/15 text-paper/85 min-[420px]:grid-cols-2">
              {about.facts.map((f, i) => (
                <li
                  key={f}
                  className={`flex items-center gap-3 border-b border-paper/15 py-3.5 ${i % 2 === 1 ? 'min-[420px]:pl-5' : 'min-[420px]:pr-5'}`}
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ishlash yondashuvi — ixcham gorizontal oqim */}
        <div className="mt-20 grid gap-6 border-t border-paper/15 pt-8 lg:mt-28 lg:grid-cols-12 lg:gap-8">
          <p data-reveal className="t-label text-accent lg:col-span-3 lg:pt-1">{approach.title}</p>
          <ol className="relative grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:col-span-9 lg:grid-cols-6">
            <span aria-hidden className="absolute left-0 right-0 top-[5px] hidden h-px bg-paper/20 lg:block" />
            {approach.steps.map((s, i) => {
              const last = i === approach.steps.length - 1;
              return (
                <li key={s} data-reveal style={{ ['--d' as string]: i }} className="relative">
                  <span
                    className={`relative block h-[11px] w-[11px] rounded-full border ${last ? 'border-accent bg-accent' : 'border-paper/50 bg-coal'}`}
                    aria-hidden
                  />
                  <span className="mt-4 block font-mono text-[11px] text-paper/45">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`t-h4 mt-1 block ${last ? 'text-accent' : ''}`}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* professional muhit */}
        <figure className="mt-20 lg:mt-28">
          <div data-reveal="image" className="media relative aspect-[4/3] bg-paper/10 sm:aspect-[16/9] lg:aspect-[21/9]">
            <Img
              src="/avazbek/images/corporate.jpg"
              srcSet="/avazbek/images/corporate-960.jpg 960w, /avazbek/images/corporate.jpg 1920w"
              sizes="(min-width: 1360px) 1264px, 100vw"
              width={1920}
              height={1440}
              alt="Avazbek Meliqoziyev hamkasblar va jamoa bilan"
              fill
              className="object-cover object-[50%_45%]"
            />
          </div>
          <figcaption className="mt-6 grid gap-3 lg:grid-cols-12 lg:gap-8">
            <span className="t-h3 lg:col-span-5">{network.title}</span>
            <span className="t-small max-w-[56ch] text-paper/65 lg:col-span-6 lg:col-start-7 lg:pt-2">{network.text}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
