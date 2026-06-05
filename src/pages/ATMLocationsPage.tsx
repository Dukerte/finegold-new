import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import logo from '../assets/images/logo.svg';

// ─── DATA — add more locations here as you expand ─────────────────────────────
const ATM_LOCATIONS = [
  {
    id: 1,
    type: 'kiosk',
    typeLabel: 'Киоск',
    name: 'Хоймор оффис',
    address: 'УБ хот, СБД, Хоймор оффис, 1408 тоот',
    hours: 'Даваа–Баасан: 09:00–17:30',
    hoursWeekend: 'Бямба–Ням: Амарна',
    phone: '7799-9999',
    available: true,
    services: ['Алт худалдан авах', 'Алт зарах', 'Зөвлөгөө авах'],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2674.5!2d106.9054!3d47.9077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDU0JzI4LjkiTiAxMDbCsDU0JzE5LjQiRQ!5e0!3m2!1smn!2smn!4v1700000000000',
    mapsLink: 'https://maps.app.goo.gl/6QC3EuKNzBRqxtV4A',
  },
  // ─── FUTURE LOCATIONS (uncomment & fill when ready) ───────────────────────
  // {
  //   id: 2,
  //   type: 'kiosk',
  //   typeLabel: 'Киоск',
  //   name: '...',
  //   address: '...',
  //   hours: '...',
  //   hoursWeekend: '...',
  //   phone: '7799-9999',
  //   available: false,
  //   services: [],
  //   mapSrc: '...',
  //   mapsLink: '...',
  // },
  // {
  //   id: 3,
  //   type: 'store',
  //   typeLabel: 'Дэлгүүр',
  //   name: '...',
  //   address: '...',
  //   hours: '...',
  //   hoursWeekend: '...',
  //   phone: '7799-9999',
  //   available: false,
  //   services: [],
  //   mapSrc: '...',
  //   mapsLink: '...',
  // },
];

