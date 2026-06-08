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
import { FloatingParticles } from '../common/FloatingParticles';
import { RegisterForm } from '../common/RegisterForm';
import { LazyGoldDashboardSection } from '../../utils/lazyLoad';

const SLIDE_IMAGES = [
  '/slides/slide1.png',
  '/slides/slide2.png',
  '/slides/slide3.png',
  '/slides/slide4.png',
];

const SLIDES = [
  {
    id: 0,
    title1: 'ҮЕ ДАМЖИХ',
    title2: 'ҮНЭТ ӨВ',
    subtitle:
      'Монголын алтны зах зээлийг ил тод, хүртээмжтэй, найдвартай болгох зорилготой Fine Gold Nation нь иргэн бүрт алтны үнэ цэнийг хүртээж, хөрөнгийг үе дамжуулан хадгалах шинэ экосистемийг бий болгож байна.',
    cta: 'Хөрөнгө оруулалтын тооцоолуур',
    ctaAction: 'calculator',
    accentColor: '#E2B56D',
  },
  {
    id: 1,
    title1: '24/7 АЛТНЫ',
    title2: 'КИОСК АТМ',
    subtitle:
      '999.9 сорьцтой Fine Gold Nation брэндийн алтан гулдмайг 24/7 бодит цагийн ханшаар шууд гартаа авна. Карт, QR болон аппаар төлбөр хийх боломжтой. Хурдан, найдвартай, хямд.',
    cta: 'ATM байршил харах',
    ctaAction: 'atm',
    accentColor: '#C8A96E',
  },
  {
    id: 2,
    title1: 'FGN',
    title2: 'АППЛИКЕЙШН',
    subtitle:
      'Алт худалдан авах, зарах, хадгалах, арилжих, алт барьцаалан зээл авах, өвлүүлэх — бүгдийг нэг аппаас. Баталгаатай физик алтны нөөцөд холбогдсон дижитал платформ.',
    cta: 'Апп татаж авах',
    ctaAction: 'app',
    accentColor: '#F5D7A1',
  },
  {
    id: 3,
    title1: 'ТӨВ АЗИЙН',
    title2: 'ТЭРГҮҮЛЭГЧ',
    subtitle:
      '2030 он гэхэд Fine Gold Nation нь Монголдоо төдийгүй Төв Азид хөрөнгийн менежмент, хөрөнгө оруулалтын тэргүүлэх платформ болно. ISO 9001 · 14001 · 45001 · 27001 баталгаатай.',
    cta: 'Бидний тухай',
    ctaAction: 'about',
    accentColor: '#D4AF6A',
  },
];

