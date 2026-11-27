/**
 * Site-wide conversion events, on top of the existing Meta Pixel (src/lib/tracking.ts) and a plain
 * dataLayer push (ready for a tag manager; harmless without one).
 *
 * Four separate events so reports can tell them apart:
 *   CTAClick          — a call-to-action button was pressed   { location }
 *   FormOpen          — a form was opened / came into view    { form }
 *   FormSubmitSuccess — the server confirmed the application  { form, status } + standard "Lead"
 *   FormError         — sending failed or was rejected        { form, reason }
 *
 * Never put the visitor's name, phone, Telegram or free-text answers in an event.
 */
import { track } from './tracking';

declare global { interface Window { dataLayer?: Record<string, unknown>[] } }

function push(event: string, params: Record<string, string>) {
  if (typeof window === 'undefined') return;
  try { (window.dataLayer = window.dataLayer || []).push({ event, ...params }); } catch { /* ignore */ }
}

export function ctaClick(location: string) {
  push('CTAClick', { location });
  track('CTAClick', { location }, { custom: true });
}

export function formOpen(form: string) {
  push('FormOpen', { form });
  track('FormOpen', { form }, { custom: true, onceKey: `open:${form}` });
}

export function formSuccess(form: string, status: string, leadId: string) {
  push('FormSubmitSuccess', { form, status });
  track('FormSubmitSuccess', { form, status }, { custom: true, onceKey: `ok:${leadId}` });
  // Standard event for ad optimisation; the id deduplicates it with a future server-side event.
  track('Lead', { content_name: form }, { onceKey: `lead:${leadId}`, eventID: leadId });
}

export function formError(form: string, reason: string) {
  push('FormError', { form, reason });
  track('FormError', { form, reason }, { custom: true });
}
