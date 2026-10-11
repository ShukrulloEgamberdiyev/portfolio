import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Car,
  Check,
  CircleCheck,
  Factory,
  GraduationCap,
  HardHat,
  Loader2,
  MoreHorizontal,
  Scissors,
  TriangleAlert,
} from 'lucide-react';
import {
  BUDGETS,
  CATEGORIES,
  SERVICES,
  formatPhone,
  normalisePhone,
  validateLead,
  type CategoryId,
  type LeadErrors,
  type LeadInput,
} from './lead';

export type Draft = Omit<LeadInput, 'submissionId' | 'source'>;
export const emptyDraft: Draft = { category: '', customCategory: '', service: '', budget: '', name: '', phone: '', website: '' };

const ICONS: Record<CategoryId, typeof Factory> = {
  'ishlab-chiqarish': Factory,
  qurilish: HardHat,
  avtosalon: Car,
  talim: GraduationCap,
  tekstil: Scissors,
  boshqa: MoreHorizontal,
};

const STEP_FIELDS: (keyof LeadErrors)[][] = [['category', 'customCategory'], ['service', 'budget'], ['name', 'phone']];
const STEP_TITLES = ['Yo‘nalish', 'Xizmat va budjet', 'Aloqa'];

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;

function detectSource(): string {
  try {
    const q = new URLSearchParams(window.location.search);
    const src = q.get('utm_source');
    if (src) return [src, q.get('utm_medium'), q.get('utm_campaign')].filter(Boolean).join(' / ');
    if (q.get('fbclid')) return 'Facebook / Instagram';
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '');
      if (host && host !== window.location.hostname) return `Havola: ${host}`;
    }
  } catch {
    /* ignore */
  }
  return 'Sayt (to‘g‘ridan-to‘g‘ri)';
}

/* ---------- Shared bits ---------- */

function ErrorText({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-[13.5px] font-semibold text-warn">
      <TriangleAlert className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {msg}
    </p>
  );
}

interface ChoiceProps<T extends string> {
  name: string;
  legend: string;
  options: readonly { id: T; label: string }[];
  value: T | '';
  onChange: (v: T) => void;
  error?: string;
  cols?: string;
  icons?: Partial<Record<T, typeof Factory>>;
  compact?: boolean;
}

