import { motion } from 'motion/react';
import React, { useState } from 'react';

const symbols = [
  {
    id: 'tree',
    mongolian: 'МӨНГӨН МОД',
    title: 'Амьдралын мод',
    description:
      'Монголчууд эртнээс модоор тэнгэр газрыг холбон, өнгөрсөн, одоо, ирээдүйн мөнхийн холбоос хэмээн үзсээр ирсэн. Энэхүү амьдралын мод нь Fine Gold Nation-ы үндэс суурь — үе дамжих үнэт өвийн бэлгэдэл.',
    symbol: '🌳',
    svgPath: (
      <g>
        {/* Tree trunk */}
        <rect x="38" y="55" width="4" height="25" rx="2" fill="#E2B56D" fillOpacity="0.6"/>
        {/* Main branches */}
        <path d="M40 55 C40 40 25 35 20 20" stroke="#E2B56D" strokeWidth="2" strokeLinecap="round" fillOpacity="0"/>
        <path d="M40 55 C40 40 55 35 60 20" stroke="#E2B56D" strokeWidth="2" strokeLinecap="round" fillOpacity="0"/>
        <path d="M40 45 C40 35 40 25 40 10" stroke="#E2B56D" strokeWidth="2" strokeLinecap="round" fillOpacity="0"/>
        {/* Leaf clusters */}
        <circle cx="20" cy="18" r="10" fill="#E2B56D" fillOpacity="0.15" stroke="#E2B56D" strokeWidth="1"/>
        <circle cx="60" cy="18" r="10" fill="#E2B56D" fillOpacity="0.15" stroke="#E2B56D" strokeWidth="1"/>
        <circle cx="40" cy="8" r="10" fill="#E2B56D" fillOpacity="0.15" stroke="#E2B56D" strokeWidth="1"/>
        <circle cx="30" cy="32" r="7" fill="#E2B56D" fillOpacity="0.1" stroke="#E2B56D" strokeWidth="0.5"/>
        <circle cx="50" cy="32" r="7" fill="#E2B56D" fillOpacity="0.1" stroke="#E2B56D" strokeWidth="0.5"/>
      </g>
    ),
  },
  {
    id: 'messenger',
    mongolian: 'ТЭНГЭРИЙН ЭЛЧ',
    title: 'Тэнгэрийн элч',
    description:
      'Модны оройд байрлах тэнгэрийн элч нь олон түмэнд сайн сайхан, эд баялгийн ерөөл түгээхээр бишгүүр үлээн сонордуулж буйгаар дүрслэгддэг. Баялаг, хишиг хүргэгчийн бэлгэдэл.',
    symbol: '✦',
    svgPath: (
      <g>
        <circle cx="40" cy="25" r="12" fill="#E2B56D" fillOpacity="0.1" stroke="#E2B56D" strokeWidth="1.5"/>
        <circle cx="40" cy="22" r="5" fill="#E2B56D" fillOpacity="0.4"/>
        {/* Wings */}
        <path d="M28 25 C20 18 14 22 12 28 C18 26 24 28 28 25Z" fill="#E2B56D" fillOpacity="0.3" stroke="#E2B56D" strokeWidth="0.5"/>
        <path d="M52 25 C60 18 66 22 68 28 C62 26 56 28 52 25Z" fill="#E2B56D" fillOpacity="0.3" stroke="#E2B56D" strokeWidth="0.5"/>
        {/* Horn */}
        <path d="M45 25 C52 20 60 22 65 18" stroke="#E2B56D" strokeWidth="1.5" strokeLinecap="round"/>
        {/* Sound waves */}
        <path d="M62 16 C64 14 66 15 65 18" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round" fillOpacity="0"/>
        <path d="M64 13 C67 11 70 12 69 16" stroke="#E2B56D" strokeWidth="0.8" strokeLinecap="round" fillOpacity="0" strokeDasharray="2 2"/>
      </g>
    ),
  },
  {
    id: 'dragon',
    mongolian: 'ЛУУ',
    title: 'Дөрвөн луу',
    description:
      'Модны их биеэс дөрвөн тийш хандсан луу нь монголчуудын уламжлалт дүрслэлээр бүтээгдсэн бөгөөд сүр хүч, хамгаалагч сахиусыг илэрхийлнэ. Луу бүрийн амнаас хүч чадал, баялаг түгэнэ.',
    symbol: '龍',
    svgPath: (
      <g>
        {/* Dragon body - serpentine */}
        <path d="M40 40 C30 35 15 38 12 30 C10 22 18 18 25 20 C32 22 35 30 40 28 C45 26 48 18 55 20 C62 22 68 28 65 35 C62 42 50 40 40 40Z"
          stroke="#E2B56D" strokeWidth="1.5" fill="#E2B56D" fillOpacity="0.08"/>
        {/* Dragon head */}
        <ellipse cx="12" cy="28" rx="8" ry="6" fill="#E2B56D" fillOpacity="0.2" stroke="#E2B56D" strokeWidth="1"/>
        {/* Scales */}
        <path d="M25 22 C27 20 30 21 28 24" stroke="#E2B56D" strokeWidth="0.8" fillOpacity="0"/>
        <path d="M35 26 C37 24 40 25 38 28" stroke="#E2B56D" strokeWidth="0.8" fillOpacity="0"/>
        <path d="M45 24 C47 22 50 23 48 26" stroke="#E2B56D" strokeWidth="0.8" fillOpacity="0"/>
        {/* Claws */}
        <path d="M8 24 L4 20 M8 28 L3 28 M10 32 L6 35" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round"/>
        {/* Fire/wealth */}
        <path d="M5 26 C3 22 6 18 8 20 C7 16 10 13 12 16 C12 12 15 11 14 15" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round" fillOpacity="0" strokeDasharray="1.5 1.5"/>
      </g>
    ),
  },
  {
    id: 'cauldron',
    mongolian: 'ТОГОО',
    title: 'Гурван хөлт тогоо',
    description:
      'Луу бүрийн амнаас гарах эд баялаг, сүр хүчийг тосон байрлуулсан гурван хөлт тогоо нь монголчуудын хамгийн эрхэм эдлэлийн нэг. Тасралтгүй үргэлжлэх баялгийн бэлгэдэл.',
    symbol: '⊕',
    svgPath: (
      <g>
        {/* Cauldron body */}
        <path d="M20 35 C18 50 22 60 40 62 C58 60 62 50 60 35Z"
          stroke="#E2B56D" strokeWidth="1.5" fill="#E2B56D" fillOpacity="0.1"/>
        {/* Rim */}
        <ellipse cx="40" cy="35" rx="20" ry="6" fill="#E2B56D" fillOpacity="0.15" stroke="#E2B56D" strokeWidth="1.5"/>
        {/* Three legs */}
        <path d="M28 60 L24 72 M40 62 L40 74 M52 60 L56 72" stroke="#E2B56D" strokeWidth="2" strokeLinecap="round"/>
        {/* Pattern on cauldron */}
        <path d="M25 45 C30 42 35 46 40 43 C45 40 50 44 55 41" stroke="#E2B56D" strokeWidth="0.8" strokeDasharray="2 2" fillOpacity="0"/>
        {/* Steam/wealth rising */}
        <path d="M32 33 C31 26 33 22 32 18" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" fillOpacity="0"/>
        <path d="M40 33 C39 25 41 20 40 15" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" fillOpacity="0"/>
        <path d="M48 33 C47 26 49 22 48 18" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round" strokeDasharray="2 3" fillOpacity="0"/>
      </g>
    ),
  },
];

