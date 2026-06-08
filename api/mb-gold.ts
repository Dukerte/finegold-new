/**
 * Vercel Serverless Function — Mongolbank gold price proxy.
 *
 * Forwards POST /api/mb-gold?startDate=...&endDate=...
 *   → POST https://www.mongolbank.mn/mn/gold-and-silver-price/data?...
 *
 * Deploy to Vercel: this file is picked up automatically.
 * No extra config needed — Vercel maps /api/* to /api/*.ts functions.
 *
 * Also update src/hooks/useGoldRate.ts fetch URL to '/api/mb-gold' (not '/mb-gold')
 * when deploying to Vercel.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Forward the date-range query params
  const params = new URLSearchParams(req.query as Record<string, string>);
  const targetUrl = `https://www.mongolbank.mn/mn/gold-and-silver-price/data?${params.toString()}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!upstream.ok) {
      res.status(upstream.status).json({ error: `Upstream ${upstream.status}` });
      return;
    }

    const data = await upstream.json();

    res
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
      .json(data);
  } catch (err) {
    res.status(502).json({ error: 'Proxy fetch failed', detail: String(err) });
  }
}
