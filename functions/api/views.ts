// Cloudflare Pages Function — article view counter.
// Port of api/views.ts (Vercel edge). Behaviour is identical:
//   GET /api/views?slug=<slug>  ->  200 {"count": n}  (CORS: *)
//   missing slug                ->  400 {"error":"Missing slug"}
//
// Upstash is called over its REST API with plain fetch so no client library
// has to be bundled. INCR returns {"result": <number>}.

interface Env {
  KV_REST_API_URL: string;
  KV_REST_API_TOKEN: string;
}

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Increment on every visit — no deduplication by design
  const upstream = await fetch(
    `${env.KV_REST_API_URL}/incr/${encodeURIComponent(`views:${slug}`)}`,
    { headers: { Authorization: `Bearer ${env.KV_REST_API_TOKEN}` } }
  );

  const { result } = (await upstream.json()) as { result: number };
  const count = result;

  return new Response(JSON.stringify({ count }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
