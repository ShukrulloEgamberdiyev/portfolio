// Vercel Function: /api/lead-retry — re-sends leads that are waiting in the retry queue.
// Called daily by Vercel Cron (vercel.json, Authorization: Bearer CRON_SECRET) and on demand by an
// admin (Authorization: Bearer LEADS_ADMIN_KEY). A new lead also triggers a small flush after it is saved.
import { handleRetry, type LeadEnv } from '../src/server/lead/handler.js';
import { blobQueue } from '../src/server/lead/blobQueue.js';

declare const process: { env: Record<string, string | undefined> };

const env = (): LeadEnv => ({
  LEADS_SHEETS_URL: process.env.LEADS_SHEETS_URL,
  LEADS_SHEETS_SECRET: process.env.LEADS_SHEETS_SECRET,
  LEADS_ADMIN_KEY: process.env.LEADS_ADMIN_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
});

export const maxDuration = 60;

export function GET(request: Request): Promise<Response> {
  return handleRetry(request, env(), blobQueue());
}

export function POST(request: Request): Promise<Response> {
  return handleRetry(request, env(), blobQueue());
}
