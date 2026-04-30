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
      <section className='relative flex min-h-screen flex-col justify-center px-4 sm:px-6 lg:px-8'>
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
    transition={{ delay: 0.2, duration: 0.8 }}
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
  <span
    className="
      absolute inset-0 rounded-xl
      p-[1px]
      bg-[linear-gradient(120deg,#E0B165,#FFD700,#FFF3B0,#FFD700,#E0B165)]
      bg-[length:200%_200%]
      animate-borderShimmer
    "
  >
    <span className="block h-full w-full rounded-xl bg-black" />
  </span>

  {/* TEXT */}
  <span className="relative z-10">
    {t('hero.cta')}
  </span>
</motion.button>
  
</motion.div>

</motion.div>

</div>

{/* ISO SECTION — FINAL PREMIUM VERSION */}
<div className="mt-20 w-full">
  <div className="max-w-7xl mx-auto px-6">

    {/* SINGLE CLEAN STRIP */}
    <div className="flex items-center justify-start gap-5 py-10 
                    bg-black/30 backdrop-blur-md 
                    border-t border-white/10">

      {/* LEFT TEXT */}
      <div className="text-white/70 text-sm md:text-base leading-snug text-left">
        Олон улсын стандартаар <br />
        баталгаажсан
      </div>

      {/* ISO LOGOS */}
      <div className="flex items-center gap-16">

        <img
          src="/partners/iso9001.png"
          className="h-20 md:h-24 object-contain
                     opacity-60
                     transition-all duration-300 ease-out
                     hover:opacity-100 hover:scale-105 hover:brightness-125
                     hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        />

        <img
          src="/partners/iso14001.png"
          className="h-20 md:h-24 object-contain
                     opacity-60
                     transition-all duration-300 ease-out
                     hover:opacity-100 hover:scale-105 hover:brightness-125
                     hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        />

        <img
          src="/partners/iso45001.png"
          className="h-20 md:h-24 object-contain
                     opacity-60
                     transition-all duration-300 ease-out
                     hover:opacity-100 hover:scale-105 hover:brightness-125
                     hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        />

      </div>

      {/* RIGHT TEXT + INSURANCE */}
      <div className="flex items-center gap-6 ml-24">

        <p className="text-white/70 text-sm md:text-base max-w-md leading-snug text-left">
          Алтны хөрөнгө оруулалт, хадгалалт, арилжаа,
          системийн аюулгүй байдал бүрэн даатгагдсан
        </p>

        <img
          src="/partners/insurance.png"
          className="h-13.5 md:h-15 object-contain opacity-80 
                     transition-all duration-300 ease-out
                     hover:opacity-100 hover:scale-105 hover:brightness-125
                     hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]"
        />

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

      {/* Second Section - Features with Enhanced Overflow */}
      <section className="py-32 px-6 bg-black text-white">

  <div className="max-w-7xl mx-auto">

    {/* TITLE */}
    <div className="mb-16 flex flex-col items-center text-center">

  <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">
    ДИЖИТАЛ ЭКОСИСТЕМ
  </h2>

  <p className="mt-4 max-w-2xl text-white/60 text-base leading-relaxed">
    Олон улс болон Монгол улсын стандарт хангасан (ISO 22001) Алт худалдан авах,
    зарах, хадгалах, арилжих боломжийг танд 24/7 санал болгож байна. Шуурхай
    гүйлгээ, түргэн хөрвөх чадвар, баталгаатай үнэ, аюулгүй ажиллагаагаар та хаана ч, хэзээ ч, хамгийн бага эрсдэлтэй хөрөнгө оруулалтын ирээдүйгээ бүтээх боломжтой.
  </p>

 <p className="mt-4 max-w-2xl text-white/60 text-base leading-relaxed">
 
 </p>
</div>

    {/* GRID */}
    <div className="grid md:grid-cols-2 gap-8">

      {/* CARD 1 */}
      <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition">

        <img
          src="/images/gold-bars.png"
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            999.9 цэвэр алт
          </h3>
          <p className="text-white/60 text-sm">
            1гр-100гр хүртэл төрөл бүрийн сонголт
          </p>
        </div>

      </div>

      {/* CARD 2 */}
      <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition">

        <img
          src="/images/kiosk.png"
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            Алтны киоск
          </h3>
          <p className="text-white/60 text-sm">
            24/7 шууд худалдан авах боломж
          </p>
        </div>

      </div>

      {/* CARD 3 */}
      <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition">

        <img
          src="/images/app.png"
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            Гар утасны апп
          </h3>
          <p className="text-white/60 text-sm">
            Хаанаас ч удирдах боломж
          </p>
        </div>

      </div>

      {/* CARD 4 */}
      <div className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition">

        <img
          src="/images/gift.png"
          className="w-full h-64 object-cover"
        />

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-2">
            Үе дамжих үнэт өв
          </h3>
          <p className="text-white/60 text-sm">
            Бэлэг болон хөрөнгө оруулалт
          </p>
        </div>

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
