export const GIFT_PACKAGES = [
  { id: 'moet', number: '01', name: 'Moet&Chandon Brut Imperial', detail: '375 мл · Оргилуун дарстай багц', price: 599999 },
  { id: 'nicolas', number: '02', name: 'Champagne Nicolas Feuillatte Brut', detail: '375 мл · Оргилуун дарстай багц', price: 499999 },
  { id: 'tree', number: '03', name: 'Шинэ жилийн гацуур — чимэглэл', detail: 'Гацуур чимэглэлтэй багц', price: 399999 },
] as const;
export type GiftPackageId = typeof GIFT_PACKAGES[number]['id'];
export type GiftCartItem = { packageId: GiftPackageId; quantity: number };
export type GiftQuote = { quantity: number; subtotal: number; discount: number; total: number; coupon: string };
export const MIN_GIFT_QUANTITY = 10;
export const MAX_GIFT_QUANTITY = 100000;
export const giftMoney = (amount: number) => `${new Intl.NumberFormat('en-US').format(amount)}₮`;
