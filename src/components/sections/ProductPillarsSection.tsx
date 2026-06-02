import { motion } from 'motion/react';
import React from 'react';

const pillars = [
  {
    number: '01',
    title: 'FGN АППЛИКЕЙШН',
    subtitle: 'Дижитал алтны платформ',
    description:
      'Алт худалдан авах, зарах, хадгалах, арилжих, алт барьцаалан зээл авах, өвлүүлэх боломж бүхий нэгдсэн дижитал платформ. Баталгаатай физик алтны нөөцөд шууд холбогдсон.',
    features: [
      'Бодит цагийн ханш, арилжаа',
      'Алт барьцаалан зээл',
      'Үе дамжих өвлүүлэлт',
      'Хэрэглэгч бүрийн дансны хяналт',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="12" y="4" width="24" height="40" rx="4" stroke="#E2B56D" strokeWidth="1.5"/>
        <rect x="17" y="10" width="14" height="18" rx="2" fill="#E2B56D" fillOpacity="0.15" stroke="#E2B56D" strokeWidth="1"/>
        <circle cx="24" cy="36" r="2.5" fill="#E2B56D" fillOpacity="0.6"/>
        <path d="M20 16h8M20 20h5" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    accentFrom: '#E2B56D',
    accentTo: '#C8952A',
  },
  {
    number: '02',
    title: 'АЛТНЫ КИОСК',
    subtitle: '24/7 Алтны АТМ',
    description:
      '24/7 ажиллагаатай алтан гулдмай худалдан авах киоск. Бодит цагийн ханшийн шинэчлэлтээр 999.9 сорьцтой Fine Gold Nation брэндийн алтыг хурдан, найдвартай, хямдаар гартаа авна.',
    features: [
      '999.9 сорьц, ISO баталгаатай',
      '1гр — 100гр хүртэл сонголт',
      'Карт, QR, апп төлбөр',
      'Бодит цагийн ханшийн шинэчлэлт',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="10" y="6" width="28" height="36" rx="3" stroke="#E2B56D" strokeWidth="1.5"/>
        <rect x="15" y="12" width="18" height="10" rx="2" fill="#E2B56D" fillOpacity="0.15" stroke="#E2B56D" strokeWidth="1"/>
        <rect x="16" y="26" width="16" height="2" rx="1" fill="#E2B56D" fillOpacity="0.4"/>
        <rect x="16" y="30" width="10" height="2" rx="1" fill="#E2B56D" fillOpacity="0.4"/>
        <rect x="15" y="35" width="18" height="3" rx="1" fill="#E2B56D" fillOpacity="0.25" stroke="#E2B56D" strokeWidth="0.5"/>
      </svg>
    ),
    accentFrom: '#C8952A',
    accentTo: '#A07020',
  },
  {
    number: '03',
    title: 'АЛТ БОЛОВСРУУЛАХ ҮЙЛДВЭР',
    subtitle: 'Монголын өөрийн брэнд',
    description:
      'Монгол Улсад алт цутгах, савлах, брэндчлэх нэгдсэн үйлдвэрлэлийн шугам. Fine Gold Nation брэндийн алтны бүтээгдэхүүнийг дотоод болон гадаад зах зээлд нийлүүлнэ.',
    features: [
      'Дотоодын үйлдвэрлэл',
      'Гарал үүслийн бүрэн ил тод байдал',
      'FGN брэндийн алтан гулдмай',
      'Гадаад зах зээлд экспорт',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M8 36h32M12 36V24l4-4h16l4 4v12" stroke="#E2B56D" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="19" y="28" width="10" height="8" rx="1" stroke="#E2B56D" strokeWidth="1"/>
        <path d="M16 24v-6h16v6" stroke="#E2B56D" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M22 16V10M26 16V10" stroke="#E2B56D" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="8" r="2" fill="#E2B56D" fillOpacity="0.5"/>
      </svg>
    ),
    accentFrom: '#F5D7A1',
    accentTo: '#E2B56D',
  },
];

export const ProductPillarsSection: React.FC = () => {
  return (
    <section id="products" className="relative bg-black py-32 px-6 overflow-hidden">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#E2B56D]/5 blur-[140px] rounded-full" />
        <div className="absolute right-0 top-1/3 w-[400px] h-[400px] bg-[#E2B56D]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          className="mb-20 max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-10 bg-[#E2B56D]" />
            <span className="text-[#E2B56D] text-sm font-medium tracking-widest uppercase">Үндсэн бүрэлдэхүүн</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            НЭГДСЭН<br />
            <span className="gold-shimmer">ЭКОСИСТЕМ</span>
          </h2>
          <p className="mt-5 text-white/60 text-base leading-relaxed max-w-lg">
            Биет болон дижитал алтны хадгалалт, арилжааг нэг дор шийдсэн
            Fine Gold Nation-ы гурван тулгуур бүрэлдэхүүн.
          </p>
        </motion.div>

        {/* PILLARS */}
        <div className="grid lg:grid-cols-3 gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative rounded-3xl border border-white/8 bg-white/[0.02] backdrop-blur-sm overflow-hidden p-8 flex flex-col gap-6 cursor-default"
            >
              {/* Gold top border line on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E2B56D]/0 to-transparent group-hover:via-[#E2B56D]/60 transition-all duration-500" />

              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
                <div className="absolute -inset-4 bg-gradient-to-br from-[#E2B56D]/8 to-transparent blur-2xl" />
              </div>

              {/* Number + Icon */}
              <div className="flex items-start justify-between">
                <div className="relative z-10">
                  {p.icon}
                </div>
                <span
                  className="text-6xl font-black leading-none select-none"
                  style={{ color: `${p.accentFrom}18` }}
                >
                  {p.number}
                </span>
              </div>

              {/* Text */}
              <div className="relative z-10 flex flex-col gap-2">
                <p className="text-[#E2B56D] text-xs font-medium tracking-widest uppercase">{p.subtitle}</p>
                <h3 className="text-white font-semibold text-xl leading-snug">{p.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mt-1">{p.description}</p>
              </div>

              {/* Feature list */}
              <ul className="relative z-10 flex flex-col gap-2 mt-auto">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2.5 text-white/60 text-sm">
                    <span className="w-1 h-1 rounded-full bg-[#E2B56D] shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Bottom gradient bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${p.accentFrom}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
