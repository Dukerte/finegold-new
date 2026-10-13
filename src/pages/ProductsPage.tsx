import { PRODUCT_COLLECTIONS } from '../data/productCollections';
import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { HeritageSection } from '../components/sections/HeritageSection';
import { productPrice } from '../utils/productPricing';
import { useGoldRate } from '../hooks/useGoldRate';
import './ProductsPage.css';
const products = [
  { key: '1', weight: '1 г', grams: 1, dims: '8.6 × 14.4 × 0.45' },
  { key: '2-5', weight: '2.5 г', grams: 2.5, dims: '11.2 × 18.7 × 0.65' },
  { key: '5', weight: '5 г', grams: 5, dims: '14 × 23 × 0.85' },
  { key: '10', weight: '10 г', grams: 10, dims: '15.5 × 25.5 × 1.4' },
  { key: '20', weight: '20 г', grams: 20, dims: '18 × 31 × 1.95' },
  { key: '1oz', weight: '1 унц', grams: 31.1, dims: '24 × 41 × 1.75' },
  { key: '50', weight: '50 г', grams: 50, dims: '27 × 47 × 2.2' },
  { key: '100', weight: '100 г', grams: 100, dims: '27 × 47 × 4.3' },
];
export default function ProductsPage() {
  const [selected, setSelected] = useState(0),
    [packaged, setPackaged] = useState(false),
    [view, setView] = useState<'premium' | '3d' | 'compare'>('premium'),
    [failed, setFailed] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const product = products[selected];
  const [custom, setCustom] = useState(false);
  const [minimumPurchase, setMinimumPurchase] = useState(false);
  const [customWeight, setCustomWeight] = useState('50000');
  const [customUnit, setCustomUnit] = useState<'grams' | 'mnt'>('mnt');
  const rate = useGoldRate();
  const rateReady = !rate.loading && rate.source !== 'fallback';
  const appRateReady = !rate.loading && rate.source === 'mongolbank';
  const minimumGrams = appRateReady ? 50000 / rate.pricePerGram : 0;
  const gramLabel = (grams: number) => Number(grams.toFixed(4)).toString();
  const minimumLabel = appRateReady ? gramLabel(minimumGrams) : '—';
  const customGrams = minimumPurchase ? minimumGrams : customUnit === 'mnt' ? (appRateReady ? Number(customWeight) / rate.pricePerGram : 0) : Number(customWeight);
  const customAmount = minimumPurchase ? 50000 : customUnit === 'mnt' ? Number(customWeight) : customGrams * rate.pricePerGram;
  const validCustom = appRateReady && (minimumPurchase || (customWeight.trim() !== '' && Number.isFinite(customGrams) && customAmount >= 50000));
  const price = productPrice(custom ? (validCustom ? customGrams : 0) : product.grams, rate.pricePerGram);
  const money = (value: number) => `₮${value.toLocaleString('en-US')}`;
  const appUrl = 'https://onelink.to/xnesvy';
  const [width, height, depth] = product.dims.split(' × ').map(Number);
  const shownDimensions = view === '3d' && packaged ? `≈ 54 × 85.6 × ${Number((depth + 1.35).toFixed(2))}` : product.dims;
  const send = (type: string, data: Record<string, unknown> = {}) =>
    frame.current?.contentWindow?.postMessage(
      { type, ...data },
      location.origin
    );
  useEffect(() => {
    const old = document.title;
    document.title = 'Мөнгөн мод · Алтан гулдмай | Fine Gold Nation';
    return () => {
      document.title = old;
    };
  }, []);
  useEffect(() => {
    const receive = (e: MessageEvent) => {
      if (
        e.origin !== location.origin ||
        e.source !== frame.current?.contentWindow
      )
        return;
      if (e.data?.type === 'product-error') setFailed(true);
    };
    window.addEventListener('message', receive);
    const observer = new IntersectionObserver(([e]) =>
      send('product-active', { value: e.isIntersecting })
    );
    if (stage.current) observer.observe(stage.current);
    return () => {
      window.removeEventListener('message', receive);
      observer.disconnect();
    };
  }, []);
  const choose = (i: number) => {
    setSelected(i);
    setCustom(false);
    setFailed(false);
  };
  const order = () => {
    window.dispatchEvent(new CustomEvent('fgn-product-order', { detail: { grams: custom ? (validCustom ? customGrams : undefined) : product.grams, custom, includeFees: !custom } }));
  };
  return (
    <div className='products-page'>
      <Header solid onOrder={order} />
      <main>
        <section className='products-intro'>
          <p className='products-eyebrow'>FINE GOLD NATION / МӨНГӨН МОД</p>
          <h1>
            Үе дамжих
            <br />
            <em>үнэт өв.</em>
          </h1>
          <p className='products-lead'>
            Монгол бэлгэдэл. Шижир алт.
            <br />
            Таны үнэ цэнийн илэрхийлэл.
          </p>

          <span className='products-edition'>
            AU 999.9 <i /> 1 Г — 100 Г
          </span>
        </section>
        <section
          className='products-config'
          id='collection'
          aria-label='Алтан гулдмай сонгох'
        >
          <div className='products-stage' ref={stage}>
            <div className={`products-stage-label${custom ? ' products-stage-label-app' : ''}`}>
              <span>МӨНГӨН МОД</span>
              <span>{custom ? `${validCustom ? gramLabel(customGrams) : '—'}ГР | AU 999.9` : `${product.grams}ГР | AU 999.9`}</span>
            </div>
            {custom ? (
              <div className='products-app-preview'><img src='/product-preview/fgn-app-purchase.png' alt='FGN гар утасны апп — алт худалдан авах' /></div>
            ) : view === 'premium' ? (
              <div className='products-editorial-wrap' data-finish={product.key}><img className='products-editorial' src={`/product-preview/boxed-${product.key}.webp`} alt={`${product.weight} алтан гулдмай Мөнгөн мод карттай, бэлгийн хайрцагт`} /><div className='products-preview-footer'><span>ISO 9001 | ISO 14001 | ISO 45001</span><span>CERTIFIED GOLD BAR</span></div></div>
            ) : view === 'compare' ? (
              <div className='products-comparison'>
                <svg viewBox='0 0 120 145' role='img' aria-label={`${product.weight}: ${product.dims} мм. 85.60 × 53.98 мм банкны карттай харьцуулсан хэмжээ.`}>
                  <defs><pattern id='size-grid' width='10' height='10' patternUnits='userSpaceOnUse'><path d='M 10 0 L 0 0 0 10' fill='none' stroke='#bca575' strokeOpacity='.27' strokeWidth='.25'/></pattern><linearGradient id='size-gold' x2='1' y2='1'><stop stopColor='#a58750'/><stop offset='.45' stopColor='#ead5a0'/><stop offset='1' stopColor='#b49358'/></linearGradient></defs>
                  <rect width='120' height='145' fill='url(#size-grid)'/>
                  <rect x={60-width/2} y='12' width={width} height={height} rx={width*.055} fill='url(#size-gold)'/>
                  <path d={`M ${60-width/2} 7 v -2 H ${60+width/2} v 2`} fill='none' stroke='#d7c598' strokeWidth='.3'/>
                  <text x='60' y='3' textAnchor='middle'>{width} мм</text>
                  <path d={`M ${64+width/2} 12 h 2 v ${height} h -2`} fill='none' stroke='#d7c598' strokeWidth='.3'/>
                  <text x={68+width/2} y={13+height/2}>{height} мм</text>
                  <text x='60' y='67' textAnchor='middle'>{product.weight} · Зузаан {depth} мм</text>
                  <rect x='17.2' y='76' width='85.6' height='53.98' rx='3.18' fill='#292c27' stroke='#b5a17a' strokeWidth='.3'/>
                  <rect x='24' y='86' width='10' height='8' rx='1.5' fill='#8c7e61'/>
                  <text x='25' y='107'>БАНКНЫ КАРТ</text><text x='25' y='115'>85.60 × 53.98 мм</text>
                  <text x='60' y='140' textAnchor='middle'>Нэг нүд = 10 × 10 мм</text>
                </svg>
              </div>
            ) : failed ? (
              <img
                className='products-fallback'
                src={`/product-preview/${product.key}.webp`}
                alt={`${product.weight} алтан гулдмай`}
              />
            ) : (
              <div className='products-interactive-view'><iframe
                ref={frame}
                key={`${product.key}-${view}-${packaged}`}
                src={`/product-preview/index.html?weight=${product.key}&packaged=${packaged ? 1 : 0}`}
                title='Мөнгөн мод алтан гулдмайн 3D харагдац'
              /><div className='products-side-controls products-package-controls' aria-label='3D бүтээгдэхүүний хувилбар'><button aria-pressed={packaged} onClick={() => setPackaged(true)}>Карттай</button><button aria-pressed={!packaged} onClick={() => setPackaged(false)}>Картгүй</button></div><div className='products-side-controls' aria-label='3D харах өнцөг'><button onClick={() => send('product-face', { face: 'front' })}>Урд</button><button onClick={() => send('product-face', { face: 'rear' })}>Ард</button><button aria-label='Харагдац сэргээх' title='Харагдац сэргээх' onClick={() => send('product-reset')}>↺</button></div></div>
            )}
            
            <div className='products-dimensions-overlay'>{custom ? <p className='products-app-caption'>FGN хэтэвч дэх алтаа хүссэн үедээ гулдмай хэлбэрээр биежүүлэн авах боломжтой.<br />Гулдмайн сонголтууд: 0.5гр - 100гр</p> : <>{shownDimensions} мм<span>Өргөн × Өндөр × Зузаан</span></>}</div>
            {!custom && <div className='products-mode-controls' aria-label='Харагдац сонгох'>
              <button aria-pressed={view === 'premium'} onClick={() => { setView('premium'); }}>Үндсэн харагдац</button>
              <button aria-pressed={view === '3d'} onClick={() => { setView('3d'); }}>3D үзэх</button>
              <button aria-pressed={view === 'compare'} onClick={() => setView('compare')}>Харьцуулж харах</button>
            </div>
            }
          </div>
          <div className='products-details'>
            <div className='products-selection'>
            <div className='products-collection-heading'>
              <p className='products-eyebrow'>ЦУГЛУУЛГА</p>
              <details className='products-collection-select'>
                <summary><span>Коллекц: Мөнгөн мод</span><svg width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' aria-hidden='true'><path d='m6 9 6 6 6-6'/></svg></summary>
                <div className='products-collection-menu'>
                  {PRODUCT_COLLECTIONS.map(collection => <button key={collection.id} disabled={!collection.available} aria-pressed={collection.available} onClick={e => { e.currentTarget.closest('details')?.removeAttribute('open'); }}><span>{collection.name}<small>{collection.sub}</small></span><em>{collection.available ? '✓ Сонгосон' : 'Удахгүй'}</em></button>)}
                </div>
              </details>
            </div>
            <h2>Мөнгөн мод</h2>
            <p className='products-detail-copy'>
              Хамгаалал, хүч чадал, элбэг дэлбэгийн бэлгэдлийг шингээсэн 999.9
              сорьцтой алтан гулдмай.
            </p>
            <fieldset>
              <legend>Хэмжээ сонгох</legend>
              <div className='products-weights'>
                {products.map((p, i) => (
                  <button
                    key={p.key}
                    aria-pressed={!custom && selected === i}
                    onClick={() => choose(i)}
                  >
                    {p.weight}
                  </button>
                ))}
                <button aria-pressed={custom && minimumPurchase} disabled={!appRateReady} onClick={() => { setCustom(true); setMinimumPurchase(true); }}>{appRateReady ? `≈ ${minimumLabel} г` : 'Ханш уншиж байна…'}</button>
                <button aria-pressed={custom && !minimumPurchase} onClick={() => { setCustom(true); setMinimumPurchase(false); if (!customWeight) { setCustomUnit('mnt'); setCustomWeight('50000'); } }}>Бусад хэмжээ</button>
              </div>
              {custom && <div className='products-custom-input'>
                <p className='products-app-minimum'><strong>Та FGN апп-аар 50,000₮ болон түүнээс дээш дүнгээр худалдан авах боломжтой.</strong></p>
                {minimumPurchase ? <p>50,000₮ ÷ {money(rate.pricePerGram)}/гр = ≈ {minimumLabel} гр. Хэмжээг тухайн өдрийн Монголбанкны ханшаар тооцно.</p> : <div className='products-purchase-panel'>
                  <h3>Худалдан авах хэмжээгээ оруулна уу</h3>
                  <div className='products-purchase-fields'>
                    <label htmlFor='custom-gold-weight'>Гр<input id='custom-gold-weight' type='number' inputMode='decimal' min={minimumGrams || undefined} step='any' disabled={!appRateReady} value={customUnit === 'grams' ? customWeight : customWeight && appRateReady ? Number(customGrams.toFixed(6)) : ''} onChange={e => { setCustomUnit('grams'); setCustomWeight(e.target.value); }} aria-invalid={!validCustom} aria-describedby='custom-purchase-help' /></label>
                    <span aria-hidden='true'>⇄</span>
                    <label htmlFor='custom-gold-amount'>Төгрөг (₮)<input id='custom-gold-amount' type='number' inputMode='decimal' min='50000' step='any' disabled={!appRateReady} value={customUnit === 'mnt' ? customWeight : customWeight && appRateReady ? Number(customAmount.toFixed(2)) : ''} onChange={e => { setCustomUnit('mnt'); setCustomWeight(e.target.value); }} aria-invalid={!validCustom} aria-describedby='custom-purchase-help' /></label>
                  </div>
                  <p id='custom-purchase-help' aria-live='polite'>{!appRateReady ? 'Монголбанкны ханшийг уншиж байна…' : validCustom ? '' : 'Худалдан авах дүн 50,000₮-өөс багагүй байна.'}</p>
                </div>}
              </div>}
            </fieldset>
            </div>
            <div className='products-purchase-details'>
            <dl>
              <div>
                <dt>Алтны сорьц</dt>
                <dd>Au 999.9</dd>
              </div>
              <div>
                <dt>Жин</dt>
                <dd>
                  {custom ? `${validCustom ? (minimumPurchase ? '≈ ' : '') + gramLabel(customGrams) : '—'} г` : product.weight}
                  {!custom && product.key === '1oz' ? ' / 31.1 г' : ''}
                </dd>
              </div>
              <div>
                <dt>Өргөн × Өндөр × Зузаан</dt>
                <dd>{custom ? 'Аппд сонгоно' : `${shownDimensions} мм`}</dd>
              </div>
            </dl>
            <div className='products-price' aria-live='polite'>
              <span>{rate.rateDate.replaceAll('-', '.')} байдлаарх {rate.source === 'mongolbank' ? 'Монголбанк' : 'Монханс'} ханш · 1 гр</span>
              <strong>{rateReady ? money(rate.pricePerGram) : rate.loading ? 'Ханш уншиж байна…' : 'Ханш түр боломжгүй'}</strong>
              {rateReady && !custom && <div className='products-price-breakdown'>
                <div><span>Алтны суурь үнэ · {custom ? customGrams : product.grams} гр</span><b>{money(price.gold)}</b></div>
                <div><span>+ Ур хийцийн нэмэгдэл (4.9%)</span><b>{money(price.workmanship)}</b></div>
                <div><span>+ Татвар, бусад хураамж (15.0%)</span><b>{money(price.fees)}</b></div>
                <div className='products-price-total'><span>Нийт үнэ</span><b>{money(price.total)}</b></div>
              </div>}
              {custom && validCustom && <div className='products-price-breakdown'><div className='products-price-total'><span>Худалдан авах дүн</span><b>{money(Math.round(customAmount))}</b></div></div>}
            </div>
            <div className='products-channels'>
              <h3>Худалдан авах боломжтой</h3>
              <div className='products-channel-options'>
                {[
                  ...(!custom ? [{ label: 'FGN Киоск', href: '/locations', available: selected < 4, icon: 'kiosk' }] : []),
                  { label: 'FGN Гар утасны апп', href: appUrl, available: true, icon: 'app' },
                  ...(!custom ? [{ label: 'FGN салбарууд', href: '/locations', available: true, icon: 'branch' }] : []),
                ].map(channel => {
                  const content = <><span className='products-channel-icon' aria-hidden='true'><svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.4' strokeLinecap='round' strokeLinejoin='round'>{channel.icon === 'app' ? <><rect x='6.5' y='2.5' width='11' height='19' rx='2.5'/><path d='M10 5h4M11 18.5h2'/></> : channel.icon === 'kiosk' ? <><rect x='5' y='3' width='14' height='18' rx='2'/><path d='M8 6h8v7H8zM9 17h6'/></> : <><path d='M3 10h18L19 4H5l-2 6ZM5 10v10h14V10M10 20v-6h4v6M3 21h18'/></>}</svg></span><span className='products-channel-name'>{channel.label}</span><span className='products-channel-status'><i />{channel.available ? 'Боломжтой' : 'Боломжгүй'}</span>{channel.available && <span className='products-channel-arrow' aria-hidden='true'>↗</span>}</>;
                  return channel.available ? <a key={channel.icon} className='products-channel is-available' href={channel.href}>{content}</a> : <div key={channel.icon} className='products-channel is-unavailable' aria-disabled='true'>{content}</div>;
                })}
              </div>
            </div>
            <button className='products-order' onClick={custom ? () => window.location.assign(appUrl) : order} disabled={custom ? !validCustom : !rateReady}>
              {custom ? 'FGN апп руу очих' : 'Захиалга өгөх'} <span>↗</span>
            </button>
            <a className='products-call' href='tel:77999999'>
              Зөвлөгөө авах · 7799-9999
            </a>
            </div>
          </div>
        </section>
        <section className='products-range'>
          <div className='products-range-grid'>
            {products.map((p, i) => (
              <button
                key={p.key}
                data-finish={p.key}
                onClick={() => {
                  choose(i);
                  document
                    .getElementById('collection')
                    ?.scrollIntoView({
                      behavior: matchMedia('(prefers-reduced-motion: reduce)')
                        .matches
                        ? 'instant'
                        : 'smooth',
                    });
                }}
                aria-label={`${p.weight} сонгож 3D харах`}
              >
                <div className='products-range-scene'>
                <img
                  src={`/product-preview/${p.key}.webp`}
                  loading='lazy'
                  alt={`${p.weight} гулдмай`}
                />
                </div>
                <span>
                  {p.weight}
                  <b>↗</b>
                </span>
                <small>AU 999.9</small>
              </button>
            ))}
          </div>
        </section>
        <div className='products-heritage'>
          <HeritageSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
