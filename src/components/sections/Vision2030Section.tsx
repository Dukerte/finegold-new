import { motion } from 'motion/react';
import React from 'react';

const milestones = [
  {
    year: '2023',
    label: 'Үүсгэн байгуулалт',
    desc: 'Fine Gold Nation ХХК байгуулагдаж, ISO баталгаажуулалтын ажил эхэлсэн.',
    done: true,
  },
  {
    year: '2025',
    label: 'ISO баталгаажуулалт',
    desc: 'ISO 9001 · 14001 · 45001 · 27001 дөрвөн олон улсын стандартаар баталгаажсан.',
    done: true,
  },
  {
    year: '2026',
    label: 'Үйлдвэр & Киоск',
    desc: 'Алт боловсруулах үйлдвэр болон алтны киоск сүлжээний өргөтгөл.',
    done: false,
  },
  {
    year: '2028',
    label: 'Монгол даяар',
    desc: 'Монгол Улсын бүх аймаг, хот суурин газарт FGN киоск ATM сүлжээ.',
    done: false,
  },
  {
    year: '2030',
    label: 'Төв Азийн тэргүүлэгч',
    desc: 'Төв Азийн хөрөнгийн менежмент, алтны хөрөнгө оруулалтын тэргүүлэх платформ.',
    done: false,
  },
];

const pillars = [
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4z" stroke="#E2B56D" strokeWidth="1.5"/>
        <path d="M16 9v7l4 4" stroke="#E2B56D" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Эдийн засаг',
    desc: 'Алтны дотоодын нэмүү өртөг өсч, эдийн засагт үлдэнэ.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="4" y="8" width="24" height="16" rx="3" stroke="#E2B56D" strokeWidth="1.5"/>
        <path d="M10 16h12M10 20h7" stroke="#E2B56D" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="24" cy="12" r="2" fill="#E2B56D" fillOpacity="0.5"/>
      </svg>
    ),
    title: 'Санхүү',
    desc: 'Ил тод, найдвартай арилжааны систем бий болно.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <circle cx="16" cy="12" r="5" stroke="#E2B56D" strokeWidth="1.5"/>
        <path d="M6 28c0-5.5 4.5-10 10-10s10 4.5 10 10" stroke="#E2B56D" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Иргэд',
    desc: 'Алтанд суурилсан хөрөнгө оруулалт бүх иргэнд хүртээмжтэй болно.',
  },
  {
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-7 h-7">
        <rect x="6" y="10" width="12" height="16" rx="2" stroke="#E2B56D" strokeWidth="1.5"/>
        <path d="M18 14h4a2 2 0 012 2v8a2 2 0 01-2 2H18" stroke="#E2B56D" strokeWidth="1.5"/>
        <path d="M10 14h4M10 18h4M10 22h2" stroke="#E2B56D" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Технологи',
    desc: 'Fintech болон физик хөрөнгийг уялдуулсан шинэ шийдэл хэрэгжинэ.',
  },
];

export const Vision2030Section: React.FC = () => {
  return (
    <section className="relative bg-black py-32 px-6 overflow-hidden">

      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute right-0 bottom-0 w-[700px] h-[700px] bg-[#E2B56D]/5 blur-[160px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-[#E2B56D]" />
              <span className="text-[#E2B56D] text-sm font-medium tracking-widest uppercase">Алсын харaa</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-tight">
              VISION<br />
              <span className="gold-shimmer">2030</span>
            </h2>
          </motion.div>

          <motion.div
            className="flex items-end"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
          >
            <p className="text-white/60 text-lg leading-relaxed">
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
          {/* Timeline line */}
          <div className="absolute left-0 right-0 top-6 h-px bg-white/8 hidden lg:block" />
          <div
            className="absolute left-0 top-6 h-px bg-gradient-to-r from-[#E2B56D] to-[#E2B56D]/20 hidden lg:block"
            style={{ width: '40%' }}
          />

          <div className="grid lg:grid-cols-5 gap-6">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative pt-12 lg:pt-14"
              >
                {/* Dot */}
                <div className={`
                  absolute top-4 left-0 lg:left-1/2 lg:-translate-x-1/2
                  w-4 h-4 rounded-full border-2 -translate-y-1/2
                  ${m.done
                    ? 'bg-[#E2B56D] border-[#E2B56D] shadow-[0_0_12px_rgba(226,181,109,0.6)]'
                    : 'bg-black border-white/20'}
                `} />

                <p className={`text-sm font-bold mb-1 ${m.done ? 'text-[#E2B56D]' : 'text-white/30'}`}>{m.year}</p>
                <p className={`font-semibold text-base mb-2 ${m.done ? 'text-white' : 'text-white/50'}`}>{m.label}</p>
                <p className="text-white/40 text-xs leading-relaxed">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* IMPACT PILLARS */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-white/40 text-sm mb-8 uppercase tracking-widest">Хүлээгдэж буй үр дүн</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pillars.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.3 } }}
                className="group rounded-2xl border border-white/8 bg-white/[0.02] p-6 hover:border-[#E2B56D]/25 transition-all duration-300"
              >
                <div className="mb-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {p.icon}
                </div>
                <h4 className="text-white font-semibold text-base mb-2">{p.title}</h4>
                <p className="text-white/45 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};
