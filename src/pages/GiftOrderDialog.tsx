import { useEffect, useRef, useState, type FormEvent } from 'react';
import { GIFT_PACKAGES, giftMoney, MIN_GIFT_QUANTITY, MAX_GIFT_QUANTITY, type GiftCartItem, type GiftPackageId, type GiftQuote } from '../lib/giftPackages';
import './GiftOrderDialog.css';

const CART_KEY = 'fgn-special-edition-cart-v1';
function readCart(): GiftCartItem[] {
  try {
    const value = JSON.parse(sessionStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(value)) return [];
    const seen = new Set<string>();
    return value.filter(item => {
      if (!item || seen.has(item.packageId) || !GIFT_PACKAGES.some(p => p.id === item.packageId) || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > MAX_GIFT_QUANTITY) return false;
      seen.add(item.packageId); return true;
    });
  } catch { return []; }
}
function CartQuantity({ value, max, label, disabled, onChange }: { value: number; max: number; label: string; disabled: boolean; onChange: (value: number) => void }) {
  const [draft, setDraft] = useState(String(value));
  useEffect(() => setDraft(String(value)), [value]);
  return <input aria-label={label} type="number" inputMode="numeric" min={1} max={max} step={1} value={draft} disabled={disabled}
    onFocus={e => e.currentTarget.select()} onBlur={() => setDraft(String(value))}
    onChange={e => { setDraft(e.target.value); const n = Number(e.target.value); if (Number.isInteger(n) && n >= 1 && n <= max) onChange(n); }} />;
}
export function GiftOrderDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const inFlight = useRef(false);
  const [items, setItems] = useState<GiftCartItem[]>(readCart);
  const [selected, setSelected] = useState<GiftPackageId>('moet');
  const [quantity, setQuantity] = useState('10');
  const [coupon, setCoupon] = useState('');
  const [quote, setQuote] = useState<GiftQuote | null>(null);
  const [status, setStatus] = useState<'idle' | 'quoting' | 'sending' | 'success'>('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [step, setStep] = useState<'select' | 'cart'>('select');
  const busy = status === 'sending' || status === 'quoting';
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.quantity * GIFT_PACKAGES.find(p => p.id === item.packageId)!.price, 0);
  const active = GIFT_PACKAGES.find(p => p.id === selected)!;
  useEffect(() => { try { sessionStorage.setItem(CART_KEY, JSON.stringify(items)); } catch { /* Cart still works without storage. */ } }, [items]);
  useEffect(() => {
    if (open && !dialog.current?.open) { setStatus('idle'); setError(''); dialog.current?.showModal(); }
    if (!open) dialog.current?.close();
    if (!open) return;
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  function updateCart(next: GiftCartItem[]) {
    setItems(next); setQuote(null); setError('');
    setNotice(quote?.coupon ? 'Сагс өөрчлөгдлөө. Купоноо дахин шалгана уу.' : '');
  }
  function add() {
    const value = Number(quantity);
    if (!Number.isInteger(value) || value < 1 || count + value > MAX_GIFT_QUANTITY) { setError('Тоо хэмжээг 1–100,000 хооронд оруулна уу.'); return; }
    const found = items.find(item => item.packageId === selected);
    updateCart(found ? items.map(item => item.packageId === selected ? { ...item, quantity: item.quantity + value } : item) : [...items, { packageId: selected, quantity: value }]);
    setNotice(`${active.name} · ${value}ш сагсанд нэмэгдлээ.`); setStep('cart');
  }
  async function request(action: 'quote' | 'submit', phone?: string) {
    if (inFlight.current) return;
    inFlight.current = true; setStatus(action === 'quote' ? 'quoting' : 'sending'); setError(''); setNotice('');
    const controller = new AbortController(); const timer = window.setTimeout(() => controller.abort(), 18000);
    try {
      const response = await fetch('/api/gift-order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ action, phone, items, coupon: coupon.trim() }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || result.ok !== true) throw new Error(response.status < 500 && result.error ? result.error : 'Илгээсэн эсэхийг баталгаажуулж чадсангүй. info@finegold.mn хаягаар холбогдоно уу.');
      setQuote(result.quote);
      if (action === 'submit') { setStatus('success'); setItems([]); setCoupon(''); }
      else { setStatus('idle'); setNotice(result.quote.coupon ? 'Купон амжилттай үйлчиллээ.' : 'Үнийн дүн шинэчлэгдлээ.'); }
    } catch (e) { setStatus('idle'); setError(e instanceof Error && e.name === 'Error' ? e.message : 'Холболтын хугацаа дууслаа. Илгээсэн эсэхийг info@finegold.mn хаягаар лавлана уу.'); }
    finally { window.clearTimeout(timer); inFlight.current = false; }
  }
  function submit(e: FormEvent<HTMLFormElement>) { e.preventDefault(); if (e.currentTarget.reportValidity()) void request('submit', String(new FormData(e.currentTarget).get('phone'))); }
  function close() { if (!busy) dialog.current?.close(); }
  return <dialog ref={dialog} className="gift-order-dialog gift-shop" aria-labelledby="gift-order-title"
    onCancel={e => { if (busy) e.preventDefault(); }} onClose={onClose}
    onClick={e => { if (e.target === dialog.current) close(); }}>
    <button className="gift-order-close" type="button" aria-label="Хаах" disabled={busy} onClick={close}>×</button>
    <p className="gift-order-eyebrow">FGN · SPECIAL EDITION</p>
    <h2 id="gift-order-title">{status === 'success' ? 'Баярлалаа.' : step === 'cart' ? 'Миний сагс' : 'Бэлгээ сонгоорой'}</h2>
    {status === 'success' ? <div role="status" className="gift-order-success">
      <span className="gift-success-mark" aria-hidden="true">✓</span>
      <p>Таны урьдчилсан захиалгын хүсэлтийг хүлээн авлаа. Манай байгууллага хариуцсан менежерүүд ажлын 2 хоногийн дотор тантай холбогдох болно.</p>
      <p className="gift-success-total">{quote?.quantity} багц · {giftMoney(quote?.total || 0)}</p>
      <button type="button" className="gift-order-submit" onClick={close}>Хаах</button>
    </div> : <>
      <p className="gift-shop-intro">{step === 'select' ? '3 сонголт. Танд тохирох багц, тоо хэмжээгээ сонгоно уу.' : 'Тоо хэмжээ, үнийн дүнгээ шалгаад хүсэлтээ илгээнэ үү.'}</p>
      <div className="gift-shop-tabs" aria-label="Захиалгын алхам">
        <button type="button" aria-pressed={step === 'select'} onClick={() => setStep('select')} disabled={busy}>01 · Багц сонгох</button>
        <button type="button" aria-pressed={step === 'cart'} onClick={() => setStep('cart')} disabled={busy}>02 · Миний сагс <span>{count}</span></button>
      </div>
      {step === 'select' ? <section aria-label="Багцын сонголтууд">
        <fieldset className="gift-package-list" disabled={busy}><legend className="gift-sr-only">Багц сонгох</legend>
          {GIFT_PACKAGES.map(p => <label key={p.id} className={`gift-package ${selected === p.id ? 'is-selected' : ''}`}>
            <input type="radio" name="gift-package" value={p.id} checked={selected === p.id} onChange={() => { setSelected(p.id); setError(''); }} />
            <span className="gift-package-number">{p.number}</span><span className="gift-package-copy"><strong>{p.name}</strong><small>{p.detail}</small></span>
            <span className="gift-package-price">{giftMoney(p.price)}<small>/ багц</small></span>
          </label>)}
        </fieldset>
        <p className="gift-order-note">Бүх үнэд бэлгийн бүтэн багц багтсан. Сонголтуудыг хослуулж болно. Хамгийн багадаа нийт 10 багц захиална.</p>
        <div className="gift-add-row"><label htmlFor="gift-add-quantity">Тоо хэмжээ<input id="gift-add-quantity" type="number" min={1} max={MAX_GIFT_QUANTITY} step={1} inputMode="numeric" value={quantity} onChange={e => setQuantity(e.target.value)} /></label>
          <button type="button" className="gift-order-submit" onClick={add}>Сагсанд нэмэх <span>→</span></button></div>
      </section> : <section aria-label="Миний сагс">
        {!items.length ? <div className="gift-empty"><p>Таны сагс хоосон байна.</p><button className="gift-order-submit" type="button" onClick={() => setStep('select')}>Багц сонгох</button></div> : <>
          <div className="gift-cart-items">{items.map(item => { const p = GIFT_PACKAGES.find(p => p.id === item.packageId)!; return <div key={p.id} className="gift-cart-item">
            <div><strong>{p.name}</strong><small>{giftMoney(p.price)} / багц</small><button className="gift-text-button" type="button" disabled={busy} onClick={() => updateCart(items.filter(i => i.packageId !== p.id))}>Хасах</button></div>
            <div className="gift-cart-right"><div className="gift-stepper"><button type="button" aria-label={`${p.name}: тоог багасгах`} disabled={busy || item.quantity <= 1} onClick={() => updateCart(items.map(i => i.packageId === p.id ? { ...i, quantity: i.quantity - 1 } : i))}>−</button>
              <CartQuantity label={`${p.name}: тоо хэмжээ`} value={item.quantity} max={MAX_GIFT_QUANTITY - count + item.quantity} disabled={busy} onChange={n => updateCart(items.map(i => i.packageId === p.id ? { ...i, quantity: n } : i))} />
              <button type="button" aria-label={`${p.name}: тоог нэмэх`} disabled={busy || count >= MAX_GIFT_QUANTITY} onClick={() => updateCart(items.map(i => i.packageId === p.id ? { ...i, quantity: i.quantity + 1 } : i))}>+</button></div><strong>{giftMoney(p.price * item.quantity)}</strong></div>
          </div>; })}</div>
          <button type="button" className="gift-text-button gift-add-more" disabled={busy} onClick={() => setStep('select')}>+ Өөр багц нэмэх</button>
          <form onSubmit={submit}>
            <label htmlFor="gift-coupon">Купон код <span className="gift-optional">· Заавал биш</span></label>
            <div className="gift-coupon-row"><input id="gift-coupon" autoComplete="off" maxLength={40} value={coupon} placeholder="Кодоо оруулах" disabled={busy} onChange={e => { setCoupon(e.target.value); setQuote(null); setNotice(''); setError(''); }} />
              <button className="gift-secondary-button" type="button" disabled={busy || !coupon.trim()} onClick={() => void request('quote')}>{status === 'quoting' ? 'Шалгаж байна…' : 'Шалгах'}</button></div>
            <dl className="gift-totals"><div><dt>Нийт {count} багц</dt><dd>{giftMoney(subtotal)}</dd></div>{!!quote?.discount && <div className="gift-discount"><dt>Хөнгөлөлт · {quote.coupon}</dt><dd>−{giftMoney(quote.discount)}</dd></div>}<div className="gift-grand-total"><dt>Нийт дүн</dt><dd>{giftMoney(quote?.total ?? subtotal)}</dd></div></dl>
            {count < MIN_GIFT_QUANTITY && <p className="gift-minimum">Хамгийн багадаа 10 багц. Дахин {MIN_GIFT_QUANTITY - count} багц нэмнэ үү.</p>}
            <label htmlFor="gift-phone">Утасны дугаар</label><input id="gift-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="9911 2233" required pattern="(\+976 ?)?[0-9]{4} ?[0-9]{4}" maxLength={15} title="8 оронтой утасны дугаар оруулна уу." disabled={busy} />
            <p className="gift-order-note">Одоо төлбөр төлөхгүй. Менежер ажлын 2 хоногийн дотор холбогдож захиалга, хүргэлтийг баталгаажуулна.</p>
            <button className="gift-order-submit" type="submit" disabled={busy || count < MIN_GIFT_QUANTITY || (!!coupon.trim() && !quote?.coupon)}>{status === 'sending' ? 'Илгээж байна…' : 'Урьдчилсан захиалга илгээх'}</button>
            {!!coupon.trim() && !quote?.coupon && <p className="gift-order-note">Купоноо шалгах эсвэл кодыг арилгаж үргэлжлүүлнэ үү.</p>}
          </form>
        </>}
      </section>}
      {error && <p role="alert" className="gift-order-error">{error}</p>}
      <p role="status" className="gift-cart-notice">{notice}</p>
    </>}
  </dialog>;
}
