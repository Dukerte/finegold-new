import { GIFT_PACKAGES, MAX_GIFT_QUANTITY, type GiftCartItem, type GiftPackageId } from './giftPackages';

export const GIFT_CART_EVENT = 'fgn-gift-cart-changed';
const CART_KEY = 'fgn-special-edition-cart-v1';
let memoryCart: GiftCartItem[] = [];
function readAllCart(): GiftCartItem[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value.filter(item => {
      if (!item || seen.has(item.packageId) || !GIFT_PACKAGES.some(p => p.id === item.packageId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_GIFT_QUANTITY) return false;
      seen.add(item.packageId); return true;
    });
  } catch { return memoryCart; }
}
function saveAllCart(items: GiftCartItem[]) {
  memoryCart = items;
  try { sessionStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* Browsing remains available. */ }
  window.dispatchEvent(new Event(GIFT_CART_EVENT));
}
export type GiftCollection = 'executive' | 'holiday';
export const collectionFor = (id: GiftPackageId): GiftCollection => id.startsWith('holiday-') ? 'holiday' : 'executive';
export function readCart(collection: GiftCollection = 'executive'): GiftCartItem[] {
  return readAllCart().filter(item => collectionFor(item.packageId) === collection);
}
export function saveCart(collection: GiftCollection, items: GiftCartItem[]) {
  saveAllCart([...readAllCart().filter(item => collectionFor(item.packageId) !== collection), ...items.filter(item => collectionFor(item.packageId) === collection)]);
}
export function addGiftToCart(packageId: GiftPackageId) {
  const collection = collectionFor(packageId);
  const items = readCart(collection);
  if (items.reduce((sum, item) => sum + item.quantity, 0) >= MAX_GIFT_QUANTITY) return false;
  const found = items.find(item => item.packageId === packageId);
  saveCart(collection, found ? items.map(item => item.packageId === packageId ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { packageId, quantity: 1 }]);
  return true;
}
