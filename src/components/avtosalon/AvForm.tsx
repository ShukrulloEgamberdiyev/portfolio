import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { CONTACT } from '../../data/site';
import { AV_FORM_ID, OPT, REGIONS, form as F } from '../../content/avtosalon';
import { DeliveryError } from '../../lib/applicationTransport';
import { buildAvtosalonPayload, isSubmissionId, newSubmissionId, submitAvtosalon, trackLeadOnce, type AvData } from '../../lib/submitAvtosalon';
import { track } from '../../lib/tracking';
import { scrollToId } from '../../lib/scroll';

const ease = [0.22, 1, 0.36, 1] as const;
const DRAFT_KEY = 'fazo.avtosalon.draft';
const MIN_FILL_MS = 4000;

type Errors = Partial<Record<keyof AvData, string>>;

const EMPTY: AvData = {
  dealer: '', region: '', city: '', instagram: '', website: '', carTypes: [], carBrands: '', branches: '', stock: '',
  marketingOwner: '', targetStatus: '', budget: '', monthlyLeads: '', leadsUnknown: false,
  monthlySales: '', salesStaff: '', rop: '', crm: '', leadSystem: '',
  goals: [], goalsOther: '', problem: '', name: '', position: '', phone: '', telegram: '',
};

const FIELD_STEP: Partial<Record<keyof AvData, number>> = {
  dealer: 0, region: 0, city: 0, instagram: 0, website: 0, carTypes: 0, carBrands: 0, branches: 0, stock: 0,
  marketingOwner: 1, targetStatus: 1, budget: 1, monthlyLeads: 1, leadsUnknown: 1,
  monthlySales: 2, salesStaff: 2, rop: 2, crm: 2, leadSystem: 2,
  goals: 3, goalsOther: 3, problem: 3, name: 3, position: 3, phone: 3, telegram: 3,
};

/* ───────── validation ───────── */

const isInstagram = (v: string) => {
  const s = v.trim();
  return /^@?[a-zA-Z0-9._]{2,30}$/.test(s) || /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{2,30}\/?(\?.*)?$/i.test(s);
};
const isWebsite = (v: string) => /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v.trim());
export const phoneDigits = (v: string) => {
  let digits = v.replace(/\D/g, '');
  if (digits.length > 9 && digits.startsWith('998')) digits = digits.slice(3); // pasted with country code
  return digits.slice(0, 9);
};
const formatPhone = (d: string) => [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean).join(' ');
const isTelegram = (v: string) => /^@?[a-zA-Z][a-zA-Z0-9_]{4,31}$/.test(v.trim()); // 5–32 belgi, @ hisobga olinmaydi

function validate(step: number, d: AvData): Errors {
  const e: Errors = {};
  const req = 'Majburiy maydon';
  if (step === 0) {
    if (d.dealer.trim().length < 2) e.dealer = 'Avtosalon nomini kiriting';
    if (!d.region) e.region = 'Hududni tanlang';
    if (!d.instagram.trim()) e.instagram = req;
    else if (!isInstagram(d.instagram)) e.instagram = 'Masalan: @avtosalon yoki instagram.com/avtosalon';
    if (d.website.trim() && !isWebsite(d.website)) e.website = 'Sayt manzilini tekshiring (masalan: avtosalon.uz)';
    if (!d.carTypes.length) e.carTypes = 'Kamida bittasini tanlang';
    if (!d.branches) e.branches = req;
    if (!d.stock) e.stock = req;
  }
  if (step === 1) {
    if (!d.marketingOwner) e.marketingOwner = req;
    if (!d.targetStatus) e.targetStatus = req;
    if (!d.budget) e.budget = 'Budjet oralig‘ini tanlang';
    if (!d.leadsUnknown && !/^\d{1,6}$/.test(d.monthlyLeads.trim())) e.monthlyLeads = 'Taxminiy sonni kiriting yoki “Aniq bilmayman”ni tanlang';
  }
  if (step === 2) {
    if (!d.monthlySales) e.monthlySales = req;
    if (!d.salesStaff) e.salesStaff = req;
    if (!d.rop) e.rop = req;
    if (!d.crm) e.crm = req;
    if (!d.leadSystem) e.leadSystem = req;
  }
  if (step === 3) {
    if (!d.goals.length) e.goals = 'Kamida bittasini tanlang';
    if (d.goals.includes('Boshqa') && d.goalsOther.trim().length < 2) e.goalsOther = 'Qisqacha yozing';
    if (d.problem.trim().length < 5) e.problem = 'Qisqacha yozing — bu suhbatni aniqroq qiladi';
    if (d.name.trim().length < 2) e.name = 'Ismingizni kiriting';
    if (d.position.trim().length < 2) e.position = 'Lavozimingizni kiriting';
    if (phoneDigits(d.phone).length !== 9) e.phone = 'Raqamni to‘liq kiriting: +998 XX XXX XX XX';
    if (!isTelegram(d.telegram)) e.telegram = 'Masalan: @username — 5–32 belgi: lotin harflari, raqamlar va _';
  }
  return e;
}