function Choice<T extends string>({ name, legend, options, value, onChange, error, cols, icons, compact }: ChoiceProps<T>) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const idx = options.findIndex((o) => o.id === value);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!next) return;
    e.preventDefault();
    const j = (i + next + options.length) % options.length;
    refs.current[j]?.focus();
    onChange(options[j].id);
  };
  return (
    <fieldset>
      <legend className="mb-3 text-[15.5px] font-bold text-fg">{legend}</legend>
      <div
        role="radiogroup"
        aria-label={legend}
        aria-describedby={error ? `${name}-err` : undefined}
        className={`grid gap-2.5 ${cols ?? 'grid-cols-1 sm:grid-cols-2'}`}
      >
        {options.map((o, i) => {
          const Icon = icons?.[o.id] as typeof Factory | undefined;
          const on = o.id === value;
          return (
            <button
              key={o.id}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={on}
              tabIndex={on || (idx === -1 && i === 0) ? 0 : -1}
              onClick={() => onChange(o.id)}
              onKeyDown={(e) => onKey(e, i)}
              className={`chip ${compact ? 'py-2.5 text-[14px]' : ''}`}
            >
              {Icon && (
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border transition ${
                    on ? 'border-accent bg-accent text-white' : 'border-line-strong bg-card-2 text-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
              )}
              <span className="min-w-0 flex-1">{o.label}</span>
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border transition ${
                  on ? 'border-accent bg-accent text-white' : 'border-white/25'
                }`}
                aria-hidden="true"
              >
                {on && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
            </button>
          );
        })}
      </div>
      <ErrorText id={`${name}-err`} msg={error} />
    </fieldset>
  );
}

/* ---------- Hero quick start (desktop) ---------- */

export function QuickStart({ onPick }: { onPick: (c: CategoryId) => void }) {
  return (
    <div className="rounded-[20px] border border-line-strong bg-card/90 p-6 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-md">
      <div className="mb-5 flex items-center justify-between">
        <span className="eyebrow">Ariza · 1 / 3</span>
        <span className="font-mono text-[11px] text-dim">≈ 30 soniya</span>
      </div>
      <p className="mb-4 text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-fg">Biznesingiz qaysi yo‘nalishda?</p>
      <div className="grid grid-cols-2 gap-2">
        {CATEGORIES.map((c) => {
          const Icon = ICONS[c.id];
          return (
            <button key={c.id} type="button" onClick={() => onPick(c.id)} className="chip py-2.5 text-[13.5px]">
              <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
              <span className="min-w-0">{c.label}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 text-[12.5px] leading-relaxed text-dim">Tanlang — keyingi 2 ta qisqa savol shu yerning o‘zida davom etadi.</p>
    </div>
  );
}

/* ---------- Main wizard ---------- */

interface WizardProps {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  step: number;
  setStep: (n: number) => void;
}

type Status = 'idle' | 'sending' | 'success' | 'error';

export function LeadWizard({ draft, setDraft, step, setStep }: WizardProps) {
  const [errors, setErrors] = useState<LeadErrors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMsg, setServerMsg] = useState('');
  const submissionId = useRef(newId());
  const inFlight = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const customRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  useEffect(() => {
    if (draft.category === 'boshqa' && step === 0) customRef.current?.focus({ preventScroll: true });
  }, [draft.category, step]);

  const stepErrors = (s: number) => {
    const all = validateLead({ ...draft, submissionId: 'x', source: '' });
    const out: LeadErrors = {};
    for (const f of STEP_FIELDS[s]) if (all[f]) out[f] = all[f];
    return out;
  };

  const next = () => {
    const e = stepErrors(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    setStep(step + 1);
    panelRef.current?.focus({ preventScroll: true });
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (step < 2) return next();
    if (inFlight.current) return; // duplicate-submit guard
    const all = validateLead({ ...draft, submissionId: 'x', source: '' });
    setErrors(all);
    if (Object.keys(all).length) {
      const firstStep = STEP_FIELDS.findIndex((fs) => fs.some((f) => all[f]));
      if (firstStep !== -1 && firstStep !== step) setStep(firstStep);
      return;
    }
    inFlight.current = true;
    setStatus('sending');
    setServerMsg('');
    try {
      const res = await fetch('/api/077agency/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          phone: normalisePhone(draft.phone),
          submissionId: submissionId.current, // same ID on retry → no duplicate rows
          source: detectSource(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: LeadErrors };
      if (res.ok && data.ok) {
        setStatus('success');
        submissionId.current = newId();
        return;
      }
      if (data.errors) setErrors(data.errors);
      setServerMsg(data.message || 'Arizani yuborib bo‘lmadi. Iltimos, qayta urinib ko‘ring.');
      setStatus('error');
    } catch {
      setServerMsg('Internet aloqasini tekshirib, qayta urinib ko‘ring.');
      setStatus('error');
    } finally {
      inFlight.current = false;
    }
  };

  if (status === 'success') {
    return (
      <div className="step-in flex flex-col items-start gap-5 py-6" role="status" aria-live="polite">
        <span className="grid h-14 w-14 place-items-center rounded-[16px] border border-ok/30 bg-ok/10 text-ok">
          <CircleCheck className="h-7 w-7" aria-hidden="true" />
        </span>
        <p className="text-[22px] font-extrabold leading-snug tracking-[-0.015em] text-fg sm:text-[27px]">
          Arizangiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog‘lanamiz.
        </p>
        <p className="text-[14px] text-dim">
          Telefoningizni yaqin tuting: mutaxassis <span className="text-fg">+998 {formatPhone(normalisePhone(draft.phone))}</span> raqamiga
          qo‘ng‘iroq qiladi.
        </p>
        <button
          type="button"
          className="btn-ghost"
          onClick={() => {
            setDraft(emptyDraft);
            setStep(0);
            setStatus('idle');
          }}
        >
          Yangi ariza
        </button>
      </div>
    );
  }

  const sending = status === 'sending';

  return (
    <form onSubmit={submit} noValidate aria-busy={sending} className="flex flex-col">
      {/* progress */}
      <div className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <span className="eyebrow">
            {step + 1}-qadam / 3 · {STEP_TITLES[step]}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1.5" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-accent' : 'bg-white/[0.10]'}`} />
          ))}
        </div>
      </div>

      {/* honeypot */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" tabIndex={-1} autoComplete="off" value={draft.website} onChange={(e) => set('website', e.target.value)} />
      </div>

      <div ref={panelRef} tabIndex={-1} key={step} className="step-in flex flex-col gap-7 outline-none">
        {step === 0 && (
          <>
            <Choice
              name="category"
              legend="1. Biznesingiz qaysi yo‘nalishda?"
              options={CATEGORIES}
              value={draft.category}
              onChange={(v) => set('category', v)}
              error={errors.category}
              icons={ICONS}
            />
            {draft.category === 'boshqa' && (
              <div className="step-in">
                <label htmlFor="customCategory" className="mb-2 block text-[14.5px] font-semibold text-fg">
                  Biznesingiz yo‘nalishi
                </label>
                <input
                  id="customCategory"
                  ref={customRef}
                  className="field"
                  maxLength={60}
                  placeholder="Masalan: mebel savdosi, restoran, klinika"
                  value={draft.customCategory}
                  onChange={(e) => set('customCategory', e.target.value)}
                  aria-invalid={!!errors.customCategory}
                  aria-describedby={errors.customCategory ? 'customCategory-err' : undefined}
                />
                <ErrorText id="customCategory-err" msg={errors.customCategory} />
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <Choice
              name="service"
              legend="2. Sizga qaysi xizmat kerak?"
              options={SERVICES}
              value={draft.service}
              onChange={(v) => set('service', v)}
              error={errors.service}
            />
            <Choice
              name="budget"
              legend="3. Oylik reklama budjetingiz qancha?"
              options={BUDGETS}
              value={draft.budget}
              onChange={(v) => set('budget', v)}
              error={errors.budget}
              cols="grid-cols-1 sm:grid-cols-3"
              compact
            />
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <label htmlFor="name" className="mb-2 block text-[15.5px] font-bold text-fg">
                4. Ismingiz
              </label>
              <input
                id="name"
                className="field"
                autoComplete="given-name"
                maxLength={60}
                placeholder="Ismingizni kiriting"
                value={draft.name}
                onChange={(e) => set('name', e.target.value)}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'name-err' : undefined}
              />
              <ErrorText id="name-err" msg={errors.name} />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-[15.5px] font-bold text-fg">
                5. Telefon raqamingiz
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-mono text-[16px] font-medium text-fg">+998</span>
                <input
                  id="phone"
                  className="field pl-[4.6rem] font-mono tracking-wide"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="90 123 45 67"
                  value={formatPhone(normalisePhone(draft.phone))}
                  onChange={(e) => set('phone', normalisePhone(e.target.value))}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? 'phone-err' : 'phone-hint'}
                />
              </div>
              {errors.phone ? (
                <ErrorText id="phone-err" msg={errors.phone} />
              ) : (
                <p id="phone-hint" className="mt-2 text-[12.5px] text-dim">
                  SMS tasdiqlash yo‘q. Raqam faqat siz bilan bog‘lanish uchun.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {status === 'error' && serverMsg && (
        <div role="alert" className="mt-6 flex items-start gap-2.5 rounded-[14px] border border-warn/40 bg-warn/[0.08] px-4 py-3 text-[14px] text-fg">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden="true" />
          <span>{serverMsg}</span>
        </div>
      )}

      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => {
              setErrors({});
              setStep(step - 1);
            }}
            disabled={sending}
            className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] border border-line text-muted transition hover:border-accent/60 hover:text-fg disabled:opacity-50"
            aria-label="Orqaga"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
        <button type="submit" disabled={sending} className="btn-primary h-[52px] flex-1 sm:flex-none sm:px-9">
          {step < 2 ? (
            <>
              Davom etish <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </>
          ) : sending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Yuborilmoqda…
            </>
          ) : (
            'Ariza yuborish'
          )}
        </button>
      </div>
    </form>
  );
}

