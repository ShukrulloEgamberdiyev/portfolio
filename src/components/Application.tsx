import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState } from 'react';
import { useLang } from '../i18n';
import type { Option } from '../i18n/types';
import { CONTACT, SECTION_IDS } from '../data/site';
import { submitApplication } from '../lib/submit';
import { Button } from '../ui/Button';
import { Headline } from '../ui/Headline';
import { Label } from '../ui/Label';
import { Reveal } from '../ui/Reveal';

type Data = Record<string, string>;

const MIN_FILL_MS = 4000;
const ease = [0.22, 1, 0.36, 1] as const;

function TextField({ id, label, value, onChange, placeholder, hint, type = 'text', optional, autoComplete }: {
  id: string; label: string; value: string; onChange: (v: string) => void; placeholder?: string; hint?: string; type?: string; optional?: boolean; autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">{label}{!optional && <span className="text-violet"> *</span>}</label>
      <input id={id} name={id} type={type} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full border-0 border-b border-line-strong bg-transparent py-3 text-[1.35rem] font-medium tracking-[-0.02em] text-bone outline-none transition-colors placeholder:text-ash/60 focus:border-violet sm:text-[1.6rem]" />
      {hint && <p className="mt-2 text-[0.85rem] text-ash">{hint}</p>}
    </div>
  );
}

function TextArea({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow block">{label}</label>
      <textarea id={id} name={id} rows={2} value={value} onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full resize-none border-0 border-b border-line-strong bg-transparent py-3 text-[1.1rem] text-bone outline-none transition-colors focus:border-violet" />
    </div>
  );
}

