import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';

// Category definitions — each covers a slice of the 16 FAQ items (0-indexed)
const CATEGORIES = [
  {
    mn: 'Аппликейшн & Бүтээгдэхүүн',
    en: 'App & Products',
    items: [1, 2, 3],
  },
  {
    mn: 'Ханш & Хөрөнгө оруулалт',
    en: 'Pricing & Investment',
    items: [4, 5],
  },
  {
    mn: 'Худалдан авалт',
    en: 'Purchasing',
    items: [6, 7, 8],
  },
  {
    mn: 'Хадгалалт & Удирдлага',
    en: 'Storage & Management',
    items: [9, 10, 11, 12],
  },
  {
    mn: 'Тусламж & Аюулгүй байдал',
    en: 'Support & Security',
    items: [13, 14, 15, 16],
  },
];

const FaqSection = () => {
  const { t, isMongolian } = useLocalization();
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  const contactItems = [
    {
      label: 'Имэйл илгээх',
      value: 'info@finegold.mn',
      href: 'mailto:info@finegold.mn',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
        </svg>
      ),
    },
    {
      label: 'Залгах',
      value: '7799-9999',
      href: 'tel:+97677999999',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.18 1.18 2 2 0 012.16 0h3a2 2 0 012 1.72c.12.91.34 1.8.66 2.66a2 2 0 01-.45 2.11L6.1 7.76a16 16 0 006.14 6.14l1.27-1.27a2 2 0 012.11-.45c.86.32 1.75.54 2.66.66A2 2 0 0122 16.92z" />
        </svg>
      ),
    },
    {
      label: 'Messenger',
      value: '@finegoldnation',
      href: 'https://m.me/finegoldnation',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.5 8.5 0 01-12.7 7.4L3 20l1.2-4.6A8.5 8.5 0 1121 11.5z" />
          <path d="M8 12.5l2.4-2.4 2.2 2.2 3.4-3.1" />
        </svg>
      ),
    },
  ];

  const isMn = isMongolian();

  return (
    <section className="relative overflow-hidden bg-black px-6 py-16 lg:px-12 lg:py-20">
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-140px] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-[#E2B56D]/5 blur-[150px]" />
        <div className="absolute left-[-180px] bottom-0 h-[360px] w-[360px] rounded-full bg-[#E2B56D]/4 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* HEADER */}
        <motion.div
          className="mb-16 w-full text-left"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="h-px w-10 bg-[#E2B56D]" />
            <span className="text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
              {isMn ? 'Асуулт & Хариулт' : 'FAQ'}
            </span>
          </div>

          <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
            {t('faq.title')}
          </h2>
        </motion.div>

        {/* FAQ + CONTACT */}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:gap-12">
          {/* FAQ ITEMS — grouped by category */}
          <div className="flex flex-col gap-10">
            {CATEGORIES.map((cat, catIdx) => (
              <div key={catIdx}>
                {/* Category label */}
                <motion.div
                  className="mb-4 flex items-center gap-3"
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: catIdx * 0.05 }}
                >
                  <span className="inline-flex items-center rounded-full border border-[#E2B56D]/25 bg-[#E2B56D]/8 px-3 py-1 text-xs font-medium tracking-wide text-[#E2B56D]/80">
                    {isMn ? cat.mn : cat.en}
                  </span>
                  <div className="h-px flex-1 bg-white/6" />
                </motion.div>

                {/* Items in this category */}
                <div className="flex flex-col gap-3">
                  {cat.items.map((n, itemIdx) => {
                    const globalIdx = n; // use question number as unique key
                    const isOpen = openIndex === globalIdx;
                    const question = t(`faq.question${n}`);
                    const answer = t(`faq.answer${n}`);

                    return (
                      <motion.div
                        key={n}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: catIdx * 0.04 + itemIdx * 0.06, duration: 0.45 }}
                        className={`
                          group overflow-hidden rounded-[1.75rem] border
                          transition-all duration-500
                          ${
                            isOpen
                              ? 'border-[#E2B56D]/45 bg-gradient-to-br from-[#E2B56D]/8 via-white/[0.018] to-transparent shadow-[0_24px_80px_rgba(0,0,0,0.45)]'
                              : 'border-white/8 bg-white/[0.018] hover:border-white/15 hover:bg-white/[0.028]'
                          }
                        `}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                          className="flex w-full items-center justify-between gap-5 p-6 text-left sm:p-7"
                        >
                          {/* Question number + text */}
                          <div className="flex items-start gap-4">
                            <span className={`
                              mt-0.5 shrink-0 text-xs font-bold tabular-nums
                              transition-colors duration-300
                              ${isOpen ? 'text-[#E2B56D]' : 'text-white/20 group-hover:text-[#E2B56D]/50'}
                            `}>
                              {String(n).padStart(2, '0')}
                            </span>

                            <h3 className={`
                              text-base font-semibold leading-snug transition-colors duration-300 sm:text-lg
                              ${isOpen ? 'text-white' : 'text-white/82'}
                            `}>
                              {question}
                            </h3>
                          </div>

                          <motion.div
                            animate={{ rotate: isOpen ? 45 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`
                              flex h-10 w-10 shrink-0 items-center justify-center rounded-full border
                              transition-all duration-300
                              ${
                                isOpen
                                  ? 'border-[#E2B56D]/60 bg-[#E2B56D]/14 text-[#E2B56D]'
                                  : 'border-white/12 bg-white/5 text-white/45 group-hover:border-[#E2B56D]/35 group-hover:text-[#E2B56D]'
                              }
                            `}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: 'easeInOut' }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-7 sm:px-7">
                                <div className="mb-5 h-px w-full bg-white/8" />
                                <p className="max-w-3xl text-left text-sm leading-relaxed text-white/56 sm:text-base">
                                  {answer}
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* CONTACT CARD */}
          <motion.div
            className="
              relative overflow-hidden rounded-[2rem]
              border border-white/8
              bg-gradient-to-br from-white/[0.035] via-white/[0.018] to-[#E2B56D]/[0.035]
              p-6 text-left
              shadow-[0_24px_80px_rgba(0,0,0,0.35)]
              backdrop-blur-sm
              lg:sticky lg:top-6 lg:self-start
            "
            initial={{ opacity: 0, x: 26 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18, duration: 0.65, ease: 'easeOut' }}
          >
            {/* soft shine */}
            <div className="pointer-events-none absolute right-[-120px] top-[-120px] h-[260px] w-[260px] rounded-full bg-[#E2B56D]/10 blur-[90px]" />

            <div className="relative z-10">
              <h3 className="text-xl font-semibold tracking-tight text-white">
                {isMn ? 'Нэмэлт асуулт байна уу?' : 'Still have questions?'}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-white/45">
                {isMn
                  ? 'Манай баг тантай холбогдоход бэлэн байна. Та доорх сувгуудаар шууд холбогдоорой.'
                  : 'Our team is ready to assist you. Reach us through any of the channels below.'}
              </p>

              <div className="mt-8 flex flex-col gap-3">
                {contactItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="
                      group/contact flex items-center justify-between gap-4
                      rounded-2xl border border-white/8
                      bg-black/25 p-4
                      transition-all duration-300
                      hover:border-[#E2B56D]/35
                      hover:bg-[#E2B56D]/7
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="
                        flex h-11 w-11 shrink-0 items-center justify-center
                        rounded-full border border-[#E2B56D]/25
                        bg-[#E2B56D]/7 text-[#E2B56D]
                        transition-all duration-300
                        group-hover/contact:border-[#E2B56D]/55
                        group-hover/contact:bg-[#E2B56D]/14
                      ">
                        {item.icon}
                      </div>

                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/32">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-medium text-[#E2B56D]">
                          {item.value}
                        </p>
                      </div>
                    </div>

                    <span className="text-xl text-white/25 transition-all duration-300 group-hover/contact:translate-x-1 group-hover/contact:text-[#E2B56D]">
                      →
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-[#E2B56D]/18 bg-[#E2B56D]/7 p-4">
                <p className="text-sm leading-relaxed text-[#E2B56D]/80">
                  {isMn
                    ? 'Хэрэв та хариултаа шууд авч чадаагүй бол ~15 минут орчим хүлээхийг хүсье. Баярлалаа.'
                    : 'If you don\'t get an immediate response, please allow ~15 minutes. Thank you.'}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
