import { LazyGoldDashboardSection } from '../../utils/lazyLoad';
import { motion } from 'motion/react';
import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {
  backgroundParallax,
  floating,
  heroText,
  imageParallax,
  slideInLeft,
  slideUp,
  staggerContainer,
  textCharacter,
  textReveal,
} from '../../animations/variants';
import handGoldBar from '../../assets/images/hand-gold-bar.png';
import heroBackground from '../../assets/images/hero-background.svg';
import slider from '../../assets/images/slider.svg';
import { useLocalization } from '../../hooks/useLocalization';
import { Button } from '../common/Button';
import { FloatingParticles } from '../common/FloatingParticles';
import { RegisterForm } from '../common/RegisterForm';

// Character component for text animation
const AnimatedText: React.FC<{ text: string; className?: string }> = ({
  text,
  className,
}) => {
  return (
    <motion.span
      variants={heroText}
      initial='hidden'
      animate='visible'
      className={className}
    >
      {text.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={textCharacter}
          className='inline-block'
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export const HeroSection: React.FC = () => {
  const { t, isMongolian } = useLocalization();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    // Success animation will be shown
    // User will manually close with Finish button
  };

  return (
    <div className='relative overflow-hidden bg-black'>
      {/* Floating Particles Background */}
      <FloatingParticles />

      {/* Hero Background - Enhanced parallax effect */}
      <motion.div
        className='absolute inset-0 h-full w-full'
        variants={backgroundParallax}
        initial='hidden'
        animate='visible'
      >
        {/* Main Hero Background */}
        <div className='absolute bottom-0 left-0 h-full w-full'>
          {/* Hero background image */}
          <img
            src={heroBackground}
            alt='Hero background'
            className='h-full w-full object-cover object-left-bottom'
          />

          {/* Enhanced overlay with gradient */}
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30'></div>
        </div>
      </motion.div>

      {/* First Section - Main Hero */}
      <section className="relative flex min-h-screen flex-col justify-center pt-[100px] lg:pt-0 px-4 sm:px-6 lg:px-8">
        {/* Content Container */}
        <div className="relative mx-auto w-full max-w-7xl px-6 flex flex-col justify-center items-start text-left">
          <motion.div
            className='order-2 flex flex-col items-start text-left lg:order-1'
            variants={staggerContainer}
            initial='hidden'
            animate='visible'
          >
            <motion.div
              className={`mb-6 text-5xl md:text-7xl font-semibold leading-[1.05] tracking-tight text-white ${
  isMongolian() ? 'font-manrope' : 'font-manrope'
}`}
              variants={slideUp}
            >

              <div className="flex flex-col items-start">

  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-white"
  >
    {t('hero.title1')}
  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1, duration: 0.2 }}
    className="gold-shimmer"
  >
    {t('hero.title2')}
  </motion.div>

</div>

</motion.div>

<motion.p
  className={`mx-auto mt-4 max-w-2xl text-base text-white/85 sm:mt-5 sm:text-lg ${
    isMongolian() ? 'font-inter' : 'font-inter'
  }`}
  variants={slideUp}
>
  {t('hero.subtitle')}
</motion.p>

<motion.div
  variants={slideUp}
  className='mt-5 sm:mt-6 lg:mt-8'
>
<motion.button
  onClick={() => {
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }}
  whileHover={{ scale: 1.04 }}
  whileTap={{ scale: 0.97 }}
  className="
    relative px-7 py-3 rounded-xl
    font-display font-semibold
    text-white
    bg-transparent
  "
>
  {/* GRADIENT BORDER */}
  <motion.span
  className="
    absolute inset-0 rounded-xl
    p-[0.5px]
    bg-[linear-gradient(120deg,#E0B165,#FFD700,#FFF3B0,#FFD700,#E0B165)]
    bg-[length:200%_200%]
  "
  animate={{
    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
  }}
  transition={{
    duration: 1,
    ease: "easeInOut",
    repeat: Infinity,
  }}
>
  <span className="block h-full w-full rounded-xl bg-black" />
</motion.span>

{/* TEXT */}
<span className="relative z-10">
  {t('hero.cta')}
</span>

</motion.button>
  
</motion.div>

</motion.div>

</div>

{/* ISO SECTION — PREMIUM FINAL */}
<div className="mt-20 w-full">
  <div className="max-w-7xl mx-auto px-6">

    <div className="overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-12 py-10 min-w-max
                      bg-gradient-to-r from-black/40 via-black/30 to-black/10
                      backdrop-blur-xl
                      border-t border-white/10 relative">

        {/* subtle glow line */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E2B56D]/10 to-transparent blur-2xl pointer-events-none" />

        {/* LEFT TEXT */}
        <div className="text-white/70 text-sm md:text-base leading-snug min-w-[160px]">
          Олон улсын стандартаар <br />
          баталгаажсан
        </div>

        {/* ISO LOGOS */}
        <div className="flex items-center gap-14">

          {[
            "/partners/iso9001.png",
            "/partners/iso14001.png",
            "/partners/iso45001.png",
          ].map((src, i) => (
            <div
              key={i}
              className="relative group"
            >
              {/* glow */}
              <div className="absolute inset-0 rounded-full bg-[#E2B56D]/0 group-hover:bg-[#E2B56D]/10 blur-xl transition duration-500" />

              <img
                src={src}
                className="relative h-16 md:h-24 object-contain
                           opacity-60
                           transition-all duration-500 ease-out
                           group-hover:opacity-100
                           group-hover:scale-110
                           group-hover:brightness-125
                           group-hover:drop-shadow-[0_0_18px_rgba(255,215,150,0.35)]"
              />
            </div>
          ))}

        </div>

        {/* RIGHT TEXT */}
        <div className="text-white/70 text-sm md:text-base leading-snug max-w-[280px] min-w-[220px]">
          Алтны хөрөнгө оруулалт, хадгалалт, арилжаа,
          системийн аюулгүй байдал бүрэн даатгагдсан
        </div>

        {/* INSURANCE */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-[#E2B56D]/0 group-hover:bg-[#E2B56D]/10 blur-xl transition duration-500" />
          <img
            src="/partners/insurance.png"
            className="relative h-12 md:h-14 object-contain opacity-80
                       transition-all duration-500 ease-out
                       group-hover:opacity-100
                       group-hover:scale-105
                       group-hover:brightness-125
                       group-hover:drop-shadow-[0_0_18px_rgba(255,215,150,0.35)]"
          />
        </div>

      </div>
    </div>

  </div>
</div>
      </section>

{/* ===== DASHBOARD INSERT ===== */}
<div className="relative z-20 -mt-32 px-6">
  <div className="max-w-7xl mx-auto">
    <LazyGoldDashboardSection />
  </div>
</div>

{/* PREMIUM FEATURES SECTION */}
<section className="py-32 px-6 bg-black text-white">

  <div className="max-w-7xl mx-auto">

    {/* TITLE */}
    <div className="mb-20 flex flex-col items-center text-center">
      <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
        ДИЖИТАЛ ЭКОСИСТЕМ
      </h2>

      <p className="mt-4 max-w-2xl text-white/60 text-base leading-relaxed">
        Олон улс болон Монгол улсын стандарт хангасан (ISO 22001) Алт худалдан авах,
        зарах, хадгалах, арилжих боломжийг танд 24/7 санал болгож байна.
      </p>
    </div>

    {/* GRID WRAPPER */}
    <div className="relative">

      {/* AMBIENT GOLD LIGHT */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/4 top-0 w-[500px] h-[500px] bg-[#E2B56D]/10 blur-[120px]" />
        <div className="absolute right-1/4 bottom-0 w-[500px] h-[500px] bg-[#E2B56D]/10 blur-[120px]" />
      </div>

      {/* GRID */}
      <div className="relative z-10 grid md:grid-cols-2 gap-8">

        {[
          {
            img: "/images/gold-bars.png",
            title: "999.9 цэвэр алт",
            desc: "1гр-100гр хүртэл төрөл бүрийн сонголт"
          },
          {
            img: "/images/kiosk.png",
            title: "Алтны киоск",
            desc: "24/7 шууд худалдан авах боломж"
          },
          {
            img: "/images/app.png",
            title: "Гар утасны апп",
            desc: "Хаанаас ч удирдах боломж"
          },
          {
            img: "/images/gift.png",
            title: "Үе дамжих үнэт өв",
            desc: "Бэлэг болон хөрөнгө оруулалт"
          }
        ].map((card, i) => (
          
          <div
            key={i}
            className="
              group relative rounded-2xl overflow-hidden
              border border-white/10 bg-white/[0.03]
              backdrop-blur-xl
              transition-all duration-500
              hover:border-[#E2B56D]/40
              hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)]
              hover:-translate-y-2
            "
          >

            {/* GLOW ON HOVER */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none">
              <div className="absolute -inset-10 bg-gradient-to-br from-[#E2B56D]/20 to-transparent blur-3xl" />
            </div>

            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={card.img}
                className="
                  w-full h-64 object-cover
                  transition duration-700
                  group-hover:scale-110
                "
              />
            </div>

            {/* GLASS OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />

            {/* CONTENT */}
            <div className="relative p-6">
              <h3 className="text-xl font-semibold mb-2 text-white">
                {card.title}
              </h3>

              <p className="text-white/60 text-sm">
                {card.desc}
              </p>
            </div>

          </div>

        ))}

      </div>
    </div>

  </div>
</section>

      {/* Registration Modal */}
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
            // Responsive: on mobile, set fixed dimensions 326x386
            ...(window.innerWidth <= 640
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
