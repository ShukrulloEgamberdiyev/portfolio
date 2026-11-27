import { useCallback, useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { CONTACT } from '../data/site';
import { formError, formOpen, formSuccess } from '../lib/analytics';
import { clearDraft, loadDraft, newLeadId, saveDraft, sendLead, type Draft, type SendOutcome } from './client';
import { normalizeName, normalizePhone, normalizeTelegram } from './contact';
import { FORMS, visibleQuestions, type FormId, type Question } from './defs';
import { QUESTION_TEXT, UI_TEXT, type FormLang, type UiText } from './i18n';

/**
 * One lead form for the whole site: a short step-by-step questionnaire whose next question depends on
 * the previous answer, then name, phone and (optional) Telegram. Several instances can live on one
 * page — each has its own state, ids and saved draft (`storageKey`).
 *
 * Success is shown only after /api/lead confirms this application id; on any failure the answers stay
 * in the form (and in sessionStorage) and the same id is reused, so a retry never creates a duplicate.
 */

export const UZ_UI: UiText = {
  stepOf: (i: number, n: number) => `${i} / ${n}`,
  next: 'Davom etiş',
  back: 'Orqaga',
  skip: 'O‘tkazib yuboriş',
  optional: 'ixtiyoriy',
  choose: 'Variantlardan birini tanlang',
  fill: 'Şu maydonni to‘ldiring',
  tooLong: (max: number) => `Ko‘pi bilan ${max} belgi`,
  contactTitle: 'Siz bilan qanday bog‘lanamiz?',
  name: 'Ismingiz',
  phone: 'Telefon raqamingiz',
  phoneHint: 'O‘zbekiston raqami: +998 90 123 45 67. Xorijiy raqamni + bilan yozing.',
  telegram: 'Telegram username',
  telegramHint: 'Agar Telegram’da yozişimiz qulay bo‘lsa',
  submit: 'Arizani yuboriş',
  sending: 'Yuborilmoqda…',
  consent: 'Ma’lumotlaringiz faqat şu ariza bo‘yicha bog‘laniş uchun işlatiladi.',
  privacy: 'Maxfiylik siyosati',
  errors: {
    network: 'Ariza yuborilmadi: internet aloqasi uzildi yoki server javob bermadi. Javoblaringiz saqlanib turibdi — qayta yuboring.',
    timeout: 'Server javobini kutiş vaqti tugadi. Javoblaringiz saqlanib turibdi — qayta yuboring.',
    unavailable: 'Hozir arizani saqlab bo‘lmadi. Javoblaringiz saqlanib turibdi — birozdan so‘ng qayta yuboring yoki Telegram orqali yozing.',
    rate_limited: 'Bu raqamdan qisqa vaqt ichida bir nechta ariza yuborildi. Birozdan so‘ng qayta urinib ko‘ring yoki Telegram orqali yozing.',
    too_fast: 'Ariza juda tez yuborildi. Iltimos, tugmani yana bir marta bosing.',
    invalid: 'Ba’zi javoblar qabul qilinmadi. Belgilangan maydonni tekşirib, qayta yuboring.',
    unknown: 'Ariza yuborilmadi. Javoblaringiz saqlanib turibdi — qayta urinib ko‘ring.',
  } as Record<string, string>,
  retry: 'Qayta yuboriş',
  telegramAlt: 'Yoki Telegram orqali yozing',
  successTitle: 'Ariza qabul qilindi',
  successNext: 'Keyingi qadam: mutaxassisimiz siz bilan telefon yoki Telegram orqali bog‘lanadi, vazifangizni aniqlaştiradi va tanişuv uchraşuvini belgilaydi.',
  successId: 'Ariza raqami',
  contactErrors: {},
};

type Props = {
  formId: FormId;
  /** Separate saved draft for a second instance of the same form on one page. */
  storageKey?: string;
  /** Focus the first question on mount (popup). */
  autoFocus?: boolean;
  /** Report FormOpen on mount (popup) instead of when the form scrolls into view. */
  openOnMount?: boolean;
  className?: string;
  /** Display language; only the main-site form ('sayt') has Russian and English text. */
  lang?: FormLang;
  onSuccess?: (id: string) => void;
};

type FieldErrors = Partial<Record<'answer' | 'name' | 'phone' | 'telegram', string>>;

export function LeadForm({ formId, storageKey = formId, autoFocus = false, openOnMount = false, className = '', lang = 'uz', onSuccess }: Props) {
  const def = FORMS[formId];
  const tr = lang !== 'uz' && formId === 'sayt' ? lang : null;
  const T = tr ? UI_TEXT[tr] : UZ_UI;
  const cErr = (m: string) => T.contactErrors[m] ?? m;
  /** Text of a question in the page language; stored values stay the Uzbek option labels. */
  const text = (x: Question) => {
    const t = tr ? QUESTION_TEXT[tr][x.id] : undefined;
    return { label: t?.label ?? x.label, hint: t?.hint ?? x.hint, placeholder: t?.placeholder ?? (x.kind === 'text' ? x.placeholder : undefined), option: (i: number) => (x.kind === 'choice' ? (t?.options?.[i] ?? x.options[i]) : '') };
  };
  const uid = useId().replace(/:/g, '');
  const [draft, setDraft] = useState<Draft>(() => ({ answers: {}, step: 0, name: '', phone: '', telegram: '' }));
  const [hydrated, setHydrated] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [sendError, setSendError] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ id: string } | null>(null);
  const inFlight = useRef(false);
  const startedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLElement>(null);
  const moved = useRef(false);

  // Restore a saved draft after mount (sessionStorage is not available during prerender).
  useEffect(() => {
    setDraft(loadDraft(storageKey));
    setHydrated(true);
    startedAt.current = Date.now();
  }, [storageKey]);
  useEffect(() => { if (hydrated && !done) saveDraft(storageKey, draft); }, [draft, hydrated, storageKey, done]);

  // FormOpen: on mount for popups, otherwise the first time the form is on screen.
  useEffect(() => {
    if (openOnMount) { formOpen(formId); return; }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) { formOpen(formId); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [formId, openOnMount]);

  const questions = useMemo(() => visibleQuestions(def, draft.answers), [def, draft.answers]);
  const total = questions.length + 1;
  const step = Math.min(draft.step, questions.length);
  const q: Question | undefined = questions[step];

  // Move focus to the new step's heading after navigation (not on first render unless autoFocus).
  useEffect(() => {
    if (!hydrated) return;
    if (!moved.current && !autoFocus) return;
    const el = headingRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
    if (moved.current) rootRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [step, hydrated, autoFocus, done]);

  const go = (to: number) => {
    moved.current = true;
    setErrors({});
    setSendError('');
    setDraft((d) => ({ ...d, step: Math.max(0, Math.min(to, questions.length)) }));
  };

  const setAnswer = (id: string, value: string) => {
    setErrors({});
    setDraft((d) => ({ ...d, answers: { ...d.answers, [id]: value } }));
  };

  const validateQuestion = (question: Question, value: string): string => {
    if (question.kind === 'choice') return question.options.includes(value) ? '' : T.choose;
    const v = value.trim();
    if (!v && !question.optional) return T.fill;
    if (v.length > (question.max ?? 300)) return T.tooLong(question.max ?? 300);
    return '';
  };

  const nextFromQuestion = () => {
    if (!q) return;
    const err = validateQuestion(q, draft.answers[q.id] ?? '');
    if (err) { setErrors({ answer: err }); return; }
    go(step + 1);
  };

  const submit = useCallback(async () => {
    if (inFlight.current) return; // a second click while sending does nothing
    // Every visible question must still be answered (an earlier answer may have changed the path).
    for (let i = 0; i < questions.length; i += 1) {
      const err = validateQuestion(questions[i], draft.answers[questions[i].id] ?? '');
      if (err) { go(i); setTimeout(() => setErrors({ answer: err }), 0); return; }
    }
    const name = normalizeName(draft.name);
    const phone = normalizePhone(draft.phone);
    const tg = normalizeTelegram(draft.telegram);
    const fe: FieldErrors = {};
    if (!name.ok) fe.name = cErr(name.error);
    if (!phone.ok) fe.phone = cErr(phone.error);
    if (!tg.ok) fe.telegram = cErr(tg.error);
    if (Object.keys(fe).length) {
      setErrors(fe);
      const first = (['name', 'phone', 'telegram'] as const).find((k) => fe[k]);
      document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setSending(true);
    setSendError('');
    const id = draft.id || newLeadId();
    const createdAt = draft.createdAt || new Date().toISOString();
    const nextDraft: Draft = { ...draft, id, createdAt, phone: phone.ok ? phone.display : draft.phone, telegram: tg.ok ? tg.value : draft.telegram };
    setDraft(nextDraft);
    saveDraft(storageKey, nextDraft);

    let outcome: SendOutcome;
    try {
      outcome = await sendLead({
        formId, id, createdAt,
        answers: Object.fromEntries(questions.map((x) => [x.id, (draft.answers[x.id] ?? '').trim()])),
        name: name.ok ? name.value : '',
        phone: phone.ok ? phone.e164 : '',
        telegram: tg.ok ? tg.value : '',
        website: honeypot.current?.value ?? '',
        elapsedMs: Date.now() - startedAt.current,
      });
    } catch {
      outcome = { ok: false, error: 'unknown' };
    }
    inFlight.current = false;
    setSending(false);

    if (outcome.ok) {
      clearDraft(storageKey);
      formSuccess(formId, outcome.status, id);
      moved.current = true;
      setDone({ id });
      onSuccess?.(id);
      return;
    }
    formError(formId, outcome.error);
    if (outcome.error === 'invalid' && outcome.field) {
      const qi = questions.findIndex((x) => x.id === outcome.field);
      if (qi >= 0) { go(qi); setTimeout(() => setErrors({ answer: T.errors.invalid }), 0); return; }
      if (outcome.field === 'name' || outcome.field === 'phone' || outcome.field === 'telegram') {
        setErrors({ [outcome.field]: T.errors.invalid });
      }
    }
    setSendError(T.errors[outcome.error] ?? T.errors.unknown);
    }, [draft, questions, formId, storageKey, uid, onSuccess, T]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (q) nextFromQuestion();
    else void submit();
  };

  const onFieldFocus = (e: React.FocusEvent<HTMLElement>) => {
    // Keep the focused field above the on-screen keyboard on phones.
    const el = e.currentTarget;
    if (window.matchMedia?.('(pointer: coarse)').matches) setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250);
  };

  if (done) {
    return (
      <div className={`lf ${className}`} role="status">
        <p ref={headingRef as React.RefObject<HTMLParagraphElement>} tabIndex={-1} className="text-[1.6rem] font-bold leading-tight tracking-[-0.02em] outline-none">
          {T.successTitle}<span className="lf-accent">.</span>
        </p>
        <p className="mt-4 max-w-[46ch] text-[1rem] leading-relaxed text-bone/85">{T.successNext}</p>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">{T.successId}: <span className="text-mist normal-case tracking-normal">{done.id}</span></p>
        <a href={CONTACT.telegram.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center gap-2 border-b border-line-strong pb-1 text-[0.95rem] text-bone hover:border-bone">
          Telegram: {CONTACT.telegram.handle}
        </a>
      </div>
    );
  }

  const progress = Math.round(((step + (q ? 0 : 1)) / total) * 100);
  const errId = `${uid}-err`;

  return (
    <form ref={rootRef} noValidate onSubmit={onSubmit} className={`lf ${className}`} aria-busy={sending}>
      <div className="flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ash">
        <span aria-hidden>{T.stepOf(step + 1, total)}</span>
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} disabled={sending} className="tap text-mist transition-colors hover:text-bone disabled:opacity-40">
            ← {T.back}
          </button>
        )}
      </div>
      <div className="mt-3 h-px w-full bg-line" aria-hidden>
        <div className="lf-bar h-px" style={{ width: `${Math.max(progress, 4)}%` }} />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>Veb-sayt<input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
      </div>

      {q ? (
        <fieldset key={q.id} className="lf-step mt-7 min-w-0 border-0 p-0">
          <legend ref={headingRef as React.RefObject<HTMLLegendElement>} tabIndex={-1} className="float-left w-full text-[1.3rem] font-semibold leading-snug tracking-[-0.015em] outline-none sm:text-[1.45rem]">
            <span className="sr-only">{T.stepOf(step + 1, total)}. </span>{text(q).label}
            {q.kind === 'text' && q.optional && <span className="ml-2 align-middle font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-ash">{T.optional}</span>}
          </legend>
          {text(q).hint && <p className="clear-both pt-2 text-[0.9rem] leading-relaxed text-mist">{text(q).hint}</p>}
          <div className="clear-both pt-5">
            {q.kind === 'choice' ? (
              <div className="grid gap-2" aria-describedby={errors.answer ? errId : undefined}>
                {q.options.map((opt, i) => {
                  const checked = draft.answers[q.id] === opt;
                  return (
                    <label key={opt}
                      // A tap or click on a choice moves on; with the keyboard, arrows/Space select and Enter continues.
                      onPointerUp={(e) => { if (e.button === 0) { setAnswer(q.id, opt); setTimeout(() => go(step + 1), 180); } }}
                      className={`lf-option group flex min-h-[52px] cursor-pointer items-center gap-3 border px-4 py-3 text-[0.98rem] leading-snug transition-colors ${checked ? 'lf-option-on border-transparent text-bone' : 'border-line-strong text-bone/90 hover:border-bone/50'}`}>
                      <input
                        type="radio" name={`${uid}-${q.id}`} value={opt} checked={checked}
                        onChange={() => setAnswer(q.id, opt)}
                        data-first={i === 0 ? '' : undefined}
                        className="peer sr-only"
                      />
                      <span aria-hidden className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${checked ? 'lf-dot border-transparent' : 'border-line-strong'}`}>
                        {checked && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="peer-focus-visible:underline">{text(q).option(i)}</span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <input
                id={`${uid}-${q.id}`} type="text" value={draft.answers[q.id] ?? ''} maxLength={(q.max ?? 300) + 20}
                placeholder={text(q).placeholder} onChange={(e) => setAnswer(q.id, e.target.value)} onFocus={onFieldFocus}
                aria-invalid={!!errors.answer} aria-describedby={errors.answer ? errId : undefined} aria-label={text(q).label}
                autoComplete={q.id === 'company' ? 'organization' : 'off'}
                className="lf-input"
              />
            )}
            {errors.answer && <p id={errId} role="alert" className="lf-error mt-3">{errors.answer}</p>}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="lf-btn">{T.next} →</button>
            {q.kind === 'text' && q.optional && !(draft.answers[q.id] ?? '').trim() && (
              <button type="button" onClick={() => go(step + 1)} className="tap px-2 text-[0.92rem] text-mist hover:text-bone">{T.skip}</button>
            )}
          </div>
        </fieldset>
      ) : (
        <fieldset className="lf-step mt-7 min-w-0 border-0 p-0" disabled={sending}>
          <legend ref={headingRef as React.RefObject<HTMLLegendElement>} tabIndex={-1} className="float-left w-full text-[1.3rem] font-semibold leading-snug tracking-[-0.015em] outline-none sm:text-[1.45rem]">
            <span className="sr-only">{T.stepOf(total, total)}. </span>{T.contactTitle}
          </legend>
          <div className="clear-both grid gap-5 pt-5">
            <Field id={`${uid}-name`} label={T.name} error={errors.name}>
              <input id={`${uid}-name`} type="text" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                onFocus={onFieldFocus} autoComplete="name" autoCapitalize="words" enterKeyHint="next" maxLength={80}
                aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-err` : undefined} className="lf-input" />
            </Field>
            <Field id={`${uid}-phone`} label={T.phone} hint={T.phoneHint} error={errors.phone}>
              <input id={`${uid}-phone`} type="tel" inputMode="tel" value={draft.phone}
                onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
                onBlur={() => { const r = normalizePhone(draft.phone); if (r.ok) setDraft((d) => ({ ...d, phone: r.display })); }}
                onFocus={onFieldFocus} autoComplete="tel" enterKeyHint="next" placeholder="+998 90 123 45 67" maxLength={32}
                aria-invalid={!!errors.phone} aria-describedby={`${uid}-phone-hint${errors.phone ? ` ${uid}-phone-err` : ''}`} className="lf-input" />
            </Field>
            <Field id={`${uid}-telegram`} label={T.telegram} optional={T.optional} hint={T.telegramHint} error={errors.telegram}>
              <input id={`${uid}-telegram`} type="text" value={draft.telegram} onChange={(e) => setDraft((d) => ({ ...d, telegram: e.target.value }))}
                onBlur={() => { const r = normalizeTelegram(draft.telegram); if (r.ok) setDraft((d) => ({ ...d, telegram: r.value })); }}
                onFocus={onFieldFocus} autoComplete="off" autoCapitalize="none" autoCorrect="off" spellCheck={false} enterKeyHint="send"
                placeholder="@username" maxLength={60}
                aria-invalid={!!errors.telegram} aria-describedby={`${uid}-telegram-hint${errors.telegram ? ` ${uid}-telegram-err` : ''}`} className="lf-input" />
            </Field>
          </div>
          <div className="mt-7">
            <button type="submit" disabled={sending} className="lf-btn lf-btn-primary w-full sm:w-auto" aria-describedby={sendError ? errId : undefined}>
              {sending ? (<><span aria-hidden className="lf-spinner" />{T.sending}</>) : `${sendError ? T.retry : T.submit} →`}
            </button>
            <p className="mt-4 max-w-[52ch] text-[0.82rem] leading-relaxed text-ash">
              {T.consent} <a href="/privacy" className="underline decoration-line-strong underline-offset-2 hover:text-bone">{T.privacy}</a>
            </p>
          </div>
        </fieldset>
      )}

      <div aria-live="assertive" className="empty:hidden">
        {sendError && (
          <div id={errId} className="lf-error mt-5 border border-current/30 px-4 py-3">
            <p>{sendError}</p>
            <a href={CONTACT.telegram.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block underline underline-offset-2">{T.telegramAlt}: {CONTACT.telegram.handle}</a>
          </div>
        )}
      </div>
    </form>
  );
}

function Field({ id, label, hint, optional, error, children }: { id: string; label: string; hint?: string; optional?: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.95rem] font-medium text-bone">
        {label}
        {optional && <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-ash">{optional}</span>}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-1 text-[0.82rem] leading-snug text-ash">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && <p id={`${id}-err`} role="alert" className="lf-error mt-2">{error}</p>}
    </div>
  );
}
