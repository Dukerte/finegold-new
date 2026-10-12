// Cloudflare Pages Function — Mongolbank gold price proxy.
//
// Port of api/mb-gold.ts. NOTE: the Vercel original is a *Node* serverless
// function (IncomingMessage/ServerResponse), not an edge function, so this is
// a rewrite to the Web API rather than a copy. Observable behaviour is kept
// identical, including the fact that the two error paths do NOT carry the
// CORS header (same as the original — see MIGRATION-NOTES.md).
//
//   POST /api/mb-gold?startDate=...&endDate=...
//     -> POST https://www.mongolbank.mn/mn/gold-and-silver-price/data?...
//
//   200  upstream JSON  + Access-Control-Allow-Origin: *
//                       + Cache-Control: s-maxage=3600, stale-while-revalidate=86400
//   <upstream status>   {"error":"Upstream <status>"}
//   502                 {"error":"Proxy fetch failed","detail":"..."}

export const onRequest: PagesFunction = async ({ request }) => {
  // Forward the date-range query params
  const params = new URL(request.url).searchParams;
  const targetUrl = `https://www.mongolbank.mn/mn/gold-and-silver-price/data?${params.toString()}`;

  try {
    const upstream = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: `Upstream ${upstream.status}` }), {
        status: upstream.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await upstream.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Proxy fetch failed', detail: String(err) }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
