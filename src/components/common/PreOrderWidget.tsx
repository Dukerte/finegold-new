import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useGoldRate } from '../../hooks/useGoldRate';

// ── Config ────────────────────────────────────────────────────────────────────
const SHEET_URL = '/api/preorder';
const IS_DEV = import.meta.env.DEV;

// ── Products ──────────────────────────────────────────────────────────────────
const PRODUCTS = [
  { grams: 1,    label: '1',   unit: 'гр',  sublabel: '1 грамм',    dims: '8.6 × 14.4 мм',  desc: 'Анх удаа алт худалдан авч буй хэрэглэгч, өдөр тутмын жижиг хуримтлал үүсгэх болон бэлэг дурсгалын зориулалтад тохиромжтой сонголт.' },
  { grams: 2.5,  label: '2.5', unit: 'гр',  sublabel: '2.5 грамм',  dims: '11.2 × 18.7 мм', desc: 'Үнэ цэнтэй хөрөнгө эзэмших, тогтмол хуримтлал эхлүүлэх болон ойр дотнын хүндээ утга учиртай бэлэг өгөхөд тохиромжтой бүтээгдэхүүн.' },
  { grams: 5,    label: '5',   unit: 'гр',  sublabel: '5 грамм',    dims: '14 × 23 мм',      desc: 'Хуримтлалын үнэ цэнээ нэмэгдүүлэх, дунд хугацааны хадгаламж үүсгэх болон онцгой тэмдэглэлт өдөрт зориулсан бэлгийн сонголт.' },
  { grams: 10,   label: '10',  unit: 'гр',  sublabel: '10 грамм',   dims: '15.5 × 25.5 мм', desc: 'Илүү бодит үнэ цэнтэй хөрөнгө оруулалт хийх, урт хугацаанд хадгалах болон гэр бүлийн үнэт хуримтлал бий болгоход тохиромжтой бүтээгдэхүүн.' },
  { grams: 20,   label: '20',  unit: 'гр',  sublabel: '20 грамм',   dims: '18 × 31 мм',      desc: 'Урт хугацааны хөрөнгө оруулалт, үнэ цэнээ хадгалах хуримтлал болон онцгой бэлгийн зориулалтаар сонгоход тохиромжтой бүтээгдэхүүн.' },
  { grams: 31.1, label: '1',   unit: 'унц', sublabel: '31.1 грамм', dims: '24 × 41 мм',      desc: 'Олон улсын жишигт нийцсэн хэмжээгээр алт эзэмших, хөрөнгө оруулалтын багцаа төрөлжүүлэх болон үнэ цэнтэй хадгаламж бүрдүүлэхэд тохиромжтой сонголт.' },
  { grams: 50,   label: '50',  unit: 'гр',  sublabel: '50 грамм',   dims: '27 × 47 мм',      desc: 'Өндөр үнэ цэнтэй хөрөнгө оруулалт хийх, байгууллагын бэлэг дурсгал болон урт хугацааны хадгаламжийн зориулалтаар сонгоход тохиромжтой бүтээгдэхүүн.' },
  { grams: 100,  label: '100', unit: 'гр',  sublabel: '100 грамм',  dims: '27 × 47 мм',      desc: 'Их хэмжээний үнэ цэнтэй хөрөнгө эзэмших, урт хугацаанд найдвартай хадгалах болон өвлүүлэх боломжтой үнэт хөрөнгө оруулалтын бүтээгдэхүүн.' },
];

const COLLECTIONS = [
  { id: 'mungunmod', name: 'Мөнгөн мод',     sub: 'FGN Certified Gold Bar', available: true  },
  { id: '12jil',     name: '12 Жил',          sub: 'FGN Certified Gold Bar', available: false },
  { id: 'limited',   name: 'Limited edition', sub: 'FGN Certified Gold Bar', available: false },
];

type Product = typeof PRODUCTS[number];

const fmt = (n: number) => '₮' + Math.round(n).toLocaleString('mn-MN');

const GOLD = '#E2B56D';
const GOLD_DARK = '#b8832e';

const inputCls =
  'w-full rounded-xl border border-white/8 bg-white/[0.04] px-4 py-3.5 text-sm text-white ' +
  'transition-all duration-200 focus:border-[#E2B56D]/50 focus:bg-[#E2B56D]/[0.04] focus:outline-none ' +
  'placeholder-white/20';

