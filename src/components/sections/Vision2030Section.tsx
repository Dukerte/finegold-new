import { motion } from 'motion/react';
import React from 'react';
import bgDecor from '../../assets/images/background.svg';

const milestones = [
  {
    year: '2023',
    label: 'Үүсгэн байгуулалт',
    desc: 'Fine Gold Nation ХХК байгуулагдаж, ISO баталгаажуулалтын ажил эхэлсэн.',
    status: 'done',
  },
  {
    year: '2025',
    label: 'ISO баталгаажуулалт',
    desc: 'ISO 9001 · 14001 · 45001 · 27001 дөрвөн олон улсын стандартаар баталгаажсан.',
    status: 'done',
  },
  {
    year: '2026',
    label: 'Үйлдвэр & Киоск',
    desc: 'Алт боловсруулах үйлдвэр болон алтны киоск сүлжээний өргөтгөл.',
    status: 'active',
  },
  {
    year: '2028',
    label: 'Монгол даяар',
    desc: 'Монгол Улсын бүх аймаг, хот суурин газарт FGN киоск ATM сүлжээ.',
    status: 'future',
  },
  {
    year: '2030',
    label: 'Төв Азийн тэргүүлэгч',
    desc: 'Төв Азийн хөрөнгийн менежмент, алтны хөрөнгө оруулалтын тэргүүлэх платформ.',
    status: 'future',
  },
];

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
        <path
          d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4z"
          stroke="#E2B56D"
          strokeWidth="1.5"
        />
        <path
          d="M16 9v7l4 4"
          stroke="#E2B56D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Эдийн засаг',
    desc: 'Алтны дотоодын нэмүү өртөг өсч, эдийн засагт үлдэнэ.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
        <rect
          x="4"
          y="8"
          width="24"
          height="16"
          rx="3"
          stroke="#E2B56D"
          strokeWidth="1.5"
        />
        <path
          d="M10 16h12M10 20h7"
          stroke="#E2B56D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="24" cy="12" r="2" fill="#E2B56D" fillOpacity="0.5" />
      </svg>
    ),
    title: 'Санхүү',
    desc: 'Ил тод, найдвартай арилжааны систем бий болно.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
        <circle cx="16" cy="12" r="5" stroke="#E2B56D" strokeWidth="1.5" />
        <path
          d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10"
          stroke="#E2B56D"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Иргэд',
    desc: 'Алтанд суурилсан хөрөнгө оруулалт бүх иргэнд хүртээмжтэй болно.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="h-7 w-7">
        <rect
          x="6"
          y="10"
          width="12"
          height="16"
          rx="2"
          stroke="#E2B56D"
          strokeWidth="1.5"
        />
        <path
          d="M18 14h4a2 2 0 012 2v8a2 2 0 01-2 2H18"
          stroke="#E2B56D"
          strokeWidth="1.5"
        />
        <path
          d="M10 14h4M10 18h4M10 22h2"
          stroke="#E2B56D"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: 'Технологи',
    desc: 'Fintech болон физик хөрөнгийг уялдуулсан шинэ шийдэл хэрэгжинэ.',
  },
];

