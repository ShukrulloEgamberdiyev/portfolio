import { useCallback, useState } from 'react';
import { ArrowRight, ArrowUpRight, Compass, Megaphone, PhoneCall, Workflow } from 'lucide-react';
import { Logo, Mark077 } from './Mark';
import { SignalGrid } from './SignalGrid';
import { Cursor3D, Target3D } from './Decor';
import { LeadWizard, QuickStart, emptyDraft, type Draft } from './LeadForm';
import type { CategoryId } from './lead';

const SERVICES = [
  {
    code: 'STR',
    icon: Compass,
    title: 'Marketing strategiyasi',
    text: 'Biznesingiz uchun aniq maqsad va rivojlanish strategiyasini ishlab chiqamiz.',
  },
  {
    code: 'SMM',
    icon: Megaphone,
    title: 'SMM va target reklama',
    text: 'Professional kontent va maqsadli reklama orqali yangi mijozlarni jalb qilamiz.',
  },
  {
    code: 'CRM',
    icon: Workflow,
    title: 'CRM va sotuv tizimi',
    text: 'Murojaatlarni nazorat qilish va sotuv jarayonini tizimlashtirishga yordam beramiz.',
  },
];

export default function App() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [step, setStep] = useState(0);

  const goToForm = useCallback(() => {
    document.getElementById('ariza')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const pickFromHero = (c: CategoryId) => {
    setDraft((d) => ({ ...d, category: c }));
    setStep(c === 'boshqa' ? 0 : 1);
    goToForm();
  };

  return (
    <div id="top" className="a077 relative">
      {/* ---------- Header ---------- */}
      <header className="absolute inset-x-0 top-0 z-30">
        <div className="shell flex h-[72px] items-center justify-between gap-3">
          <Logo />
          <nav aria-label="Asosiy menyu" className="flex items-center gap-2 sm:gap-6">
            <a href="#xizmatlar" className="hidden text-[14px] font-medium text-muted transition hover:text-fg sm:inline">
              Xizmatlar
            </a>
            <a
              href="#ariza"
              className="inline-flex min-h-11 items-center rounded-[14px] border border-line-strong bg-white/[0.03] px-4 text-[13.5px] font-semibold text-fg transition hover:border-accent/70 hover:bg-accent/10"
            >
              Ariza qoldirish
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* ---------- 1. Hero ---------- */}
        <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-line">
          <SignalGrid className="absolute inset-0 -z-10 h-full w-full" />
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(45% 50% at 82% 28%, rgba(227,33,45,0.13), transparent 70%), radial-gradient(35% 40% at 0% 100%, rgba(227,33,45,0.06), transparent 70%), linear-gradient(to bottom, transparent 72%, #0B0B0F)',
            }}
            aria-hidden="true"
          />
          <Mark077
            className="pointer-events-none absolute -right-[12%] top-[52%] -z-10 w-[120%] max-w-none -translate-y-1/2 opacity-[0.14] sm:-right-[6%] sm:w-[85%] sm:opacity-[0.18] lg:-right-[4%] lg:bottom-[-120px] lg:top-auto lg:w-[60%] lg:translate-y-0 lg:opacity-[0.4]"
            strokeWidth={1.4}
          />

          <div className="shell grid items-center gap-12 pb-16 pt-28 sm:pb-20 sm:pt-36 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pb-28 lg:pt-40">
            <div className="rise min-w-0">
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="h-px w-8 bg-accent" aria-hidden="true" />
                077agency · Marketing agentligi
              </p>
              <h1
                id="hero-title"
                className="text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] text-fg xs:text-[36px] sm:text-[50px] lg:text-[56px] xl:text-[62px]"
              >
                Biznesingiz o‘sishi uchun <span className="text-accent">kuchli marketing</span> tizimi.
              </h1>

              {/* Mobile entry point, right under the headline */}
              <div className="mt-7 lg:hidden">
                <button type="button" onClick={goToForm} className="btn-primary w-full sm:w-auto">
                  Konsultatsiyaga yozilish <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-7 max-w-[30rem] text-[16.5px] leading-relaxed text-muted sm:text-[18px]">
                Strategiya, kontent, target reklama va sotuv jarayonlarini yagona tizimga birlashtiramiz.
              </p>

              <div className="mt-10 hidden flex-wrap items-center gap-4 lg:flex">
                <button type="button" onClick={goToForm} className="btn-primary">
                  Konsultatsiyaga yozilish <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <a href="#xizmatlar" className="btn-ghost">
                  Xizmatlar
                </a>
              </div>
            </div>

            <div className="rise relative hidden min-w-0 lg:block" style={{ animationDelay: '0.12s' }}>
              <Target3D className="float-slow pointer-events-none absolute -right-10 -top-16 z-0 w-[120px]" />
              <div className="relative z-10">
                <QuickStart onPick={pickFromHero} />
              </div>
            </div>
          </div>
          <Target3D className="float-slow pointer-events-none absolute right-5 top-[86px] hidden w-[76px] opacity-90 sm:block lg:hidden" />
        </section>

        {/* ---------- 2. Services ---------- */}
        <section id="xizmatlar" aria-labelledby="services-title" className="scroll-mt-6 py-16 sm:py-24">
          <div className="shell">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow mb-4">Xizmatlarimiz</p>
                <h2 id="services-title" className="text-[28px] font-extrabold leading-tight tracking-[-0.025em] text-fg sm:text-[40px]">
                  Uch yo‘nalish, bitta tizim.
                </h2>
              </div>
              <button
                type="button"
                onClick={goToForm}
                className="group inline-flex min-h-12 items-center gap-2 self-start text-left text-[14.5px] font-semibold text-fg underline decoration-accent decoration-2 underline-offset-[6px] md:self-auto"
              >
                Qaysi biri kerakligini birga aniqlaymiz
                <ArrowUpRight className="h-4 w-4 text-accent transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
            </div>

            <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
              {SERVICES.map(({ code, icon: Icon, title, text }) => (
                <li
                  key={code}
                  className="card group relative flex flex-col overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-white/15 sm:p-7"
                >
                  <span
                    className="pointer-events-none absolute -right-3 -top-6 font-display text-[110px] font-extrabold leading-none text-white/[0.03] transition group-hover:text-accent/[0.08]"
                    aria-hidden="true"
                  >
                    {code}
                  </span>
                  <span className="mb-9 grid h-12 w-12 place-items-center rounded-[14px] border border-line-strong bg-card-2 text-fg shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] transition group-hover:border-accent/60 group-hover:bg-accent group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mb-3 text-[19px] font-bold text-fg">{title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------- 3. Application form ---------- */}
        <section id="ariza" aria-labelledby="form-title" className="scroll-mt-4 pb-16 sm:pb-24">
          <div className="shell">
            <div className="card relative grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative flex flex-col justify-between gap-10 overflow-hidden border-b border-line p-6 sm:p-10 lg:border-b-0 lg:border-r lg:p-12">
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: 'radial-gradient(80% 60% at 0% 100%, rgba(227,33,45,0.10), transparent 70%)' }}
                  aria-hidden="true"
                />
                <div className="relative">
                  <p className="eyebrow mb-5">Bepul konsultatsiya</p>
                  <h2 id="form-title" className="text-[27px] font-extrabold leading-[1.12] tracking-[-0.025em] text-fg sm:text-[38px]">
                    Biznesingiz uchun marketing yechimini topamiz.
                  </h2>
                  <p className="mt-5 max-w-[26rem] text-[16px] leading-relaxed text-muted">
                    Qisqa savollarga javob bering. Mutaxassisimiz siz bilan bog‘lanadi.
                  </p>
                </div>
                <div className="relative hidden items-center gap-4 sm:flex">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] border border-line-strong bg-card-2 text-accent">
                    <PhoneCall className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="text-[14px] leading-snug text-dim">
                    5 ta savol · 3 qadam
                    <br />
                    Arizani ko‘rib chiqib, o‘zimiz qo‘ng‘iroq qilamiz.
                  </p>
                </div>
                <Cursor3D className="float-slower pointer-events-none absolute bottom-8 right-6 hidden w-[96px] opacity-90 lg:block" />
                <Mark077
                  animated={false}
                  strokeWidth={2}
                  className="pointer-events-none absolute -bottom-10 -right-16 hidden w-[340px] opacity-[0.05] lg:block"
                />
              </div>
              <div className="relative bg-[linear-gradient(180deg,rgba(255,255,255,0.015),transparent)] p-5 xs:p-6 sm:p-10 lg:p-12">
                <LeadWizard draft={draft} setDraft={setDraft} step={step} setStep={setStep} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="shell flex flex-col gap-3 py-8 text-[13px] text-dim sm:flex-row sm:items-center sm:justify-between">
          <Logo />
          <p>© {new Date().getFullYear()} 077agency. Barcha huquqlar himoyalangan.</p>
        </div>
      </footer>
    </div>
  );
}
