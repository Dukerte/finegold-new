import { motion } from 'motion/react';
import React from 'react';
import {
  arrowHover,
  cardHover,
  cardTap,
  floating,
  goldenGlow,
  imageParallax,
  listItem,
  slideUp,
  staggerContainer,
  staggerList,
  textReveal,
} from '../../animations/variants';

// 🔥 CHANGE IMAGE ONLY
import appImage from '../../assets/images/app.png';

import { useLocalization } from '../../hooks/useLocalization';
import { ArrowOutward } from '../common/ArrowOutward';
import { Button } from '../common/Button';

export const APPFeaturesSection: React.FC = () => {
  const { t } = useLocalization();

  return (
    <section
      id='features-app'
      className='relative flex min-h-screen items-center overflow-hidden bg-black px-4 sm:px-6 lg:px-8'
    >
      {/* Background Image */}
      <motion.div
        className='absolute inset-0 z-0 hidden items-center justify-center lg:flex'
        variants={imageParallax}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className='relative flex h-full w-full max-w-lg items-center justify-center sm:max-w-xl lg:max-w-2xl'>
          <motion.img
            src={appImage}
            alt='Mobile App'
            className='h-auto max-h-[80vh] w-full object-contain'
            variants={floating}
            animate='visible'
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className='relative z-10 container mx-auto py-16 sm:py-20'>
        <motion.div
          className='grid grid-cols-1 items-center gap-16 sm:gap-20 lg:grid-cols-2 lg:gap-100'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
        >

{/* LEFT */}
<motion.div
  className='flex h-full flex-col justify-end gap-12 text-center sm:gap-16 lg:gap-20 lg:text-left'
  variants={staggerList}
>
<div className="space-y-6 sm:space-y-8">

  {/* TITLE 1 */}
  <motion.h2
    className='font-display font-extrabold text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] tracking-tight'
    variants={textReveal}
    whileHover={{
      scale: 1.02,
      textShadow: '0 0 12px rgba(226,181,109,0.35), 0 0 24px rgba(226,181,109,0.25)',
    }}
  >
    {t('features3.title1')}
  </motion.h2>

  {/* TITLE 2 */}
  <motion.h3
    className='font-display font-medium text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl leading-tight tracking-tight'
    variants={slideUp}
  >
    <span className='bg-gradient-to-r from-[#F5D7A1] via-[#E2B56D] to-[#CFA15B] bg-clip-text text-transparent'>
      {t('features3.title2')}
    </span>
  </motion.h3>

</div>

  {/* DESCRIPTION */}
  <motion.p
    className='text-base sm:text-lg lg:text-lg leading-relaxed text-white/70 max-w-xl mx-auto lg:mx-0'
    variants={slideUp}
  >
    {t('features3.description')}
  </motion.p>

  {/* BUTTONS */}
  <motion.div
    className='flex flex-row items-center justify-center gap-4 lg:justify-start'
    variants={staggerList}
  >
    {/* PRIMARY */}
    <motion.div variants={listItem}>
      <button className='px-7 py-3 rounded-xl font-display font-semibold text-black bg-gradient-to-r from-[#F5D7A1] via-[#E2B56D] to-[#CFA15B] shadow-[0_8px_24px_rgba(226,181,109,0.25)]'>
        {t('features3.button1')}
      </button>
    </motion.div>

    {/* SECONDARY */}
    <motion.div variants={listItem}>
      <button className='flex items-center gap-2 whitespace-nowrap px-5 py-3 rounded-xl font-display font-medium text-white/80 border border-white transition-all duration-300 hover:text-white hover:border-[#E2B56D] hover:bg-white/5'>
        {t('features3.button2')}
        <ArrowOutward className='h-4 w-4' />
      </button>
    </motion.div>
  </motion.div>
</motion.div>

{/* MOBILE IMAGE */}
<motion.div className='flex justify-center lg:hidden'>
  <motion.img
    src={appImage}
    alt='Mobile App'
    className='h-auto max-h-[50vh] w-full max-w-md object-contain'
    variants={floating}
    animate='visible'
  />
</motion.div>

{/* RIGHT SIDE */}
<motion.div
  className='flex h-full flex-row justify-between gap-8 sm:gap-12 lg:flex-col'
  variants={staggerList}
>
  <motion.div className='space-y-6 sm:space-y-8' variants={staggerList}>

    {[1,2,3,4].map((i) => (
      <motion.div key={i} className='group cursor-pointer' variants={listItem}>
        <div className='flex items-start justify-between gap-4 text-right'>
          <p className='font-inter-regular flex-1 text-sm text-[#FBFBFB] sm:text-base lg:text-lg'>
            {t(`features3.popup${i}`)}
          </p>
          <ArrowOutward className='h-4 w-4 sm:h-5 sm:w-5' />
        </div>
        <motion.div
          className='mt-4 h-[1px] bg-gradient-to-r from-[#FBFBFB]/50 to-transparent'
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.6 }}
        />
      </motion.div>
    ))}

  </motion.div>

  {/* BOTTOM */}
  <motion.div
    className='mx-auto pt-4 text-center lg:mx-0 lg:text-left'
    variants={goldenGlow}
  >
    <motion.h3 className='font-inter-medium mb-2 bg-gradient-to-r from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] bg-clip-text text-xl text-transparent sm:text-2xl lg:text-3xl'>
      {t('features3.userCount')}
    </motion.h3>

    <motion.p className='font-inter-regular text-sm text-[#FBFBFB] opacity-70 sm:text-base lg:text-lg'>
      {t('features3.userDescription')}
    </motion.p>
  </motion.div>

</motion.div>

        </motion.div>
      </div>
    </section>
  );
};