export const Vision2030Section: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-black px-6 py-16 text-left text-white lg:py-20">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-0 right-0 h-[700px] w-[700px] rounded-full bg-[#E2B56D]/5 blur-[160px]" />
        <div className="absolute left-[-200px] top-1/3 h-[500px] w-[500px] rounded-full bg-[#E2B56D]/4 blur-[150px]" />
        {/* Background SVG decoration */}
        <img
          src={bgDecor}
          alt=""
          className="absolute -right-24 -top-24 w-[520px] opacity-[0.06] pointer-events-none select-none"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-20 grid gap-10 lg:mb-24 lg:grid-cols-[48%_52%] lg:gap-16">
          <motion.div
            className="w-full text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="mb-4 flex items-center justify-start gap-3">
              <div className="h-px w-10 bg-[#E2B56D]" />
              <span className="text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
                Алсын хараа
              </span>
            </div>

            <h2 className="text-left text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
              VISION <span className="gold-shimmer">2030</span>
            </h2>
          </motion.div>

          <motion.div
            className="flex items-end text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <p className="max-w-xl text-left text-base leading-relaxed text-white/60 md:text-lg">
              2030 он гэхэд Fine Gold Nation нь Монголдоо төдийгүй{' '}
              <span className="text-white">Төв Азид хөрөнгийн менежмент</span>,
              хөрөнгө оруулалтын тэргүүлэх платформ болох. Монгол улсад алтны
              хөрөнгө оруулалт, хуримтлалын{' '}
              <span className="text-white">шинэ соёлыг бүрдүүлнэ.</span>
            </p>
          </motion.div>
        </div>

        {/* TIMELINE */}
        <motion.div
          className="relative mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
        >
          {/* Desktop timeline line */}
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/8 lg:block" />

          {/* Progress line — now reaches 2026 */}
          <div
            className="absolute left-0 top-6 hidden h-px bg-gradient-to-r from-[#E2B56D] via-[#E2B56D] to-[#E2B56D]/25 lg:block"
            style={{ width: '50%' }}
          />

          <div className="grid gap-6 lg:grid-cols-5">
            {milestones.map((m, i) => {
              const isDone = m.status === 'done';
              const isActive = m.status === 'active';

              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="
                    relative rounded-3xl border border-white/8
                    bg-white/[0.015] p-5 pt-10 text-left
                    transition-all duration-500
                    hover:border-[#E2B56D]/30 hover:bg-white/[0.03]
                    lg:border-0 lg:bg-transparent lg:p-0 lg:pt-14
                  "
                >
                  {/* Mobile small line */}
                  {i < milestones.length - 1 && (
                    <div className="absolute bottom-[-24px] left-[27px] h-6 w-px bg-white/10 lg:hidden" />
                  )}

                  {/* Dot */}
                  <div
                    className={`
                      absolute left-5 top-5 h-4 w-4 -translate-y-1/2 rounded-full border-2
                      lg:left-1/2 lg:top-6 lg:-translate-x-1/2
                      ${
                        isDone
                          ? 'border-[#E2B56D] bg-[#E2B56D] shadow-[0_0_14px_rgba(226,181,109,0.55)]'
                          : isActive
                            ? 'border-[#E2B56D] bg-black shadow-[0_0_18px_rgba(226,181,109,0.45)]'
                            : 'border-white/20 bg-black'
                      }
                    `}
                  >
                    {isActive && (
                      <span className="absolute inset-[-7px] rounded-full border border-[#E2B56D]/35 animate-pulse" />
                    )}
                  </div>

                  <p
                    className={`mb-1 text-left text-sm font-bold ${
                      isDone || isActive ? 'text-[#E2B56D]' : 'text-white/50'
                    }`}
                  >
                    {m.year}
                  </p>

                  <p
                    className={`mb-2 text-left text-base font-semibold ${
                      isDone || isActive ? 'text-white' : 'text-white/70'
                    }`}
                  >
                    {m.label}
                  </p>

                  <p className="max-w-xs text-left text-xs leading-relaxed text-white/55">
                    {m.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* IMPACT PILLARS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-left"
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="h-px w-10 bg-[#E2B56D]/70" />
            <p className="text-left text-sm uppercase tracking-widest text-white/40">
              Хүлээгдэж буй үр дүн
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="
                  group rounded-3xl border border-white/8 bg-white/[0.02]
                  p-6 text-left transition-all duration-300
                  hover:border-[#E2B56D]/25 hover:bg-white/[0.035]
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                "
              >
                <div className="mb-4 opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                  {p.icon}
                </div>

                <h4 className="mb-2 text-left text-base font-semibold text-white">
                  {p.title}
                </h4>

                <p className="text-left text-sm leading-relaxed text-white/60">
                  {p.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};