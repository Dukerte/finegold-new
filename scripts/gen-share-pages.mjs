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
const giftTitle = 'FGN 2026/7 Executive Gift Set — Special Edition';
const giftDescription = 'Шинэ жилийн тусгай захиалгат бэлгийн багц. 999.9 сорьцтой 0.5 г шижир алтан гулдмай, байгууллагын лого болон мэндчилгээ бүхий онцгой бэлэг.';
const giftUrl = `${SITE}/executive`;
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
writeFileSync(join(root, 'dist/executive.html'), giftPage, 'utf8');
console.log('share page: /executive generated with gift-set render');

const holidayTitle = 'FGN 2026/27 Шинэ жилийн цуглуулга — Баярын өдрүүдэд зориулсан тусгай загвар';
const holidayDescription = 'Энэ жил талархлаа, хайраа, сайн сайхны ерөөлөө алтан бэлгээр илэрхийлээрэй. 999.9 сорьцтой алт · 0.5 гр · 54 × 85.6 мм карт.';
const holidayPage = readFileSync(join(root, 'dist/index.html'), 'utf8')
  .replace('<html lang="en">', '<html lang="mn">')
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(holidayTitle)}</title>`)
  .replace(/<meta\b[^>]*(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/g, '')
  .replace(/<link\b[^>]*rel="canonical"[^>]*>\s*/g, '')
  .replace('</head>', `<link rel="canonical" href="${SITE}/holiday" />
<meta name="description" content="${esc(holidayDescription)}" />
<meta property="og:type" content="website" />
<meta property="og:title" content="${esc(holidayTitle)}" />
<meta property="og:description" content="${esc(holidayDescription)}" />
<meta property="og:url" content="${SITE}/holiday" />
<meta property="og:image" content="${SITE}/holiday-preview/holiday-scene.webp" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="${SITE}/holiday-preview/holiday-scene.webp" />
</head>`);
writeFileSync(join(root, 'dist/holiday.html'), holidayPage, 'utf8');
console.log('share page: /holiday generated');

// Product catalogue metadata must be present before JavaScript runs so link
// previews can read it. Keep the same React entry point for human visitors.
const productsTitle = 'Fine Gold Nation — Мөнгөн мод коллекц';
const productsDescription = 'Үе дамжих үнэт өв. Монгол бэлгэдэл, 999.9 сорьцтой шижир алтны төгс зохицол. Мөнгөн мод коллекцийн каталогтой танилцаарай.';
const productsUrl = 'https://finegold.mn/products';
const productsImage = 'https://finegold.mn/images/mongon-mod-collection-share-v2.png';
const productsAlt = 'Мөнгөн мод коллекц — алтан гулдмай, Мөнгөн мод бэлгэдэл бүхий нээлттэй хар, алтан бэлгийн хайрцаг';
const productsPage = readFileSync(join(root, 'dist/index.html'), 'utf8')
  .replace('<html lang="en">', '<html lang="mn">')
  .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(productsTitle)}</title>`)
  .replace(/<meta\b[^>]*(?:name|property)="(?:description|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/g, '')
  .replace(/<link\b[^>]*rel="canonical"[^>]*>\s*/g, '')
  .replace('</head>', `
<link rel="canonical" href="${productsUrl}" />
<meta name="description" content="${esc(productsDescription)}" />
<meta property="og:site_name" content="Fine Gold Nation" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="mn_MN" />
<meta property="og:title" content="${esc(productsTitle)}" />
<meta property="og:description" content="${esc(productsDescription)}" />
<meta property="og:url" content="${productsUrl}" />
<meta property="og:image" content="${productsImage}" />
<meta property="og:image:secure_url" content="${productsImage}" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1729" />
<meta property="og:image:height" content="910" />
<meta property="og:image:alt" content="${esc(productsAlt)}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${esc(productsTitle)}" />
<meta name="twitter:description" content="${esc(productsDescription)}" />
<meta name="twitter:image" content="${productsImage}" />
<meta name="twitter:image:alt" content="${esc(productsAlt)}" />
</head>`);
writeFileSync(join(root, 'dist/products.html'), productsPage, 'utf8');
console.log('share page: /products generated with Mongon Mod collection artwork');
