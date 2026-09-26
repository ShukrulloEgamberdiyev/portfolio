import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { CONTACT } from '../../data/site';
import { OPT, QR_FORM_ID, REGIONS, form as F } from '../../content/qurilish';
import { DeliveryError } from '../../lib/applicationTransport';
import { buildQurilishPayload, isQrSubmissionId, newQrSubmissionId, submitQurilish, trackQrLeadOnce, type QrData } from '../../lib/submitQurilish';
import { track } from '../../lib/tracking';

const ease = [0.22, 1, 0.36, 1] as const;
const DRAFT_KEY = 'fazo.qurilish.draft';
const MIN_FILL_MS = 4000;

type Errors = Partial<Record<keyof QrData, string>>;

const EMPTY: QrData = { name: '', phone: '', company: '', region: '', city: '', stage: '', problem: '', problemOther: '', budget: '', contactTime: '' };
const ORDER: (keyof QrData)[] = ['name', 'phone', 'company', 'region', 'city', 'stage', 'problem', 'problemOther', 'budget', 'contactTime'];

export const phoneDigits = (v: string) => {
  let digits = v.replace(/\D/g, '');
  if (digits.length > 9 && digits.startsWith('998')) digits = digits.slice(3); // pasted with country code
  return digits.slice(0, 9);
};
const formatPhone = (d: string) => [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');

export function validateQurilish(d: QrData): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2) e.name = 'Ismingizni kiriting';
  if (phoneDigits(d.phone).length !== 9) e.phone = 'Raqamni to‘liq kiriting: +998 XX XXX XX XX';
  if (d.company.trim().length < 2) e.company = 'Kompaniya nomini kiriting';
  if (!d.region) e.region = 'Hududni tanlang';
  if (!d.stage) e.stage = 'Loyiha bosqichini tanlang';
  if (!d.problem) e.problem = 'Asosiy muammoni tanlang';
  if (d.problem === 'Boshqa' && d.problemOther.trim().length < 2) e.problemOther = 'Qisqacha yozing';
  if (!d.budget) e.budget = 'Budjet oralig‘ini tanlang';
  if (!d.contactTime) e.contactTime = 'Qulay vaqtni tanlang';
  return e;
}

/* ───────── field primitives ───────── */

function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
  return (
    <div data-field={id}>
      <label htmlFor={id} className="block text-[0.95rem] font-medium text-bone">
        {label}{optional ? <span className="ml-2 text-[0.8rem] font-normal text-ash">ixtiyoriy</span> : <span className="text-violet"> *</span>}
      </label>
      <div className="mt-2.5">{children}</div>
      {error && <p id={`${id}-err`} className="mt-2 text-[0.85rem] text-alert" role="alert">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full min-h-[52px] border bg-ink/60 px-4 text-[16px] text-bone outline-none transition-colors placeholder:text-ash/70 focus:border-violet focus:bg-ink ${err ? 'border-alert/70' : 'border-line-strong'}`;

function Chips({ id, label, options, value, onChange, error, hint, columns }: {
  id: string; label: string; options: string[]; value: string; onChange: (v: string) => void; error?: string; hint?: ReactNode; columns?: string;
}) {
  const gid = useId();
  return (
    <fieldset data-field={id} aria-describedby={error ? `${id}-err` : undefined} className="min-w-0">
      <legend className="text-[0.95rem] font-medium text-bone">{label}<span className="text-violet"> *</span></legend>
      {hint && <div className="mt-1.5 text-[0.85rem] leading-snug text-ash">{hint}</div>}
      <div className={`mt-3 grid gap-2 ${columns ?? 'grid-cols-1 sm:grid-cols-2'}`}>
        {options.map((o, i) => {
          const on = value === o;
          return (
            <label key={o} data-cursor="hover"
              className={`relative flex min-h-[50px] cursor-pointer items-center gap-3 border px-3.5 py-2.5 text-[0.93rem] leading-snug transition-[background-color,border-color,color] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-violet ${on ? 'border-bone bg-bone text-ink' : 'border-line-strong text-bone/90 hover:border-bone/45'}`}>
              <input id={i === 0 ? id : `${gid}-${i}`} type="radio" name={id} value={o} checked={on} onChange={() => onChange(o)} className="sr-only" />
              <span aria-hidden className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${on ? 'border-ink' : 'border-bone/40'}`}>
                {on && <span className="h-2 w-2 rounded-full bg-violet" />}
              </span>
              {o}
            </label>
          );
        })}
      </div>
      {error && <p id={`${id}-err`} className="mt-2 text-[0.85rem] text-alert" role="alert">{error}</p>}
    </fieldset>
  );
}

/* ───────── form ───────── */

