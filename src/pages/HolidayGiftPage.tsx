import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import { HOLIDAY_CARDS, type HolidayCard } from '../lib/giftPackages';
import { GiftOrderDialog, addGiftToCart, GIFT_CART_EVENT, readCart } from './GiftOrderDialog';
import './HolidayGiftPage.css';

export default function HolidayGiftPage() {
  const [selected, setSelected] = useState<HolidayCard | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [count, setCount] = useState(() => readCart().reduce((n, p) => n + p.quantity, 0));
  const [notice, setNotice] = useState('');
  const preview = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.title;
    document.title = 'FGN 2026/7 Holiday Collection — 0.5 г алттай баярын карт';
    const sync = () => setCount(readCart().reduce((n, p) => n + p.quantity, 0));
    window.addEventListener(GIFT_CART_EVENT, sync);
    return () => { document.title = previous; window.removeEventListener(GIFT_CART_EVENT, sync); };
  }, []);
  useEffect(() => { if (selected && !preview.current?.open) preview.current?.showModal(); if (!selected) preview.current?.close(); }, [selected]);
  function add(card: HolidayCard) {
    if (!addGiftToCart(card.id)) { setNotice('Сагсны тоо хэмжээ дээд хязгаарт хүрсэн байна.'); return; }
    setNotice(`${card.name} сагсанд нэмэгдлээ.`);
    setSelected(null); setOrderOpen(true);
  }
  return <div className="holiday-page">
    <Header solid onOrder={() => setOrderOpen(true)} />
    <main>
      <section className="holiday-hero" aria-labelledby="holiday-title">
        <div className="holiday-hero-copy">
          <p className="holiday-eyebrow">FINE GOLD NATION · HOLIDAY 2026/7</p>
          <h1 id="holiday-title">Бяцхан бэлэг.<br /><span>Үнэт дурсамж.</span></h1>
          <p className="holiday-lead">Хайртай хүмүүстээ баярын инээмсэглэл,<br className="holiday-desktop-break" /> үнэ цэнээ хадгалах алтыг хамтад нь.</p>
          <div className="holiday-hero-actions"><a className="holiday-primary" href="#holiday-collection">Зургаан загварыг үзэх <span aria-hidden="true">↘</span></a><button className="holiday-subtle" onClick={() => setSelected(HOLIDAY_CARDS[1])}>3D танилцуулга <span aria-hidden="true">↗</span></button></div>
          <div className="holiday-facts"><span><strong>999.9</strong>Алтны сорьц</span><span><strong>0.5 г</strong>Загвар бүрд</span><span><strong>06</strong>Баярын загвар</span></div>
        </div>
        <figure className="holiday-scene"><img src="/holiday-preview/holiday-scene.webp" alt="Гацуурын мөчрөөс өлгөсөн гурван алтан карт, нээлттэй бэлгийн хайрцагт хоёр карт, хажууд нь цагаан баавгайн карт" width="1600" height="1400" fetchPriority="high" /><figcaption>Баярын орчны дүрслэл · Гоёл, хайрцаг тусдаа</figcaption></figure>
        <span className="holiday-hero-edition" aria-hidden="true">A LITTLE GOLD. A LASTING MEMORY.</span>
      </section>
      <section className="holiday-collection" id="holiday-collection" aria-labelledby="holiday-collection-title">
        <div className="holiday-section-top"><div><p className="holiday-eyebrow">THE HOLIDAY COLLECTION</p><h2 id="holiday-collection-title">Таны баярын зургаан дүр</h2><p>Дуртай загваруудаа сонгож, нэг сагсанд нэгтгээрэй.</p></div><button className="holiday-basket" onClick={() => setOrderOpen(true)}>Миний сагс <span>{count}</span></button></div>
        <div className="holiday-grid">{HOLIDAY_CARDS.map(card => <article key={card.id} className="holiday-product">
          <button className="holiday-product-image" style={{ backgroundColor: card.tone }} aria-label={`${card.name} — 3D үзэх`} onClick={() => setSelected(card)}>
            <span className="holiday-product-number">0.5 г · 999.9</span><img src={`/holiday-preview/${card.slug}-render.png`} alt={`${card.name} алтан картын нүүрэн тал`} width="680" height="850" loading="lazy" /><span className="holiday-preview-link">Эргүүлж үзэх ↗</span>
          </button>
          <div className="holiday-product-copy"><p className="holiday-product-en">{card.number} / {card.english}</p><h3>{card.name}</h3><p className="holiday-rate">Худалдан авах өдрийн Монголбанкны ханшаас хамаарна.</p>
            <div className="holiday-product-actions"><button onClick={() => setSelected(card)}>3D үзэх <span aria-hidden="true">↗</span></button><button onClick={() => add(card)}>Сагсанд нэмэх <span aria-hidden="true">+</span></button></div>
          </div>
        </article>)}</div>
        <p className="holiday-spec-note">3D загвар нь дүрслэлийн зориулалттай. Картын зузаан, алтан хэсгийн хэмжээ болон өлгөх бэхэлгээг үйлдвэрлэлийн үзүүлэлтээр баталгаажуулна.</p>
      </section>
      <section className="holiday-closing"><p className="holiday-eyebrow">GIVE SOMETHING THAT LASTS</p><h2>Энэ жилийн баяр.<br /><span>Үе дамжих үнэт өв.</span></h2><a href="/executive">Байгууллагын Executive багц үзэх ↗</a></section>
    </main>
    <footer className="holiday-footer"><span>FINE GOLD NATION</span><a href="mailto:info@finegold.mn">info@finegold.mn ↗</a></footer>
    <p className="holiday-sr-only" role="status">{notice}</p>
    <dialog ref={preview} className="holiday-preview-dialog" aria-labelledby="holiday-preview-title" onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      {selected && <><button className="holiday-preview-close" aria-label="3D харагдацыг хаах" onClick={() => setSelected(null)}>×</button>
        <div className="holiday-preview-stage"><iframe key={selected.slug} title={`${selected.name} — нүүр ба арын 3D харагдац`} src={`/holiday-preview/index.html?card=${selected.slug}`} /></div>
        <div className="holiday-preview-info"><p className="holiday-eyebrow">HOLIDAY COLLECTION · {selected.number} / 06</p><h2 id="holiday-preview-title">{selected.name}</h2><p className="holiday-preview-purity">999.9 сорьцтой алт · 0.5 г</p><p>Баярын дүртэй карт дээр байрласан 0.5 г шижир алт. Нүүр болон арын загварыг эргүүлж, ойроос үзээрэй.</p>
          <p className="holiday-preview-size">Картын эх файлын хэмжээ: ойролцоогоор 54 × 85.6 мм.<br /><small>Бэлэн бүтээгдэхүүний зузаан, бэхэлгээг баталгаажуулна.</small></p>
          <div className="holiday-design-switcher" aria-label="Картын загвар сонгох">{HOLIDAY_CARDS.map(card => <button key={card.id} aria-label={card.name} aria-pressed={card.id === selected.id} onClick={() => setSelected(card)} style={{ backgroundColor: card.tone }}><img src={`/holiday-preview/${card.slug}-render.png`} alt="" width="48" height="60" /></button>)}</div>
          <p className="holiday-rate">Үнэ нь худалдан авах өдрийн Монголбанкны ханшаас хамаарна.</p><button className="holiday-primary" onClick={() => add(selected)}>Сагсанд нэмэх <span>+</span></button>
        </div></>}
    </dialog>
    <GiftOrderDialog open={orderOpen} onClose={() => setOrderOpen(false)} startInCart />
  </div>;
}
