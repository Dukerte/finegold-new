import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import './GiftPage.css';
import { GiftOrderDialog } from './GiftOrderDialog';

export const GiftPage = () => {
  const [orderOpen, setOrderOpen] = useState(false);
  const enquiryRef = useRef<HTMLDialogElement>(null);
  const previewRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const resizePreview = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== previewRef.current?.contentWindow || !['gift-preview-height','gift-preview-focus'].includes(event.data?.type)) return;
      if(event.data.type === 'gift-preview-focus' && window.innerWidth <= 760){previewRef.current?.scrollIntoView({block:'start',behavior:'instant'});return;}
      if (window.innerWidth <= 760 && Number.isFinite(event.data.height)) previewRef.current!.style.height = `${Math.ceil(event.data.height)}px`;
    };
    const resetHeight = () => { if(window.innerWidth > 760 && previewRef.current) previewRef.current.style.height = ''; };
    window.addEventListener('message', resizePreview);
    window.addEventListener('resize', resetHeight);
    return () => {window.removeEventListener('message', resizePreview);window.removeEventListener('resize', resetHeight);};
  }, []);
  useEffect(() => {
    const previous = document.title;
    document.title = '2026/7 Special Edition Executive package | Fine Gold Nation';
    return () => { document.title = previous; };
  }, []);
  return (
    <div className="gift-page min-h-screen bg-[#0b0b0b] text-white">
      <Header solid onOrder={() => setOrderOpen(true)} onContact={() => enquiryRef.current?.showModal()} />
      <main className="pt-[72px]">
        <iframe ref={previewRef} src="/gift-preview/index.html?v=special-edition-rotation-v3-20261002" title="Байгууллагын бэлгийн багцыг 3D орчинд үзэх" className="block h-[calc(100svh-72px)] min-h-[660px] w-full border-0 max-md:h-[max(730px,calc(100svh-72px))] max-md:min-h-0" />

      </main>
      <GiftOrderDialog open={orderOpen} onClose={() => setOrderOpen(false)} />
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
