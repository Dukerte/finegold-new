import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {
  backgroundParallax,
  listItem,
  staggerList,
} from '../../animations/variants';
import heroBackground from '../../assets/images/hero-background.svg';
import { useLocalization } from '../../hooks/useLocalization';
import { FloatingParticles } from '../common/FloatingParticles';
import { RegisterForm } from '../common/RegisterForm';
import { LazyGoldDashboardSection } from '../../utils/lazyLoad';

// ─── SLIDE DATA ───────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id: 0,
    title1: 'ҮЕ ДАМЖИХ',
    title2: 'ҮНЭТ ӨВ',
    subtitle:
      'Хөрөнгө оруулалтын хялбар, хүртээмжтэй, дэвшилтэт шийдэл. Гар утасны АПП болон ойр байрлах АТМ киоскоор дамжуулан ханшийн зөрүүгүй алт худалдаж авах, хадгалах, арилжах, удирдах боломжтой.',
    cta: 'Хөрөнгө оруулалтын тооцоолуур',
    ctaAction: 'calculator',
    // Gold sphere — uses the existing hero-background.svg
    bgGradient: 'from-black via-black/80 to-transparent',
    accentColor: '#E2B56D',
    // Right-side visual: decorative SVG orb (existing bg image handles it)
    visual: null,
  },
  {
    id: 1,
    title1: '24/7 АЛТНЫ',
    title2: 'ATM СҮЛЖЭЭ',
    subtitle:
      'Монгол даяар байрлах FGN Алтны ATM киоскоос шууд 999.9 сорьцтой алт худалдан авах боломж. Карт, QR, апп-аар төлбөр хийж, биет алтаа тэр даруй гартаа авна.',
    cta: 'ATM байршил харах',
    ctaAction: 'atm',
    bgGradient: 'from-black via-black/85 to-transparent',
    accentColor: '#C8A96E',
    visual: 'atm',
  },
  {
    id: 2,
    title1: 'ДИЖИТАЛ',
    title2: 'АЛТНЫ АПП',
    subtitle:
      'FGN мобайл апп-аар таны алтны хөрөнгийг хаанаас ч, хэзээ ч удирдах боломжтой. Худалдаж авах, зарах, хадгалах, бэлэглэх — бүгдийг нэг дороос.',
    cta: 'Апп татаж авах',
    ctaAction: 'app',
    bgGradient: 'from-black via-black/80 to-transparent',
    accentColor: '#F5D7A1',
    visual: 'app',
  },
  {
    id: 3,
    title1: 'ISO',
    title2: 'БАТАЛГААТАЙ',
    subtitle:
      'ISO 9001 · 14001 · 45001 олон улсын стандартаар баталгаажсан FGN платформ. Таны алтны хөрөнгө оруулалт, хадгалалт, арилжаа бүрэн даатгагдсан.',
    cta: 'Дэлгэрэнгүй',
    ctaAction: 'about',
    bgGradient: 'from-black via-black/80 to-transparent',
    accentColor: '#D4AF6A',
    visual: 'iso',
  },
];

// ─── ANIMATED GRADIENT BORDER BUTTON ─────────────────────────────────────────
const GoldBorderButton: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="relative px-7 py-3 rounded-xl font-display font-semibold text-white bg-transparent"
  >
    <motion.span
      className="absolute inset-0 rounded-xl p-[1px] bg-[linear-gradient(120deg,#E0B165,#FFD700,#FFF3B0,#FFD700,#E0B165)] bg-[length:200%_200%]"
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity }}
    >
      <span className="block h-full w-full rounded-xl bg-black" />
    </motion.span>
    <span className="relative z-10">{label}</span>
  </motion.button>
);

