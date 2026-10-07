export const EXECUTIVE_PACKAGES = [
  { id: 'moet', number: '01', name: 'Moet&Chandon Brut Imperial', detail: '375 мл · Оргилуун дарстай багц', price: 699999 },
  { id: 'nicolas', number: '02', name: 'Champagne Nicolas Feuillatte Brut', detail: '375 мл · Оргилуун дарстай багц', price: 599999 },
  { id: 'tree', number: '03', name: 'Шинэ жилийн гацуур — чимэглэл', detail: 'Гацуур чимэглэлтэй багц', price: 499999 },
] as const;
export const HOLIDAY_CARDS = [
  { id: 'holiday-santa', slug: 'santa', number: '01', name: 'Өвлийн өвөө', description: 'Хүсэн хүлээсэн шинэ жил ирлээ.', english: 'Santa', tone: '#dce2e6', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-snowman', slug: 'snowman', number: '02', name: 'Хөгжилтэй цасан хүн', description: 'Хүйтэн өдрүүдийн дулаахан инээмсэглэл.', english: 'Snowman', tone: '#deebed', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-tree', slug: 'tree', number: '03', name: 'Гэрэлт баярын гацуур', description: 'Гэрэлтэй гацуурын дэргэд бүтээх алтан дурсамж.', english: 'Christmas tree', tone: '#f3e3d9', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-reindeer', slug: 'reindeer', number: '04', name: 'Өхөөрдөм цаа буга', description: 'Шинэ он шинэ бүхнийг дагуулсан бэлэг.', english: 'Reindeer', tone: '#e0e8d9', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-gingerbread', slug: 'gingerbread', number: '05', name: 'Жигнэмэгэн хүн', description: 'Баярын амтат дурсамжийг алттай хамт.', english: 'Gingerbread', tone: '#f1e7ce', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
  { id: 'holiday-bear', slug: 'bear', number: '06', name: 'Цагаан баавгайн бамбарууш', description: 'Хайртай хүндээ хүргэх үнэ цэнтэй бэлэг.', english: 'Polar bear', tone: '#dde8e8', detail: '999.9 сорьц · 0.5 г · Баярын карт', price: null },
] as const;
export const GIFT_PACKAGES = [...EXECUTIVE_PACKAGES, ...HOLIDAY_CARDS];
export type HolidayCard = typeof HOLIDAY_CARDS[number];
export type GiftPackageId = typeof GIFT_PACKAGES[number]['id'];
export type GiftCartItem = { packageId: GiftPackageId; quantity: number };
export type GiftQuote = { quantity: number; subtotal: number | null; discount: number; total: number | null; coupon: string; pendingPrice?: boolean; knownSubtotal?: number };
export const MIN_GIFT_QUANTITY = 10;
export const MAX_GIFT_QUANTITY = 100000;
export const giftMoney = (amount: number) => `${new Intl.NumberFormat('en-US').format(amount)}₮`;
