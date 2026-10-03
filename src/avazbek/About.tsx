import Img from './Img';
import { about, approach, network } from './content';

/** Men haqimda — split rasm + qisqa bio, yondashuv oqimi, so'ng cinematic jamoaviy rasm (bitta yaxlit bo'lim). */
export default function About() {
  return (
    <section id="about" className="relative bg-coal text-paper">
      {/* split: full-bleed office photo + bio */}
      <div className="grid lg:grid-cols-2">
        <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:min-h-[600px]">
          <Img
            src="/avazbek/images/office.jpg"
            alt="Avazbek Meliqoziyev ofisda"
            width={640}
            height={640}
            fill
            className="object-cover object-[48%_30%] "
          />
        </div>

        <div className="flex flex-col justify-between gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24 xl:px-20">
          <div>
            <p data-reveal className="kicker flex items-center gap-2.5 text-accent">
              <span className="h-px w-8 bg-accent" aria-hidden />
              Men haqimda
            </p>
            <h2 data-reveal className="mt-6 text-[clamp(52px,9vw,112px)] font-semibold leading-[0.85] tracking-[-0.065em]">
              {about.title}
            </h2>
          </div>
          <div>
            <p data-reveal className="max-w-xl text-pretty text-[24px] font-medium leading-[1.25] tracking-[-0.025em] sm:text-[30px]">
              {about.lead}
            </p>
            <p data-reveal className="mt-5 max-w-md text-[16px] leading-relaxed text-paper/55">{about.text}</p>
            <ul data-reveal className="mt-10 grid grid-cols-2 border-t border-paper/15 text-[14px] text-paper/80">
              {about.facts.map((f, i) => (
                <li key={f} className={`border-b border-paper/15 py-3.5 ${i % 2 === 1 ? 'pl-4' : 'pr-4'}`}>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* approach — horizontal visual flow */}
      <div className="shell py-16 sm:py-24">
        <p data-reveal className="kicker text-accent">{approach.title}</p>
        <ol className="relative mt-10 grid grid-cols-2 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
          <span aria-hidden className="absolute left-0 right-0 top-[7px] hidden h-px bg-paper/20 lg:block" />
          {approach.steps.map((s, i) => {
            const last = i === approach.steps.length - 1;
            return (
              <li key={s} data-reveal style={{ ['--d' as string]: i }} className="relative pr-4">
                <span className={`relative block h-[15px] w-[15px] rounded-full border ${last ? 'border-accent bg-accent' : 'border-paper/40 bg-coal'}`} />
                <span className="mt-5 block font-mono text-[11px] text-paper/40">{String(i + 1).padStart(2, '0')}</span>
                <span className={`mt-1 block text-[24px] font-semibold tracking-[-0.035em] sm:text-[30px] ${last ? 'text-accent' : ''}`}>{s}</span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* professional environment — cinematic continuation */}
      <figure className="relative">
        <div data-reveal="image" className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] lg:aspect-[21/9]">
          <Img
            src="/avazbek/images/corporate.jpg"
            srcSet="/avazbek/images/corporate-960.jpg 960w, /avazbek/images/corporate.jpg 1920w"
            sizes="100vw"
            width={1920}
            height={1440}
            alt="Avazbek Meliqoziyev hamkasblar va jamoa bilan"
            fill
            className="object-cover object-[50%_45%] "
          />
        </div>
        <figcaption className="shell flex flex-col gap-3 py-8 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
          <span className="text-[22px] font-semibold tracking-[-0.03em] sm:text-[26px]">{network.title}</span>
          <span className="max-w-xl text-[15px] leading-relaxed text-paper/55 sm:text-right">{network.text}</span>
        </figcaption>
      </figure>
    </section>
  );
}
