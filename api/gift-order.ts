import submitPreorder from './preorder';
import { GIFT_PACKAGES, MIN_GIFT_QUANTITY, MAX_GIFT_QUANTITY } from '../src/lib/giftPackages';

export const config = { runtime: 'edge' };
const reply = (error: string, status = 400) => Response.json({ error }, { status });

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405, headers: { 'Content-Type': 'application/json', Allow: 'POST' },
  });
  const origin = req.headers.get('origin');
  if (origin && origin !== new URL(req.url).origin) return reply('Invalid origin', 403);
  const raw = await req.text();
  if (raw.length > 4096) return reply('Request too large', 413);
  let data;
  try { data = JSON.parse(raw); } catch { return reply('Invalid JSON'); }
  if (!data || typeof data !== 'object' || !['quote', 'submit'].includes(data.action)) return reply('Invalid action');
  if (!Array.isArray(data.items) || !data.items.length || data.items.length > GIFT_PACKAGES.length) return reply('Багцаа сонгоно уу.');
  const seen = new Set<string>();
  const lines = [];
  for (const item of data.items) {
    const product = GIFT_PACKAGES.find(p => p.id === item?.packageId);
    if (!product || seen.has(product.id) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_GIFT_QUANTITY) return reply('Багцын сонголт эсвэл тоо буруу байна.');
    seen.add(product.id);
    lines.push({ ...product, quantity: item.quantity as number });
  }
  const quantity = lines.reduce((sum, line) => sum + line.quantity, 0);
  const executiveQuantity = lines.filter(line => line.price !== null).reduce((sum, line) => sum + line.quantity, 0);
  if (quantity > MAX_GIFT_QUANTITY) return reply('Нийт 100,000 хүртэл ширхэг сонгох боломжтой.');
  if (data.action === 'submit' && executiveQuantity > 0 && executiveQuantity < MIN_GIFT_QUANTITY) return reply('Executive багцыг хамгийн багадаа нийт 10 ширхэг захиална.');
  const subtotal = lines.reduce((sum, line) => sum + line.quantity * (line.price ?? 0), 0);
  if (data.coupon !== undefined && (typeof data.coupon !== 'string' || data.coupon.length > 40)) return reply('Купон код буруу байна.');
  const coupon = (data.coupon || '').trim().toUpperCase();
  let discount = 0;
  const pendingPrice = lines.some(line => line.price === null);
  if (coupon && pendingPrice) return reply('Holiday картын үнэ баталгаажсаны дараа купон тооцно.');
  if (coupon) {
    // Codes remain server-only; never trust discounts or prices sent by the client.
    let coupons;
    try { coupons = JSON.parse(process.env.GIFT_ORDER_COUPONS || '[]'); } catch { return reply('Купоныг шалгах боломжгүй байна. Түр хүлээгээд дахин оролдоно уу.', 503); }
    if (!Array.isArray(coupons)) return reply('Купоныг шалгах боломжгүй байна.', 503);
    const rule = coupons.find(c => typeof c?.code === 'string' && c.code.toUpperCase() === coupon);
    if (!rule || (rule.expiresAt && (!Number.isFinite(Date.parse(rule.expiresAt)) || Date.parse(rule.expiresAt) <= Date.now()))) return reply('Купон код хүчингүй эсвэл хугацаа дууссан байна.');
    if (rule.minQuantity !== undefined && (!Number.isInteger(rule.minQuantity) || quantity < rule.minQuantity)) return reply('Энэ купоны хамгийн бага тоо хэмжээнд хүрээгүй байна.');
    if (typeof rule.percentOff === 'number' && rule.percentOff > 0 && rule.percentOff <= 100 && rule.amountOff === undefined) discount = Math.round(subtotal * rule.percentOff / 100);
    else if (Number.isSafeInteger(rule.amountOff) && rule.amountOff > 0 && rule.percentOff === undefined) discount = Math.min(subtotal, rule.amountOff);
    else return reply('Купоныг шалгах боломжгүй байна.', 503);
  }
  const quote = { quantity, subtotal: pendingPrice ? null : subtotal, discount, total: pendingPrice ? null : subtotal - discount, coupon, pendingPrice, knownSubtotal: subtotal };
  if (data.action === 'quote') return Response.json({ ok: true, quote });
  if (typeof data.phone !== 'string') return reply('Утасны дугаараа оруулна уу.');
  const phone = data.phone.replace(/[\s-]/g, '').replace(/^\+976/, '');
  if (!/^[0-9]{8}$/.test(phone)) return reply('8 оронтой утасны дугаар оруулна уу.');
  const breakdown = lines.map(line => line.price === null ? `${line.name} (${line.detail}): ${line.quantity}ш — Худалдан авах өдрийн Монголбанкны ханшаас хамаарна` : `${line.name} (${line.detail}): ${line.quantity}ш × ${line.price}₮ = ${line.price * line.quantity}₮`).join('\n');
  const couponNote = coupon ? `\nКупон: ${coupon}; хөнгөлөлт: ${discount}₮; үндсэн дүн: ${subtotal}₮` : '';
  // Keep the established receiver's columns, including the complete cart in its email-visible product field.
  const response = await submitPreorder(new Request(req.url, {
    method: 'POST', headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify({ timestamp: new Date().toISOString(), collection: 'FGN 2026/7 Special Edition',
      product: `Урьдчилсан захиалга\n${breakdown}${couponNote}`, qty: quantity,
      price: pendingPrice ? `Holiday: худалдан авах өдрийн ханшаар баталгаажуулна. Executive: ${subtotal}₮` : `${quote.total}₮`, name: 'Бэлгийн цуглуулга — special-edition', phone }),
  }));
  if (!response.ok) return response;
  return Response.json({ ok: true, quote });
}
