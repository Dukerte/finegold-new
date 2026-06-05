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
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        <rect
          x="12"
          y="4"
          width="24"
          height="40"
          rx="4"
          stroke="#E2B56D"
          strokeWidth="1.5"
        />
        <rect
          x="17"
          y="10"
          width="14"
          height="18"
          rx="2"
          fill="#E2B56D"
          fillOpacity="0.15"
          stroke="#E2B56D"
          strokeWidth="1"
        />
        <circle cx="24" cy="36" r="2.5" fill="#E2B56D" fillOpacity="0.6" />
        <path
          d="M20 16h8M20 20h5"
          stroke="#E2B56D"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    accentFrom: '#E2B56D',
  },
  {
    number: '02',
    title: 'АЛТНЫ КИОСК',
    subtitle: '24/7 Алтны ATM',
    description:
      '24/7 ажиллагаатай алтан гулдмай худалдан авах киоск. Бодит цагийн ханшаар 999.9 сорьцтой Fine Gold Nation брэндийн алтыг хурдан, найдвартай, хүртээмжтэйгээр гартаа авна.',
    features: [
      '999.9 сорьц, ISO баталгаатай',
      '1гр — 100гр хүртэл сонголт',
      'Карт, QR, апп төлбөр',
      'Бодит цагийн ханшийн шинэчлэлт',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        <rect
          x="10"
          y="6"
          width="28"
          height="36"
          rx="3"
          stroke="#E2B56D"
          strokeWidth="1.5"
        />
        <rect
          x="15"
          y="12"
          width="18"
          height="10"
          rx="2"
          fill="#E2B56D"
          fillOpacity="0.15"
          stroke="#E2B56D"
          strokeWidth="1"
        />
        <rect x="16" y="26" width="16" height="2" rx="1" fill="#E2B56D" fillOpacity="0.4" />
        <rect x="16" y="30" width="10" height="2" rx="1" fill="#E2B56D" fillOpacity="0.4" />
        <rect
          x="15"
          y="35"
          width="18"
          height="3"
          rx="1"
          fill="#E2B56D"
          fillOpacity="0.25"
          stroke="#E2B56D"
          strokeWidth="0.5"
        />
      </svg>
    ),
    accentFrom: '#C8952A',
  },
  {
    number: '03',
    title: 'АЛТ БОЛОВСРУУЛАХ ҮЙЛДВЭР',
    subtitle: 'Монголын өөрийн брэнд',
    description:
      'Монгол Улсад алт цутгах, савлах, брэндчлэх нэгдсэн үйлдвэрлэлийн шугам. Fine Gold Nation брэндийн алтны бүтээгдэхүүнийг дотоод болон гадаад зах зээлд нийлүүлнэ.',
    features: [
      'Дотоодын үйлдвэрлэл',
      'Гарал үүслийн ил тод байдал',
      'FGN брэндийн алтан гулдмай',
      'Гадаад зах зээлд экспорт',
    ],
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
        <path
          d="M8 36h32M12 36V24l4-4h16l4 4v12"
          stroke="#E2B56D"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <rect x="19" y="28" width="10" height="8" rx="1" stroke="#E2B56D" strokeWidth="1" />
        <path d="M16 24v-6h16v6" stroke="#E2B56D" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M22 16V10M26 16V10" stroke="#E2B56D" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="8" r="2" fill="#E2B56D" fillOpacity="0.5" />
      </svg>
    ),
    accentFrom: '#F5D7A1',
  },
];

export const ProductPillarsSection: React.FC = () => {
  return (
    <section
      id="products"
      className="relative overflow-hidden bg-black px-6 py-16 text-left text-white lg:py-20"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-160px] top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-[#E2B56D]/5 blur-[150px]" />
        <div className="absolute right-[-140px] top-1/3 h-[440px] w-[440px] rounded-full bg-[#E2B56D]/5 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.div
          className="mb-16 w-full max-w-2xl text-left lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-4 flex items-center justify-start gap-3">
            <div className="h-px w-10 bg-[#E2B56D]" />
            <span className="text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
              Үндсэн бүрэлдэхүүн
            </span>
          </div>

          <h2 className="text-left text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            НЭГДСЭН <span className="gold-shimmer">ДЭД БҮТЭЦ</span>
          </h2>

          <p className="mt-5 max-w-xl text-left text-base leading-relaxed text-white/58">
            Биет болон дижитал алтны хадгалалт, арилжааг нэг дор шийдсэн
            Fine Gold Nation-ы гурван үндсэн тулгуур.
          </p>
        </motion.div>

        {/* PILLARS */}
        <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
          {pillars.map((p, i) => (
            <motion.div
              key={p.number}
              initial={{ opacity: 0, y: 42 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.12 }}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="
                group relative flex min-h-[520px] cursor-default flex-col
                overflow-hidden rounded-[2rem] border border-white/8
                bg-white/[0.022] p-7 text-left backdrop-blur-sm
                transition-all duration-500
                hover:border-[#E2B56D]/35
                hover:bg-white/[0.035]
                hover:shadow-[0_24px_80px_rgba(0,0,0,0.55)]
                sm:p-8
              "
            >
              {/* Top gold line on hover */}
              <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2B56D]/0 to-transparent transition-all duration-500 group-hover:via-[#E2B56D]/70" />

              {/* Soft premium glow */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                <div className="absolute -inset-10 bg-gradient-to-br from-[#E2B56D]/10 via-transparent to-transparent blur-3xl" />
              </div>

              {/* Background number */}
              <span
                className="pointer-events-none absolute right-6 top-6 select-none text-7xl font-black leading-none tracking-tight transition-all duration-500 group-hover:scale-105"
                style={{ color: `${p.accentFrom}18` }}
              >
                {p.number}
              </span>

              {/* Icon */}
              <div className="relative z-10 mb-10 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#E2B56D]/20 bg-[#E2B56D]/5 transition-all duration-500 group-hover:border-[#E2B56D]/45 group-hover:bg-[#E2B56D]/10 group-hover:shadow-[0_0_30px_rgba(226,181,109,0.15)]">
                {p.icon}
              </div>

              {/* Text */}
              <div className="relative z-10 flex flex-col gap-2 text-left">
                <p className="text-left text-xs font-medium uppercase tracking-widest text-[#E2B56D]">
                  {p.subtitle}
                </p>

                <h3 className="text-left text-xl font-semibold leading-snug text-white">
                  {p.title}
                </h3>

                <p className="mt-2 text-left text-sm leading-relaxed text-white/55">
                  {p.description}
                </p>
              </div>

              {/* Divider */}
              <div className="relative z-10 my-7 h-px w-full bg-white/8" />

              {/* Feature list */}
              <ul className="relative z-10 mt-auto flex flex-col gap-3 text-left">
                {p.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-left text-sm leading-relaxed text-white/60"
                  >
                    <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E2B56D] shadow-[0_0_8px_rgba(226,181,109,0.45)]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Bottom gradient bar */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 transition duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(90deg, transparent, ${p.accentFrom}, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};