const GoldBorderButton: React.FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.04 }}
    whileTap={{ scale: 0.97 }}
    className="
      group relative overflow-hidden rounded-xl
      px-6 py-3
      font-display font-semibold text-white
      sm:px-7
    "
  >
    <motion.span
      className="
        absolute inset-0 rounded-xl p-[1px]
        bg-[linear-gradient(120deg,#E0B165,#FFD700,#FFF3B0,#FFD700,#E0B165)]
        bg-[length:220%_220%]
      "
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    >
      <span className="block h-full w-full rounded-xl bg-black/95" />
    </motion.span>

    <span
      className="
        pointer-events-none absolute inset-0
        translate-x-[-120%]
        bg-gradient-to-r from-transparent via-white/15 to-transparent
        transition-transform duration-700
        group-hover:translate-x-[120%]
      "
    />

    <span className="relative z-10">{label}</span>
  </motion.button>
);

const SlideImage: React.FC<{ src: string; accentColor: string }> = ({
  src,
  accentColor,
}) => (
  <div
    className="pointer-events-none absolute hidden lg:block"
    style={{
      right: 60,
      top: '50%',
      transform: 'translateY(-50%)',
      width: '38%',
      maxHeight: '70vh',
    }}
  >
    <div
      style={{
        position: 'absolute',
        inset: -40,
        background: `radial-gradient(ellipse at center, ${accentColor}25 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
    />

    <img
      src={src}
      alt="Fine Gold Nation visual"
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '70vh',
        objectFit: 'contain',
        objectPosition: 'center',
        display: 'block',
        mixBlendMode: 'screen',
      }}
    />
  </div>
);

const HeroCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
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

  useEffect(() => {
    if (paused) return undefined;

    const id = window.setTimeout(next, 3000);
    return () => window.clearTimeout(id);
  }, [current, paused, next]);

  const slide = SLIDES[current];

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -80 : 80 }),
  };

  const handleCta = () => {
    if (slide.ctaAction === 'calculator') {
      document
        .getElementById('calculator')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (slide.ctaAction === 'atm') {
      window.location.hash = '/atm';
    } else if (slide.ctaAction === 'app') {
      document
        .getElementById('features-app')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      document
        .getElementById('about')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="
        relative z-10 flex min-h-screen flex-col justify-center
        overflow-hidden pt-[105px] lg:pt-0
      "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
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
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse at 72% 50%, ${slide.accentColor}18 0%, transparent 66%)`,
            }}
          />

          <SlideImage
            src={SLIDE_IMAGES[current]}
            accentColor={slide.accentColor}
          />

          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-12">
            <div className="max-w-2xl text-left">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="
                  mb-5 inline-flex items-center gap-2 rounded-full
                  border border-white/10 bg-white/5 px-4 py-1.5
                  text-xs text-white/50 backdrop-blur-sm sm:mb-6
                "
              >
                <span className="font-semibold text-[#E2B56D]">
                  {String(current + 1).padStart(2, '0')}
                </span>
                <span>/</span>
                <span>{String(SLIDES.length).padStart(2, '0')}</span>
              </motion.div>

              <div className="mb-6 font-manrope font-semibold leading-[1.03] tracking-tight">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                  className="text-[3.25rem] text-white sm:text-6xl md:text-7xl"
                >
                  {slide.title1}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="gold-shimmer text-[3.25rem] sm:text-6xl md:text-7xl"
                >
                  {slide.title2}
                </motion.div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="
                  max-w-xl font-inter
                  text-base leading-relaxed text-white/75
                  sm:text-lg
                "
              >
                {slide.subtitle}
              </motion.p>

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

      <button
        onClick={prev}
        className="
          absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2
          items-center justify-center rounded-full border border-white/15
          bg-black/40 text-white/60 backdrop-blur-sm
          transition-all duration-300
          hover:border-[#E2B56D]/50 hover:bg-black/60 hover:text-[#E2B56D]
          lg:left-8 lg:flex
        "
        aria-label="Previous slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 12L6 8l4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <button
        onClick={next}
        className="
          absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2
          items-center justify-center rounded-full border border-white/15
          bg-black/40 text-white/60 backdrop-blur-sm
          transition-all duration-300
          hover:border-[#E2B56D]/50 hover:bg-black/60 hover:text-[#E2B56D]
          lg:right-8 lg:flex
        "
        aria-label="Next slide"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
        style={{ lineHeight: 0 }}
      >
        <svg
          height="8"
          style={{ overflow: 'visible', cursor: 'pointer' }}
          viewBox={`0 0 ${SLIDES.length * 10 + 16} 8`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {SLIDES.map((s, i) => {
            const width = i === current ? 20 : 8;
            const x = SLIDES.slice(0, i).reduce(
              (acc, _, j) => acc + (j === current ? 20 : 8) + 5,
              0
            );

            return (
              <g key={s.id} onClick={() => goTo(i, i > current ? 1 : -1)}>
                <rect
                  x={x}
                  y={1}
                  width={width}
                  height={6}
                  rx={3}
                  fill="rgba(255,255,255,0.2)"
                />

                {i === current && (
                  <motion.rect
                    key={`${current}-${paused}`}
                    x={x}
                    y={1}
                    height={6}
                    rx={3}
                    fill="#E2B56D"
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{
                      duration: paused ? 0 : 3,
                      ease: 'linear',
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
};

export const HeroSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormSuccess = () => {};

  return (
    <div className="relative overflow-hidden bg-black">
      <FloatingParticles />

      <motion.div
        className="absolute inset-0 z-0 h-screen w-full"
        variants={backgroundParallax}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0">
          <img
            src={heroBackground}
            alt="Hero background"
            className="h-full w-full object-cover object-right-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/55" />
        </div>
      </motion.div>

      <HeroCarousel />

      {/* ISO SECTION */}
      <motion.div
        className="relative z-20 mt-10 w-full sm:mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div className="mx-auto max-w-7xl px-6">
          <div
            className="
              overflow-hidden rounded-[1.75rem]
              border border-white/8
              bg-white/[0.022]
              px-5 py-5
              backdrop-blur-sm
              sm:px-6 sm:py-6
            "
          >
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-7">
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/38">
                  ISO БАТАЛГААЖУУЛАЛТ
                </span>

                <div className="flex flex-wrap items-center gap-5 sm:gap-6 lg:gap-7">
                  {[
                    { src: '/partners/iso9001.png', label: 'ISO 9001' },
                    { src: '/partners/iso14001.png', label: 'ISO 14001' },
                    { src: '/partners/iso45001.png', label: 'ISO 45001' },
                  ].map((iso, i) => (
                    <div
                      key={i}
                      className="
                        group flex items-center gap-2.5
                        opacity-80 transition-all duration-300
                        hover:opacity-100
                      "
                    >
                      <img
                        src={iso.src}
                        alt={iso.label}
                        className="
                          h-12 object-contain
                          transition-all duration-300
                          sm:h-14
                          group-hover:scale-105
                          group-hover:drop-shadow-[0_0_10px_rgba(226,181,109,0.42)]
                        "
                      />

                      <span
                        className="
                          text-sm font-medium text-white/50
                          transition-colors duration-300
                          group-hover:text-[#E2B56D]
                        "
                      >
                        {iso.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/8 pt-6 lg:flex-row lg:items-center lg:gap-7 lg:border-t-0 lg:pt-0">
                <span className="text-xs font-medium uppercase tracking-[0.22em] text-white/38">
                  ДААТГАГДСАН АЛТ
                </span>

                <div
                  className="
                    group flex items-center
                    opacity-80 transition-all duration-300
                    hover:opacity-100
                  "
                >
                  <img
                    src="/partners/insurance.png"
                    alt="Агис Даатгал"
                    className="
                      h-12 object-contain
                      transition-all duration-300
                      sm:h-14
                      group-hover:scale-105
                      group-hover:drop-shadow-[0_0_10px_rgba(226,181,109,0.42)]
                    "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative z-20 mt-8 px-6">
        <div className="mx-auto max-w-7xl">
          <LazyGoldDashboardSection />
        </div>
      </div>

      <section className="relative overflow-hidden bg-black px-6 py-32 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] bg-[#E2B56D]/6 blur-[130px]" />
          <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] bg-[#E2B56D]/6 blur-[130px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            className="mb-16 w-full text-left"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-px w-10 bg-[#E2B56D]" />
              <span className="text-sm font-medium uppercase tracking-widest text-[#E2B56D]">
                Бүтээгдэхүүн
              </span>
            </div>

            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              ДИЖИТАЛ <span className="gold-shimmer">ЭКОСИСТЕМ</span>
            </h2>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/55">
              ISO стандарт хангасан алт худалдан авах, зарах, хадгалах,
              арилжих боломжийг 24/7 санал болгоно.
            </p>
          </motion.div>

          <motion.div
            className="grid gap-5 md:grid-cols-2"
            variants={staggerList}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
          >
            {[
              {
                img: '/images/gold-bars.png',
                title: '999.9 цэвэр алт',
                desc: '1гр — 100гр хүртэл FGN брэндийн алтан гулдмай',
              },
              {
                img: '/images/kiosk.png',
                title: 'Алтны киоск ATM',
                desc: '24/7 шууд худалдан авах боломж',
              },
              {
                img: '/images/app.png',
                title: 'Гар утасны апп',
                desc: 'Хаанаас ч, хэзээ ч удирдах боломж',
              },
              {
                img: '/images/gift.png',
                title: 'Үе дамжих үнэт өв',
                desc: 'Бэлэг болон хөрөнгө оруулалтын шийдэл',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                variants={listItem}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="
                  group relative overflow-hidden rounded-3xl
                  border border-white/8 bg-white/[0.02]
                  transition-all duration-500
                  hover:border-[#E2B56D]/35
                  hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
                "
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100">
                  <div className="absolute -inset-8 bg-gradient-to-br from-[#E2B56D]/12 to-transparent blur-3xl" />
                </div>

                <div className="h-64 overflow-hidden">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="
                      h-full w-full object-cover
                      transition duration-700
                      group-hover:scale-105
                    "
                  />
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-left">
                  <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#E2B56D]">
                    Fine Gold Nation
                  </p>
                  <h3 className="text-xl font-semibold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/50">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

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
            ...(typeof window !== 'undefined' && window.innerWidth <= 640
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