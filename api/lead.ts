// Vercel Function: /api/lead — every fazodigital.uz lead form (main site, /card, sector landings).
// POST: validate → "FAZO Digital" Google Sheet (or the private retry queue). GET: configuration status;
// with "Authorization: Bearer <LEADS_ADMIN_KEY>" also the retry queue (ids and errors, no personal data).
import { waitUntil } from '@vercel/functions';
import { handleLead, handleStatus, type LeadEnv } from '../src/server/lead/handler.js';
import { blobQueue } from '../src/server/lead/blobQueue.js';

declare const process: { env: Record<string, string | undefined> };

const env = (): LeadEnv => ({
  LEADS_SHEETS_URL: process.env.LEADS_SHEETS_URL,
  LEADS_SHEETS_SECRET: process.env.LEADS_SHEETS_SECRET,
  LEADS_ADMIN_KEY: process.env.LEADS_ADMIN_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
});

export function GET(request: Request): Promise<Response> {
  return handleStatus(request, env(), blobQueue());
}

export function POST(request: Request): Promise<Response> {
  return handleLead(request, env(), { queue: blobQueue(), afterResponse: (p) => waitUntil(p) });
}