function Choice({ name, label, hint, options, value, onChange }: { name: string; label: string; hint?: string; options: Option[]; value: string; onChange: (v: string) => void }) {
  const gid = useId();
  return (
    <fieldset>
      <legend className="eyebrow">{label}<span className="text-violet"> *</span></legend>
      {hint && <p id={`${gid}-hint`} className="mt-2 text-[0.85rem] text-ash">{hint}</p>}
      <div className="mt-4 flex flex-wrap gap-2" role="radiogroup">
        {options.map((o) => {
          const checked = value === o.value;
          return (
            <label key={o.value} data-cursor="hover"
              className={`relative cursor-pointer border px-4 py-3 text-[0.95rem] transition-colors duration-300 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-violet ${checked ? 'border-bone bg-bone text-ink' : 'border-line-strong text-bone/85 hover:border-bone/50'}`}>
              <input id={`${name}-${o.value}`} type="radio" name={name} value={o.value} checked={checked} onChange={() => onChange(o.value)} className="sr-only" />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Application({ compact = false }: { compact?: boolean } = {}) {
  const { t, lang } = useLang();
  const a = t.apply;
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<Data>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [showError, setShowError] = useState(false);
  const set = (k: string) => (v: string) => { setData((d) => ({ ...d, [k]: v.slice(0, k === 'problemDetail' ? 1000 : 160) })); setShowError(false); };

  // Spam protection: a hidden honeypot field bots fill in, and a minimum time on the form.
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef(0);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const v = (k: string) => data[k] ?? '';

  const contactOk = /^(\+?\d[\d\s()-]{7,}|@?[a-zA-Z0-9_]{4,})$/.test(v('contact').trim());
  const valid = [
    v('name').trim().length > 1 && v('company').trim().length > 1,
    !!v('industry') && !!v('revenue'),
    !!v('spend') && !!v('budget'),
    !!v('problem') && !!v('objective'),
    !!v('decision') && contactOk,
  ];
  const last = a.stepNames.length - 1;

  const next = async () => {
    if (status === 'sending') return;
    if (!valid[step]) { setShowError(true); return; }
    if (step < last) { setDir(1); setStep(step + 1); return; }
    setStatus('sending');
    const elapsed = Date.now() - startedAt.current;
    if (honeypot || elapsed < MIN_FILL_MS) { setStatus('error'); return; }
    try {
      await submitApplication(data, lang, { hp: honeypot, elapsed });
      setStatus('done');
    } catch { setStatus('error'); }
  };
  const back = () => { setDir(-1); setStep(Math.max(0, step - 1)); setShowError(false); };

  const screens = [
    <div className="space-y-10" key="0">
      <TextField id="name" label={a.name} value={v('name')} onChange={set('name')} autoComplete="name" />
      <TextField id="company" label={a.company} value={v('company')} onChange={set('company')} autoComplete="organization" />
      <TextField id="website" label={a.website} value={v('website')} onChange={set('website')} placeholder={a.websitePh} optional />
    </div>,
    <div className="space-y-10" key="1">
      <Choice name="industry" label={a.industry} options={a.industries} value={v('industry')} onChange={set('industry')} />
      <Choice name="revenue" label={a.revenue} options={a.revenues} value={v('revenue')} onChange={set('revenue')} />
    </div>,
    <div className="space-y-10" key="2">
      <Choice name="spend" label={a.spend} options={a.spends} value={v('spend')} onChange={set('spend')} />
      <Choice name="budget" label={a.budget} hint={a.budgetHint} options={a.budgets} value={v('budget')} onChange={set('budget')} />
    </div>,
    <div className="space-y-10" key="3">
      <Choice name="problem" label={a.problem} options={a.problems} value={v('problem')} onChange={set('problem')} />
      <TextArea id="problemDetail" label={a.problemDetail} value={v('problemDetail')} onChange={set('problemDetail')} />
      <Choice name="objective" label={a.objective} options={a.objectives} value={v('objective')} onChange={set('objective')} />
    </div>,
    <div className="space-y-10" key="4">
      <Choice name="decision" label={a.decision} options={a.decisions} value={v('decision')} onChange={set('decision')} />
      <TextField id="contact" label={a.contact} value={v('contact')} onChange={set('contact')} placeholder={a.contactPh} hint={a.contactHint} type="text" autoComplete="tel" />
    </div>,
  ];

  return (
    <section id={SECTION_IDS.apply} aria-labelledby="apply-title" className={`relative ${compact ? 'pb-24 pt-16 lg:pb-32 lg:pt-20' : 'border-t border-line py-24 lg:py-40'}`}>
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            {!compact && (
              <>
                <Label>{a.label}</Label>
                <Headline id="apply-title" lines={a.title} className="display-md mt-8" />
                <Reveal><p className="lead mt-8">{a.intro}</p></Reveal>
              </>
            )}
            <ol className={`hidden space-y-3 lg:block ${compact ? '' : 'mt-12'}`}>
              {a.stepNames.map((n, i) => (
                <li key={n} className={`flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-500 ${status === 'done' || i < step ? 'text-mist' : i === step ? 'text-bone' : 'text-ash/60'}`}>
                  <span className="tabular">{String(i + 1).padStart(2, '0')}</span>
                  <span className={`h-px transition-all duration-500 ${i === step && status !== 'done' ? 'w-10 bg-violet' : 'w-4 bg-line-strong'}`} />
                  {n}{(status === 'done' || i < step) && <span className="text-violet">✓</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="relative border border-line-strong bg-surface-1/80 p-6 backdrop-blur sm:p-10 lg:p-14">
            {status === 'done' ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="py-10" role="status">
                <span className="flex h-14 w-14 items-center justify-center bg-violet text-2xl text-white">✓</span>
                <h3 className="mt-10 text-[2.2rem] font-bold uppercase leading-none tracking-[-0.04em] sm:text-[3rem]">{a.successTitle}</h3>
                <p className="lead mt-6">{a.successText}</p>
                <div className="mt-10"><Button href={CONTACT.telegram.url} external>{a.successCta}</Button></div>
              </motion.div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); void next(); }} noValidate>
                {/* Honeypot: invisible to people, tempting to bots. */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="fax_number">Fax</label>
                  <input id="fax_number" name="fax_number" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-mist">
                    {a.stepOf} <span className="tabular text-bone">{step + 1}</span> / {a.stepNames.length} · <span className="text-bone">{a.stepNames[step]}</span>
                  </p>
                </div>
                <div className="mt-4 flex gap-1.5" aria-hidden>
                  {a.stepNames.map((_, i) => (
                    <span key={i} className="relative h-[2px] flex-1 overflow-hidden bg-line">
                      <motion.span className="absolute inset-0 origin-left bg-bone" initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.6, ease }} />
                    </span>
                  ))}
                </div>

                <div className="relative mt-12 min-h-[380px] overflow-hidden">
                  <AnimatePresence mode="wait" custom={dir} initial={false}>
                    <motion.div key={step} custom={dir}
                      initial={reduce ? false : { opacity: 0, x: dir * 40 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: dir * -40 }}
                      transition={{ duration: 0.45, ease }}>
                      {screens[step]}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <p aria-live="polite" className={`mt-6 min-h-[1.25rem] text-[0.9rem] ${status === 'error' ? 'text-bone' : 'text-violet'}`}>
                  {status === 'error' ? a.error : showError ? a.required : ''}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
                  <button type="button" onClick={back} disabled={step === 0}
                    className="h-12 font-mono text-[11px] uppercase tracking-[0.14em] text-mist transition-colors hover:text-bone disabled:invisible">← {a.back}</button>
                  <Button type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? a.sending : step === last ? a.submit : a.next}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
