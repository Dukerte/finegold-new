/**
 * Netlify Function — Mongolbank gold price proxy.
 *
 * Deployed automatically when hosting on Netlify.
 * URL becomes: /.netlify/functions/mb-gold?startDate=...&endDate=...
 *
 * Also update src/hooks/useGoldRate.ts fetch URL to
 *   '/.netlify/functions/mb-gold' (not '/mb-gold') for Netlify.
 */

import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const params = new URLSearchParams(event.queryStringParameters ?? {});
  const targetUrl = `https://www.mongolbank.mn/mn/gold-and-silver-price/data?${params.toString()}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await upstream.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=3600',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 502, body: JSON.stringify({ error: String(err) }) };
  }
};