const FILTERS = ['Бүгд', 'Киоск', 'Дэлгүүр'];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const IconPin = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconExternal = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export const ATMLocationsPage = () => {
  const [selectedId, setSelectedId] = useState<number>(1);
  const [filter, setFilter] = useState('Бүгд');

  const filtered = ATM_LOCATIONS.filter(l =>
    filter === 'Бүгд' ||
    (filter === 'Киоск' && l.type === 'kiosk') ||
    (filter === 'Дэлгүүр' && l.type === 'store')
  );

  const selectedLoc = ATM_LOCATIONS.find(l => l.id === selectedId) ?? ATM_LOCATIONS[0];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => { window.location.hash = ''; window.scrollTo({ top: 0 }); }}
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
            >
              <IconArrowLeft />
              Буцах
            </button>
            <div className="h-4 w-px bg-white/10" />
            <img src={logo} alt="FGN" className="h-6 w-auto object-contain" />
          </div>
          <span className="text-xs font-medium text-white/40 tracking-widest uppercase">АТМ байршил</span>
          {/* Filter pills in header */}
          <div className="flex items-center gap-1">
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  filter === f ? 'bg-[#E2B56D] text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── HERO STRIP ─────────────────────────────────────────────────────── */}
      <div className="pt-14 border-b border-white/[0.06]">
        <div className="relative overflow-hidden px-6 lg:px-8 py-8">
          <div className="absolute right-0 top-0 w-[500px] h-[160px] bg-[#E2B56D]/6 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Left: title */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div className="h-px w-6 bg-[#E2B56D]" />
                <span className="text-[#E2B56D] text-xs font-medium tracking-widest uppercase">АТМ сүлжээ</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-white tracking-tight">
                FGN Алтны Киоскуудын байршил
              </h1>
            </div>
            {/* Right: stats + tagline */}
            <div className="flex flex-col items-start sm:items-end gap-1">
              <p className="text-white/40 text-xs italic">Сүлжээ тасралтгүй өргөжиж байна</p>
              <div className="flex gap-5">
                {[
                  { label: 'Нийт байршил', value: `${ATM_LOCATIONS.filter(l => l.available).length}` },
                  { label: 'Улаанбаатар хот', value: '1' },
                  { label: 'Удахгүй нэмэгдэж буй', value: '5+' },
                ].map((s, i) => (
                  <div key={i} className="text-right">
                    <p className="text-base font-bold text-[#E2B56D] leading-none">{s.value}</p>
                    <p className="text-white/35 text-xs mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAP + SIDEBAR ───────────────────────────────────────────────────── */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-[300px_1fr] gap-5 h-full">

          {/* SIDEBAR */}
          <div className="flex flex-col gap-3">
            {filtered.length > 0 ? filtered.map(loc => (
              <motion.button
                key={loc.id}
                onClick={() => setSelectedId(loc.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left rounded-2xl border p-4 transition-all duration-200 ${
                  selectedId === loc.id
                    ? 'border-[#E2B56D]/50 bg-gradient-to-br from-[#E2B56D]/10 to-transparent'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15'
                }`}
              >
                <span className="text-[#E2B56D] text-xs font-medium tracking-wide">{loc.typeLabel}</span>
                <p className="text-white text-sm font-semibold mt-0.5">{loc.name}</p>
                <div className="flex items-start gap-1.5 mt-2 text-white/45 text-xs">
                  <span className="text-[#E2B56D]/70 mt-0.5 shrink-0"><IconPin /></span>
                  {loc.address}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-white/45 text-xs">
                  <span className="text-[#E2B56D]/70 shrink-0"><IconClock /></span>
                  {loc.hours}
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 text-white/45 text-xs">
                  <span className="text-[#E2B56D]/70 shrink-0"><IconPhone /></span>
                  {loc.phone}
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <span className={`w-1.5 h-1.5 rounded-full ${loc.available ? 'bg-green-400' : 'bg-white/20'}`} />
                  <span className="text-xs text-white/40">{loc.available ? 'Нээлттэй' : 'Удахгүй'}</span>
                </div>
              </motion.button>
            )) : (
              <div className="text-white/25 text-sm text-center py-10">Энэ ангилалд байршил алга</div>
            )}

            {/* Coming soon */}
            <div className="rounded-2xl border border-dashed border-white/8 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/25"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <div>
                <p className="text-white/40 text-xs font-medium">Удахгүй нэмэгдэх</p>
                <p className="text-white/20 text-xs">Шинэ байршлууд</p>
              </div>
            </div>
          </div>

          {/* MAP */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative rounded-2xl overflow-hidden border border-white/8 min-h-[480px] lg:min-h-0 bg-white/[0.02]"
            >
              <iframe
                src={selectedLoc.mapSrc}
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  minHeight: 480,
                  filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) saturate(0.85)',
                }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="ATM Location Map"
              />
              {/* Info bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-xl border border-white/10 bg-black/85 backdrop-blur-sm p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[#E2B56D] text-xs font-medium">{selectedLoc.typeLabel}</p>
                    <p className="text-white font-semibold text-sm mt-0.5">{selectedLoc.name}</p>
                    <p className="text-white/45 text-xs mt-0.5">{selectedLoc.hours}</p>
                  </div>
                  <a
                    href={selectedLoc.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-black transition-opacity hover:opacity-85"
                    style={{ background: 'linear-gradient(135deg, #E0B165, #FFD700, #E0B165)' }}
                  >
                    <IconExternal />
                    Google Maps
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────────────────── */}
      <div className="border-t border-white/[0.05] px-6 py-4 mt-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">© {new Date().getFullYear()} Fine Gold Nation ХХК</p>
          <p className="text-white/20 text-xs">
            Шинэ байршил:{' '}
            <a href="mailto:info@finegold.mn" className="text-[#E2B56D]/50 hover:text-[#E2B56D] transition-colors">
              info@finegold.mn
            </a>
          </p>
        </div>
      </div>

    </div>
  );
};
