import Img from "./Img";
import { about, approach, network } from "./content";

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ink pt-24 text-paper sm:pt-32 lg:pt-40">
      <div aria-hidden className="gridlines-dark pointer-events-none absolute inset-0" />

      {/* Intro: rasm + matn (asimmetrik) */}
      <div className="shell relative grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 lg:col-start-6 lg:row-start-1">
          <p data-reveal className="kicker text-paper/50">
            <span className="text-accent">●</span> About
          </p>
          <h2
            data-reveal
            className="mt-5 text-[17vw] font-semibold leading-[0.82] tracking-[-0.07em] sm:text-[110px] lg:text-[128px]"
          >
            Men <span className="em">haqimda</span>
          </h2>
          <p data-reveal className="mt-10 max-w-2xl text-pretty text-[24px] font-medium leading-[1.25] tracking-[-0.025em] sm:text-[30px]">
            {about.lead}
          </p>
          <p data-reveal className="mt-6 max-w-xl text-[17px] leading-relaxed text-paper/60">
            {about.text}
          </p>
          <ul data-reveal className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/15 sm:grid-cols-4">
            {about.facts.map((f) => (
              <li key={f} className="bg-ink px-4 py-4 text-[14px] leading-snug text-paper/85">
                {f}
              </li>
            ))}
          </ul>
        </div>

        <figure className="lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pt-40">
          <div data-reveal="image" className="relative aspect-[4/5] overflow-hidden rounded-[24px]">
            <Img
              src="/avazbek/images/office.jpg"
              alt="Avazbek Meliqoziyev ofisda"
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 32vw, 100vw"
              className="object-cover object-[52%_40%]"
            />
          </div>
          <figcaption className="kicker mt-4 flex justify-between text-paper/40">
            <span>Avazbek Meliqoziyev</span>
            <span>Toshkent</span>
          </figcaption>
        </figure>
      </div>

      {/* Ishlash yondashuvi — bitta vizual qator */}
      <div className="shell relative mt-24 lg:mt-32">
        <div className="flex flex-col gap-6 border-t border-paper/15 pt-8 lg:flex-row lg:items-center lg:gap-10">
          <p data-reveal className="kicker shrink-0 text-paper/50">{approach.title}</p>
          <ol className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-3">
            {approach.steps.map((s, i) => (
              <li key={s} data-reveal style={{ ["--d" as string]: i }} className="flex items-center gap-3">
                <span
                  className={`rounded-full border px-4 py-2 text-[15px] sm:text-[17px] ${
                    i === approach.steps.length - 1 ? "border-accent bg-accent text-white" : "border-paper/20"
                  }`}
                >
                  {s}
                </span>
                {i < approach.steps.length - 1 ? <span aria-hidden className="text-paper/40">→</span> : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Professional muhit — sarlavha tepada, rasm cinematic va dominant (matn yuzlar ustiga tushmaydi) */}
      <div className="relative mt-24 lg:mt-32">
        <div className="shell grid gap-6 pb-10 lg:grid-cols-12 lg:items-end lg:gap-8 lg:pb-14">
          <div className="lg:col-span-7">
            <p data-reveal className="kicker text-paper/50">
              <span className="text-accent">●</span> Network
            </p>
            <h3 data-reveal className="mt-4 text-[42px] font-semibold leading-[0.92] tracking-[-0.055em] sm:text-[64px] lg:text-[84px]">
              Professional <span className="em">muhit</span>
            </h3>
          </div>
          <p data-reveal className="max-w-md text-[16px] leading-relaxed text-paper/70 sm:text-[17px] lg:col-span-4 lg:col-start-9">
            {network.text}
          </p>
        </div>
        <div data-reveal="image" className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-[21/9]">
          <Img
            src="/avazbek/images/corporate.jpg"
            srcSet="/avazbek/images/corporate-960.jpg 960w, /avazbek/images/corporate.jpg 1920w"
            width={1920}
            height={1440}
            alt="Avazbek Meliqoziyev hamkasblar va jamoa bilan"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover object-[50%_45%]"
          />
        </div>
      </div>
    </section>
  );
}
