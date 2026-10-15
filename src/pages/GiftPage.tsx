import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import './GiftPage.css';
import { GiftOrderDialog } from './GiftOrderDialog';
import { EXECUTIVE_PACKAGES, giftMoney } from '../lib/giftPackages';
type ExecutivePackageId = typeof EXECUTIVE_PACKAGES[number]['id'];

export const GiftPage = () => {
  const [orderOpen, setOrderOpen] = useState(false);
  const [packageId, setPackageId] = useState<ExecutivePackageId>('moet');
  const selectedPackage = EXECUTIVE_PACKAGES.find(p => p.id === packageId)!;
  const enquiryRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const resizePreview = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== previewRef.current?.contentWindow || !['gift-preview-height','gift-preview-focus','gift-order-open'].includes(event.data?.type)) return;
      if(event.data.type === 'gift-order-open'){setOrderOpen(true);return;}
      if(event.data.type === 'gift-preview-focus' && window.innerWidth <= 760){previewRef.current?.scrollIntoView({block:'start',behavior:'instant'});return;}
      if (window.innerWidth <= 760 && Number.isFinite(event.data.height)) previewRef.current!.style.height = `${Math.ceil(event.data.height)}px`;
    };
    const resetHeight = () => { if(window.innerWidth > 760 && previewRef.current) previewRef.current.style.height = ''; };
    window.addEventListener('message', resizePreview);
    window.addEventListener('resize', resetHeight);
    return () => {window.removeEventListener('message', resizePreview);window.removeEventListener('resize', resetHeight);};
  }, []);
  const sendPackage = useCallback(() => previewRef.current?.contentWindow?.postMessage({ type: 'gift-package', packageId, packages: EXECUTIVE_PACKAGES }, window.location.origin), [packageId]);
  useEffect(() => { sendPackage(); }, [sendPackage]);
  useEffect(() => {
    const previous = document.title;
    document.title = 'FGN 2026/7 Executive Gift Set — Special Edition | Fine Gold Nation';
    return () => { document.title = previous; };
  }, []);
  return (
    <div className="gift-page min-h-screen bg-[#0b0b0b] text-white">
      <Header solid onOrder={() => setOrderOpen(true)} onContact={() => enquiryRef.current?.showModal()} />
      <main className="pt-[72px]">
        <section className="executive-package-picker" aria-label="Багц сонгох">
          <div><label htmlFor="executive-package">Багц сонгох</label><p>{selectedPackage.detail}</p></div>
          <select id="executive-package" value={packageId} onChange={event => setPackageId(event.target.value as ExecutivePackageId)}>
            {EXECUTIVE_PACKAGES.map(p => <option key={p.id} value={p.id}>Багц {Number(p.number)} · {p.name} · {giftMoney(p.price)}</option>)}
          </select>
        </section>
        <iframe ref={previewRef} onLoad={sendPackage} src="/gift-preview/index.html?v=three-packages-20261014" title="Байгууллагын бэлгийн багцыг 3D орчинд үзэх" className="block h-[calc(100svh-72px)] min-h-[660px] w-full border-0 max-md:h-[max(730px,calc(100svh-72px))] max-md:min-h-0" />

      </main>
      <GiftOrderDialog initialPackageId={packageId} open={orderOpen} onClose={() => setOrderOpen(false)} />
      <dialog aria-labelledby="enquiry-title" ref={enquiryRef} className="gift-enquiry" onClick={(event) => {if(event.target === enquiryRef.current) enquiryRef.current.close();}}>
        <button type="button" className="enquiry-close" aria-label="Хаах" onClick={() => enquiryRef.current?.close()}>×</button>
        <p className="enquiry-eyebrow">FGN · EXECUTIVE GIFTS</p>
        <h2 id="enquiry-title">Бэлгээ хамтдаа бүтээе</h2>
        <p className="enquiry-description">Тоо хэмжээ, хүссэн загвараа бичээд имэйлээр бидэнд илгээгээрэй.</p>
        <form onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const body = `Байгууллага: ${data.get('company')}\nТоо хэмжээ: ${data.get('quantity')}\nХүссэн хугацаа: ${data.get('date') || 'Тохиролцоно'}\n\nНэмэлт хүсэлт:\n${data.get('notes') || ''}`;
          window.location.href = `mailto:info@finegold.mn?subject=${encodeURIComponent('2026/7 Бэлгийн багц — Урьдчилсан захиалга')}&body=${encodeURIComponent(body)}`;
        }}>
          <label>Байгууллагын нэр<input name="company" required autoComplete="organization" maxLength={150} /></label>
          <div className="enquiry-fields"><label>Багцын тоо<input name="quantity" type="number" min="1" step="1" required inputMode="numeric" /></label><label>Хүлээн авах огноо<input name="date" type="date" /></label></div>
          <label>Нэмэлт хүсэлт<textarea name="notes" rows={3} maxLength={2000} placeholder="Лого, мэндчилгээ, багцын сонголт…" /></label>
          <button type="submit" className="enquiry-submit">Имэйл бэлтгэх ↗</button>
          <p className="enquiry-note">Таны имэйл апп нээгдэнэ. Захиалга шууд баталгаажихгүй.</p>
        </form>
        <a className="enquiry-email" href="mailto:info@finegold.mn">info@finegold.mn</a>
      </dialog>
    </div>
  );
};
