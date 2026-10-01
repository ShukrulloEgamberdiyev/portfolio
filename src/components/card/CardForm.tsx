import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CONTACT } from '../../data/site';
import { CARD_OPT, cardForm as F } from '../../content/card';
import { DeliveryError } from '../../lib/applicationTransport';
import { EMPTY_CARD, buildCardPayload, newCardSubmissionId, submitCard, type CardData } from '../../lib/submitCard';
import { Chips, Field, describedBy, inputCls, phoneDigits } from '../qurilish/QrForm';

const ease = [0.22, 1, 0.36, 1] as const;
const DRAFT_KEY = 'fazo.card.draft';
const MIN_FILL_MS = 3000;

type Key = keyof CardData;
type Errors = Partial<Record<Key, string>>;

/** Har bosqichning maydonlari — tartib xato bo‘lgan birinchi maydonga fokus berish uchun ham ishlatiladi. */
export const STEP_FIELDS: Key[][] = [
  ['name', 'phone', 'business', 'link'],
  ['need', 'experience', 'currentSpend'],
  ['readyBudget', 'problem'],
];

const formatPhone = (d: string) => [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');

/** @username, instagram.com/..., https://sayt.uz — bo‘sh bo‘lsa ham to‘g‘ri (ixtiyoriy maydon). */
export function isValidLink(v: string) {
  const s = v.trim();
  if (!s) return true;
  if (/^@?[A-Za-z0-9._]{2,30}$/.test(s)) return true;
  return /^(https?:\/\/)?(www\.)?([\p{L}\p{N}-]+\.)+[\p{L}]{2,}(:\d+)?(\/\S*)?$/iu.test(s);
}

export function validateCardStep(d: CardData, step: number): Errors {
  const e: Errors = {};
  const want = STEP_FIELDS[step];
  if (want.includes('name') && d.name.trim().length < 2) e.name = F.errors.name;
  if (want.includes('phone') && phoneDigits(d.phone).length !== 9) e.phone = F.errors.phone;
  if (want.includes('business') && d.business.trim().length < 2) e.business = F.errors.business;
  if (want.includes('link') && !isValidLink(d.link)) e.link = F.errors.link;
  if (want.includes('need') && !CARD_OPT.need.includes(d.need)) e.need = F.errors.need;
  if (want.includes('experience') && !CARD_OPT.experience.includes(d.experience)) e.experience = F.errors.experience;
  if (want.includes('currentSpend') && !CARD_OPT.currentSpend.includes(d.currentSpend)) e.currentSpend = F.errors.currentSpend;
  if (want.includes('readyBudget') && !CARD_OPT.readyBudget.includes(d.readyBudget)) e.readyBudget = F.errors.readyBudget;
  if (want.includes('problem') && d.problem.trim().length < 3) e.problem = F.errors.problem;
  return e;
}

type Draft = { d?: Partial<CardData>; step?: number; sid?: string };

/**
 * Ro‘yxatdan o‘tish oynasi. Sahifa ochiq turgan butun vaqt davomida mount bo‘lib turadi
 * (yopilganda faqat yashiriladi), shuning uchun yopib-ochganda ham, ORTGA bosganda ham javoblar yo‘qolmaydi.
 */
export function CardForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [d, setD] = useState<CardData>(EMPTY_CARD);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [honeypot, setHoneypot] = useState('');
  const submissionId = useRef('');
  const startedAt = useRef(0);
  const sending = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const restored = useRef(false);

  // Shu brauzer sessiyasidagi tugallanmagan javoblarni tiklash (masalan sahifa yangilansa).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Draft;
        if (saved.d) setD({ ...EMPTY_CARD, ...saved.d });
        if (typeof saved.step === 'number' && saved.step >= 0 && saved.step <= 2) setStep(saved.step);
        if (saved.sid && /^FC-[A-Z0-9]{6,14}-[A-Z0-9]{6,14}$/.test(saved.sid)) submissionId.current = saved.sid;
      }
    } catch { /* storage unavailable */ }
    restored.current = true;
  }, []);
  useEffect(() => {
    if (!restored.current || status === 'done') return;
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ d, step, sid: submissionId.current } satisfies Draft)); } catch { /* ignore */ }
  }, [d, step, status]);

  // Ochilganda: sahifa skrolini qulflash, fokusni oynaga o‘tkazish, Tab'ni oyna ichida ushlab turish, Escape — yopish.
  useEffect(() => {
    if (!open) return;
    if (!startedAt.current) startedAt.current = Date.now();
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // Mobil klaviatura ochilganda oyna ko‘rinadigan qismga sig‘ishi uchun.
    const vv = window.visualViewport;
    const sync = () => dialogRef.current?.style.setProperty('--vvh', `${Math.round(vv?.height ?? window.innerHeight)}px`);
    sync();
    vv?.addEventListener('resize', sync);
    window.addEventListener('resize', sync);

    const raf = requestAnimationFrame(() => (dialogRef.current?.querySelector('[data-autofocus]') as HTMLElement | null)?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const items = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]),[tabindex="0"]'))
        .filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      vv?.removeEventListener('resize', sync);
      window.removeEventListener('resize', sync);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  const update = <K extends Key>(k: K, v: CardData[K]) => {
    const nextData = { ...d, [k]: v };
    setD(nextData);
    // Xato ko‘rsatilgan maydon tuzatilishi bilan xabar yo‘qoladi.
    if (errors[k]) setErrors((er) => ({ ...er, [k]: validateCardStep(nextData, step)[k] }));
    if (status === 'error') setStatus('idle');
  };
  const text = (k: Key, max = 160) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(k, e.target.value.slice(0, max));
  const pick = (k: Key) => (v: string) => update(k, v);

  const toTop = useCallback(() => {
    bodyRef.current?.scrollTo({ top: 0, behavior: 'auto' });
    requestAnimationFrame(() => (dialogRef.current?.querySelector('[data-step-heading]') as HTMLElement | null)?.focus({ preventScroll: true }));
  }, []);

  const focusFirstError = (e: Errors) => {
    const first = STEP_FIELDS[step].find((k) => e[k]);
    if (!first) return;
    requestAnimationFrame(() => {
      const wrap = bodyRef.current?.querySelector(`[data-field="${first}"]`) as HTMLElement | null;
      wrap?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      (wrap?.querySelector('input:not([type=hidden]),textarea') as HTMLElement | null)?.focus({ preventScroll: true });
    });
  };

  const next = () => {
    const e = validateCardStep(d, step);
    setErrors(e);
    if (Object.keys(e).length) { focusFirstError(e); return; }
    setStep((s) => Math.min(2, s + 1));
    toTop();
  };
  const back = () => {
    if (status === 'sending') return;
    setErrors({});
    setStep((s) => Math.max(0, s - 1));
    toTop();
  };

  const submit = async () => {
    if (sending.current) return; // ikki marta bosish / Enter takrori
    const e = validateCardStep(d, 2);
    setErrors(e);
    if (Object.keys(e).length) { focusFirstError(e); return; }
    // Avvalgi bosqichlar ham to‘g‘ri ekaniga ishonch (masalan saqlangan qoralamadan tiklanganda).
    for (const s of [0, 1]) {
      const prev = validateCardStep(d, s);
      if (Object.keys(prev).length) { setStep(s); setErrors(prev); toTop(); return; }
    }
    sending.current = true;
    setStatus('sending');
    if (!submissionId.current) submissionId.current = newCardSubmissionId();
    const id = submissionId.current;
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ d, step, sid: id } satisfies Draft)); } catch { /* ignore */ }
    try {
      if (honeypot) throw new DeliveryError('rejected', 'spam'); // botlarga muvaffaqiyat ekrani ko‘rsatilmaydi
      const wait = MIN_FILL_MS - (Date.now() - startedAt.current);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const payload = buildCardPayload(d, { hp: honeypot, elapsed: Date.now() - startedAt.current }, id);
      await submitCard(payload);
      setStatus('done');
      submissionId.current = '';
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      requestAnimationFrame(() => (dialogRef.current?.querySelector('[data-success-heading]') as HTMLElement | null)?.focus({ preventScroll: true }));
    } catch {
      setStatus('error');
    } finally {
      sending.current = false;
    }
  };

  /** Muvaffaqiyatdan keyin yopilganda forma keyingi ariza uchun tozalanadi. */
  const close = () => {
    if (status === 'done') {
      setD(EMPTY_CARD); setStep(0); setErrors({}); setStatus('idle'); startedAt.current = 0;
    }
    onClose();
  };

  const E = (k: Key) => errors[k];
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <AnimatePresence>
      {open && (
        <motion.div key="card-modal" className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.22 }}>
          {/* Fon bosilganda oyna YOPILMAYDI — to‘ldirish paytida tasodifan yopilib ketmasligi uchun. */}
          <div aria-hidden className="absolute inset-0 bg-ink/85 backdrop-blur-[6px]" />
          <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="card-form-title"
            initial={{ y: reduce ? 0 : 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: reduce ? 0 : 16, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.32, ease }}
            className="card-dialog relative m-2.5 flex w-[calc(100%-20px)] max-w-[540px] flex-col overflow-hidden border border-line-strong bg-surface-1 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.95)] sm:m-6">
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet/80 to-transparent" />

            {/* Sarlavha: progress + yopish */}
            <div className="flex shrink-0 items-start justify-between gap-4 border-b border-line px-5 pb-4 pt-5 sm:px-8 sm:pt-7">
              <div className="min-w-0">
                <p id="card-form-title" className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist">{F.title}</p>
                {status !== 'done' && (
                  <div className="mt-3 flex items-center gap-3" aria-label={`${step + 1}-bosqich, jami 3`}>
                    <span className="tabular font-mono text-[12px] font-medium text-bone">{step + 1}/3</span>
                    <span aria-hidden className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <span key={i} className={`h-[3px] w-7 transition-colors duration-300 ${i <= step ? 'bg-violet' : 'bg-line-strong'}`} />
                      ))}
                    </span>
                  </div>
                )}
              </div>
              <button type="button" onClick={close} aria-label={F.closeLabel} data-cursor="hover" data-autofocus
                className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center text-mist transition-colors hover:text-bone">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden><path d="M3 3l12 12M15 3 3 15" stroke="currentColor" strokeWidth="1.6" /></svg>
              </button>
            </div>

            {status === 'done' ? (
              <div className="px-5 py-12 sm:px-8 sm:py-14" role="status" aria-live="polite">
                <span className="flex h-12 w-12 items-center justify-center bg-bone text-ink">
                  <svg width="20" height="20" viewBox="0 0 22 22" aria-hidden><path d="m4 11.5 4.5 4.5L18 6.5" stroke="currentColor" strokeWidth="2.2" fill="none" /></svg>
                </span>
                <h2 data-success-heading tabIndex={-1} className="mt-7 text-[1.7rem] font-bold leading-[1.1] tracking-[-0.03em] outline-none sm:text-[2rem]">{F.successTitle}</h2>
                <p className="mt-3 max-w-[40ch] text-[1rem] leading-relaxed text-mist">{F.successText}</p>
                <button type="button" onClick={close} data-cursor="hover"
                  className="mt-9 inline-flex min-h-13 w-full items-center justify-center border border-line-strong px-6 py-3.5 font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-bone transition-colors hover:border-bone/60 sm:w-auto">
                  {F.close}
                </button>
              </div>
            ) : (
              <form noValidate className="flex min-h-0 flex-1 flex-col"
                onSubmit={(e) => { e.preventDefault(); if (step < 2) next(); else void submit(); }}>
                <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
                  <label htmlFor="card_fax">Fax</label>
                  <input id="card_fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                </div>

                <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-7 pt-6 sm:px-8"
                  onFocus={(e) => {
                    // Klaviatura ochilganda faol maydon ko‘rinib tursin.
                    const t = e.target as HTMLElement;
                    if (t.matches('input[type=text],input[type=tel],input:not([type]),textarea')) setTimeout(() => t.scrollIntoView({ block: 'center', behavior: 'smooth' }), 320);
                  }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.fieldset key={step} disabled={status === 'sending'}
                      initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                      transition={{ duration: reduce ? 0 : 0.18, ease }}
                      className="min-w-0 border-0 p-0 disabled:opacity-60">
                      <h3 data-step-heading tabIndex={-1} className="text-[1.35rem] font-bold leading-tight tracking-[-0.02em] text-bone outline-none sm:text-[1.55rem]">
                        {F.steps[step]}<span className="text-violet">.</span>
                      </h3>

                      {step === 0 && (
                        <div className="mt-6 space-y-6">
                          <Field id="name" label={F.labels.name} error={E('name')}>
                            <input id="name" name="name" className={inputCls(E('name'))} value={d.name} onChange={text('name', 80)} autoComplete="name"
                              aria-invalid={!!E('name')} aria-describedby={describedBy('name', E('name'))} />
                          </Field>
                          <Field id="phone" label={F.labels.phone} error={E('phone')}>
                            <div className={`flex min-h-[52px] items-center border bg-ink/60 transition-colors focus-within:border-violet ${E('phone') ? 'border-alert/70' : 'border-line-strong'}`}>
                              <span className="select-none border-r border-line pl-4 pr-3 text-[16px] text-mist">+998</span>
                              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="90 123 45 67"
                                aria-invalid={!!E('phone')} aria-describedby={describedBy('phone', E('phone'))}
                                className="h-full min-h-[50px] w-full min-w-0 bg-transparent px-3 text-[16px] tracking-[0.02em] text-bone outline-none placeholder:text-ash/70"
                                value={formatPhone(phoneDigits(d.phone))} onChange={(e) => update('phone', phoneDigits(e.target.value))} />
                            </div>
                          </Field>
                          <Field id="business" label={F.labels.business} error={E('business')}>
                            <input id="business" name="business" className={inputCls(E('business'))} value={d.business} onChange={text('business', 160)}
                              placeholder={F.placeholders.business} aria-invalid={!!E('business')} aria-describedby={describedBy('business', E('business'))} />
                          </Field>
                          <Field id="link" label={F.labels.link} optional error={E('link')}>
                            <input id="link" name="link" type="text" inputMode="url" autoCapitalize="none" autoCorrect="off" spellCheck={false}
                              className={inputCls(E('link'))} value={d.link} onChange={text('link', 300)} placeholder={F.placeholders.link}
                              aria-invalid={!!E('link')} aria-describedby={describedBy('link', E('link'))} />
                          </Field>
                        </div>
                      )}

                      {step === 1 && (
                        <div className="mt-6 space-y-7">
                          <Chips id="need" label={F.labels.need} options={CARD_OPT.need} value={d.need} onChange={pick('need')} error={E('need')} columns="grid-cols-1 min-[400px]:grid-cols-2" />
                          <Chips id="experience" label={F.labels.experience} options={CARD_OPT.experience} value={d.experience} onChange={pick('experience')} error={E('experience')} columns="grid-cols-1" />
                          <Chips id="currentSpend" label={F.labels.currentSpend} options={CARD_OPT.currentSpend} value={d.currentSpend} onChange={pick('currentSpend')} error={E('currentSpend')} columns="grid-cols-2" />
                        </div>
                      )}

                      {step === 2 && (
                        <div className="mt-6 space-y-7">
                          <Chips id="readyBudget" label={F.labels.readyBudget} options={CARD_OPT.readyBudget} value={d.readyBudget} onChange={pick('readyBudget')} error={E('readyBudget')} columns="grid-cols-2" />
                          <Field id="problem" label={F.labels.problem} error={E('problem')}>
                            <textarea id="problem" name="problem" rows={3} className={`${inputCls(E('problem'))} min-h-[104px] resize-y py-3.5 leading-relaxed`}
                              value={d.problem} onChange={text('problem', 1000)} placeholder={F.placeholders.problem}
                              aria-invalid={!!E('problem')} aria-describedby={describedBy('problem', E('problem'))} />
                          </Field>
                        </div>
                      )}
                    </motion.fieldset>
                  </AnimatePresence>
                </div>

                {/* Pastki panel: xabarlar + navigatsiya. Doim ko‘rinadi. */}
                <div className="shrink-0 border-t border-line bg-surface-1 px-5 pb-[calc(env(safe-area-inset-bottom,0px)+16px)] pt-4 sm:px-8 sm:pb-6">
                  <div aria-live="polite">
                    {status === 'error' && (
                      <div role="alert" className="mb-4 border border-alert/40 bg-alert/[0.07] px-4 py-3 text-[0.88rem] leading-snug text-bone/90">
                        {F.sendError}
                        <span className="mt-1 block text-ash">{F.sendErrorAlt} <a className="text-bone underline decoration-bone/30 underline-offset-4" href={CONTACT.telegram.url} target="_blank" rel="noopener noreferrer">{CONTACT.telegram.handle}</a></span>
                      </div>
                    )}
                    {hasErrors && status !== 'error' && <p className="mb-3 text-[0.85rem] text-alert">{F.errors.step}</p>}
                  </div>
                  <div className={`grid gap-2.5 ${step > 0 ? 'grid-cols-[auto_1fr]' : 'grid-cols-1'}`}>
                    {step > 0 && (
                      <button type="button" onClick={back} disabled={status === 'sending'} data-cursor="hover"
                        className="inline-flex min-h-13 items-center justify-center gap-2 border border-line-strong px-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-bone transition-colors hover:border-bone/60 disabled:opacity-40 sm:px-6">
                        <span aria-hidden>←</span> {F.back}
                      </button>
                    )}
                    <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} data-cursor="hover"
                      className="group relative inline-flex min-h-13 items-center justify-center gap-3 overflow-hidden bg-bone px-4 font-mono text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink transition-colors disabled:cursor-wait disabled:opacity-75 sm:px-6">
                      <span aria-hidden className="absolute inset-0 origin-bottom scale-y-0 bg-violet transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100 group-disabled:scale-y-0" />
                      {status === 'sending' && <span aria-hidden className="relative h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />}
                      <span className="relative whitespace-nowrap group-hover:text-white group-disabled:text-ink">
                        {status === 'sending' ? F.sending : step < 2 ? F.next : F.submit}
                      </span>
                      {status !== 'sending' && <span aria-hidden className="relative transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">→</span>}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
