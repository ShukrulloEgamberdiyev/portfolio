// Durable retry queue for leads that could not be written to Google Sheets, in a PRIVATE Vercel Blob store.
// One blob per lead id (overwritten on each attempt), so the queue itself can never hold duplicates.
// Without BLOB_READ_WRITE_TOKEN (no store connected) the queue reports itself unavailable.
import { del, get, list, put } from '@vercel/blob';
import type { LeadQueue, QueuedLead } from './handler.js';

const PREFIX = 'fazo-leads/queue/';

export function blobQueue(token = process.env.BLOB_READ_WRITE_TOKEN): LeadQueue {
  const available = Boolean(token);
  return {
    available,
    async put(entry: QueuedLead) {
      await put(`${PREFIX}${entry.lead.id}.json`, JSON.stringify(entry), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        token,
      });
    },
    async list(limit: number) {
      const { blobs } = await list({ prefix: PREFIX, limit, token });
      const out: QueuedLead[] = [];
      for (const b of blobs) {
        const r = await get(b.pathname, { access: 'private', useCache: false, token });
        if (!r || r.statusCode !== 200) continue;
        try {
          out.push(JSON.parse(await new Response(r.stream).text()) as QueuedLead);
        } catch {
          console.error('[lead] unreadable queue entry', b.pathname);
        }
      }
      return out.sort((a, b) => a.queuedAt.localeCompare(b.queuedAt));
    },
    async remove(id: string) {
      await del(`${PREFIX}${id}.json`, { token });
    },
  };
}

declare const process: { env: Record<string, string | undefined> };
