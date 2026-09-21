// Generates one static HTML page per article at dist/medee/<slug>/index.html
//
// Why: the site uses hash routing (#/medee/slug) and browsers never send the
// part after "#" to the server — so Facebook only ever sees finegold.mn/ and
// reads one fixed set of meta tags. These static pages live at real paths the
// crawler can fetch, each carrying its own title, description and image.
// A human hitting the page is forwarded straight into the app.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.finegold.mn';
const OUT = join(root, 'dist', 'medee');

// Pull slug / title / summary / coverImage straight out of news.ts without
// needing a TS build step.
const src = readFileSync(join(root, 'src/data/news.ts'), 'utf8');
const field = (block, name) => {
  const m = block.match(new RegExp(`${name}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  return m ? m[1].replace(/\\'/g, "'") : '';
};

const blocks = src.split(/\n  \{\n/).slice(1);
const articles = blocks
  .map(b => ({
    slug: field(b, 'slug'),
    title: field(b, 'title'),
    summary: field(b, 'summary'),
    image: field(b, 'coverImage'),
  }))
  .filter(a => a.slug && a.title);

const esc = s =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const page = a => `<!DOCTYPE html>
<html lang="mn">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Fine Gold Nation | ${esc(a.title)}</title>
<meta name="description" content="${esc(a.summary)}" />
<link rel="canonical" href="${SITE}/medee/${a.slug}" />

<meta property="og:site_name" content="Fine Gold Nation" />
<meta property="og:type" content="article" />
<meta property="og:locale" content="mn_MN" />
<meta property="og:title" content="${esc(a.title)}" />
<meta property="og:description" content="${esc(a.summary)}" />
<meta property="og:url" content="${SITE}/medee/${a.slug}" />
<meta property="og:image" content="${SITE}${a.image}" />
<meta property="og:image:width" content="1600" />
<meta property="og:image:height" content="840" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(a.title)}" />
<meta name="twitter:description" content="${esc(a.summary)}" />
<meta name="twitter:image" content="${SITE}${a.image}" />

<script>location.replace('/#/medee/${a.slug}');</script>
<meta http-equiv="refresh" content="0; url=/#/medee/${a.slug}" />
</head>
<body style="margin:0;background:#0b0b0a;color:#fff;font-family:Inter,system-ui,sans-serif">
<p style="padding:2rem">Уншиж байна… <a href="/#/medee/${a.slug}" style="color:#E2B56D">Энд дарна уу</a></p>
</body>
</html>`;

mkdirSync(OUT, { recursive: true });
for (const a of articles) {
  mkdirSync(join(OUT, a.slug), { recursive: true });
  writeFileSync(join(OUT, a.slug, 'index.html'), page(a), 'utf8');
}
console.log(`share pages: ${articles.length} generated in dist/medee/`);
