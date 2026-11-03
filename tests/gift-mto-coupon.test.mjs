import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const url = source => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64');
const catalog=url(fs.readFileSync('src/lib/giftPackages.ts','utf8'));
const receiver=url('export async function submitPreorder(){return Response.json({ok:true})} export default submitPreorder;');
for(const platform of ['Vercel','Cloudflare']){
 const source=fs.readFileSync(platform==='Vercel'?'api/gift-order.ts':'functions/api/gift-order.ts','utf8').replace("'./preorder'",JSON.stringify(receiver)).replace(/'\.\.\/(?:\.\.\/)?src\/lib\/giftPackages'/,JSON.stringify(catalog));
 const adapter=await import(url(source));
 test(`${platform}: MTO2026 is 3% with existing activation and conditions`,async()=>{
  const saved=process.env.GIFT_ORDER_COUPONS;
  const send=async(coupon,items,action='quote',rules=[{code:'MTO2026',percentOff:1.5}])=>{
   const config=JSON.stringify(rules);process.env.GIFT_ORDER_COUPONS=config;
   const request=new Request('https://www.finegold.mn/api/gift-order',{method:'POST',body:JSON.stringify({action,coupon,items,phone:'99112233'})});
   return platform==='Vercel'?adapter.default(request):adapter.onRequest({request,env:{GIFT_ORDER_COUPONS:config}});
  };
  try{
   for(const [packageId,price] of [['moet',699999],['tea',599999],['honey',499999]]) for(const coupon of ['MTO2026','mto2026',' Mto2026 ']) for(const action of ['quote','submit']){
    const response=await send(coupon,[{packageId,quantity:1}],action);assert.equal(response.status,200);
    const {quote}=await response.json();assert.equal(quote.discount,Math.round(price*.03));assert.equal(quote.total,price-Math.round(price*.03));
   }
   const items=[{packageId:'tea',quantity:1}];
   assert.equal((await send('MTO2026',items,'quote',[])).status,400);
   assert.equal((await send('MTO2026',items,'quote',[{code:'MTO2026',percentOff:1.5,expiresAt:'2020-01-01'}])).status,400);
   assert.equal((await send('MTO2026',items,'quote',[{code:'MTO2026',percentOff:1.5,minQuantity:10}])).status,400);
   const {quote}=await (await send('MONCERTF26',items)).json();assert.equal(quote.discount,9000);
  }finally{if(saved===undefined)delete process.env.GIFT_ORDER_COUPONS;else process.env.GIFT_ORDER_COUPONS=saved;}
 });
}
