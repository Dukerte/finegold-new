import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const moduleURL = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText).toString('base64');
const receiverURL = moduleURL('export async function submitPreorder(req) { return Response.json(await req.json()); } export default submitPreorder;');
const catalogURL = moduleURL(fs.readFileSync('src/lib/giftPackages.ts', 'utf8'));
for (const platform of ['Vercel', 'Cloudflare']) {
 const file = platform === 'Vercel' ? 'api/gift-order.ts' : 'functions/api/gift-order.ts';
 const source = fs.readFileSync(file, 'utf8').replace("'./preorder'", JSON.stringify(receiverURL)).replace(/'\.\.\/(?:\.\.\/)?src\/lib\/giftPackages'/, JSON.stringify(catalogURL));
 // Capture the validated payload at the receiver boundary; no external requests or emails.
 const captureURL = moduleURL('export let payload; export async function submitPreorder(req) { payload = await req.json(); return Response.json({ok:true}); } export default submitPreorder;');
 const adapter = await import(moduleURL(source.replace(JSON.stringify(receiverURL), JSON.stringify(captureURL))));
 const receiver = await import(captureURL);
 const submit = body => {
  const request = new Request('https://www.finegold.mn/api/gift-order', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({action:'submit', phone:'99112233', ...body}) });
  return platform === 'Vercel' ? adapter.default(request) : adapter.onRequest({request,env:{GIFT_ORDER_COUPONS:'[]'}});
 };
 test(`${platform}: collection reflects validated products for all nine gift options`, async () => {
  for (const packageId of ['moet','tea','honey','holiday-santa','holiday-snowman','holiday-tree','holiday-reindeer','holiday-gingerbread','holiday-bear']) {
   const holiday = packageId.startsWith('holiday-');
   const response = await submit({items:[{packageId,quantity:holiday?1:10}],collection:'client supplied label'});
   assert.equal(response.status,200);
   assert.equal(receiver.payload.collection,holiday?'Holiday Set':'Executive Set');
  }
 });
 test(`${platform}: retired executive IDs are rejected`, async () => {
  for (const packageId of ['nicolas','tree']) assert.equal((await submit({items:[{packageId,quantity:10}]})).status,400);
 });
 test(`${platform}: mixed order is not misclassified as a single collection`, async () => {
  assert.equal((await submit({items:[{packageId:'moet',quantity:10},{packageId:'holiday-tree',quantity:1}]})).status,200);
  assert.equal(receiver.payload.collection,'Executive Set + Holiday Set');
 });
}

for (const platform of ['Vercel', 'Cloudflare']) {
 const file = platform === 'Vercel' ? 'api/gift-order.ts' : 'functions/api/gift-order.ts';
 const source = fs.readFileSync(file, 'utf8').replace("'./preorder'", JSON.stringify(receiverURL)).replace(/'\.\.\/(?:\.\.\/)?src\/lib\/giftPackages'/, JSON.stringify(catalogURL));
 const adapter = await import(moduleURL(source));
 test(`${platform}: MonCertf26 gives 1.5% on all Executive sets, regardless of case`, async () => {
  const saved = process.env.GIFT_ORDER_COUPONS;
  delete process.env.GIFT_ORDER_COUPONS;
  const quote = async (items, coupon, action = 'quote') => {
   const request = new Request('https://www.finegold.mn/api/gift-order', {method:'POST',body:JSON.stringify({action,items,coupon,phone:'99112233',discount:99999999,total:1})});
   return platform === 'Vercel' ? adapter.default(request) : adapter.onRequest({request,env:{}});
  };
  try {
   for (const [packageId, price] of [['moet',699999],['tea',599999],['honey',499999]]) {
    for (const coupon of ['MonCertf26','moncertf26',' MONCERTF26 ']) {
     const response = await quote([{packageId,quantity:10}],coupon);
     assert.equal(response.status,200);
     const {quote: result} = await response.json();
     assert.equal(result.discount,Math.round(price * 10 * .015));
     assert.equal(result.total,price * 10 - result.discount);
     assert.equal(result.coupon,'MONCERTF26');
    }
   }
   const submitted = await quote([{packageId:'tea',quantity:10}],'moncertf26','submit');
   assert.equal((await submitted.json()).quote.total,5909990);
   assert.equal((await quote([{packageId:'tea',quantity:9}],'moncertf26','submit')).status,400);
   assert.equal((await quote([{packageId:'holiday-tree',quantity:10}],'moncertf26')).status,400);
   assert.equal((await quote([{packageId:'tea',quantity:10}],'moncertf27')).status,400);
  } finally { if (saved === undefined) delete process.env.GIFT_ORDER_COUPONS; else process.env.GIFT_ORDER_COUPONS = saved; }
 });
}
