import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
const moduleURL = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const upstreamURL = moduleURL(fs.readFileSync('api/preorder.ts','utf8'));
const catalogURL = moduleURL(fs.readFileSync('src/lib/giftPackages.ts','utf8'));
const {default: handler} = await import(moduleURL(fs.readFileSync('api/gift-order.ts','utf8').replace("'./preorder'",JSON.stringify(upstreamURL)).replace("'../src/lib/giftPackages'",JSON.stringify(catalogURL))));
const request = body => new Request('https://www.finegold.mn/api/gift-order',{method:'POST',headers:{origin:'https://www.finegold.mn'},body:JSON.stringify(body)});
const order = {action:'submit',phone:'+976 9911 2233',items:[{packageId:'moet',quantity:5},{packageId:'tree',quantity:5}]};
test('rejects invalid carts and phone without contacting receiver', async () => {
 const original=globalThis.fetch; globalThis.fetch=()=>{throw Error('Unexpected receiver call');};
 try {
  for(const body of [null,{}, {...order,phone:'bad'}, {...order,items:[]}, {...order,items:[{packageId:'fake',quantity:10}]}, {...order,items:[{packageId:'moet',quantity:9}]}, {...order,items:[{packageId:'moet',quantity:10.5}]}, {...order,items:[{packageId:'moet',quantity:'10'}]}, {...order,items:[{packageId:'moet',quantity:10},{packageId:'moet',quantity:10}]}, {...order,items:[{packageId:'moet',quantity:100000},{packageId:'tree',quantity:1}]}]) assert.equal((await handler(request(body))).status,400);
  assert.equal((await handler(new Request('https://www.finegold.mn/api/gift-order'))).status,405);
  assert.equal((await handler(new Request('https://www.finegold.mn/api/gift-order',{method:'POST',headers:{origin:'https://other.example'},body:'{}'}))).status,403);
 } finally {globalThis.fetch=original;}
});
test('server prices mixed cart and sends complete breakdown through existing receiver', async () => {
 const original=globalThis.fetch;let payload;
 globalThis.fetch=async (url,options)=>{assert.match(url,/script.google.com/);payload=JSON.parse(options.body);return Response.json({ok:true});};
 try {const r=await handler(request({...order,total:1,discount:9999999}));assert.equal(r.status,200);const result=await r.json();assert.equal(result.quote.total,5999990);assert.equal(payload.phone,'99112233');assert.equal(payload.qty,10);assert.equal(payload.price,'5999990₮');assert.match(payload.product,/Moet&Chandon/);assert.match(payload.product,/чимэглэл/);assert.ok(payload.timestamp);}finally{globalThis.fetch=original;}
});
test('quote does not submit orders; prices all three packages accurately', async () => {
 const original=globalThis.fetch;globalThis.fetch=()=>{throw Error('Quote must not send email');};
 try {const r=await handler(request({action:'quote',items:[{packageId:'moet',quantity:1},{packageId:'nicolas',quantity:1},{packageId:'tree',quantity:1}]}));assert.equal(r.status,200);assert.equal((await r.json()).quote.total,1799997);} finally{globalThis.fetch=original;}
});
test('validates coupons, expiry, minimums, configuration, and recalculates discount', async () => {
 const saved=process.env.GIFT_ORDER_COUPONS;
 try {
 process.env.GIFT_ORDER_COUPONS=JSON.stringify([{code:'TEST10',percentOff:10},{code:'FIXED',amountOff:99999999},{code:'OLD',percentOff:10,expiresAt:'2020-01-01'},{code:'MIN20',percentOff:10,minQuantity:20}]);
 const q={...order,action:'quote'};
 const r=await handler(request({...q,coupon:' test10 '}));const data=await r.json();assert.equal(data.quote.discount,599999);assert.equal(data.quote.total,5399991);assert.equal(data.quote.coupon,'TEST10');
 assert.equal((await (await handler(request({...q,coupon:'FIXED'}))).json()).quote.total,0);
 for(const coupon of ['OLD','MISSING','MIN20'])assert.equal((await handler(request({...q,coupon}))).status,400);
 process.env.GIFT_ORDER_COUPONS='invalid';assert.equal((await handler(request({...q,coupon:'TEST10'}))).status,503);
 process.env.GIFT_ORDER_COUPONS='[]';assert.equal((await handler(request({...q,coupon:'TEST10'}))).status,400);
 } finally {if(saved===undefined)delete process.env.GIFT_ORDER_COUPONS;else process.env.GIFT_ORDER_COUPONS=saved;}
});
test('receiver failure never becomes a successful submission', async () => {
 const original=globalThis.fetch;
 try {for(const fail of [async()=>new Response('failed',{status:500}),async()=>{throw Error('Network');}]) {globalThis.fetch=fail;const r=await handler(request(order));assert.equal(r.status,502);assert.notEqual((await r.json()).ok,true);}}finally{globalThis.fetch=original;}
});
test('six Holiday designs use purchase-day pricing and never invent a total', async () => {
 const original=globalThis.fetch;globalThis.fetch=()=>{throw Error('Quote must not contact receiver');};
 try {
  const items=['santa','snowman','tree','reindeer','gingerbread','bear'].map(slug=>({packageId:`holiday-${slug}`,quantity:1}));
  const response=await handler(request({action:'quote',items,total:1,price:1}));
  assert.equal(response.status,200);const {quote}=await response.json();
  assert.equal(quote.quantity,6);assert.equal(quote.pendingPrice,true);assert.equal(quote.total,null);assert.equal(quote.subtotal,null);
  assert.equal((await handler(request({action:'quote',items,coupon:'TEST10'}))).status,400);
 } finally {globalThis.fetch=original;}
});
test('Holiday enquiry carries all selected designs without a fabricated price', async () => {
 const original=globalThis.fetch;let payload;
 globalThis.fetch=async (_,options)=>{payload=JSON.parse(options.body);return Response.json({ok:true});};
 try {
  const response=await handler(request({action:'submit',phone:'99112233',items:[{packageId:'holiday-santa',quantity:1},{packageId:'holiday-bear',quantity:2}]}));
  assert.equal(response.status,200);assert.equal((await response.json()).quote.total,null);assert.equal(payload.qty,3);
  assert.match(payload.product,/Өвлийн өвөө/);assert.match(payload.product,/Цагаан баавгай/);assert.match(payload.price,/ханшаар/);
 } finally {globalThis.fetch=original;}
});
test('mixed basket preserves Executive minimum and its known subtotal', async () => {
 const original=globalThis.fetch;globalThis.fetch=()=>{throw Error('Must not submit');};
 try {
  assert.equal((await handler(request({action:'submit',phone:'99112233',items:[{packageId:'moet',quantity:1},{packageId:'holiday-santa',quantity:20}]}))).status,400);
  const response=await handler(request({action:'quote',items:[{packageId:'moet',quantity:10},{packageId:'holiday-santa',quantity:2}]}));
  const {quote}=await response.json();assert.equal(quote.total,null);assert.equal(quote.knownSubtotal,6999990);
 } finally {globalThis.fetch=original;}
});
