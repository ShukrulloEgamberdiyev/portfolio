// Vercel Function: /api/077agency/lead — faqat /077agency landingi uchun.
// POST: arizani tekshiradi va 077agency'ning alohida Google Sheets jadvaliga yozadi.
// GET: integratsiya sozlanganini ko‘rsatadi (configured: true/false), maxfiy qiymatlarsiz.
import { handleLead, handleStatus, type Agency077Env } from '../../src/agency077/server/handler.js';

declare const process: { env: Record<string, string | undefined> };

const env = (): Agency077Env => ({
  AGENCY077_SHEETS_URL: process.env.AGENCY077_SHEETS_URL,
  AGENCY077_SHEETS_SECRET: process.env.AGENCY077_SHEETS_SECRET,
});

export function GET(): Response {
  return handleStatus(env());
}

export function POST(request: Request): Promise<Response> {
  return handleLead(request, env());
}