export function QrForm() {
  const reduce = useReducedMotion();
  const [d, setD] = useState<QrData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorReason, setErrorReason] = useState<'network' | 'busy' | 'contact' | 'invalid' | 'generic'>('generic');
  const [honeypot, setHoneypot] = useState('');
  const submissionId = useRef('');
  const startedAt = useRef(0);
  const sending = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  // Restore an unfinished draft from this browser session (e.g. after an accidental reload).
  useEffect(() => {
    startedAt.current = Date.now();
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { d?: Partial<QrData>; sid?: string };
        if (saved.d) setD({ ...EMPTY, ...saved.d });
        if (saved.sid && isQrSubmissionId(saved.sid)) submissionId.current = saved.sid;
      }
    } catch { /* ignore */ }
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!hydrated.current || status === 'done') return;
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ d, sid: submissionId.current })); } catch { /* ignore */ }
  }, [d, status]);

  const started = () => track('QurilishFormStart', { content_name: 'Qurilish ariza' }, { custom: true, onceKey: 'qr-form-start' });

  const update = <K extends keyof QrData>(k: K, v: QrData[K]) => {
    started();
    setD((prev) => {
      const next = { ...prev, [k]: v };
      if (tried) setErrors(validateQurilish(next));
      return next;
    });
  };
  const text = (k: keyof QrData, max = 160) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => update(k, e.target.value.slice(0, max) as never);
  const pick = (k: keyof QrData) => (v: string) => update(k, v as never);

  const focusFirstError = (e: Errors) => {
    const first = ORDER.find((k) => e[k]);
    if (!first) return;
    requestAnimationFrame(() => {
      const wrap = cardRef.current?.querySelector(`[data-field="${first}"]`) as HTMLElement | null;
      wrap?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      const input = wrap?.querySelector('input:not([type=hidden]),select,textarea') as HTMLElement | null;
      input?.focus({ preventScroll: true });
    });
  };

  const submit = async () => {
    if (sending.current) return;
    const e = validateQurilish(d);
    setErrors(e);
    setTried(true);
    if (Object.keys(e).length) { focusFirstError(e); return; }
    sending.current = true;
    setStatus('sending'); // inputs are disabled while sending: what the user sees is exactly what is sent
    if (!submissionId.current) submissionId.current = newQrSubmissionId();
    const id = submissionId.current;
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ d, sid: id })); } catch { /* ignore */ }
    try {
      if (honeypot) throw new DeliveryError('rejected', 'spam'); // bots never get a success screen, nothing is sent
      const wait = MIN_FILL_MS + 250 - (Date.now() - startedAt.current);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      await submitQurilish(buildQurilishPayload(d, { hp: honeypot, elapsed: Date.now() - startedAt.current }, id));
      trackQrLeadOnce(id);
      setStatus('done');
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      requestAnimationFrame(() => cardRef.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' }));
    } catch (err) {
      const code = err instanceof DeliveryError ? err.code : 'network';
      const detail = err instanceof DeliveryError ? err.detail : '';
      const field = err instanceof DeliveryError ? err.field : '';
      if (detail === 'invalid' && field === 'submissionId') submissionId.current = '';
      if (detail === 'invalid' && field && field in EMPTY) {
        const fieldErrors: Errors = { [field as keyof QrData]: 'Bu javob qabul qilinmadi — tekshirib, qayta kiriting' };
        setErrors(fieldErrors);
        focusFirstError(fieldErrors);
      }
      setErrorReason(
        code === 'timeout' || code === 'network' || detail === 'busy' || detail === 'storage_failed' ? 'network'
          : detail === 'rate_limited' ? 'busy'
          : detail === 'contact_rate_limited' ? 'contact'
          : detail === 'invalid' ? 'invalid'
          : 'generic');
      setStatus('error');
    } finally {
      sending.current = false;
    }
  };

  const E = (k: keyof QrData) => (tried ? errors[k] : undefined);

  return (
    <div ref={cardRef} id={`${QR_FORM_ID}-card`} className="relative scroll-mt-24 border border-line-strong bg-surface-1/90 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/70 to-transparent" />
      {status === 'done' ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="px-6 py-14 sm:px-12 sm:py-20" role="status" aria-live="polite">
          <span className="flex h-14 w-14 items-center justify-center bg-bone text-ink">
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden><path d="m4 11.5 4.5 4.5L18 6.5" stroke="currentColor" strokeWidth="2.2" fill="none" /></svg>
          </span>
          <h3 className="mt-8 text-[2rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.6rem]">{F.successTitle.slice(0, -1)}<span className="text-violet">.</span></h3>
          <p className="mt-4 max-w-[44ch] text-[1.05rem] leading-relaxed text-mist">{F.successText}</p>
        </motion.div>
      ) : (
        <form noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }} onFocus={started} aria-describedby="qr-form-status" aria-label="Loyiha arizasi">
          {/* Honeypot: invisible to people, tempting to bots. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="qr_fax">Fax</label>
            <input id="qr_fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <fieldset disabled={status === 'sending'} className="min-w-0 border-0 p-0 disabled:opacity-60">
            <div className="space-y-7 px-5 py-8 sm:px-10 sm:py-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist"><span className="text-violet">A</span> · Siz va kompaniya</p>
              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="name" label="Ismingiz" error={E('name')}>
                  <input id="name" name="name" className={inputCls(E('name'))} value={d.name} onChange={text('name', 80)} autoComplete="name" aria-invalid={!!E('name')} />
                </Field>
                <Field id="phone" label="Telefon raqamingiz" error={E('phone')}>
                  <div className={`flex min-h-[52px] items-center border bg-ink/60 transition-colors focus-within:border-violet ${E('phone') ? 'border-alert/70' : 'border-line-strong'}`}>
                    <span className="select-none border-r border-line pl-4 pr-3 text-[16px] text-mist">+998</span>
                    <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="90 123 45 67" aria-invalid={!!E('phone')}
                      className="h-full min-h-[50px] w-full min-w-0 bg-transparent px-3 text-[16px] tracking-[0.02em] text-bone outline-none placeholder:text-ash/70"
                      value={formatPhone(phoneDigits(d.phone))} onChange={(e) => update('phone', phoneDigits(e.target.value))} />
                  </div>
                </Field>
              </div>
              <Field id="company" label="Kompaniya nomi" error={E('company')}>
                <input id="company" name="company" className={inputCls(E('company'))} value={d.company} onChange={text('company', 160)} autoComplete="organization" aria-invalid={!!E('company')} />
              </Field>
              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="region" label="Loyihangiz qaysi hududda?" error={E('region')}>
                  <div className="relative">
                    <select id="region" name="region" className={`${inputCls(E('region'))} appearance-none pr-10 ${d.region ? '' : 'text-ash/80'}`} value={d.region} onChange={text('region')} aria-invalid={!!E('region')}>
                      <option value="" disabled>Hududni tanlang</option>
                      {REGIONS.map((r) => <option key={r} value={r} className="bg-surface-2 text-bone">{r}</option>)}
                    </select>
                    <svg aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist" width="12" height="8" viewBox="0 0 12 8"><path d="m1 1.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
                  </div>
                </Field>
                <Field id="city" label="Shahar / tuman" optional>
                  <input id="city" name="city" className={inputCls()} value={d.city} onChange={text('city', 80)} placeholder="Masalan: Yunusobod" autoComplete="address-level2" />
                </Field>
              </div>
            </div>

            <div className="space-y-8 border-t border-line px-5 py-8 sm:px-10 sm:py-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist"><span className="text-violet">B</span> · Loyiha holati</p>
              <Chips id="stage" label="Loyiha qaysi bosqichda?" options={OPT.stage} value={d.stage} onChange={pick('stage')} error={E('stage')} />
              <Chips id="problem" label="Hozirgi asosiy muammo nima?" options={OPT.problem} value={d.problem} onChange={pick('problem')} error={E('problem')} />
              <AnimatePresence initial={false}>
                {d.problem === 'Boshqa' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
                    <Field id="problemOther" label="Qisqacha yozing" error={E('problemOther')}>
                      <input id="problemOther" name="problemOther" className={inputCls(E('problemOther'))} value={d.problemOther} onChange={text('problemOther', 300)} aria-invalid={!!E('problemOther')} />
                    </Field>
                  </motion.div>
                )}
              </AnimatePresence>
              <Chips id="budget" label="Oylik reklama budjeti" options={OPT.budget} value={d.budget} onChange={pick('budget')} error={E('budget')} columns="grid-cols-2"
                hint="Meta Ads va Google Ads uchun ajratiladigan reklama budjeti. Bu FAZO Digital xizmati narxi emas." />
              <Chips id="contactTime" label="Siz bilan qachon bog‘lansak qulay?" options={OPT.contactTime} value={d.contactTime} onChange={pick('contactTime')} error={E('contactTime')} />
            </div>
          </fieldset>

          <div className="border-t border-line px-5 pb-6 pt-5 sm:px-10 sm:pb-8">
            <div id="qr-form-status" aria-live="polite">
              {status === 'error' && (
                <div className="mb-5 border border-alert/40 bg-alert/[0.07] px-4 py-3.5 text-[0.9rem] leading-snug text-bone/90" role="alert">
                  {F.errors[errorReason]}
                  <span className="mt-1.5 block text-ash">{F.errorAlt} <a className="text-bone underline decoration-bone/30 underline-offset-4" href={CONTACT.telegram.url} target="_blank" rel="noopener noreferrer">{CONTACT.telegram.handle}</a></span>
                </div>
              )}
              {tried && Object.keys(errors).length > 0 && status !== 'error' && (
                <p className="mb-4 text-[0.88rem] text-alert">{F.required}</p>
              )}
            </div>
            <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} data-cursor="hover"
              className="group relative inline-flex min-h-14 w-full items-center justify-center gap-4 overflow-hidden bg-bone px-7 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-ink transition-colors disabled:cursor-wait disabled:opacity-70 sm:w-auto">
              <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-violet transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100 group-disabled:scale-y-0" />
              {status === 'sending' && <span aria-hidden className="relative h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />}
              <span className="relative group-hover:text-white group-disabled:text-ink">{status === 'sending' ? F.sending : status === 'error' ? F.retry : F.submit}</span>
              {status !== 'sending' && <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">→</span>}
            </button>
            <p className="mt-5 text-[0.8rem] leading-snug text-ash">
              {F.privacy} <a href="/privacy" target="_blank" rel="noopener" className="text-mist underline decoration-mist/30 underline-offset-4 hover:text-bone">{F.privacyLink}</a> {F.privacyTail}
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
