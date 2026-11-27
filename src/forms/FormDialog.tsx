import { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { LeadForm } from './LeadForm';
import type { FormId } from './defs';

/**
 * The lead form in a popup (used by /card). Locks page scroll, keeps Tab inside, closes on Escape
 * and returns focus to the button that opened it. Its height follows the visual viewport, so the
 * on-screen keyboard never hides the field being typed in.
 */
export function FormDialog({ open, onClose, formId, title, closeLabel = 'Yopiş' }: { open: boolean; onClose: () => void; formId: FormId; title: string; closeLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevHtml = html.style.overflow;
    const prevBody = document.body.style.overflow;
    html.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    const vv = window.visualViewport;
    const sync = () => ref.current?.style.setProperty('--vvh', `${Math.round(vv?.height ?? window.innerHeight)}px`);
    sync();
    vv?.addEventListener('resize', sync);
    window.addEventListener('resize', sync);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const items = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),textarea:not([disabled]),[tabindex="0"]'))
        .filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !ref.current.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      vv?.removeEventListener('resize', sync);
      window.removeEventListener('resize', sync);
      html.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      opener?.focus({ preventScroll: true });
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduce ? 0 : 0.25 }}>
          <button type="button" aria-label={closeLabel} tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
          <motion.div ref={ref} role="dialog" aria-modal="true" aria-labelledby="form-dialog-title"
            className="card-dialog relative flex w-full max-w-[560px] flex-col overflow-hidden border border-line-strong bg-surface-1 shadow-2xl"
            initial={reduce ? false : { y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: 40, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}>
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
              <h2 id="form-dialog-title" className="font-mono text-[12px] font-medium uppercase tracking-[0.16em] text-bone">{title}</h2>
              <button type="button" onClick={onClose} aria-label={closeLabel}
                className="flex h-11 w-11 items-center justify-center border border-line-strong text-bone transition-colors hover:border-bone/60">
                <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" /></svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[calc(env(safe-area-inset-bottom,0px)+20px)] pt-5 sm:px-7 sm:pb-7">
              <LeadForm formId={formId} autoFocus openOnMount />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
