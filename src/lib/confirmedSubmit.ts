import { DeliveryError, deliverApplication, type DeliveryResult } from './applicationTransport';

/**
 * One rule for every landing form: the success screen appears only when the receiver proves that
 * THIS submission id now holds THIS data.
 *
 * Why it matters — the "lost reply" case: a lead is stored, the answer never reaches the browser,
 * the visitor corrects something and presses the button again. The id is the same (so no second lead),
 * but the data is not. A receiver that only says "this id already exists" must not be read as success
 * for the corrected data.
 *
 *  - Receiver returns a fingerprint (current docs/apps-script.gs): it must equal the fingerprint of the
 *    payload just sent. Same id + other data is corrected in place by the receiver.
 *  - Receiver returns no fingerprint (an older deployment): a fresh save is trusted; a "duplicate" answer is
 *    trusted only if every earlier attempt under this id carried the same data. Otherwise the data is sent
 *    again under a new id, so the corrected lead is really stored instead of being silently dropped.
 */

export type Confirmation = { submissionId: string; fingerprint: string; duplicate: boolean; updated: boolean };

export type ConfirmedSubmit = {
  endpoint: string | undefined;
  /** Builds the payload for a given submission id; must include `submissionId` and `fingerprint`. */
  build: (submissionId: string) => Record<string, string>;
  submissionId: string;
  /** Fingerprints of earlier attempts under this id that may have been stored (not counting this one). */
  earlier: string[];
  newId: () => string;
  /** Called before the data is re-sent under a new id, so the caller can persist it. */
  onNewId?: (submissionId: string) => void;
  timeoutMs?: number;
  deliver?: typeof deliverApplication;
};

function assertSaved(result: DeliveryResult, payload: Record<string, string>) {
  if (result.saved !== true || result.submissionId !== payload.submissionId) {
    throw new DeliveryError('bad_response', '', 'Receiver did not confirm this submission');
  }
}

export async function submitConfirmed(o: ConfirmedSubmit): Promise<Confirmation> {
  const deliver = o.deliver ?? deliverApplication;
  const timeout = o.timeoutMs ?? 25000;
  const payload = o.build(o.submissionId);
  const result = await deliver(o.endpoint, payload, timeout);
  assertSaved(result, payload);

  const done = (p: Record<string, string>, r: DeliveryResult): Confirmation =>
    ({ submissionId: p.submissionId, fingerprint: p.fingerprint, duplicate: r.duplicate === true, updated: r.updated === true });

  if (typeof result.fingerprint === 'string' && result.fingerprint) {
    if (result.fingerprint !== payload.fingerprint) {
      throw new DeliveryError('bad_response', 'fingerprint_mismatch', 'Receiver stored different data for this submission');
    }
    return done(payload, result);
  }

  // Older receiver: no proof of which data the row holds.
  const sameDataAsBefore = o.earlier.length > 0 && o.earlier.every((fp) => fp === payload.fingerprint);
  if (result.duplicate !== true || sameDataAsBefore) return done(payload, result);

  // The row under this id holds earlier data. Store the current data as its own row rather than lose it.
  const freshId = o.newId();
  o.onNewId?.(freshId);
  const second = o.build(freshId);
  const again = await deliver(o.endpoint, second, timeout);
  assertSaved(again, second);
  if (again.duplicate === true || (typeof again.fingerprint === 'string' && again.fingerprint && again.fingerprint !== second.fingerprint)) {
    throw new DeliveryError('bad_response', 'fingerprint_mismatch', 'Receiver did not store the current data');
  }
  return { ...done(second, again), updated: true };
}