/* ───────── field primitives ───────── */

function Field({ id, label, optional, error, hint, children }: { id: string; label: string; optional?: boolean; error?: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <div data-field={id}>
      <label htmlFor={id} className="block text-[0.95rem] font-medium text-bone">
        {label}{optional ? <span className="ml-2 text-[0.8rem] font-normal text-ash">ixtiyoriy</span> : <span className="text-signal"> *</span>}
      </label>
      {hint && <div className="mt-1.5 text-[0.85rem] leading-snug text-ash">{hint}</div>}
      <div className="mt-3">{children}</div>
      {error && <p id={`${id}-err`} className="mt-2 text-[0.85rem] text-alert" role="alert">{error}</p>}
    </div>
  );
}

const inputCls = (err?: string) =>
  `w-full min-h-[52px] rounded-[10px] border bg-ink/60 px-4 text-[16px] text-bone outline-none transition-colors placeholder:text-ash/70 focus:border-signal focus:bg-ink ${err ? 'border-alert/70' : 'border-line-strong'}`;

function Chips({ id, label, options, value, onChange, multi = false, error, hint, columns }: {
  id: string; label: string; options: string[]; value: string | string[]; onChange: (v: string) => void; multi?: boolean; error?: string; hint?: ReactNode; columns?: string;
}) {
  const gid = useId();
  const selected = (o: string) => (Array.isArray(value) ? value.includes(o) : value === o);
  return (
    <fieldset data-field={id} aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="text-[0.95rem] font-medium text-bone">
        {label}<span className="text-signal"> *</span>
        {multi && <span className="ml-2 text-[0.8rem] font-normal text-ash">bir nechtasini tanlash mumkin</span>}
      </legend>
      {hint && <div className="mt-1.5 text-[0.85rem] leading-snug text-ash">{hint}</div>}
      <div className={`mt-3 grid gap-2 ${columns ?? 'grid-cols-2 sm:flex sm:flex-wrap'}`}>
        {options.map((o, i) => {
          const on = selected(o);
          return (
            <label key={o} data-cursor="hover"
              className={`relative flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-[10px] border px-3.5 py-2.5 text-[0.92rem] leading-snug transition-[background-color,border-color,color] duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-signal ${on ? 'border-signal bg-signal text-ink' : 'border-line-strong text-bone/90 hover:border-bone/45'}`}>
              <input id={i === 0 ? id : `${gid}-${i}`} type={multi ? 'checkbox' : 'radio'} name={id} value={o} checked={on} onChange={() => onChange(o)} className="sr-only" />
              {multi && (
                <span aria-hidden className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${on ? 'border-ink bg-ink text-signal' : 'border-bone/40'}`}>
                  {on && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5.2 4 7.5l4.5-5" stroke="currentColor" strokeWidth="1.6" fill="none" /></svg>}
                </span>
              )}
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

export function AvForm() {
  const reduce = useReducedMotion();
  const [d, setD] = useState<AvData>(EMPTY);
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [tried, setTried] = useState<boolean[]>([false, false, false, false]);
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
        const saved = JSON.parse(raw) as { d?: Partial<AvData>; step?: number; sid?: string };
        if (saved.d) setD({ ...EMPTY, ...saved.d });
        if (saved.sid && isSubmissionId(saved.sid)) submissionId.current = saved.sid;
        if (typeof saved.step === 'number') setStep(Math.min(3, Math.max(0, saved.step)));
      }
    } catch { /* ignore */ }
    hydrated.current = true;
  }, []);
  useEffect(() => {
    if (!hydrated.current || status === 'done') return;
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ d, step, sid: submissionId.current })); } catch { /* ignore */ }
  }, [d, step, status]);

  const started = () => track('AvtosalonFormStart', { content_name: 'Avtosalon ariza' }, { custom: true, onceKey: 'av-form-start' });

  const update = <K extends keyof AvData>(k: K, v: AvData[K]) => {
    started();
    setD((prev) => {
      const next = { ...prev, [k]: v };
      if (tried[step]) setErrors(validate(step, next));
      return next;
    });
  };
  const text = (k: keyof AvData, max = 160) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => update(k, e.target.value.slice(0, max) as never);
  const pick = (k: keyof AvData) => (v: string) => update(k, v as never);
  const toggle = (k: 'carTypes' | 'goals') => (v: string) => update(k, (d[k].includes(v) ? d[k].filter((x) => x !== v) : [...d[k], v]));

  const keepCardInView = () => {
    const el = cardRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0 || top > window.innerHeight * 0.4) scrollToId(`${AV_FORM_ID}-card`);
  };

  const focusFirstError = (e: Errors) => {
    const first = Object.keys(e)[0];
    if (!first) return;
    requestAnimationFrame(() => {
      const wrap = cardRef.current?.querySelector(`[data-field="${first}"]`) as HTMLElement | null;
      wrap?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
      const input = wrap?.querySelector('input:not([type=hidden]),select,textarea') as HTMLElement | null;
      input?.focus({ preventScroll: true });
    });
  };

  const goNext = async () => {
    if (sending.current) return;
    const e = validate(step, d);
    setErrors(e);
    setTried((t) => t.map((v, i) => (i === step ? true : v)));
    if (Object.keys(e).length) { focusFirstError(e); return; }
    if (step < 3) {
      if (status === 'error') setStatus('idle');
      setDir(1); setStep(step + 1);
      track('AvtosalonFormStep', { step: step + 2, step_name: F.steps[step + 1] }, { custom: true, onceKey: `av-step-${step + 2}` });
      keepCardInView();
      return;
    }
    // Final submit — re-check every step, not only the current one.
    for (let i = 0; i < 3; i++) {
      const stepErrors = validate(i, d);
      if (Object.keys(stepErrors).length) {
        setDir(-1); setStep(i); setErrors(stepErrors);
        setTried((t) => t.map((v, j) => (j === i ? true : v)));
        focusFirstError(stepErrors);
        return;
      }
    }
    sending.current = true;
    setStatus('sending'); // inputs are disabled while sending, so what the user sees is exactly what is sent
    if (!submissionId.current) submissionId.current = newSubmissionId();
    const id = submissionId.current;
    try { sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ d, step, sid: id })); } catch { /* ignore */ }
    try {
      if (honeypot) throw new DeliveryError('rejected', 'spam'); // bots never get a success screen, nothing is sent
      // Minimum-time spam check: wait out the remainder instead of dropping a real (e.g. restored) application.
      const wait = MIN_FILL_MS + 250 - (Date.now() - startedAt.current);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      const payload = buildAvtosalonPayload(d, { hp: honeypot, elapsed: Date.now() - startedAt.current }, id);
      await submitAvtosalon(payload);
      // Only a confirmed save (new row, or this id's row already stored) reaches this line.
      trackLeadOnce(id);
      setStatus('done');
      try { sessionStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
      keepCardInView();
    } catch (err) {
      const code = err instanceof DeliveryError ? err.code : 'network';
      const detail = err instanceof DeliveryError ? err.detail : '';
      const field = err instanceof DeliveryError ? err.field : '';
      if (detail === 'invalid' && field === 'submissionId') submissionId.current = ''; // malformed id: next attempt gets a fresh one
      if (detail === 'invalid' && field && field in EMPTY) {
        // The server rejected a specific answer: show it on its own step, keep everything else.
        const key = field as keyof AvData;
        const s = FIELD_STEP[key] ?? 3;
        setDir(-1); setStep(s);
        setTried((t) => t.map((v, j) => (j === s ? true : v)));
        const fieldErrors: Errors = { [key]: 'Bu javob qabul qilinmadi — tekshirib, qayta kiriting' };
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

  const goBack = () => { if (sending.current) return; setDir(-1); setStep(Math.max(0, step - 1)); setErrors({}); setStatus('idle'); keepCardInView(); };

  const E = (k: keyof AvData) => (tried[step] ? errors[k] : undefined);

  const screens = [
    <div key="s0" className="space-y-7">
      <Field id="dealer" label="Avtosalon nomi" error={E('dealer')}>
        <input id="dealer" name="dealer" className={inputCls(E('dealer'))} value={d.dealer} onChange={text('dealer')} autoComplete="organization" placeholder="Masalan: Avto Premium" />
      </Field>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="region" label="Qaysi hudud / shaharda joylashgan?" error={E('region')}>
          <div className="relative">
            <select id="region" name="region" className={`${inputCls(E('region'))} appearance-none pr-10 ${d.region ? '' : 'text-ash/80'}`} value={d.region} onChange={text('region')}>
              <option value="" disabled>Hududni tanlang</option>
              {REGIONS.map((r) => <option key={r} value={r} className="bg-surface-2 text-bone">{r}</option>)}
            </select>
            <svg aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-mist" width="12" height="8" viewBox="0 0 12 8"><path d="m1 1.5 5 5 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </div>
        </Field>
        <Field id="city" label="Shahar / tuman" optional>
          <input id="city" name="city" className={inputCls()} value={d.city} onChange={text('city', 80)} placeholder="Masalan: Chirchiq" autoComplete="address-level2" />
        </Field>
      </div>
      <div className="grid gap-7 sm:grid-cols-2">
        <Field id="instagram" label="Instagram sahifasi" error={E('instagram')}>
          <input id="instagram" name="instagram" className={inputCls(E('instagram'))} value={d.instagram} onChange={text('instagram', 120)} placeholder="@avtosalon" autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="url" />
        </Field>
        <Field id="website" label="Sayt" optional error={E('website')}>
          <input id="website" name="website" className={inputCls(E('website'))} value={d.website} onChange={text('website', 160)} placeholder="avtosalon.uz" autoCapitalize="none" autoCorrect="off" spellCheck={false} inputMode="url" />
        </Field>
      </div>
      <Chips id="carTypes" label="Qanday avtomobillar sotasiz?" multi options={OPT.carTypes} value={d.carTypes} onChange={toggle('carTypes')} error={E('carTypes')} />
      <Field id="carBrands" label="Brendlar yoki modellar" optional>
        <input id="carBrands" name="carBrands" className={inputCls()} value={d.carBrands} onChange={text('carBrands', 200)} placeholder="Qaysi brendlar bilan ishlaysiz?" />
      </Field>
      <Chips id="branches" label="Nechta filialingiz bor?" options={OPT.branches} value={d.branches} onChange={pick('branches')} error={E('branches')} columns="grid-cols-4" />
      <Chips id="stock" label="Hozir omborda taxminan nechta avtomobil mavjud?" options={OPT.stock} value={d.stock} onChange={pick('stock')} error={E('stock')} columns="grid-cols-3 sm:grid-cols-5" />
    </div>,

    <div key="s1" className="space-y-7">
      <Chips id="marketingOwner" label="Hozir marketing bilan kim shug‘ullanadi?" options={OPT.marketingOwner} value={d.marketingOwner} onChange={pick('marketingOwner')} error={E('marketingOwner')} columns="grid-cols-2 sm:grid-cols-3" />
      <Chips id="targetStatus" label="Hozir target reklama ishlayaptimi?" options={OPT.targetStatus} value={d.targetStatus} onChange={pick('targetStatus')} error={E('targetStatus')} columns="grid-cols-3" />
      <Chips id="budget" label="Oyiga marketing va reklama uchun qancha budjet ajratasiz?" options={OPT.budget} value={d.budget} onChange={pick('budget')} error={E('budget')} columns="grid-cols-2"
        hint={
          <span className="mt-1 flex gap-2.5 rounded-[10px] border border-signal/25 bg-signal/[0.06] px-3.5 py-3 text-[0.85rem] leading-snug text-bone/85">
            <span aria-hidden className="mt-[3px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-signal text-[10px] font-bold text-signal">i</span>
            <span>Bu — <b className="font-semibold text-bone">avtosaloningizning</b> marketing va reklamaga ajratadigan umumiy oylik budjeti (reklama xarajatlari bilan birga). Bu <b className="font-semibold text-bone">FAZO Digital xizmati narxi emas</b>.</span>
          </span>
        } />
      <Field id="monthlyLeads" label="Oyiga taxminan nechta murojaat olasiz?" error={E('monthlyLeads')}>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input id="monthlyLeads" name="monthlyLeads" className={`${inputCls(E('monthlyLeads'))} sm:max-w-[220px] disabled:opacity-40`} value={d.leadsUnknown ? '' : d.monthlyLeads}
            onChange={(e) => update('monthlyLeads', e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" pattern="[0-9]*" placeholder="Masalan: 150" disabled={d.leadsUnknown} />
          <label data-cursor="hover" className={`flex min-h-[52px] cursor-pointer items-center gap-2.5 rounded-[10px] border px-4 text-[0.92rem] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-signal ${d.leadsUnknown ? 'border-signal bg-signal text-ink' : 'border-line-strong text-bone/90 hover:border-bone/45'}`}>
            <input type="checkbox" className="sr-only" checked={d.leadsUnknown} onChange={() => update('leadsUnknown', !d.leadsUnknown)} />
            Aniq bilmayman
          </label>
        </div>
      </Field>
    </div>,

    <div key="s2" className="space-y-7">
      <Chips id="monthlySales" label="Oyiga taxminan nechta avtomobil sotasiz?" options={OPT.monthlySales} value={d.monthlySales} onChange={pick('monthlySales')} error={E('monthlySales')} columns="grid-cols-3 sm:grid-cols-5" />
      <Chips id="salesStaff" label="Sotuv bo‘limida nechta xodim ishlaydi?" options={OPT.salesStaff} value={d.salesStaff} onChange={pick('salesStaff')} error={E('salesStaff')} columns="grid-cols-3 sm:grid-cols-5" />
      <div className="grid gap-7 sm:grid-cols-2">
        <Chips id="rop" label="Sotuv bo‘limi rahbari (ROP) bormi?" options={OPT.rop} value={d.rop} onChange={pick('rop')} error={E('rop')} columns="grid-cols-2" />
        <Chips id="crm" label="CRM ishlatasizmi?" options={OPT.crm} value={d.crm} onChange={pick('crm')} error={E('crm')} columns="grid-cols-3" />
      </div>
      <Chips id="leadSystem" label="Leadlarni hozir qayerda yuritasiz?" options={OPT.leadSystem} value={d.leadSystem} onChange={pick('leadSystem')} error={E('leadSystem')} columns="grid-cols-2 sm:grid-cols-3" />
    </div>,

    <div key="s3" className="space-y-7">
      <Chips id="goals" label="FAZO Digital bilan ishlashdan nimani kutyapsiz?" multi options={OPT.goals} value={d.goals} onChange={toggle('goals')} error={E('goals')} columns="grid-cols-1 sm:grid-cols-2" />
      <AnimatePresence initial={false}>
        {d.goals.includes('Boshqa') && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease }} className="overflow-hidden">
            <Field id="goalsOther" label="Boshqa — nimani kutyapsiz?" error={E('goalsOther')}>
              <input id="goalsOther" name="goalsOther" className={inputCls(E('goalsOther'))} value={d.goalsOther} onChange={text('goalsOther', 300)} />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>
      <Field id="problem" label="Hozir biznesingizdagi eng katta muammo nima?" error={E('problem')}>
        <textarea id="problem" name="problem" rows={4} className={`${inputCls(E('problem'))} min-h-[120px] resize-y py-3 leading-relaxed`} value={d.problem} onChange={text('problem', 1000)}
          placeholder="Masalan: murojaatlar bor, lekin menejerlar ularni sotuvgacha olib bormaydi" />
      </Field>
      <div className="border-t border-line pt-7">
        <p className="eyebrow text-mist!">Aloqa ma’lumotlari</p>
        <div className="mt-5 grid gap-7 sm:grid-cols-2">
          <Field id="name" label="Ismingiz" error={E('name')}>
            <input id="name" name="name" className={inputCls(E('name'))} value={d.name} onChange={text('name', 80)} autoComplete="name" />
          </Field>
          <Field id="position" label="Lavozimingiz" error={E('position')}>
            <input id="position" name="position" className={inputCls(E('position'))} value={d.position} onChange={text('position', 80)} list="av-positions" autoComplete="organization-title" placeholder="Masalan: Direktor" />
            <datalist id="av-positions">{OPT.positions.map((p) => <option key={p} value={p} />)}</datalist>
          </Field>
          <Field id="phone" label="Telefon raqamingiz" error={E('phone')}>
            <div className={`flex min-h-[52px] items-center rounded-[10px] border bg-ink/60 transition-colors focus-within:border-signal ${E('phone') ? 'border-alert/70' : 'border-line-strong'}`}>
              <span className="select-none border-r border-line pl-4 pr-3 text-[16px] text-mist">+998</span>
              <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="90 123 45 67"
                className="h-full min-h-[50px] w-full bg-transparent px-3 text-[16px] tracking-[0.02em] text-bone outline-none placeholder:text-ash/70"
                value={formatPhone(phoneDigits(d.phone))} onChange={(e) => update('phone', phoneDigits(e.target.value))} />
            </div>
          </Field>
          <Field id="telegram" label="Telegram username" error={E('telegram')}>
            <input id="telegram" name="telegram" className={inputCls(E('telegram'))} value={d.telegram} placeholder="@username" autoCapitalize="none" autoCorrect="off" spellCheck={false}
              onChange={(e) => { const v = e.target.value.replace(/\s/g, '').replace(/^@+/, '').slice(0, 32); update('telegram', v ? `@${v}` : ''); }} />
          </Field>
        </div>
      </div>
    </div>,
  ];

  return (
    <div ref={cardRef} id={`${AV_FORM_ID}-card`} className="relative scroll-mt-24 overflow-hidden rounded-[18px] border border-line-strong bg-surface-1/90 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-signal/60 to-transparent" />
      {status === 'done' ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="px-6 py-14 sm:px-12 sm:py-20" role="status" aria-live="polite">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-signal text-ink">
            <svg width="22" height="22" viewBox="0 0 22 22"><path d="m4 11.5 4.5 4.5L18 6.5" stroke="currentColor" strokeWidth="2.2" fill="none" /></svg>
          </span>
          <h3 className="mt-8 text-[2rem] font-bold leading-[1.05] tracking-[-0.035em] sm:text-[2.6rem]">{F.successTitle}</h3>
          <p className="mt-4 max-w-[44ch] text-[1.05rem] leading-relaxed text-mist">{F.successText}</p>
        </motion.div>
      ) : (
        <form noValidate onSubmit={(e) => { e.preventDefault(); void goNext(); }} onFocus={started} aria-describedby="av-form-status">
          {/* Honeypot: invisible to people, tempting to bots. */}
          <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
            <label htmlFor="av_fax">Fax</label>
            <input id="av_fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>

          {/* Progress */}
          <div className="border-b border-line px-5 pb-5 pt-6 sm:px-10 sm:pt-8">
            <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-mist sm:hidden">
              Bosqich <span className="tabular text-signal">{step + 1}</span> / 4 · <span className="text-bone">{F.steps[step]}</span>
            </p>
            <ol className="grid grid-cols-4 gap-2" aria-label="Ariza bosqichlari">
              {F.steps.map((s, i) => {
                const state = i < step ? 'done' : i === step ? 'now' : 'next';
                return (
                  <li key={s} aria-current={state === 'now' ? 'step' : undefined} className="min-w-0">
                    <span className="relative block h-[3px] overflow-hidden rounded-full bg-line-strong/60">
                      <motion.span className="absolute inset-0 origin-left rounded-full bg-signal" initial={false} animate={{ scaleX: i <= step ? 1 : 0 }} transition={{ duration: 0.5, ease }} />
                    </span>
                    <span className={`mt-3 hidden items-center gap-1.5 truncate font-mono text-[11px] uppercase tracking-[0.12em] sm:flex ${state === 'next' ? 'text-ash' : 'text-bone'}`}>
                      <span className={`tabular ${state === 'now' ? 'text-signal' : ''}`}>{state === 'done' ? '✓' : i + 1}</span>
                      <span className="truncate">{s}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative overflow-hidden px-5 py-8 sm:px-10 sm:py-10">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div key={step} custom={dir}
                initial={reduce ? false : { opacity: 0, x: dir * 28 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: dir * -28 }}
                transition={{ duration: 0.35, ease }}>
                <fieldset disabled={status === 'sending'} className="min-w-0 border-0 p-0 disabled:opacity-60">{screens[step]}</fieldset>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="border-t border-line px-5 pb-6 pt-5 sm:px-10 sm:pb-8">
            <div id="av-form-status" aria-live="polite">
              {status === 'error' && (
                <div className="mb-5 rounded-[10px] border border-alert/40 bg-alert/[0.07] px-4 py-3.5 text-[0.9rem] leading-snug text-bone/90" role="alert">
                  {F.errors[errorReason]}
                  <span className="mt-1.5 block text-ash">{F.errorAlt} <a className="text-bone underline decoration-bone/30 underline-offset-4" href={CONTACT.telegram.url} target="_blank" rel="noopener noreferrer">{CONTACT.telegram.handle}</a></span>
                </div>
              )}
              {tried[step] && Object.keys(errors).length > 0 && status !== 'error' && (
                <p className="mb-4 text-[0.88rem] text-alert">{F.required}</p>
              )}
            </div>
            <div className="flex items-center justify-between gap-3">
              <button type="button" onClick={goBack} className={`inline-flex h-12 items-center gap-2 rounded-full px-2 font-mono text-[11px] uppercase tracking-[0.14em] text-mist transition-colors hover:text-bone ${step === 0 ? 'invisible' : ''}`}>
                ← {F.back}
              </button>
              <button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'}
                className="group inline-flex min-h-[52px] items-center justify-center gap-3 rounded-full bg-signal px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-ink transition-[background-color,transform] duration-300 hover:bg-[#ffd35c] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70 sm:px-8">
                {status === 'sending' && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />}
                {status === 'sending' ? F.sending : status === 'error' && step === 3 ? F.retry : step === 3 ? F.submit : F.next}
                {status !== 'sending' && <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
              </button>
            </div>
            {step === 3 && (
              <p className="mt-5 text-[0.8rem] leading-snug text-ash">
                {F.privacy} <a href="/privacy" target="_blank" rel="noopener" className="text-mist underline decoration-mist/30 underline-offset-4 hover:text-bone">{F.privacyLink}</a> {F.privacyTail}
              </p>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
