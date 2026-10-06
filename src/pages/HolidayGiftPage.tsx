import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import { HOLIDAY_CARDS, type HolidayCard } from '../lib/giftPackages';
import { GiftOrderDialog, addGiftToCart, GIFT_CART_EVENT, readCart } from './GiftOrderDialog';
import './HolidayGiftPage.css';

export default function HolidayGiftPage() {
  const [selected, setSelected] = useState<HolidayCard | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [count, setCount] = useState(() => readCart('holiday').reduce((n, p) => n + p.quantity, 0));
  const [notice, setNotice] = useState('');
  const preview = useRef<HTMLDialogElement>(null);
  const hero = useRef<HTMLIFrameElement>(null);
  const heroVisible = useRef(true);
  const heroBlocked = useRef(false);
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== hero.current?.contentWindow || event.data?.type !== 'holiday-card-open') return;
      const card = HOLIDAY_CARDS.find(card => card.slug === event.data.slug);
      if (card) setSelected(card);
    };
    const observer = new IntersectionObserver(([entry]) => { heroVisible.current = entry.isIntersecting; hero.current?.contentWindow?.postMessage({type:'holiday-scene-active', active:entry.isIntersecting && !heroBlocked.current}, location.origin); });
    if (hero.current) observer.observe(hero.current);
    window.addEventListener('message', receive);
    return () => { observer.disconnect(); window.removeEventListener('message', receive); };
  }, []);
  useEffect(() => { heroBlocked.current = !!selected || orderOpen; hero.current?.contentWindow?.postMessage({type:'holiday-scene-active',active:heroVisible.current && !heroBlocked.current},location.origin); },[selected,orderOpen]);
  useEffect(() => {
    const previous = document.title;
    document.title = 'FGN 2026/27 Шинэ жилийн цуглуулга — Баярын өдрүүдэд зориулсан тусгай загвар';
    const sync = () => setCount(readCart('holiday').reduce((n, p) => n + p.quantity, 0));
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
          <h1 id="holiday-title">Үе дамжих<br /><span>Үнэт дурсамж</span></h1>
          <p className="holiday-lead">Энэ жил талархлаа, хайраа, сайн сайхны ерөөлөө алтан бэлгээр илэрхийлээрэй.</p>
          <div className="holiday-hero-actions"><a className="holiday-primary" href="#holiday-collection">Бэлгээ сонгох <span aria-hidden="true">↘</span></a><button className="holiday-subtle" onClick={() => setSelected(HOLIDAY_CARDS[1])}>3D үзэх <span aria-hidden="true">↗</span></button></div>
          <div className="holiday-facts"><span><strong>999.9</strong>Алтны сорьц</span><span><strong>.5 г</strong>Хэмжээ</span><span className="holiday-edition-fact"><strong>Holiday 2026/7</strong>Загвар · Limited special edition</span></div>
        </div>
        <figure className="holiday-scene"><div className="holiday-scene-art"><iframe ref={hero} onLoad={() => hero.current?.contentWindow?.postMessage({type:'holiday-scene-active',active:heroVisible.current && !heroBlocked.current},location.origin)} src="/holiday-preview/scene.html" title="Баярын алтан картууд — 3D орчин" /></div></figure>
      </section>
      <section className="holiday-product-context" aria-labelledby="holiday-size-title">
        <figure className="holiday-size-comparison" aria-label="Баярын карт болон банкны картын хэмжээний харьцуулалт">
          <div className="holiday-scale-card"><img src="/holiday-preview/artwork/snowman-front.png" alt="0.5 г алттай Хөгжилтэй цасан хүн карт" width="108" height="171" loading="lazy" /><span>Баярын карт</span></div>
          <div className="holiday-scale-card"><div className="holiday-bank-card" aria-hidden="true"><span className="holiday-bank-chip" /><span>БАНКНЫ КАРТ</span><span>•••• ••••</span></div><span>Банкны карт</span></div>
          <figcaption>Хэмжээний харьцуулалт</figcaption>
        </figure>
        <div className="holiday-size-copy">
          <h2 id="holiday-size-title">Алганд багтах алт.<br />Сэтгэлд үлдэх бэлэг.</h2>
          <p>Банкны картын хэмжээтэй баярын картанд 0.5 гр шижир алт, таны чин сэтгэл багтана.</p>
          <p>Хайртай нэгэндээ, дотнын найздаа, хамт олондоо шинэ жилийн нандин дурсамж бэлэглээрэй.</p>
          <p className="holiday-card-measure">999.9 сорьцтой алт · 0.5 гр · 54 × 85.6 мм карт</p>
          <a className="holiday-trust" href="/about#certificates">FGN · ISO 9001:2015 чанарын менежментийн гэрчилгээтэй. <span>Гэрчилгээ үзэх ↗</span></a>
        </div>
      </section>
      <section className="holiday-collection" id="holiday-collection" aria-labelledby="holiday-collection-title">
        <div className="holiday-section-top"><div><h2 id="holiday-collection-title">Баярын өнгө</h2></div><button className="holiday-basket" onClick={() => setOrderOpen(true)}>Миний сагс <span>{count}</span></button></div>
        <div className="holiday-grid">{HOLIDAY_CARDS.map(card => <article key={card.id} className="holiday-product">
          <button className="holiday-product-image" style={{ backgroundColor: card.tone }} aria-label={`${card.name} — 3D үзэх`} onClick={() => setSelected(card)}>
            <span className="holiday-product-number">0.5 г · 999.9</span><img src={`/holiday-preview/${card.slug}-render.png`} alt={`${card.name} алтан картын нүүрэн тал`} width="680" height="850" loading="lazy" /><span className="holiday-preview-link">3D үзэх ↗</span>
          </button>
          <div className="holiday-product-copy"><h3>{card.name}</h3>
            <div className="holiday-product-actions"><button onClick={() => add(card)}>Сагсанд нэмэх <span aria-hidden="true">+</span></button></div>
          </div>
        </article>)}</div>
        <p className="holiday-spec-note">Үнэ: худалдан авах өдрийн Монголбанкны ханшаар.</p>
      </section>
      <section className="holiday-closing"><a href="/executive">Байгууллагын Executive багц үзэх ↗</a></section>
    </main>
    <footer className="holiday-footer"><span>FINE GOLD NATION</span><div className="holiday-contact"><a href="tel:+97677999999">7799-9999</a><a href="mailto:info@finegold.mn">info@finegold.mn ↗</a></div></footer>
    <p className="holiday-sr-only" role="status">{notice}</p>
    <dialog ref={preview} className="holiday-preview-dialog" aria-labelledby="holiday-preview-title" onClose={() => setSelected(null)} onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
      {selected && <><button className="holiday-preview-close" aria-label="3D харагдацыг хаах" onClick={() => setSelected(null)}>×</button>
        <div className="holiday-preview-stage"><iframe key={selected.slug} title={`${selected.name} — нүүр ба арын 3D харагдац`} src={`/holiday-preview/index.html?card=${selected.slug}`} /></div>
        <div className="holiday-preview-info"><h2 id="holiday-preview-title">{selected.name}</h2><p className="holiday-design-description">{selected.description}</p><p className="holiday-preview-purity">999.9 сорьцтой алт · 0.5 г</p>
          <p className="holiday-preview-size">Карт: 54 × 85.6 мм · Банкны картын хэмжээтэй.</p>
          <div className="holiday-design-switcher" aria-label="Картын загвар сонгох">{HOLIDAY_CARDS.map(card => <button key={card.id} aria-label={card.name} aria-pressed={card.id === selected.id} onClick={() => setSelected(card)} style={{ backgroundColor: card.tone }}><img src={`/holiday-preview/${card.slug}-render.png`} alt="" width="48" height="60" /></button>)}</div>
          <p className="holiday-rate">Үнэ: худалдан авах өдрийн Монголбанкны ханшаар.</p><button className="holiday-primary" onClick={() => add(selected)}>Сагсанд нэмэх <span>+</span></button>
        </div></>}
    </dialog>
    <GiftOrderDialog open={orderOpen} onClose={() => setOrderOpen(false)} startInCart collection="holiday" />
  </div>;
}