// ─── RIGHT-SIDE VISUALS PER SLIDE ─────────────────────────────────────────────
const SlideVisual: React.FC<{ type: string | null }> = ({ type }) => {
  if (!type) return null;

  if (type === 'atm') return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[55%] h-full pointer-events-none hidden lg:flex items-center justify-end">
      {/* ATM kiosk illustration using CSS shapes */}
      <div className="relative w-[340px] h-[520px]">
        {/* Glow */}
        <div className="absolute inset-0 bg-[#E2B56D]/15 blur-[80px] rounded-full" />
        {/* Machine body */}
        <div className="absolute inset-x-12 top-8 bottom-0 rounded-3xl border border-[#E2B56D]/30 bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] shadow-[0_0_60px_rgba(226,181,109,0.15)]">
          {/* Screen */}
          <div className="mx-6 mt-8 h-40 rounded-xl bg-gradient-to-br from-[#E2B56D]/20 to-[#E2B56D]/5 border border-[#E2B56D]/20 flex items-center justify-center">
            <div className="text-center">
              <div className="text-[#E2B56D] font-bold text-2xl">999.9</div>
              <div className="text-white/60 text-xs mt-1">FINE GOLD</div>
              <div className="mt-3 flex gap-1 justify-center">
                {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E2B56D]/60" />)}
              </div>
            </div>
          </div>
          {/* Card slot */}
          <div className="mx-10 mt-6 h-2 rounded-full bg-[#E2B56D]/20 border border-[#E2B56D]/10" />
          {/* Keypad */}
          <div className="mx-8 mt-5 grid grid-cols-3 gap-2">
            {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((k,i) => (
              <div key={i} className="h-8 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/40 text-xs">{k}</div>
            ))}
          </div>
          {/* Gold dispenser slot */}
          <div className="mx-14 mt-5 h-3 rounded-full bg-gradient-to-r from-[#E2B56D]/40 via-[#FFD700]/30 to-[#E2B56D]/40 shadow-[0_0_10px_rgba(226,181,109,0.4)]" />
          {/* Label */}
          <div className="text-center mt-4 text-[#E2B56D]/50 text-[10px] tracking-widest">FINE GOLD NATION</div>
        </div>
      </div>
    </div>
  );

  if (type === 'app') return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-full pointer-events-none hidden lg:flex items-center justify-end pr-16">
      <div className="relative w-[260px] h-[500px]">
        {/* Glow */}
        <div className="absolute inset-0 bg-[#E2B56D]/15 blur-[70px] rounded-full" />
        {/* Phone body */}
        <div className="absolute inset-0 rounded-[3rem] border-2 border-[#E2B56D]/30 bg-gradient-to-b from-[#111] to-[#0a0a0a] shadow-[0_0_80px_rgba(226,181,109,0.2)] overflow-hidden">
          {/* Notch */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 rounded-full bg-black border border-white/10" />
          {/* Screen content */}
          <div className="absolute inset-2 top-12 rounded-[2.5rem] bg-gradient-to-b from-[#0f0f0f] to-[#080808] p-4 overflow-hidden">
            {/* App header */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-[#E2B56D] text-xs font-bold">FGN</div>
              <div className="w-6 h-6 rounded-full bg-[#E2B56D]/20 border border-[#E2B56D]/30" />
            </div>
            {/* Gold price card */}
            <div className="rounded-2xl bg-gradient-to-br from-[#E2B56D]/20 to-[#C8A96E]/10 border border-[#E2B56D]/20 p-3 mb-3">
              <div className="text-white/50 text-[9px] mb-1">Алтны ханш</div>
              <div className="text-[#E2B56D] text-lg font-bold">₮250,000</div>
              <div className="text-green-400 text-[9px]">+2.4% өнөөдөр</div>
              {/* Mini chart */}
              <div className="flex items-end gap-0.5 mt-2 h-8">
                {[3,5,4,7,6,8,7,9,8,10].map((h,i) => (
                  <div key={i} className="flex-1 rounded-sm bg-[#E2B56D]/40" style={{height:`${h*8}%`}} />
                ))}
              </div>
            </div>
            {/* Quick actions */}
            <div className="grid grid-cols-2 gap-2">
              {['Худалдах','Зарах','Хадгалах','Бэлэглэх'].map((a,i) => (
                <div key={i} className="rounded-xl bg-white/[0.04] border border-white/10 p-2 text-center">
                  <div className="text-white/60 text-[9px]">{a}</div>
                </div>
              ))}
            </div>
            {/* Balance */}
            <div className="mt-3 rounded-xl bg-white/[0.03] border border-white/10 p-2 flex justify-between items-center">
              <div className="text-white/40 text-[9px]">Миний алт</div>
              <div className="text-[#E2B56D] text-xs font-semibold">12.5 гр</div>
            </div>
          </div>
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-16 h-1 rounded-full bg-white/20" />
      </div>
    </div>
  );

  if (type === 'iso') return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-full pointer-events-none hidden lg:flex items-center justify-end pr-20">
      <div className="relative flex flex-col gap-6">
        {/* Glow */}
        <div className="absolute inset-0 bg-[#E2B56D]/10 blur-[100px]" />
        {/* ISO badge cards */}
        {[
          { code: 'ISO 9001', label: 'Чанарын менежмент' },
          { code: 'ISO 14001', label: 'Байгаль орчны менежмент' },
          { code: 'ISO 45001', label: 'Хөдөлмөрийн аюулгүй байдал' },
        ].map((iso, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 0.3, duration: 0.6 }}
            className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-[#E2B56D]/25 bg-gradient-to-r from-[#E2B56D]/10 to-transparent backdrop-blur-sm"
          >
            <div className="w-12 h-12 rounded-full border-2 border-[#E2B56D]/40 flex items-center justify-center shrink-0">
              <div className="text-[#E2B56D] font-bold text-[10px] text-center leading-tight">ISO<br/>✓</div>
            </div>
            <div>
              <div className="text-[#E2B56D] font-bold text-base">{iso.code}</div>
              <div className="text-white/50 text-xs mt-0.5">{iso.label}</div>
            </div>
          </motion.div>
        ))}
        {/* Insurance badge */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center shrink-0 text-white/60 text-xs font-bold">АГИС</div>
          <div>
            <div className="text-white/80 font-semibold text-sm">Агис Даатгал</div>
            <div className="text-white/40 text-xs mt-0.5">Бүрэн даатгагдсан</div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return null;
};

// ─── HERO CAROUSEL ────────────────────────────────────────────────────────────
const HeroCarousel: React.FC = () => {
  const { t } = useLocalization();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent(index);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % SLIDES.length, 1);
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + SLIDES.length) % SLIDES.length, -1);
  }, [current, goTo]);

  // Auto-advance every 5s
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(next, 5000);
    return () => clearTimeout(id);
  }, [current, paused, next]);

  const slide = SLIDES[current];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  const handleCta = () => {
    if (slide.ctaAction === 'calculator') {
      document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' });
    } else if (slide.ctaAction === 'atm') {
      document.getElementById('atm-locations')?.scrollIntoView({ behavior: 'smooth' });
    } else if (slide.ctaAction === 'app') {
      document.getElementById('features-app')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-[80px] lg:pt-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slide content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.55, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0 flex items-center"
        >
          {/* Per-slide background tint */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse at 70% 50%, ${slide.accentColor}18 0%, transparent 65%)`,
            }}
          />

          {/* Right-side visual */}
          <SlideVisual type={slide.visual} />

          {/* Left content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
            <div className="max-w-2xl">

              {/* Slide counter pill */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50 backdrop-blur-sm"
              >
                <span className="text-[#E2B56D] font-semibold">{String(current + 1).padStart(2,'0')}</span>
                <span>/</span>
                <span>{String(SLIDES.length).padStart(2,'0')}</span>
              </motion.div>

              {/* Title */}
              <div className="mb-6 font-manrope font-semibold leading-[1.03] tracking-tight">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-5xl md:text-7xl text-white"
                >
                  {slide.title1}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="text-5xl md:text-7xl gold-shimmer"
                >
                  {slide.title2}
                </motion.div>
              </div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="font-inter text-base text-white/75 sm:text-lg leading-relaxed max-w-xl"
              >
                {slide.subtitle}
              </motion.p>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="mt-8"
              >
                <GoldBorderButton label={slide.cta} onClick={handleCta} />
              </motion.div>

            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── CONTROLS ── */}
      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20
          w-11 h-11 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm
          flex items-center justify-center text-white/60
          hover:border-[#E2B56D]/50 hover:text-[#E2B56D] hover:bg-black/60
          transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        onClick={next}
        className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20
          w-11 h-11 rounded-full border border-white/15 bg-black/40 backdrop-blur-sm
          flex items-center justify-center text-white/60
          hover:border-[#E2B56D]/50 hover:text-[#E2B56D] hover:bg-black/60
          transition-all duration-300"
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Dot indicators + progress bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === current ? 32 : 16 }}
              aria-label={`Go to slide ${i + 1}`}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full" />
              {i === current && (
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#E2B56D]"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: paused ? 0 : 5, ease: 'linear' }}
                  key={`${current}-${paused}`}
                />
              )}
            </button>
          ))}
        </div>
      </div>

    </section>
  );
};

// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
export const HeroSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormSuccess = () => {};

  return (
    <div className='relative overflow-hidden bg-black'>
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Persistent hero background (gold sphere SVG) */}
      <motion.div
        className='absolute inset-0 h-screen w-full'
        variants={backgroundParallax}
        initial='hidden'
        animate='visible'
      >
        <div className='absolute inset-0'>
          <img
            src={heroBackground}
            alt='Hero background'
            className='h-full w-full object-cover object-right-center'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/50' />
        </div>
      </motion.div>

      {/* CAROUSEL */}
      <HeroCarousel />

      {/* ISO SECTION — PREMIUM FINAL */}
<motion.div
  className="mt-20 w-full"
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}
  transition={{ duration: 0.8, ease: 'easeOut' }}
>
  <div className="max-w-7xl mx-auto px-6">

    <div className="overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-12 py-10 min-w-max
                      bg-gradient-to-r from-black/40 via-black/30 to-black/10
                      backdrop-blur-xl
                      border-t border-white/10 relative">

        {/* subtle glow line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2B56D]/10 to-transparent blur-2xl pointer-events-none" />

        {/* LEFT TEXT */}
        <div className="text-white/70 text-sm md:text-base leading-snug min-w-[160px]">
          Олон улсын стандартаар <br />
          баталгаажсан
        </div>

        {/* ISO LOGOS */}
        <div className="flex items-center gap-14">

          {[
            "/partners/iso9001.png",
            "/partners/iso14001.png",
            "/partners/iso45001.png",
          ].map((src, i) => (
            <div
              key={i}
              className="relative group"
            >
              {/* glow */}
              <div className="absolute inset-0 rounded-full bg-[#E2B56D]/0 group-hover:bg-[#E2B56D]/10 blur-xl transition duration-500" />

              <img
                src={src}
                className="relative h-16 md:h-24 object-contain
                           opacity-60
                           transition-all duration-500 ease-out
                           group-hover:opacity-100
                           group-hover:scale-110
                           group-hover:brightness-125
                           group-hover:drop-shadow-[0_0_18px_rgba(255,215,150,0.35)]"
              />
            </div>
          ))}

        </div>

        {/* RIGHT TEXT */}
        <div className="text-white/70 text-sm md:text-base leading-snug max-w-[280px] min-w-[220px]">
          Алтны хөрөнгө оруулалт, хадгалалт, арилжаа,
          системийн аюулгүй байдал бүрэн даатгагдсан
        </div>

        {/* INSURANCE */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-[#E2B56D]/0 group-hover:bg-[#E2B56D]/10 blur-xl transition duration-500" />
          <img
            src="/partners/insurance.png"
            className="relative h-12 md:h-14 object-contain opacity-80
                       transition-all duration-500 ease-out
                       group-hover:opacity-100
                       group-hover:scale-105
                       group-hover:brightness-125
                       group-hover:drop-shadow-[0_0_18px_rgba(255,215,150,0.35)]"
          />
        </div>

      </div>
    </div>

  </div>
</motion.div>

{/* ===== DASHBOARD INSERT ===== */}
<div className="relative z-20 -mt-32 px-6">
  <div className="max-w-7xl mx-auto">
    <LazyGoldDashboardSection />
  </div>
</div>

{/* PREMIUM FEATURES SECTION */}
<section className="py-32 px-6 bg-black text-white">

  <div className="max-w-7xl mx-auto">

    {/* TITLE */}
    <motion.div
      className="relative z-10 mb-20 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
        ДИЖИТАЛ ЭКОСИСТЕМ
      </h2>

      <p className="relative z-10 mt-4 max-w-2xl text-white/60 text-base leading-relaxed">
        Олон улс болон Монгол улсын стандарт хангасан (ISO 22001) Алт худалдан авах,
        зарах, хадгалах, арилжих боломжийг танд 24/7 санал болгож байна.
      </p>
    </motion.div>

    {/* GRID WRAPPER */}
    <div className="relative">

      {/* AMBIENT GOLD LIGHT */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 top-0 w-[500px] h-[500px] bg-[#E2B56D]/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 w-[500px] h-[500px] bg-[#E2B56D]/10 blur-[120px]" />
      </div>

      {/* GRID */}
      <motion.div
        className="relative z-10 grid md:grid-cols-2 gap-8"
        variants={staggerList}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >

        {[
          {
            img: "/images/gold-bars.png",
            title: "999.9 цэвэр алт",
            desc: "1гр-100гр хүртэл төрөл бүрийн сонголт"
          },
          {
            img: "/images/kiosk.png",
            title: "Алтны киоск",
            desc: "24/7 шууд худалдан авах боломж"
          },
          {
            img: "/images/app.png",
            title: "Гар утасны апп",
            desc: "Хаанаас ч удирдах боломж"
          },
          {
            img: "/images/gift.png",
            title: "Үе дамжих үнэт өв",
            desc: "Бэлэг болон хөрөнгө оруулалт"
          }
        ].map((card, i) => (

          <motion.div
            key={i}
            variants={listItem}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="
              group relative rounded-2xl overflow-hidden
              border border-white/10 bg-white/[0.03]
              backdrop-blur-xl
              transition-all duration-500
              hover:border-[#E2B56D]/40
              hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
            "
          >

            {/* GLOW ON HOVER */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-10 bg-gradient-to-br from-[#E2B56D]/20 to-transparent blur-3xl" />
            </div>

            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={card.img}
                className="
                  w-full h-64 object-cover
                  transition duration-700
                  group-hover:scale-110
                "
              />
            </div>

            {/* GLASS OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

            {/* CONTENT */}
            <div className="relative p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">
                {card.title}
              </h3>

              <p className="text-white/60 text-sm">
                {card.desc}
              </p>
            </div>

          </motion.div>

        ))}

      </motion.div>
    </div>

  </div>
</section>

      {/* Registration Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        center
        showCloseIcon={false}
        styles={{
          modal: {
            backgroundColor: 'transparent',
            width: '90%',
            height: 'auto',
            maxWidth: '540px',
            maxHeight: '90vh',
            minHeight: '430px',
            padding: '0',
            // Responsive: on mobile, set fixed dimensions 326x386
            ...(window.innerWidth <= 640
              ? {
                  width: '326px',
                  height: '386px',
                  minHeight: '386px',
                  maxWidth: '326px',
                  maxHeight: '386px',
                }
              : {}),
          },
        }}
      >
        <RegisterForm
          onSuccess={handleFormSuccess}
          onError={message => {
            console.error('Registration error:', message);
          }}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};
