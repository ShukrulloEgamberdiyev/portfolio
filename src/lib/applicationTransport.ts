/** Success is shown only after the receiver explicitly accepts the application. */
export async function deliverApplication(endpoint: string | undefined, payload: Record<string, string>): Promise<void> {
  if (!endpoint?.trim()) throw new Error('Application endpoint is not configured');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Application failed: ${response.status}`);
    const result: unknown = await response.json();
    if (!result || typeof result !== 'object' || !('ok' in result) || result.ok !== true) {
      throw new Error('Application was not accepted');
    }
  } finally {
    clearTimeout(timeout);
  }
}