export const HeritageSection: React.FC = () => {
  const [active, setActive] = useState(0);

  return (
    <section id="about" className="relative bg-black py-32 px-6 overflow-hidden">

      {/* Deep gold ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#E2B56D]/4 blur-[180px] rounded-full" />
      </div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, #E2B56D 0px, #E2B56D 1px, transparent 1px, transparent 40px)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#E2B56D]" />
            <span className="text-[#E2B56D] text-sm font-medium tracking-widest uppercase">Монголын уламжлал</span>
            <div className="h-px w-10 bg-[#E2B56D]" />
          </div>
          <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight">
            МӨНГӨН МОД
          </h2>
          <p className="mt-5 text-white/50 text-base leading-relaxed max-w-xl mx-auto">
            Монгол соёлын гүн утгыг агуулсан Fine Gold Nation-ы бэлгэдэлт бүтээл —
            үе дамжих баялаг, хамгаалалт, хишгийн нэгдэл.
          </p>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Symbol tabs */}
          <motion.div
            className="flex flex-col gap-3"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {symbols.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                className={`
                  group text-left rounded-2xl border p-5 transition-all duration-400
                  ${active === i
                    ? 'border-[#E2B56D]/50 bg-[#E2B56D]/8 shadow-[0_0_30px_rgba(226,181,109,0.1)]'
                    : 'border-white/8 bg-white/[0.02] hover:border-white/15'}
                `}
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 font-bold
                    transition-all duration-300
                    ${active === i ? 'bg-[#E2B56D]/20 text-[#E2B56D]' : 'bg-white/5 text-white/30'}
                  `}>
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <p className={`text-xs font-medium tracking-widest uppercase transition-colors duration-300 ${active === i ? 'text-[#E2B56D]' : 'text-white/30'}`}>
                      {s.mongolian}
                    </p>
                    <p className={`font-semibold text-base transition-colors duration-300 ${active === i ? 'text-white' : 'text-white/50'}`}>
                      {s.title}
                    </p>
                  </div>
                </div>

                {active === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 text-white/60 text-sm leading-relaxed pl-14"
                  >
                    {s.description}
                  </motion.p>
                )}
              </button>
            ))}
          </motion.div>

          {/* RIGHT — Visual */}
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          >
            {/* Outer ring */}
            <div className="absolute w-80 h-80 rounded-full border border-[#E2B56D]/10" />
            <div className="absolute w-64 h-64 rounded-full border border-[#E2B56D]/15" />
            <div className="absolute w-48 h-48 rounded-full border border-[#E2B56D]/20" />

            {/* Rotating ring */}
            <motion.div
              className="absolute w-72 h-72 rounded-full border border-dashed border-[#E2B56D]/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            />

            {/* Center SVG illustration */}
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative z-10 w-48 h-48 flex items-center justify-center"
            >
              <svg viewBox="0 0 80 80" className="w-full h-full">
                {/* Glow circle */}
                <circle cx="40" cy="40" r="35" fill="#E2B56D" fillOpacity="0.05"/>
                {symbols[active].svgPath}
              </svg>
            </motion.div>

            {/* Floating label */}
            <motion.div
              key={`label-${active}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full border border-[#E2B56D]/30 bg-black/60 backdrop-blur-sm"
            >
              <span className="text-[#E2B56D] text-xs font-medium tracking-widest">
                {symbols[active].mongolian}
              </span>
            </motion.div>
          </motion.div>

        </div>

        {/* BOTTOM TAGLINE */}
        <motion.div
          className="mt-24 pt-12 border-t border-white/8 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div>
            <p className="text-white/40 text-sm">Fine Gold Nation брэндийн бэлгэдэл</p>
            <p className="text-white font-semibold text-xl mt-1">
              Үе дамжих <span className="gold-shimmer">үнэт өв</span>
            </p>
          </div>
          <div className="flex items-center gap-8">
            {['Тэнгэр', 'Луу', 'Тогоо', 'Мод'].map((w, i) => (
              <div key={i} className="text-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#E2B56D]/50 mx-auto mb-2" />
                <span className="text-white/40 text-xs">{w}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
