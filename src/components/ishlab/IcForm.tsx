import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { CONTACT } from '../../data/site';
import { IC_FORM_ID, OPT, form as F } from '../../content/ishlab';
import { DeliveryError } from '../../lib/applicationTransport';
import { icFingerprint } from '../../lib/leadFingerprint';
import { buildIshlabPayload, isIcSubmissionId, newIcSubmissionId, submitIshlab, trackIcLeadOnce, type IcData } from '../../lib/submitIshlab';
import { track } from '../../lib/tracking';
import { Chips, Field, describedBy, inputCls, phoneDigits } from '../qurilish/QrForm';

const ease = [0.22, 1, 0.36, 1] as const;
const DRAFT_KEY = 'fazo.ishlab.draft';
const MIN_FILL_MS = 4000;

type Errors = Partial<Record<keyof IcData, string>>;

const EMPTY: IcData = { name: '', phone: '', product: '', region: '', channel: '', budget: '', problem: '' };
const ORDER: (keyof IcData)[] = ['name', 'phone', 'product', 'region', 'channel', 'budget', 'problem'];
const formatPhone = (d: string) => [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');

export function validateIshlab(d: IcData): Errors {
  const e: Errors = {};
  if (d.name.trim().length < 2) e.name = 'Ismingizni kiriting';
  if (phoneDigits(d.phone).length !== 9) e.phone = 'Raqamni to‘liq kiriting: +998 XX XXX XX XX';
  if (d.product.trim().length < 2) e.product = 'Nima ishlab chiqarishingizni yozing';
  if (d.region.trim().length < 2) e.region = 'Hududingizni yozing';
  if (!OPT.channel.includes(d.channel)) e.channel = 'Sotuv yo‘nalishini tanlang';
  if (!OPT.budget.includes(d.budget)) e.budget = 'Budjet oralig‘ini tanlang';
  return e;
}

type ErrorReason = 'network' | 'busy' | 'contact' | 'invalid' | 'generic' | 'mismatch' | 'corrections';
/**
 * Retry bookkeeping, persisted per browser session:
 *  sid     — one submission id per logical application, kept until the server confirms it;
 *  sentFp  — fingerprint of the data last sent under that id;
 *  unknown — the last attempt may have been stored (timeout, lost reply), so the row may exist;
 *  edited  — data was changed after such an ambiguous attempt (the final success is then a correction).
 */
type Draft = { d?: Partial<IcData>; sid?: string; sentFp?: string; unknown?: boolean; edited?: boolean };

export function IcForm() {
  const reduce = useReducedMotion();
  const [d, setD] = useState<IcData>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [errorReason, setErrorReason] = useState<ErrorReason>('generic');
  const [outcome, setOutcome] = useState<'new' | 'updated'>('new');
  const [honeypot, setHoneypot] = useState('');
  const [retry, setRetry] = useState<{ sentFp: string; unknown: boolean; edited: boolean }>({ sentFp: '', unknown: false, edited: false });
  const submissionId = useRef('');
  const startedAt = useRef(0);
  const sending = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const hydrated = useRef(false);

  const save = (next: Draft) => { try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify(next)); } catch { /* ignore */ } };

  // Restore an unfinished draft (and its pending submission id) from this browser session, e.g. after a reload.
  useEffect(() => {
    startedAt.current = Date.now();
    try {
      const raw = sessionStorage.getItem(DRAFT_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Draft;
        if (saved.d) setD({ ...EMPTY, ...saved.d });
        if (saved.sid && isIcSubmissionId(saved.sid)) {
          submissionId.current = saved.sid;
          setRetry({ sentFp: saved.sentFp ?? '', unknown: !!saved.unknown, edited: !!saved.edited });
        }
      }
    } catch { /* ignore */ }
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!hydrated.current || status === 'done') return;
    save({ d, sid: submissionId.current, ...retry });
  }, [d, status, retry]);

  /** The previous attempt may already be stored and the user has since changed the data: next send is a correction. */
  const correcting = !!submissionId.current && retry.unknown && !!retry.sentFp && retry.sentFp !== icFingerprint(d);

  const started = () => track('IshlabFormStart', { content_name: 'Ishlab chiqarish ariza' }, { custom: true, onceKey: 'ic-form-start' });

  const update = <K extends keyof IcData>(k: K, v: IcData[K]) => {
    started();
    setD((prev) => {
      const next = { ...prev, [k]: v };
      if (tried) setErrors(validateIshlab(next));
      return next;
    });
  };
  const text = (k: keyof IcData, max = 160) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(k, e.target.value.slice(0, max));
  const pick = (k: keyof IcData) => (v: string) => update(k, v);

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
    if (sending.current) return; // double click / Enter spam
    const e = validateIshlab(d);
    setErrors(e);
    setTried(true);
    if (Object.keys(e).length) { focusFirstError(e); return; }
    sending.current = true;
    const wasCorrection = correcting || retry.edited; // this attempt carries edits to a possibly stored application
    setStatus('sending'); // inputs are disabled while sending: what the user sees is exactly what is sent
    // Keep the id across retries — also after a timeout, so an ambiguous attempt never turns into a second lead.
    if (!submissionId.current) submissionId.current = newIcSubmissionId();
    const id = submissionId.current;
    const payload = buildIshlabPayload(d, { hp: honeypot, elapsed: Date.now() - startedAt.current }, id);
    // Written before sending: if the page reloads mid-request, the same id and data are resumed.
    const inFlight = { sentFp: payload.fingerprint, unknown: true, edited: wasCorrection };
    save({ d, sid: id, ...inFlight });
    try {
      if (honeypot) throw new DeliveryError('rejected', 'spam'); // bots never get a success screen, nothing is sent
      const wait = MIN_FILL_MS + 250 - (Date.now() - startedAt.current);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      payload.elapsed = String(Date.now() - startedAt.current);
      // Success (and the Meta Lead event) only after the server confirms this id now holds this exact data.
      const confirmed = await submitIshlab(payload);
      trackIcLeadOnce(id);
      setOutcome(confirmed.updated || (confirmed.duplicate && wasCorrection) ? 'updated' : 'new');
      setStatus('done');
      submissionId.current = '';
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      requestAnimationFrame(() => {
        cardRef.current?.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
        (cardRef.current?.querySelector('[data-focus-target]') as HTMLElement | null)?.focus({ preventScroll: true });
      });
    } catch (err) {
      const code = err instanceof DeliveryError ? err.code : 'network';
      const detail = err instanceof DeliveryError ? err.detail : '';
      const field = err instanceof DeliveryError ? err.field : '';
      // Definite rejections mean this attempt stored nothing; ambiguous failures keep `unknown` so the next
      // send (same id) is either an idempotent retry or an explicit correction of the stored row.
      const definite = code === 'rejected' || code === 'http' || code === 'config';
      setRetry((prev) => (definite ? prev : inFlight));
      if (detail === 'invalid' && field === 'submissionId') { submissionId.current = ''; setRetry({ sentFp: '', unknown: false, edited: false }); }
      if (detail === 'invalid' && field && field in EMPTY) {
        const fieldErrors: Errors = { [field as keyof IcData]: 'Bu javob qabul qilinmadi — tekshirib, qayta kiriting' };
        setErrors(fieldErrors);
        focusFirstError(fieldErrors);
      }
      setErrorReason(
        detail === 'fingerprint_mismatch' ? 'mismatch'
          : detail === 'too_many_corrections' ? 'corrections'
          : code === 'timeout' || code === 'network' || code === 'bad_response' || detail === 'busy' || detail === 'storage_failed' ? 'network'
          : detail === 'rate_limited' ? 'busy'
          : detail === 'contact_rate_limited' ? 'contact'
          : detail === 'invalid' ? 'invalid'
          : 'generic');
      setStatus('error');
    } finally {
      sending.current = false;
    }
  };

  const E = (k: keyof IcData) => (tried ? errors[k] : undefined);

  return (
    <div ref={cardRef} id={`${IC_FORM_ID}-card`} className="relative scroll-mt-24 border border-line-strong bg-surface-1/90 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-forge/70 to-transparent" />
      {status === 'done' ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="px-6 py-14 sm:px-12 sm:py-20" role="status" aria-live="polite">
          <span className="flex h-14 w-14 items-center justify-center bg-bone text-ink">
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden><path d="m4 11.5 4.5 4.5L18 6.5" stroke="currentColor" strokeWidth="2.2" fill="none" /></svg>
          </span>
          <h3 data-focus-target tabIndex={-1} className="mt-8 text-[2rem] font-bold leading-[1.05] tracking-[-0.035em] outline-none sm:text-[2.6rem]">{(outcome === 'updated' ? F.updatedTitle : F.successTitle).slice(0, -1)}<span className="text-violet">.</span></h3>
          <p className="mt-4 max-w-[44ch] text-[1.05rem] leading-relaxed text-mist">{outcome === 'updated' ? F.updatedText : F.successText}</p>
        </motion.div>
      ) : (
        <form noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }} onFocus={started} aria-describedby="ic-form-status" aria-labelledby="ic-form-heading">
          {/* Honeypot: invisible to people, tempting to bots. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="ic_fax">Fax</label>
            <input id="ic_fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          <div className="border-b border-line px-5 pb-6 pt-8 sm:px-10 sm:pt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-mist"><span className="text-forge">●</span> Ariza · 1–2 daqiqa</p>
            <h3 id="ic-form-heading" data-focus-target tabIndex={-1} className="mt-4 outline-none text-[1.5rem] font-bold leading-[1.1] tracking-[-0.025em] text-bone sm:text-[1.85rem]">{F.title}</h3>
          </div>

          <fieldset disabled={status === 'sending'} className="min-w-0 border-0 p-0 disabled:opacity-60">
            <div className="space-y-7 px-5 py-8 sm:px-10 sm:py-10">
              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="name" label="Ismingiz" error={E('name')}>
                  <input id="name" name="name" required className={inputCls(E('name'))} value={d.name} onChange={text('name', 80)} autoComplete="name" aria-invalid={!!E('name')} aria-describedby={describedBy('name', E('name'))} />
                </Field>
                <Field id="phone" label="Telefon raqamingiz" error={E('phone')}>
                  <div className={`flex min-h-[52px] items-center border bg-ink/60 transition-colors focus-within:border-violet ${E('phone') ? 'border-alert/70' : 'border-line-strong'}`}>
                    <span className="select-none border-r border-line pl-4 pr-3 text-[16px] text-mist">+998</span>
                    <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="90 123 45 67" required aria-invalid={!!E('phone')} aria-describedby={describedBy('phone', E('phone'))}
                      className="h-full min-h-[50px] w-full min-w-0 bg-transparent px-3 text-[16px] tracking-[0.02em] text-bone outline-none placeholder:text-ash/70"
                      value={formatPhone(phoneDigits(d.phone))} onChange={(e) => update('phone', phoneDigits(e.target.value))} />
                  </div>
                </Field>
              </div>
              <div className="grid gap-7 sm:grid-cols-2">
                <Field id="product" label="Nima ishlab chiqarasiz?" error={E('product')}>
                  <input id="product" name="product" required aria-describedby={describedBy('product', E('product'))} className={inputCls(E('product'))} value={d.product} onChange={text('product', 160)} placeholder="Masalan: krovat va shkaflar" aria-invalid={!!E('product')} />
                </Field>
                <Field id="region" label="Hududingiz qayerda?" error={E('region')}>
                  <input id="region" name="region" required aria-describedby={describedBy('region', E('region'))} className={inputCls(E('region'))} value={d.region} onChange={text('region', 120)} placeholder="Masalan: Toshkent, Namangan" autoComplete="address-level1" aria-invalid={!!E('region')} />
                </Field>
              </div>
              <Chips id="channel" label="Asosiy sotuv yo‘nalishingiz" options={OPT.channel} value={d.channel} onChange={pick('channel')} error={E('channel')} columns="grid-cols-1 sm:grid-cols-3" />
              <Chips id="budget" label="Oylik reklama budjetingiz" options={OPT.budget} value={d.budget} onChange={pick('budget')} error={E('budget')} columns="grid-cols-1 sm:grid-cols-2" hint={F.budgetHint} />
              <Field id="problem" label="Hozirgi asosiy muammo nimada?" optional error={E('problem')}>
                <textarea id="problem" name="problem" rows={4} className={`${inputCls(E('problem'))} min-h-[120px] resize-y py-3.5 leading-relaxed`} value={d.problem} onChange={text('problem', 1000)} aria-describedby={describedBy('problem', E('problem'))}
                  placeholder="Masalan: reklama bor, lekin optom mijozlar kelmayapti" />
              </Field>
            </div>
          </fieldset>

          <div className="border-t border-line px-5 pb-6 pt-5 sm:px-10 sm:pb-8">
            <div id="ic-form-status" aria-live="polite">
              {correcting && status !== 'sending' && (
                <div className="mb-5 border border-forge/40 bg-forge/[0.06] px-4 py-3.5 text-[0.9rem] leading-snug text-bone/90">
                  <span className="font-semibold text-bone">{F.correctionTitle}</span> {F.correctionText}
                </div>
              )}
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
              <span className="relative group-hover:text-white group-disabled:text-ink">{status === 'sending' ? F.sending : correcting ? F.submitCorrection : status === 'error' ? F.retry : F.submit}</span>
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
