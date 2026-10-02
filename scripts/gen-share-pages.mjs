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

// Keep the built React entry point while serving route-specific metadata to
// crawlers that do not run JavaScript. Other pages retain their own metadata.
const giftTitle = 'FGN 2026/7 Special Edition | Шинэ жилийн бэлгийн багц';
const giftDescription = 'Шинэ жилийн тусгай захиалгат бэлгийн багц. 999.9 сорьцтой 0.5 г шижир алтан гулдмай, байгууллагын лого болон мэндчилгээ бүхий онцгой бэлэг.';
const giftUrl = `${SITE}/special-edition`;
const giftImage = `${SITE}/images/special-edition-2027-share.jpg`;
let giftPage = readFileSync(join(root, 'dist/index.html'), 'utf8')
  .replace('<html lang="en">', '<html lang="mn">')
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(giftTitle)}</title>`)
  .replace(/<meta\b[^>]*(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/g, '')
  .replace(/<link\b[^>]*rel="canonical"[^>]*>\s*/g, '');
const giftMetadata = `
<link rel="canonical" href="${giftUrl}" />
<meta name="description" content="${esc(giftDescription)}" />
<meta property="og:site_name" content="Fine Gold Nation" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="mn_MN" />
<meta property="og:title" content="${esc(giftTitle)}" />
<meta property="og:description" content="${esc(giftDescription)}" />
<meta property="og:url" content="${giftUrl}" />
<meta property="og:image" content="${giftImage}" />
<meta property="og:image:secure_url" content="${giftImage}" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="800" />
<meta property="og:image:alt" content="FGN 2027 бэлгийн багц — нээлттэй хайрцаг, алтан гулдмай, оргилуун дарс, дугтуй болон бэлгийн уут" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(giftTitle)}" />
<meta name="twitter:description" content="${esc(giftDescription)}" />
<meta name="twitter:image" content="${giftImage}" />
`;
giftPage = giftPage.replace('</head>', `${giftMetadata}</head>`);
writeFileSync(join(root, 'dist/special-edition.html'), giftPage, 'utf8');
console.log('share page: /special-edition generated with gift-set render');
