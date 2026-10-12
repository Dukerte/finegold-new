# Cloudflare Pages migration — branch notes

Branch: `cloudflare-migration`. **Do not merge to main yet.**
`api/` and `vercel.json` are untouched, so this branch still deploys correctly
on Vercel if it is ever merged.

## Files added

| File | Purpose |
|---|---|
| `functions/api/views.ts` | Port of `api/views.ts` |
| `functions/api/preorder.ts` | Port of `api/preorder.ts` (also exports `submitPreorder`) |
| `functions/api/mb-gold.ts` | **Rewrite** of `api/mb-gold.ts` — see below |
| `functions/api/gift-order.ts` | Port of `api/gift-order.ts` |
| `public/_redirects` | Mirrors `vercel.json` redirects + rewrites |
| `public/_headers` | Mirrors `vercel.json` headers |
| `.nvmrc` | Pins Node 20 |
| `MIGRATION-NOTES.md` | This file |

`.gitignore` gained one line: `.dev.vars`.

Nothing else was modified. No secrets are committed.

## Port notes

**`mb-gold.ts` is the only non-mechanical change.** The Vercel original is a
*Node* serverless function using `IncomingMessage`/`ServerResponse` and Vercel's
`res.status().json()` helpers — not an edge function like the other three. The
Cloudflare version is a rewrite to the Web API. Observable behaviour is
preserved exactly, including a quirk worth knowing about:

> On both the `Upstream <status>` and the `Proxy fetch failed` paths, the
> original does **not** send `Access-Control-Allow-Origin`. Only the success
> path sets it. The port reproduces this. If the client is ever served from a
> different origin, errors would be opaque to it. Same on Vercel today, so this
> is not a regression — but it is worth fixing deliberately, later, on both.

**`views.ts`** uses the Upstash REST endpoint via plain `fetch` instead of the
`@upstash/redis` client, so nothing extra has to be bundled into the Worker.
`INCR` returns `{"result": n}`; the response shape `{"count": n}` is unchanged.

**`gift-order.ts`** is byte-identical to the original apart from three lines:
the handler signature, `process.env.GIFT_ORDER_COUPONS` → `env.GIFT_ORDER_COUPONS`,
and two import paths (`./preorder` now imports the named `submitPreorder`, and
`../src/lib/giftPackages` → `../../src/lib/giftPackages`).

## Not done here (by request)

Asset clean-up — the 14 MB `gift-set.glb`, the PNG slides, `Frame.cdr` — is out
of scope so the Vercel/Pages comparison stays exact.

## Optional, for editor support only

`npm i -D @cloudflare/workers-types` gives real types for `PagesFunction`.
It is **not** required: Pages strips TypeScript types at build time without
typechecking, and all four functions already pass `tsc --strict` against a
local declaration.
