import { motion } from 'motion/react';
import { useState } from 'react';
import logo from '../assets/images/logo.svg';
import bgDecor from '../assets/images/background.svg';
import { Footer } from '../components/layout/Footer';
import { Vision2030Section } from '../components/sections/Vision2030Section';

// ─── ICONS ───────────────────────────────────────────────────────────────────
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" />
  </svg>
);
const IconLightbulb = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <line x1="9" y1="18" x2="15" y2="18" /><line x1="10" y1="22" x2="14" y2="22" />
    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 018.91 14" />
  </svg>
);
const IconGlobe = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);
const IconEye = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconZoom = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const VALUES = [
  { icon: <IconShield />,    title: 'Итгэлцэл',         desc: 'Хэрэглэгчийн хөрөнгийг хамгаалах баталгаа' },
  { icon: <IconLightbulb />, title: 'Шинэчлэл',         desc: 'Технологид суурилсан дэвшилтэт шийдэл' },
  { icon: <IconGlobe />,     title: 'Тогтвортой байдал', desc: 'Олон улсын ISO стандарт, нэгдсэн менежментийн тогтсон үйл ажиллагаа' },
  { icon: <IconEye />,       title: 'Нээлттэй байдал',  desc: 'Ил тод, хариуцлагатай удирдлага' },
];

const MISSIONS = [
  'Алтны хуримтлал, худалдаа, зээлийн үйлчилгээг олон улсын стандартад нийцүүлэн хүргэх',
  'Хэрэглэгчийн итгэл дээр суурилсан тогтвортой бизнесийн орчин бий болгох',
  'Аялал жуулчлал, хөрөнгө оруулалт, дотоодын санхүүгийн салбарт шинэ зах зээл бий болгох',
];

const ISO_CERTS = [
  { code: 'ISO 9001',  year: '2015', label: 'Чанарын менежментийн тогтолцоо' },
  { code: 'ISO 14001', year: '2015', label: 'Байгаль орчны менежментийн тогтолцоо' },
  { code: 'ISO 45001', year: '2018', label: 'ХЭМАБ менежментийн тогтолцоо' },
];

const COMMITMENTS = [
  'Хэрэглэгчийн хэрэгцээ, хүлээлтийг хангаж, итгэл, сэтгэл ханамжийг тасралтгүй дээшлүүлнэ',
  'Бүтээгдэхүүн, үйлчилгээний чанар, найдвартай байдлыг тогтвортой хангана',
  'Ажилтнуудын эрүүл мэнд, аюулгүй байдлыг хамгаалж, осол, мэргэжлээс шалгаалах өвчлөлөөс урьдчилан сэргийлнэ',
  'Аюул, эрсдэлийг тодорхойлон хянаж, аюулгүй ажлын байрны орчныг бүрдүүлнэ',
  'Байгаль орчинд үзүүлэх сөрөг нөлөөллийг бууруулж, бохирдлоос урьдчилан сэргийлнэ',
  'Чанар, байгаль орчин, ХЭМАБ-тай холбоотой зорилго, зорилтыг тодорхойлж, хэрэгжилтийг сайжруулна',
];

const CERTIFICATES = [
  { img: '/certificates/iso-cert-1.png',      label: 'ISO 14001:2015', desc: 'Байгаль орчны менежментийн тогтолцооны гэрчилгээ' },
  { img: '/certificates/iso-cert-2.png',      label: 'ISO 9001:2015',  desc: 'Чанарын менежментийн тогтолцооны гэрчилгээ' },
  { img: '/certificates/iso-cert-3.png',      label: 'ISO 45001:2018', desc: 'ХЭМАБ менежментийн тогтолцооны гэрчилгээ' },
  { img: '/certificates/license-special-1.png', label: 'Тусгай зөвшөөрөл',  desc: 'Файн Гоулд Нэйшн ХХК — Тусгай зөвшөөрөл' },
  { img: '/certificates/license-umyet-1.png',   label: 'ҮМҮЭТ Зөвшөөрөл',   desc: 'Үнэт металл үйлдвэрлэл, эрдэнийн тогтолцооны тодорхойлолт' },
];

// ─── ANIMATION HELPERS ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.65, ease: 'easeOut', delay },
});

// ─── SECTION LABEL ────────────────────────────────────────────────────────────
// Gold line + small uppercase label — used above every section h2.
const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 flex items-center gap-3">
    <div className="h-px w-10 shrink-0 bg-[#E2B56D]" />
    <span className="text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
      {children}
    </span>
  </div>
);

