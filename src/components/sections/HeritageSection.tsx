import { motion } from 'motion/react';
import React from 'react';

import bgDecor from '../../assets/images/background.svg';
import mongonMod from '../../assets/images/mongon-mod.png';
import belgedel1 from '../../assets/images/belgedel1.png';
import belgedel2 from '../../assets/images/belgedel2.png';
import belgedel3 from '../../assets/images/belgedel3.png';
import belgedel4 from '../../assets/images/belgedel4.png';

const medallions = [belgedel1, belgedel2, belgedel3, belgedel4];

const symbols = [
  {
    number: '01',
    mongolian: 'ТЭНГЭРИЙН ЭЛЧ',
    description:
      'Модны оройд байрлах тэнгэрийн элч нь олон түмэнд сайн сайхан, эд баялгийн ерөөл түгээхээр бишгүүр үлээн сонордуулж буйгаар дүрслэгддэг.',
  },
  {
    number: '02',
    mongolian: 'АМЬДРАЛЫН МОД',
    description:
      'Модны саглагар мөчир бүхий их бие нь амьдралын хүч, эрч энергийн эх булаг хэмээн үзэгддэг. Түүнийг монгол уламжлалт урлагийн хамгийн эртний хэлбэрүүд болох угалз ба үүлэн хээгээр сүлэлдүүлэн урласан нь Монгол сэтгэлгээний гүн утгыг илтгэнэ.',
  },
  {
    number: '03',
    mongolian: 'ДӨРВӨН ЛУУ',
    description:
      'Модны их биеэс дөрвөн тийш хандсан луу нь монголчуудын уламжлалт луун дүрслэлээр бүтээгдсэн бөгөөд сүр хүчийг бэлгэдэхийн сацуу хамгаалагч сахиусыг илэрхийлдэг. Луу бүрийн амнаас хүч чадал, баялаг түгэж буй байдлыг харуулжээ.',
  },
  {
    number: '04',
    mongolian: 'ГУРВАН ХӨЛТ ТОГОО',
    description:
      'Луу бүрийн амнаас гарах эд баялаг, сүр хүчийг тосон байрлуулсан гурван хөлтэй тогоо нь монголчуудын хамгийн эрхэм эдлэлийн нэг юм. Түүнийг тасралтгүй үргэлжлэхийн бэлгэдэл алхан хээгээр бүслүүрдэж, эртний уран дархны хийц маягаар урласан байна.',
  },
];

export const HeritageSection: React.FC = () => {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-black text-left text-white"
    >
      {/* BACKGROUND SVG DECORATION */}
      <img
        src={bgDecor}
        alt=""
        className="pointer-events-none absolute -right-20 -top-20 w-[500px] select-none opacity-[0.08]"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* AMBIENT GOLD LIGHT */}
      <div className="pointer-events-none absolute left-[-120px] top-1/3 h-[520px] w-[520px] rounded-full bg-[#E2B56D]/7 blur-[160px]" />
      <div className="pointer-events-none absolute right-[-160px] bottom-0 h-[420px] w-[420px] rounded-full bg-[#E2B56D]/5 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16 text-left sm:px-8 lg:py-20">
        {/* SECTION HEADER */}
        <motion.div
          className="mb-16 max-w-2xl text-left lg:mb-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-4 flex items-center justify-start gap-3">
            <div className="h-px w-10 bg-[#E2B56D]" />
            <span className="text-left text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
              Монголын уламжлал
            </span>
          </div>

          <h2 className="text-left text-4xl font-semibold tracking-tight text-white md:text-5xl lg:text-6xl">
            МӨНГӨН <span className="gold-shimmer">МОД</span>
          </h2>

          <p className="mt-5 max-w-xl text-left text-base leading-relaxed text-white/55">
            Монгол соёлын гүн утгыг агуулсан Fine Gold Nation-ы бэлгэдэлт
            бүтээл — үе дамжих баялаг, хамгаалалт, хишгийн нэгдэл.
          </p>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="grid gap-12 text-left lg:grid-cols-[42%_58%] lg:gap-14">
          {/* LEFT VISUAL */}
          <motion.div
            className="relative flex flex-col items-start text-left"
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            {/* Image frame */}
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-6 rounded-full bg-[#E2B56D]/10 blur-[80px]" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/8 bg-white/[0.02] p-6 backdrop-blur-sm">
                <img
                  src={mongonMod}
                  alt="Мөнгөн мод — Fine Gold Nation бэлгэдэл"
                  className="w-full max-w-md object-contain"
                  style={{
                    filter: 'drop-shadow(0 0 50px rgba(226,181,109,0.28))',
                  }}
                />

                {/* Soft inner shine */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-[#E2B56D]/[0.04]" />
              </div>
            </div>

            <div className="mt-7 w-full max-w-lg text-left">
              <p className="text-left text-xs font-medium uppercase tracking-[0.28em] text-[#E2B56D]/80">
                Бэлгэдлийн тайлбар
              </p>
              <p className="mt-2 text-left text-sm leading-relaxed text-white/45">
                FGN брэндийн “Үе дамжих үнэт өв” гэсэн санааг Монголын
                уламжлалт бэлгэдэлтэй холбосон үндсэн дүрслэл.
              </p>
            </div>
          </motion.div>

          {/* RIGHT SYMBOLS */}
          <motion.div
            className="flex flex-col gap-4 text-left"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
          >
            {symbols.map((s, i) => (
              <motion.div
                key={s.number}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.55, ease: 'easeOut' }}
                className="
                  group relative overflow-hidden rounded-3xl
                  border border-white/8 bg-white/[0.025]
                  p-5 text-left backdrop-blur-sm
                  transition-all duration-500
                  hover:border-[#E2B56D]/35
                  hover:bg-white/[0.04]
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                  sm:p-6
                "
              >
                {/* Top gold line */}
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#E2B56D]/0 to-transparent transition-all duration-500 group-hover:via-[#E2B56D]/60" />

                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[#E2B56D]/10 to-transparent blur-3xl" />
                </div>

                <div className="relative z-10 flex items-start gap-5 text-left">
                  {/* MEDALLION */}
                  <div className="relative shrink-0">
                    <div className="absolute -inset-2 rounded-full bg-[#E2B56D]/0 blur-lg transition-all duration-500 group-hover:bg-[#E2B56D]/20" />

                    <div
                      className="
                        relative overflow-hidden rounded-full
                        border-2 border-[#E2B56D]/35
                        bg-[#0a0a0a]
                        transition-all duration-300
                        group-hover:border-[#E2B56D]/80
                        group-hover:shadow-[0_0_20px_rgba(226,181,109,0.22)]
                      "
                      style={{ width: 76, height: 76 }}
                    >
                      <motion.img
                        src={medallions[i]}
                        alt={s.mongolian}
                        className="h-full w-full object-cover"
                        whileHover={{ scale: 1.16 }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  {/* TEXT */}
                  <div className="min-w-0 flex-1 text-left">
                    <div className="mb-2 flex items-center justify-start gap-3 text-left">
                      <span className="shrink-0 text-left text-xs font-semibold tracking-widest text-[#E2B56D]/70">
                        {s.number}
                      </span>

                      <div className="h-px w-8 shrink-0 bg-[#E2B56D]/30" />

                      <p className="text-left text-xs font-semibold uppercase tracking-widest text-[#E2B56D]">
                        {s.mongolian}
                      </p>
                    </div>

                    <p className="max-w-3xl text-left text-sm leading-relaxed text-white/58">
                      {s.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};