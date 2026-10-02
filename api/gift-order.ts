import submitPreorder from './preorder';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
  const reply = (error: string, status: number) => Response.json({ error }, { status });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405, headers: { 'Content-Type': 'application/json', Allow: 'POST' },
  });
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return reply('Invalid origin', 403);
  const raw = await req.text();
  if (raw.length > 1024) return reply('Request too large', 413);
  let data: { phone?: unknown; quantity?: unknown };
  try { data = JSON.parse(raw); } catch { return reply('Invalid JSON', 400); }
  if (!data || typeof data !== 'object' || typeof data.phone !== 'string') return reply('Invalid phone', 400);
  const phone = data.phone.replace(/[\s-]/g, '').replace(/^\+976/, '');
  if (!/^[0-9]{8}$/.test(phone)) return reply('Invalid phone', 400);
  if (typeof data.quantity !== 'number' || !Number.isInteger(data.quantity) || data.quantity < 10 || data.quantity > 100000) return reply('Minimum quantity is 10', 400);

  // Reuse the established receiver and its email workflow with its existing schema.
  return submitPreorder(new Request(req.url, {
    method: 'POST', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      collection: 'FGN 2026/7 Special Edition',
      product: 'Шинэ жилийн тусгай захиалгат бэлгийн багц',
      qty: data.quantity, price: 'Үнийн санал авах',
      name: 'Байгууллагын бэлгийн багц — special-edition', phone,
    }),
  }));
}