// ─── ISO BADGE ────────────────────────────────────────────────────────────────
const IsoBadge = ({ code, year, label }: { code: string; year: string; label: string }) => (
  <motion.div
    {...fadeUp(0.05)}
    className="
      group flex flex-col items-center gap-4 rounded-3xl
      border border-white/8 bg-white/[0.025]
      p-7 text-center backdrop-blur-sm
      transition-all duration-500
      hover:border-[#E2B56D]/35 hover:bg-white/[0.04]
    "
  >
    <div className="relative flex h-20 w-20 items-center justify-center">
      <svg viewBox="0 0 80 80" className="absolute inset-0 h-full w-full">
        <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(226,181,109,0.25)" strokeWidth="1.5" />
        <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(226,181,109,0.12)" strokeWidth="1" />
        {Array.from({ length: 24 }).map((_, i) => {
          const rad = ((i * 360) / 24 * Math.PI) / 180;
          return <line key={i} x1={40 + 34 * Math.cos(rad)} y1={40 + 34 * Math.sin(rad)} x2={40 + 37 * Math.cos(rad)} y2={40 + 37 * Math.sin(rad)} stroke="rgba(226,181,109,0.3)" strokeWidth="1" />;
        })}
      </svg>
      <div className="relative z-10 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#E2B56D]/70">ISO</p>
        <p className="text-[13px] font-black leading-tight text-white">{code.replace('ISO ', '')}</p>
      </div>
    </div>
    <div>
      <p className="text-lg font-bold text-white">{code}</p>
      <p className="text-xs font-semibold tracking-widest text-[#E2B56D]/70">:{year}</p>
    </div>
    <p className="text-xs leading-relaxed text-white/50">{label}</p>
  </motion.div>
);

// ─── CERTIFICATE CARD ─────────────────────────────────────────────────────────
const CertCard = ({ img, label, desc, index, onOpen }: { img: string; label: string; desc: string; index: number; onOpen: () => void }) => (
  <motion.div
    {...fadeUp(index * 0.07)}
    onClick={onOpen}
    className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] transition-all duration-400 hover:border-[#E2B56D]/35 hover:shadow-[0_16px_60px_rgba(0,0,0,0.5)]"
  >
    <div className="relative overflow-hidden bg-white/5" style={{ aspectRatio: '0.707' }}>
      <img src={img} alt={label} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-[#E2B56D] opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <IconZoom />
      </div>
    </div>
    <div className="p-4 text-left">
      <p className="text-sm font-bold text-white">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-white/45">{desc}</p>
    </div>
  </motion.div>
);

// ─── LIGHTBOX ─────────────────────────────────────────────────────────────────
const Lightbox = ({ img, label, onClose }: { img: string; label: string; onClose: () => void }) => (
  <motion.div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/92 px-4 backdrop-blur-sm"
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    onClick={onClose}
  >
    <motion.div
      className="relative max-h-[92vh] w-full max-w-2xl"
      initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={e => e.stopPropagation()}
    >
      <img src={img} alt={label} className="h-full w-full rounded-2xl object-contain shadow-[0_40px_120px_rgba(0,0,0,0.8)]" />
      <button onClick={onClose} className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/80 text-white/60 backdrop-blur-sm transition hover:text-[#E2B56D]">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </button>
      <p className="mt-3 text-center text-xs text-white/40">{label}</p>
    </motion.div>
  </motion.div>
);

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export const AboutPage = () => {
  const [lightbox, setLightbox] = useState<{ img: string; label: string } | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ── STICKY MINI HEADER ── */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-white/8 bg-black/90 px-6 py-3.5 backdrop-blur-xl">
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.location.hash = ''; }}
          className="flex items-center gap-2 text-[13px] font-medium text-white/50 transition-colors duration-200 hover:text-[#E2B56D]"
        >
          <IconArrowLeft />
          Нүүр хуудас
        </a>
        <img src={logo} alt="FGN" className="h-8 w-auto object-contain" />
        {/* Balance spacer — same approx width as back link */}
        <div className="w-[110px]" />
      </div>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-6 pb-16 pt-20 text-left">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[#E2B56D]/6 blur-[160px]" />
          <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#E2B56D]/4 blur-[120px]" />
          {/* background.svg — top right */}
          <img
            src={bgDecor}
            alt=""
            className="pointer-events-none absolute -right-24 -top-24 w-[560px] select-none opacity-[0.06]"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Two-column hero — both columns top-aligned */}
          <div className="grid gap-10 lg:grid-cols-[44%_56%] lg:gap-16 lg:items-start">
            <motion.div {...fadeUp()} className="text-left">
              <SectionLabel>Fine Gold Nation</SectionLabel>
              <h1 className="text-left text-[clamp(2.75rem,6vw,4.5rem)] font-bold leading-[1.1] tracking-tight">
                БИДНИЙ{' '}
                <span className="gold-shimmer">ТУХАЙ</span>
              </h1>
            </motion.div>

            <motion.div {...fadeUp(0.15)} className="flex flex-col gap-6">
              <p className="text-[15px] leading-[1.75] text-white/60 md:text-base">
                "Файн Гоулд Нэйшн" ХХК нь Монгол Улсын хууль тогтоомж болон олон
                улсын стандартын шаардлагад нийцсэн нэгдсэн менежментийн
                тогтолцоог алтан бүтээгдэхүүн үйлдвэрлэл, хуримтлал, арилжаа,
                санхүүгийн үйлчилгээний бүхий л{' '}
                <span className="font-medium text-white">
                  үйл ажиллагаандаа хэрэгжүүлнэ.
                </span>
              </p>

              {/* Stat grid — 2×2 premium gold cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '999.9 сорьц чанартай', sub: 'Даатгагсан алт' },
                  { label: 'ISO стандартуудаар', sub: 'Баталгаажсан' },
                  { label: '24/7 — тасралтгүй, аюулгүй', sub: 'Үйлчилгээ' },
                  { label: 'Дижитал + Биет', sub: 'Нэгдсэн экосистем' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.03, y: -2 }}
                    transition={{ duration: 0.2 }}
                    className="
                      group relative overflow-hidden rounded-2xl
                      border border-[#E2B56D]/20 bg-[#E2B56D]/[0.04]
                      px-4 py-3.5 cursor-default
                      transition-colors duration-300
                      hover:border-[#E2B56D]/50 hover:bg-[#E2B56D]/[0.08]
                    "
                  >
                    {/* Shimmer on hover */}
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#E2B56D]/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    {/* Top gold line */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2B56D]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="relative text-[13px] font-semibold leading-snug text-white">{s.label}</p>
                    <p className="relative mt-0.5 text-xs text-[#E2B56D]/60">{s.sub}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ҮНЭТ ЗҮЙЛС ── */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#E2B56D]/4 blur-[140px]" />
          {/* background.svg — bottom left */}
          <img
            src={bgDecor}
            alt=""
            className="pointer-events-none absolute -bottom-24 -left-24 w-[480px] select-none opacity-[0.05]"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          {/* Two-col header — label+title LEFT, desc RIGHT */}
          <div className="mb-14 grid gap-10 lg:grid-cols-[48%_52%] lg:items-end">
            <motion.div {...fadeUp()} className="text-left">
              <SectionLabel>Бидний зарчим</SectionLabel>
              <h2 className="text-left text-4xl font-semibold tracking-tight text-white md:text-5xl">ҮНЭТ ЗҮЙЛС</h2>
            </motion.div>
            <motion.div {...fadeUp(0.12)}>
              <p className="text-left text-base leading-relaxed text-white/55">
                Хэрэглэгчийн итгэл, технологийн шинэчлэл, тогтвортой стандарт болон ил тод
                удирдлага — эдгээр дөрвөн зарчим бидний үйл ажиллагааны суурь болно.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v, i) => (
              <motion.div key={i} {...fadeUp(i * 0.08)}
                className="group relative overflow-hidden rounded-3xl border border-white/8 bg-white/[0.025] p-7 text-left backdrop-blur-sm transition-all duration-500 hover:border-[#E2B56D]/35 hover:bg-white/[0.04]"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[#E2B56D]/10 to-transparent blur-3xl" />
                </div>
                <div className="relative z-10">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#E2B56D]/25 bg-[#E2B56D]/10 text-[#E2B56D]">
                    {v.icon}
                  </div>
                  <h3 className="mb-2 text-base font-bold text-white">{v.title}</h3>
                  <p className="text-sm leading-relaxed text-white/50">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ЭРХЭМ ЗОРИЛГО ── */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#E2B56D]/4 blur-[140px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">
          {/*
            2-column: LEFT = [title + icon side-by-side] | RIGHT = missions
            This makes both gaps (title→icon and icon→missions) equal to the
            same flex/grid gap — no more asymmetric whitespace.
          */}
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">

            {/* LEFT BLOCK: label+title beside the icon */}
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">

              {/* Text */}
              <motion.div {...fadeUp()} className="shrink-0 text-left">
                <SectionLabel>Бидний зорилго</SectionLabel>
                <h2 className="text-left text-4xl font-semibold tracking-tight text-white md:text-5xl">
                  ЭРХЭМ<br />ЗОРИЛГО
                </h2>
              </motion.div>

              {/* Animated radar icon */}
              <motion.div
                {...fadeUp(0.1)}
                className="flex shrink-0 items-center justify-center"
              >
                <div className="relative flex h-44 w-44 items-center justify-center">

                  {/* Pulsing ambient glow */}
                  <motion.div
                    className="pointer-events-none absolute inset-2 rounded-full bg-[#E2B56D]/10 blur-[44px]"
                    animate={{ opacity: [0.35, 0.85, 0.35], scale: [0.88, 1.08, 0.88] }}
                    transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <svg
                    viewBox="0 0 160 160"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10 h-full w-full"
                    overflow="visible"
                  >
                    {/* Outer ring — slow CW rotation with tick marks */}
                    <motion.g
                      animate={{ rotate: 360 }}
                      transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    >
                      <circle cx="80" cy="80" r="74" stroke="rgba(226,181,109,0.10)" strokeWidth="1" />
                      {Array.from({ length: 32 }).map((_, k) => {
                        const a = (k * 360 / 32) * (Math.PI / 180);
                        const isMajor = k % 4 === 0;
                        return (
                          <line
                            key={k}
                            x1={80 + 70 * Math.cos(a)} y1={80 + 70 * Math.sin(a)}
                            x2={80 + (isMajor ? 76 : 73) * Math.cos(a)}
                            y2={80 + (isMajor ? 76 : 73) * Math.sin(a)}
                            stroke={`rgba(226,181,109,${isMajor ? 0.45 : 0.2})`}
                            strokeWidth={isMajor ? 1.5 : 1}
                          />
                        );
                      })}
                    </motion.g>

                    {/* Second ring — CCW dashed */}
                    <motion.circle
                      cx="80" cy="80" r="60"
                      stroke="rgba(226,181,109,0.18)"
                      strokeWidth="1"
                      strokeDasharray="5 9"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    />

                    {/* Static inner rings */}
                    <circle cx="80" cy="80" r="44" stroke="rgba(226,181,109,0.20)" strokeWidth="1.5" />
                    <circle cx="80" cy="80" r="28" stroke="rgba(226,181,109,0.38)" strokeWidth="1.5" />
                    <circle cx="80" cy="80" r="12" stroke="rgba(226,181,109,0.65)" strokeWidth="2" />

                    {/* Centre dot — pulsing */}
                    <motion.circle
                      cx="80" cy="80" r="4"
                      fill="#E2B56D"
                      animate={{ opacity: [0.6, 1, 0.6], r: [3.5, 4.5, 3.5] as unknown as number }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Arrow top-right → centre */}
                    <line x1="126" y1="34" x2="85" y2="75" stroke="#E2B56D" strokeWidth="1.8" strokeLinecap="round" />
                    <polygon points="82,69 91,67 92,76" fill="#E2B56D" />

                    {/* Cardinal dots */}
                    <circle cx="80"  cy="6"   r="2.5" fill="rgba(226,181,109,0.35)" />
                    <circle cx="154" cy="80"  r="2.5" fill="rgba(226,181,109,0.35)" />
                    <circle cx="80"  cy="154" r="2.5" fill="rgba(226,181,109,0.20)" />
                    <circle cx="6"   cy="80"  r="2.5" fill="rgba(226,181,109,0.20)" />
                  </svg>
                </div>
              </motion.div>
            </div>

            {/* RIGHT: mission cards */}
            <motion.div {...fadeUp(0.2)} className="space-y-3">
              {MISSIONS.map((m, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ duration: 0.2 }}
                  className="
                    group relative flex gap-4 overflow-hidden
                    rounded-2xl border border-[#E2B56D]/15
                    bg-[#E2B56D]/[0.04] p-5 text-left
                    transition-colors duration-300
                    hover:border-[#E2B56D]/40 hover:bg-[#E2B56D]/[0.08]
                  "
                >
                  {/* Shimmer sweep */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#E2B56D]/8 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  {/* Top gold line */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2B56D]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E2B56D]/35 bg-[#E2B56D]/10 text-xs font-bold text-[#E2B56D]">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <p className="relative text-left text-[14px] leading-relaxed text-white/65">{m}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VISION 2030 — reuse the exact home page section ── */}
      <Vision2030Section />

      {/* ── ISO СТАНДАРТ ── */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-80 w-[600px] -translate-x-1/2 rounded-full bg-[#E2B56D]/4 blur-[140px]" />
          {/* background.svg — bottom right */}
          <img
            src={bgDecor}
            alt=""
            className="pointer-events-none absolute -bottom-16 -right-16 w-[500px] select-none opacity-[0.07]"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">

          {/* Two-column header */}
          <div className="mb-14 grid gap-10 lg:grid-cols-[48%_52%] lg:items-end">
            <motion.div {...fadeUp()} className="text-left">
              <SectionLabel>Олон улсын баталгаа</SectionLabel>
              <h2 className="text-left text-4xl font-semibold tracking-tight text-white md:text-5xl">
                НЭГДСЭН<br />МЕНЕЖМЕНТИЙН<br />ТОГТОЛЦОО
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.12)}>
              <p className="text-left text-base leading-relaxed text-white/60">
                "Файн Гоулд Нэйшн" ХХК нь Монгол Улсын хууль тогтоомж, олон улсын
                стандартын шаардлагад нийцсэн Нэгдсэн менежментийн тогтолцоог алтан
                бүтээгдэхүүн үйлдвэрлэл, алтны хуримтлал, арилжаа, санхүүгийн
                үйлчилгээний бүхий л үйл ажиллагаандаа хэрэгжүүлнэ.
              </p>
            </motion.div>
          </div>

          {/* ISO badges */}
          <div className="mb-14 grid gap-5 sm:grid-cols-3">
            {ISO_CERTS.map((cert, i) => <IsoBadge key={i} {...cert} />)}
          </div>

          {/* Policy commitments */}
          <motion.div {...fadeUp(0.1)}
            className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.025] p-8 backdrop-blur-sm md:p-10"
          >
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#E2B56D]/6 blur-[100px]" />
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-[#E2B56D]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#E2B56D]">
                  Бид дараах амлалтыг өгнө
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {COMMITMENTS.map((c, i) => (
                  <motion.div
                    key={i}
                    {...fadeUp(i * 0.07)}
                    whileHover={{ scale: 1.015, x: 3 }}
                    transition={{ duration: 0.22 }}
                    className="
                      group relative flex gap-3 overflow-hidden
                      rounded-2xl border border-white/7 bg-black/30
                      p-4 text-left
                      transition-all duration-350
                      hover:border-[#E2B56D]/28 hover:bg-[#E2B56D]/[0.04]
                      hover:shadow-[0_8px_32px_rgba(0,0,0,0.35)]
                    "
                  >
                    {/* Left accent bar — slides in on hover */}
                    <div className="absolute inset-y-0 left-0 w-[2px] origin-bottom scale-y-0 rounded-full bg-gradient-to-t from-[#E2B56D]/0 via-[#E2B56D]/70 to-[#E2B56D]/0 transition-transform duration-400 group-hover:scale-y-100" />

                    {/* Shimmer sweep */}
                    <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#E2B56D]/5 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {/* Check icon */}
                    <div className="
                      relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center
                      rounded-full border border-[#E2B56D]/30 bg-[#E2B56D]/10
                      text-[#E2B56D] transition-all duration-300
                      group-hover:border-[#E2B56D]/55 group-hover:bg-[#E2B56D]/18
                    ">
                      <IconCheck />
                    </div>

                    {/* Text */}
                    <p className="
                      relative text-left text-[13px] leading-relaxed
                      text-white/55 transition-colors duration-300
                      group-hover:text-white/78
                    ">{c}</p>
                  </motion.div>
                ))}
              </div>
              <p className="mt-8 border-t border-white/6 pt-6 text-left text-[13px] leading-relaxed text-white/35">
                Энэхүү бодлого нь байгууллагын бүх түвшинд мөрдөгдөж, Нэгдсэн
                менежментийн тогтолцоог тасралтгүй сайжруулах үндэс болно.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ГЭРЧИЛГЭЭ & ЗӨВШӨӨРӨЛ ── */}
      <section className="relative overflow-hidden px-6 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-1/2 h-80 w-96 -translate-y-1/2 rounded-full bg-[#E2B56D]/4 blur-[150px]" />
          {/* background.svg — top left */}
          <img
            src={bgDecor}
            alt=""
            className="pointer-events-none absolute -left-24 -top-16 w-[460px] select-none opacity-[0.05]"
            style={{ mixBlendMode: 'screen' }}
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl">

          {/* Two-column header */}
          <div className="mb-14 grid gap-10 lg:grid-cols-[48%_52%] lg:items-end">
            <motion.div {...fadeUp()} className="text-left">
              <SectionLabel>Баримт бичиг</SectionLabel>
              <h2 className="text-left text-4xl font-semibold tracking-tight text-white md:text-5xl">
                ГЭРЧИЛГЭЭ &<br />ЗӨВШӨӨРӨЛ
              </h2>
            </motion.div>
            <motion.div {...fadeUp(0.12)}>
              <p className="text-left text-base leading-relaxed text-white/60">
                Fine Gold Nation ХХК нь олон улсын ISO стандарт болон холбогдох
                зохицуулалтын байгууллагын бүрэн зөвшөөрөлтэй үйл ажиллагаа явуулж байна.
                Доорх гэрчилгээнүүдийг дарж томруулж үзэх боломжтой.
              </p>
            </motion.div>
          </div>

          {/* 3 ISO certs */}
          <div className="mb-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">ISO Гэрчилгээнүүд</p>
            <div className="grid gap-5 sm:grid-cols-3">
              {CERTIFICATES.slice(0, 3).map((cert, i) => (
                <CertCard key={i} index={i} {...cert} onOpen={() => setLightbox({ img: cert.img, label: cert.label })} />
              ))}
            </div>
          </div>

          {/* 2 license docs */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/30">Тусгай зөвшөөрөл</p>
            <div className="grid max-w-2xl gap-5 sm:grid-cols-2">
              {CERTIFICATES.slice(3).map((cert, i) => (
                <CertCard key={i} index={i + 3} {...cert} onOpen={() => setLightbox({ img: cert.img, label: cert.label })} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PAGE NAV BUTTONS ── */}
      <section className="px-6 pb-20 pt-6">
        <div className="mx-auto max-w-7xl border-t border-white/8 pt-10">
          <motion.div
            {...fadeUp()}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            {/* 1 — Ghost back home */}
            <a
              href="#"
              onClick={e => { e.preventDefault(); window.location.hash = ''; }}
              className="
                inline-flex h-8 items-center gap-1.5 rounded-full
                border border-white/8 bg-transparent
                px-4 text-[11px] font-medium text-white/38
                transition-all duration-200
                hover:border-white/18 hover:text-white/65
              "
            >
              <IconArrowLeft />
              Нүүр хуудас
            </a>

            {/* 2 — Ghost border */}
            <a
              href="#/medee"
              className="
                inline-flex h-8 items-center rounded-full
                border border-white/14 bg-white/[0.03]
                px-4 text-[11px] font-medium text-white/65
                transition-all duration-200
                hover:border-white/28 hover:bg-white/[0.06] hover:text-white/90
              "
            >
              Мэдээ мэдээлэл
            </a>

            {/* 3 — Primary gold */}
            <a
              href="#"
              className="
                inline-flex h-8 items-center rounded-full
                bg-[#E2B56D] px-4 text-[11px] font-bold
                text-black tracking-wide
                transition-all duration-200
                hover:brightness-110 hover:shadow-[0_0_18px_rgba(226,181,109,0.45)]
              "
            >
              Апп татах
            </a>

            {/* 4 — Ghost border */}
            <a
              href="#/atm"
              className="
                inline-flex h-8 items-center rounded-full
                border border-white/14 bg-white/[0.03]
                px-4 text-[11px] font-medium text-white/65
                transition-all duration-200
                hover:border-white/28 hover:bg-white/[0.06] hover:text-white/90
              "
            >
              Киоск байршил
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER — with a divider for breathing room ── */}
      <div className="border-t border-white/8">
        <Footer />
      </div>

      {/* ── LIGHTBOX ── */}
      {lightbox && (
        <Lightbox img={lightbox.img} label={lightbox.label} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
};