// ── Reusable gold gradient style ──────────────────────────────────────────────
const goldGrad = 'linear-gradient(135deg, #b8832e 0%, #E2B56D 45%, #d4a050 75%, #b8832e 100%)';

// ── Product card ──────────────────────────────────────────────────────────────
const ProductCard: React.FC<{
  product: Product;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  rate: number;
}> = ({ product, qty, onAdd, onRemove, rate }) => {
  const selected = qty > 0;
  const price = product.grams * rate;
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex w-[230px] flex-shrink-0 flex-col overflow-hidden rounded-2xl text-left"
      style={{
        background: selected
          ? 'linear-gradient(160deg, #141108 0%, #0e0d0b 100%)'
          : 'linear-gradient(160deg, #111010 0%, #0d0d0d 100%)',
        border: `1px solid ${selected ? 'rgba(226,181,109,0.55)' : 'rgba(226,181,109,0.18)'}`,
        boxShadow: selected
          ? '0 8px 40px rgba(226,181,109,0.18), 0 0 0 1px rgba(226,181,109,0.08), inset 0 1px 0 rgba(226,181,109,0.08)'
          : '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(226,181,109,0.04)',
        transition: 'border-color 0.25s ease, box-shadow 0.25s ease, background 0.25s ease',
      }}
    >
      {/* Top-edge gold line */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] transition-opacity duration-300"
        style={{
          background: 'linear-gradient(90deg, transparent 5%, rgba(226,181,109,0.55) 50%, transparent 95%)',
          opacity: selected ? 1 : 0.35,
        }}
      />

      {/* Hover ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(226,181,109,0.1) 0%, transparent 65%)' }}
      />

      {/* Selected ambient glow */}
      {selected && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(226,181,109,0.1) 0%, transparent 65%)' }}
        />
      )}

      {/* Branding */}
      <div className="flex items-center justify-between px-3.5 pt-3.5 pb-0">
        <span className="text-[9px] font-medium uppercase tracking-[0.15em] text-white/55">
          FGN Certified Gold Bar
        </span>
        <span
          className="rounded-full px-1.5 py-[2px] text-[8.5px] font-bold text-black"
          style={{ background: goldGrad }}
        >
          999.9
        </span>
      </div>

      {/* Image */}
      <div
        className="relative mx-3 mt-2.5 overflow-hidden rounded-xl"
        style={{ height: 148, background: 'radial-gradient(ellipse at 60% 35%, #1d1508 0%, #090806 100%)' }}
      >
        <img
          src="/images/gold-bars.png"
          alt={`FGN Gold Bar ${product.label}${product.unit}`}
          className="absolute inset-0 h-full w-full object-contain object-center"
          style={{ filter: 'drop-shadow(0 6px 20px rgba(226,181,109,0.38))' }}
          draggable={false}
        />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#090806]/90 to-transparent" />
      </div>

      {/* Weight */}
      <div className="flex items-baseline gap-1 px-4 pt-3">
        <span
          className="text-[2.1rem] font-bold leading-none tracking-tight"
          style={{ color: selected ? GOLD : '#ffffff' }}
        >
          {product.label}
        </span>
        <span className="text-lg font-semibold" style={{ color: selected ? GOLD : 'rgba(255,255,255,0.45)' }}>
          {product.unit}
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 flex-1 px-4 text-[11px] leading-[1.65] text-white/65">{product.desc}</p>

      {/* Dims */}
      <div className="mt-3 flex gap-5 border-t border-white/[0.05] px-4 pt-2.5">
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/50">Хэмжээ</p>
          <p className="mt-0.5 text-[10.5px] text-white/75">{product.dims}</p>
        </div>
        <div>
          <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/50">Сорьц</p>
          <p className="mt-0.5 text-[10.5px] text-white/75">999.9</p>
        </div>
      </div>

      {/* Price + qty stepper */}
      <div className="flex items-center justify-between px-4 pt-3 pb-4">
        <div>
          <span className="text-base font-bold" style={{ color: selected ? '#ffffff' : 'rgba(226,181,109,0.8)' }}>
            {fmt(price)}
          </span>
          {selected && (
            <p className="text-[9.5px] text-white/50 mt-0.5">
              {product.label}{product.unit} × {qty}ш
            </p>
          )}
        </div>

        {qty === 0 ? (
          /* Add button */
          <motion.button
            type="button"
            onClick={onAdd}
            whileTap={{ scale: 0.9 }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold"
            style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.55)' }}
          >
            <span className="text-base leading-none" style={{ color: GOLD, marginTop: -1 }}>+</span>
            НЭМЭХ
          </motion.button>
        ) : (
          /* Qty stepper — unified pill */
          <div
            className="flex items-center overflow-hidden rounded-full"
            style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)' }}
          >
            <motion.button
              type="button"
              onClick={onRemove}
              whileTap={{ scale: 0.85 }}
              className="flex h-6 w-6 items-center justify-center text-[13px] text-white/55 transition-colors hover:text-white"
            >
              −
            </motion.button>
            <div className="h-3 w-px bg-white/12" />
            <span className="w-6 text-center text-[11px] font-semibold text-white">{qty}</span>
            <div className="h-3 w-px bg-white/12" />
            <motion.button
              type="button"
              onClick={onAdd}
              whileTap={{ scale: 0.85 }}
              className="flex h-6 w-6 items-center justify-center text-[13px] text-white/55 transition-colors hover:text-white"
            >
              +
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ── Carousel arrow ────────────────────────────────────────────────────────────
const ArrowBtn: React.FC<{ dir: 'left' | 'right'; visible: boolean; onClick: () => void }> = ({
  dir, visible, onClick,
}) => (
  <AnimatePresence>
    {visible && (
      <motion.button
        type="button"
        onClick={onClick}
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.75 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        className={`absolute top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${dir === 'left' ? '-left-3' : '-right-3'}`}
        style={{
          background: 'rgba(20,18,14,0.92)',
          border: '1px solid rgba(226,181,109,0.2)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.6)',
          color: 'rgba(226,181,109,0.6)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          {dir === 'left' ? <path d="M15 18l-6-6 6-6"/> : <path d="M9 18l6-6-6-6"/>}
        </svg>
      </motion.button>
    )}
  </AnimatePresence>
);

// ── Success ───────────────────────────────────────────────────────────────────
const SuccessView: React.FC<{ product: Product | null; onClose: () => void }> = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center py-10 text-center"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 240, damping: 16, delay: 0.1 }}
      className="relative mb-6 flex h-20 w-20 items-center justify-center"
    >
      {/* Outer ring glow */}
      <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, rgba(226,181,109,0.2) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 rounded-full border border-[#E2B56D]/20" />
      <div className="flex h-14 w-14 items-center justify-center rounded-full text-2xl text-black" style={{ background: goldGrad }}>
        ✓
      </div>
    </motion.div>

    <h3 className="text-xl font-semibold text-white">Захиалга амжилттай!</h3>
    <p className="mt-3 text-sm leading-relaxed text-white/38">
      Таны урьдчилсан захиалгыг хүлээн авлаа.<br />Бид тантай удахгүй холбогдох болно.
    </p>

    <motion.button
      onClick={onClose}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative mt-7 overflow-hidden rounded-xl px-10 py-2.5 text-sm font-semibold text-black"
      style={{ background: goldGrad }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }}
        animate={{ x: ['-100%', '150%'] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
      />
      Хаах
    </motion.button>
  </motion.div>
);

// ── Main widget ───────────────────────────────────────────────────────────────
export const PreOrderWidget: React.FC = () => {
  const { pricePerGram, rateDate } = useGoldRate();

  const [open, setOpen]                             = useState(false);
  const [cart, setCart]                             = useState<Record<string, number>>({});
  const [collectionOpen, setCollectionOpen]         = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('Мөнгөн мод');
  const [name, setName]                             = useState('');
  const [phone, setPhone]                           = useState('');
  const [status, setStatus]                         = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Deep-link auto-open and optional app-provided customer prefill.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shouldOpenFromApp = params.get('preorder') === '1';

    if (shouldOpenFromApp) {
      const prefilledName = params.get('name')?.trim().slice(0, 100) ?? '';
      const prefilledPhone = (params.get('phone') ?? '').replace(/\D/g, '').slice(0, 15);

      setName(prefilledName);
      setPhone(prefilledPhone);
      setOpen(true);
    } else if (window.location.hash === '#/preorder') {
      setOpen(true);
    }

    const onHash = () => { if (window.location.hash === '#/preorder') setOpen(true); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // Carousel
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener('scroll', updateArrows, { passive: true });
    return () => el.removeEventListener('scroll', updateArrows);
  }, [updateArrows, open]);

  const scrollCards = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -260 : 260, behavior: 'smooth' });

  const goToMungunMod = () => {
    setCollectionOpen(false);
    handleClose();
    const doScroll = () =>
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.location.hash.startsWith('#/')) {
      window.location.hash = '';
      setTimeout(doScroll, 500);
    } else doScroll();
  };

  // Cart helpers
  const cartKey = (p: Product) => `${p.label}-${p.unit}`;
  const cartQty = (p: Product) => cart[cartKey(p)] ?? 0;
  const cartItems = PRODUCTS.filter(p => cartQty(p) > 0);
  const totalQty  = cartItems.reduce((s, p) => s + cartQty(p), 0);
  const totalPrice = cartItems.reduce((s, p) => s + p.grams * pricePerGram * cartQty(p), 0);
  const addToCart    = (p: Product) => setCart(c => ({ ...c, [cartKey(p)]: Math.min(99, (c[cartKey(p)] ?? 0) + 1) }));
  const removeFromCart = (p: Product) => setCart(c => {
    const next = { ...c };
    const n = (next[cartKey(p)] ?? 1) - 1;
    if (n <= 0) delete next[cartKey(p)]; else next[cartKey(p)] = n;
    return next;
  });

  const reset = () => {
    setCart({});
    setName('');
    setPhone('');
    setStatus('idle');
    setCollectionOpen(false);
    setSelectedCollection('Мөнгөн мод');
  };

  const handleClose = () => {
    setOpen(false);
    if (window.location.hash === '#/preorder') window.location.hash = '';
    setTimeout(reset, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'loading') return;
    setStatus('loading');
    if (IS_DEV) {
      await new Promise(r => setTimeout(r, 900));
      setStatus('success');
      return;
    }
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15_000);

    try {
      const response = await fetch(SHEET_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        signal: controller.signal,
        body: JSON.stringify({
          timestamp:  new Date().toISOString(),
          collection: selectedCollection,
          product:    cartItems.length > 0
            ? cartItems.map(p => `${p.label}${p.unit} ×${cartQty(p)}`).join(', ')
            : 'Сонгоогүй',
          qty:        totalQty,
          price:      cartItems.length > 0 ? fmt(totalPrice) : '—',
          name, phone,
        }),
      });
      if (!response.ok) throw new Error(`Pre-order request failed: ${response.status}`);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  return (
    <>
      {/* ── Floating trigger ─────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 overflow-hidden rounded-full px-5 py-3 text-sm font-semibold text-black"
        style={{
          background: goldGrad,
          boxShadow: `0 4px 24px rgba(226,181,109,0.55), 0 0 0 1px rgba(226,181,109,0.2), inset 0 1px 0 rgba(255,255,255,0.15)`,
        }}
      >
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)' }}
          animate={{ x: ['-100%', '160%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
        />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="relative">
          <path d="M12 2L2 9l10 13L22 9z"/>
        </svg>
        <span className="relative">Урьдчилсан захиалга</span>
      </motion.button>

      {/* ── Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="preorder-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div className="absolute inset-0 bg-black/88 backdrop-blur-lg" onClick={handleClose} />

            <motion.div
              initial={{ opacity: 0, y: 36, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl"
              style={{
                background: 'linear-gradient(160deg, #0d0c09 0%, #090907 50%, #0b0a08 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 50px 120px rgba(0,0,0,0.95), 0 0 0 1px rgba(226,181,109,0.06)',
              }}
            >
              {/* ── Ambient glow overlays ─────────────────────────────── */}
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(226,181,109,0.1) 0%, transparent 55%)' }} />
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse at 90% 100%, rgba(184,131,46,0.06) 0%, transparent 50%)' }} />

              {/* ── Top stripe — animated shimmer ─────────────────────── */}
              <div className="absolute inset-x-0 top-0 h-[1.5px] overflow-hidden">
                <div className="h-full" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(226,181,109,0.6) 30%, #E2B56D 50%, rgba(226,181,109,0.6) 70%, transparent 100%)' }} />
                <motion.div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent)', width: '30%' }}
                  animate={{ x: ['-40%', '160%'] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                />
              </div>

              {/* ── Corner accents ────────────────────────────────────── */}
              <div className="pointer-events-none absolute left-0 top-0 h-16 w-16" style={{ background: 'radial-gradient(circle at 0% 0%, rgba(226,181,109,0.08) 0%, transparent 70%)' }} />
              <div className="pointer-events-none absolute right-0 bottom-0 h-24 w-24" style={{ background: 'radial-gradient(circle at 100% 100%, rgba(184,131,46,0.06) 0%, transparent 70%)' }} />

              {/* ── Scrollable body ───────────────────────────────────── */}
              <div className="relative max-h-[88vh] overflow-y-auto p-5" style={{ scrollbarWidth: 'none' }}>

                {/* Close */}
                <button
                  onClick={handleClose}
                  aria-label="Хаах"
                  className="absolute right-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full text-white/20 transition-all hover:bg-white/6 hover:text-white/60"
                >
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13"/>
                  </svg>
                </button>

                {/* ── Header ──────────────────────────────────────────── */}
                <div className="mb-5 pr-8">
                  <div className="mb-2 flex items-center gap-2.5">
                    <div className="h-px flex-1 max-w-[32px]" style={{ background: 'linear-gradient(90deg, #E2B56D, transparent)' }} />
                    <span className="text-[9.5px] font-bold uppercase tracking-[0.25em]" style={{ color: 'rgba(226,181,109,0.65)' }}>
                      Fine Gold Nation
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-white">Урьдчилсан захиалга</h2>

                  {/* Ready date */}
                  <div
                    className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5"
                    style={{ border: '1px solid rgba(226,181,109,0.18)', background: 'rgba(226,181,109,0.05)' }}
                  >
                    <span className="text-[11px] text-white/55">Захиалга бэлэн болох хугацаа:</span>
                    <span className="text-[11.5px] font-semibold" style={{ color: GOLD }}>
                      ⏳ 2026 оны 9-р сарын эхээр
                    </span>
                  </div>
                </div>

                {status === 'success' ? (
                  <SuccessView product={null} onClose={handleClose} />
                ) : (
                  <form onSubmit={handleSubmit}>

                    {/* ── Коллекц section ──────────────────────────────── */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-white/62">
                          Бүтээгдэхүүн сонгох
                        </p>

                        {/* Коллекц chip */}
                        <motion.button
                          type="button"
                          onClick={() => setCollectionOpen(v => !v)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          className="relative flex items-center gap-2 overflow-hidden rounded-lg px-3.5 py-2"
                          style={{
                            background: collectionOpen
                              ? 'rgba(226,181,109,0.12)'
                              : 'rgba(226,181,109,0.06)',
                            border: `1px solid ${collectionOpen ? 'rgba(226,181,109,0.45)' : 'rgba(226,181,109,0.22)'}`,
                            boxShadow: collectionOpen
                              ? '0 0 16px rgba(226,181,109,0.2), inset 0 1px 0 rgba(226,181,109,0.08)'
                              : 'inset 0 1px 0 rgba(226,181,109,0.04)',
                            transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                          }}
                        >
                          {/* Shimmer */}
                          <motion.div
                            className="pointer-events-none absolute inset-0"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(226,181,109,0.12), transparent)' }}
                            animate={{ x: ['-120%', '220%'] }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                          />
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.7, flexShrink: 0 }}>
                            <path d="M12 22v-7"/><path d="M9 8l-5 7h16l-5-7"/>
                            <path d="M7 15l-3 7"/><path d="M17 15l3 7"/><path d="M12 8V2"/>
                          </svg>
                          <span className="text-[11.5px] font-semibold leading-none" style={{ color: GOLD }}>
                            Коллекц: {selectedCollection}
                          </span>
                          <motion.svg
                            animate={{ rotate: collectionOpen ? 180 : 0 }}
                            transition={{ duration: 0.22 }}
                            width="9" height="9" viewBox="0 0 24 24" fill="none"
                            stroke={GOLD} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            style={{ opacity: 0.55, flexShrink: 0 }}
                          >
                            <path d="M6 9l6 6 6-6"/>
                          </motion.svg>
                        </motion.button>
                      </div>

                      {/* Dropdown panel */}
                      <AnimatePresence>
                        {collectionOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, y: -4 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -4 }}
                            transition={{ duration: 0.22, ease: 'easeOut' }}
                            className="overflow-hidden"
                          >
                            <div
                              className="mb-3 overflow-hidden rounded-xl"
                              style={{ border: '1px solid rgba(226,181,109,0.1)', background: 'rgba(10,9,7,0.95)' }}
                            >
                              {COLLECTIONS.map((col, i) => (
                                <motion.div
                                  key={col.id}
                                  initial={{ opacity: 0, x: -8 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.06, duration: 0.16 }}
                                >
                                  {i > 0 && <div className="mx-4 h-px" style={{ background: 'rgba(255,255,255,0.045)' }} />}
                                  {col.available ? (
                                    <div className="group flex w-full items-center justify-between px-4 py-3 transition-colors duration-150 hover:bg-[#E2B56D]/[0.05]">
                                      <button
                                        type="button"
                                        onClick={() => { setSelectedCollection(col.name); setCollectionOpen(false); }}
                                        className="flex-1 text-left"
                                      >
                                        <p className="text-sm font-semibold text-white transition-colors group-hover:text-[#E2B56D]">
                                          {col.name}
                                        </p>
                                        <p className="text-[10px] text-white/58">{col.sub}</p>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={goToMungunMod}
                                        className="ml-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full transition-all"
                                        style={{ border: '1px solid rgba(226,181,109,0.18)', color: 'rgba(226,181,109,0.45)' }}
                                        title="Хэсгийг харах"
                                      >
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                                          <path d="M15 3h6v6"/><path d="M10 14L21 3"/>
                                        </svg>
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex w-full items-center justify-between px-4 py-3">
                                      <div className="text-left opacity-35">
                                        <p className="text-sm font-semibold text-white/70">{col.name}</p>
                                        <p className="text-[10px] text-white/30">{col.sub}</p>
                                      </div>
                                      <span
                                        className="rounded-full px-2.5 py-1 text-[10px] font-semibold text-black opacity-70"
                                        style={{ background: goldGrad }}
                                      >
                                        Тун удахгүй
                                      </span>
                                    </div>
                                  )}
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Carousel ─────────────────────────────────────── */}
                    <div className="relative">
                      <ArrowBtn dir="left"  visible={canLeft}  onClick={() => scrollCards('left')}  />
                      <ArrowBtn dir="right" visible={canRight} onClick={() => scrollCards('right')} />

                      {/* Edge fade on right */}
                      {canRight && (
                        <div className="pointer-events-none absolute right-0 top-0 z-[5] h-full w-12" style={{ background: 'linear-gradient(90deg, transparent, rgba(9,9,7,0.85))' }} />
                      )}

                      <div
                        ref={scrollRef}
                        className="flex gap-3 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                      >
                        {PRODUCTS.map(p => (
                          <ProductCard
                            key={`${p.label}-${p.unit}`}
                            product={p}
                            rate={pricePerGram}
                            qty={cartQty(p)}
                            onAdd={() => { addToCart(p); setStatus('idle'); }}
                            onRemove={() => removeFromCart(p)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* ── Rate panel ───────────────────────────────────── */}
                    <div
                      className="mt-4 flex overflow-hidden rounded-xl"
                      style={{ border: '1px solid rgba(226,181,109,0.1)', background: 'rgba(226,181,109,0.025)' }}
                    >
                      {/* Gold left accent */}
                      <div className="w-[3px] flex-shrink-0" style={{ background: 'linear-gradient(to bottom, rgba(226,181,109,0.5), #E2B56D, rgba(184,131,46,0.4))' }} />

                      <div className="flex flex-1 items-center justify-between gap-4 px-4 py-3.5">
                        <div className="flex flex-col items-start text-left">
                          <p className="text-[9.5px] font-semibold uppercase tracking-[0.22em] text-white/60">
                            Монголбанкны лавлагаа ханш
                          </p>
                          <div className="mt-1.5 flex items-baseline gap-2">
                            <span className="text-xl font-bold tracking-tight text-white">{fmt(pricePerGram)}</span>
                            <span className="text-xs text-white/60">/ 1г · 999.9</span>
                          </div>
                          <p className="mt-1.5 text-[10px] leading-relaxed text-white/65">
                            Монголбанкны өнөөдрийн ханшийг лавлагаа байдлаар танд харуулж байна.{' '}
                            <span className="font-medium text-white">
                              Захиалга баталгаажсан өдрийн ханшаар суурь үнэ тодорхойлогдох ба холбогдох татвар болон бусад хураамжийн дүн нэмэгдэж тооцогдоно.
                            </span>
                          </p>
                        </div>
                        <span
                          className="flex-shrink-0 rounded-lg px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/65"
                          style={{ border: '1px solid rgba(226,181,109,0.12)', background: 'rgba(226,181,109,0.04)' }}
                        >
                          {rateDate}
                        </span>
                      </div>
                    </div>

                    {/* ── Form ─────────────────────────────────────────── */}
                    <div className="mt-4 flex flex-col gap-3">

                      {/* Cart summary — only shown when items are in cart */}
                      <AnimatePresence>
                        {cartItems.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden rounded-xl"
                            style={{ border: '1px solid rgba(226,181,109,0.15)', background: 'rgba(226,181,109,0.03)' }}
                          >
                            <div className="px-4 py-3">
                              <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.2em] text-white/58">
                                Сонгосон бүтээгдэхүүн
                              </p>
                              {cartItems.map(p => (
                                <div key={cartKey(p)} className="flex items-center justify-between py-0.5">
                                  <span className="text-[12px] text-white/80">
                                    {p.label}{p.unit} × {cartQty(p)}ш
                                  </span>
                                  <span className="text-[12px] font-semibold" style={{ color: GOLD }}>
                                    {fmt(p.grams * pricePerGram * cartQty(p))}
                                  </span>
                                </div>
                              ))}
                              {cartItems.length > 1 && (
                                <div className="mt-2 flex items-center justify-between border-t border-white/[0.06] pt-2">
                                  <span className="text-[11px] font-semibold text-white/68">Нийт дүн</span>
                                  <span className="text-sm font-bold" style={{ color: GOLD }}>{fmt(totalPrice)}</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div>
                        <label className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/62">
                          Таны нэр
                        </label>
                        <input required type="text" value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white/62">
                          Таны утасны дугаар
                        </label>
                        <input
                          required
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]+"
                          value={phone}
                          onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                          className={inputCls}
                        />
                      </div>

                      {status === 'error' && (
                        <p className="rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2 text-sm text-red-400">
                          Алдаа гарлаа. Дахин оролдоно уу.
                        </p>
                      )}

                      {/* Priority note */}
                      <div
                        className="mt-1 flex items-start gap-2 rounded-xl px-3.5 py-2.5"
                        style={{ border: '1px solid rgba(226,181,109,0.12)', background: 'rgba(226,181,109,0.03)' }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1, opacity: 0.8 }}>
                          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.3L12 16.7 5.8 21.2l2.4-7.3L2 9.4h7.6z"/>
                        </svg>
                        <p className="text-[10.5px] leading-relaxed text-white/60">
                          Урьдчилсан захиалга илгээснээр, бүтээгдэхүүн бэлэн болмогц бид танд{' '}
                          <span className="font-medium text-white">тэргүүн ээлжинд</span> санал болгоно.
                        </p>
                      </div>

                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        disabled={status === 'loading'}
                        whileHover={{ scale: status === 'loading' ? 1 : 1.015 }}
                        whileTap={{ scale: status === 'loading' ? 1 : 0.98 }}
                        className="relative mt-1 w-full overflow-hidden rounded-xl py-4 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          background: goldGrad,
                          boxShadow: '0 4px 24px rgba(226,181,109,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                        }}
                      >
                        {/* Shimmer */}
                        {status !== 'loading' && (
                          <motion.div
                            className="pointer-events-none absolute inset-0"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                            animate={{ x: ['-100%', '160%'] }}
                            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                          />
                        )}
                        <span className="relative">
                          {status === 'loading' ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                              </svg>
                              Илгээж байна...
                            </span>
                          ) : 'Урьдчилсан захиалга илгээх'}
                        </span>
                      </motion.button>

                    </div>

                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
