export const config = { runtime: 'edge' };

const SHEET_URL =
  'https://script.google.com/macros/s/AKfycbxwhxGF3dYyR0MOq_dGd3S4w0NuMfm8vNKhNmAg4Ahwec-on0DV63pTgmFz3XYr-AyY/exec';

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  const body = await req.text();
  if (!body || body.length > 10_000) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12_000);

  try {
    const upstream = await fetch(SHEET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
      signal: controller.signal,
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: `Order receiver returned ${upstream.status}` }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return new Response(JSON.stringify({ error: timedOut ? 'Order receiver timed out' : 'Order receiver failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    clearTimeout(timeoutId);
  }
}
