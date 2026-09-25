export type DeliveryResult = { ok: true; duplicate?: boolean; saved?: boolean; submissionId?: string; [k: string]: unknown };

/**
 * Error with a machine-readable reason:
 *   timeout      — no complete answer (headers + body) within the time limit
 *   network      — request never reached / came back from the receiver
 *   http         — non-2xx status
 *   bad_response — body was not the JSON the receiver promises (e.g. an HTML login page)
 *   rejected     — receiver answered {ok:false, error, field?}; `detail` = error, `field` = offending field
 *   config       — no endpoint configured
 */
export class DeliveryError extends Error {
  code: 'timeout' | 'network' | 'http' | 'rejected' | 'config' | 'bad_response';
  detail: string;
  field: string;
  constructor(code: DeliveryError['code'], detail = '', message = `Application failed: ${code}${detail ? ` (${detail})` : ''}`, field = '') {
    super(message);
    this.code = code;
    this.detail = detail;
    this.field = field;
  }
}

/**
 * Success is returned only after the receiver explicitly accepts the application.
 * The time limit covers the whole exchange — request, response headers AND reading/parsing the body —
 * and the timer is cleared on every outcome.
 */
export async function deliverApplication(endpoint: string | undefined, payload: Record<string, string>, timeoutMs = 15000): Promise<DeliveryResult> {
  if (!endpoint?.trim()) throw new DeliveryError('config', '', 'Application endpoint is not configured');

  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timedOut = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new DeliveryError('timeout', '', `Application failed: no complete response within ${timeoutMs} ms`));
    }, timeoutMs);
  });
  timedOut.catch(() => { /* handled via race below */ });

  const exchange = async (): Promise<DeliveryResult> => {
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (error) {
      if (controller.signal.aborted) throw new DeliveryError('timeout', '', `Application failed: ${String(error)}`);
      throw new DeliveryError('network', '', `Application failed: ${String(error)}`);
    }
    if (!response.ok) throw new DeliveryError('http', String(response.status), `Application failed: ${response.status}`);
    let result: unknown;
    try {
      result = await response.json();
    } catch (error) {
      if (controller.signal.aborted) throw new DeliveryError('timeout', '', `Application failed: ${String(error)}`);
      throw new DeliveryError('bad_response', '', `Application failed: invalid response (${String(error)})`);
    }
    if (!result || typeof result !== 'object' || !('ok' in result) || (result as { ok: unknown }).ok !== true) {
      const r = (result && typeof result === 'object' ? result : {}) as { error?: unknown; field?: unknown };
      const reason = r.error ? String(r.error) : '';
      const field = r.field ? String(r.field) : '';
      throw new DeliveryError('rejected', reason, `Application was not accepted${reason ? ` (${reason})` : ''}`, field);
    }
    return result as DeliveryResult;
  };

  try {
    const attempt = exchange();
    attempt.catch(() => { /* a late failure after a timeout is irrelevant */ });
    return await Promise.race([attempt, timedOut]);
  } finally {
    clearTimeout(timer);
  }
}
