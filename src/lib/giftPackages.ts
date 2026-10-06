export const EXECUTIVE_PACKAGES = [
  { id: 'moet', number: '01', name: 'Moet&Chandon Brut Imperial', detail: '375 мл · Оргилуун дарстай багц', price: 599999 },
  { id: 'nicolas', number: '02', name: 'Champagne Nicolas Feuillatte Brut', detail: '375 мл · Оргилуун дарстай багц', price: 499999 },
  { id: 'tree', number: '03', name: 'Шинэ жилийн гацуур — чимэглэл', detail: 'Гацуур чимэглэлтэй багц', price: 399999 },
] as const;
export const HOLIDAY_CARDS = [
  { id: 'holiday-santa', slug: 'santa', number: '01', name: 'Өвлийн өвгөн', english: 'Santa', tone: '#dce2e6', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-snowman', slug: 'snowman', number: '02', name: 'Цасан хүн', english: 'Snowman', tone: '#deebed', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-tree', slug: 'tree', number: '03', name: 'Баярын гацуур', english: 'Christmas tree', tone: '#f3e3d9', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-reindeer', slug: 'reindeer', number: '04', name: 'Цаа буга', english: 'Reindeer', tone: '#e0e8d9', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-gingerbread', slug: 'gingerbread', number: '05', name: 'Цагаан гаатай жигнэмэг', english: 'Gingerbread', tone: '#f1e7ce', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-bear', slug: 'bear', number: '06', name: 'Цагаан баавгай', english: 'Polar bear', tone: '#dde8e8', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
] as const;
export const GIFT_PACKAGES = [...EXECUTIVE_PACKAGES, ...HOLIDAY_CARDS];
export type HolidayCard = typeof HOLIDAY_CARDS[number];
export type GiftPackageId = typeof GIFT_PACKAGES[number]['id'];
export type GiftCartItem = { packageId: GiftPackageId; quantity: number };
export type GiftQuote = { quantity: number; subtotal: number | null; discount: number; total: number | null; coupon: string; pendingPrice?: boolean; knownSubtotal?: number };
export const MIN_GIFT_QUANTITY = 10;
export const MAX_GIFT_QUANTITY = 100000;
export const giftMoney = (amount: number) => `${new Intl.NumberFormat('en-US').format(amount)}₮`;
