import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
const moduleURL = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const upstreamURL = moduleURL(fs.readFileSync('api/preorder.ts','utf8'));
const {default: handler} = await import(moduleURL(fs.readFileSync('api/gift-order.ts','utf8').replace("'./preorder'",JSON.stringify(upstreamURL))));
const request = body => new Request('https://www.finegold.mn/api/gift-order',{method:'POST',headers:{origin:'https://www.finegold.mn'},body:JSON.stringify(body)});
test('rejects invalid submissions without contacting receiver', async () => {
 const original=globalThis.fetch; globalThis.fetch=()=>{throw Error('Unexpected receiver call');};
 try {
  for(const body of [{phone:'99112233',quantity:9},{phone:'99112233',quantity:10.5},{phone:'bad',quantity:10},null,{phone:'99112233',quantity:'10'}]) assert.equal((await handler(request(body))).status,400);
  assert.equal((await handler(new Request('https://www.finegold.mn/api/gift-order'))).status,405);
  assert.equal((await handler(new Request('https://www.finegold.mn/api/gift-order',{method:'POST',headers:{origin:'https://other.example'},body:'{}'}))).status,403);
 } finally {globalThis.fetch=original;}
});
test('normalizes phone and forwards gift metadata using existing order schema', async () => {
 const original=globalThis.fetch;let payload;
 globalThis.fetch=async (url,options)=>{assert.match(url,/script.google.com/);payload=JSON.parse(options.body);return Response.json({ok:true});};
 try {const r=await handler(request({phone:'+976 9911 2233',quantity:10}));assert.equal(r.status,200);assert.deepEqual(await r.json(),{ok:true});assert.equal(payload.phone,'99112233');assert.equal(payload.qty,10);assert.equal(payload.collection,'FGN 2026/7 Special Edition');assert.ok(payload.timestamp);}finally{globalThis.fetch=original;}
});
test('receiver failure never becomes a successful submission', async () => {
 const original=globalThis.fetch;
 try {for(const fail of [async()=>new Response('failed',{status:500}),async()=>{throw Error('Network');}]) {globalThis.fetch=fail;const r=await handler(request({phone:'99112233',quantity:10}));assert.equal(r.status,502);assert.notEqual((await r.json()).ok,true);}}finally{globalThis.fetch=original;}
});
