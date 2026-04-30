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
import goldAtmImage from '../../assets/images/gold-atm.png';
import { useLocalization } from '../../hooks/useLocalization';
import { ArrowOutward } from '../common/ArrowOutward';
import { Button } from '../common/Button';

export const ATMFeaturesSection: React.FC = () => {
  const { t } = useLocalization();

  return (
    <section
      id='features'
      className='relative flex min-h-screen items-center overflow-hidden bg-black px-4 sm:px-6 lg:px-8'
    >
      {/* Background Gold ATM Image - Hidden on mobile/tablet, visible on desktop */}
      <motion.div
        className='absolute inset-0 z-0 hidden items-center justify-center lg:flex'
        variants={imageParallax}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className='relative flex h-full w-full max-w-lg items-center justify-center sm:max-w-xl lg:max-w-2xl'>
          <motion.img
            src={goldAtmImage}
            alt='Gold ATM'
            className='h-auto max-h-[80vh] w-full object-contain'
            variants={floating}
            animate='visible'
          />
        </div>
      </motion.div>

      {/* Content Container */}
      <div className='relative z-10 container mx-auto py-16 sm:py-20'>
        <motion.div
          className='grid grid-cols-1 items-center gap-16 sm:gap-20 lg:grid-cols-2 lg:gap-100'
          variants={staggerContainer}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true, amount: 0.3 }}
        >

{/* Left Side Content */}
<motion.div
  className='flex h-full flex-col justify-end gap-12 text-center sm:gap-16 lg:gap-20 lg:text-left'
  variants={staggerList}
>
{/* TITLE BLOCK */}
<div className="space-y-6 sm:space-y-8">

  {/* TITLE 1 */}
  <motion.h2
    className='
      font-display font-extrabold
      text-white
      text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
      leading-[1.02]
      tracking-tight
    '
    variants={textReveal}
    whileHover={{
      scale: 1.02,
      textShadow: '0 0 12px rgba(226,181,109,0.35), 0 0 24px rgba(226,181,109,0.25)',
    }}
  >
    {t('features2.title1')}
  </motion.h2>

  {/* TITLE 2 */}
<motion.h3
  className='
    font-display font-medium

    text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl
    leading-tight
    tracking-tight

    cursor-default
  '
  variants={slideUp}
>
  <span
    className="
      bg-gradient-to-r
      from-[#F5D7A1]
      via-[#E2B56D]
      to-[#CFA15B]

      bg-clip-text
      text-transparent
    "
  >
    {t('features2.title2')}
  </span>
</motion.h3>


</div>
  {/* DESCRIPTION */}
  <motion.p
    className='
      text-base sm:text-lg lg:text-lg
      leading-relaxed
      text-white/70
      max-w-xl
      mx-auto lg:mx-0
    '
    variants={slideUp}
  >
    {t('features2.description')}
  </motion.p>

  {/* BUTTONS */}
  <motion.div
    className='flex flex-row items-center justify-center gap-4 lg:justify-start'
    variants={staggerList}
  >
    {/* PRIMARY BUTTON */}
<motion.div
  variants={listItem}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  className='flex-shrink-0'
>
  <button
    className="
      px-7 py-3 rounded-xl
      font-display font-semibold
      text-black

      bg-gradient-to-r
      from-[#F5D7A1]
      via-[#E2B56D]
      to-[#CFA15B]

      bg-[length:200%_auto]
      transition-all duration-500

      shadow-[0_8px_24px_rgba(226,181,109,0.25)]
      hover:shadow-[0_12px_36px_rgba(226,181,109,0.55)]

      hover:bg-right
      hover:brightness-110
    "
  >
    {t('features2.button1')}
  </button>
</motion.div>

    {/* SECONDARY BUTTON */}
    <motion.div
  variants={listItem}
  whileHover={cardHover}
  whileTap={cardTap}
  className='flex-shrink-0'
>
  <button
    className="
      flex items-center gap-2
      whitespace-nowrap   /* ✅ FORCE SINGLE LINE */

      px-5 py-3 rounded-xl

      font-display font-medium
      text-white/80

      border border-white   /* ✅ FRAME */

      transition-all duration-300

      hover:text-white
      hover:border-[#E2B56D]   /* gold border on hover */
      hover:bg-white/5         /* subtle glass effect */
    "
  >
    {t('features2.button2')}
    <ArrowOutward className='h-4 w-4 transition-transform duration-300 group-hover:translate-x-1' />
  </button>
</motion.div>
  </motion.div>
</motion.div>

          {/* Mobile/Tablet Image - Shown above right section on small screens */}
          <motion.div
            className='flex justify-center lg:hidden'
            variants={slideUp}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.img
              src={goldAtmImage}
              alt='Gold ATM'
              className='h-auto max-h-[50vh] w-full max-w-md object-contain sm:max-h-[60vh] sm:max-w-lg'
              variants={floating}
              animate='visible'
            />
          </motion.div>

          {/* Right Side Content */}
          <motion.div
            className='flex h-full flex-row justify-between gap-8 sm:gap-12 lg:flex-col'
            variants={staggerList}
          >
            <motion.div
              className='space-y-6 sm:space-y-8'
              variants={staggerList}
            >
             <motion.div

                className='group cursor-pointer'
                variants={listItem}
                whileHover={cardHover}
                whileTap={cardTap}
              >
                <div className='flex items-start justify-between gap-4 text-right'>
                  <p className='font-inter-regular flex-1 text-sm text-[#FBFBFB] sm:text-base lg:text-lg'>
                    {t('features2.popup1')}
                  </p>
                  <motion.div whileHover={arrowHover} className='flex-shrink-0'>
                    <ArrowOutward className='h-4 w-4 sm:h-5 sm:w-5' />
                  </motion.div>
                </div>
                <motion.div
                  className='mt-4 h-[1px] bg-gradient-to-r from-[#FBFBFB]/50 to-transparent'
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                />
              </motion.div>

              <motion.div
                className='group cursor-pointer'
                variants={listItem}
                whileHover={cardHover}
                whileTap={cardTap}
              >
                <div className='flex items-start justify-between gap-4 text-right'>
                  <p className='font-inter-regular flex-1 text-sm text-[#FBFBFB] sm:text-base lg:text-lg'>
                    {t('features2.popup2')}
                  </p>
                  <motion.div whileHover={arrowHover} className='flex-shrink-0'>
                    <ArrowOutward className='h-4 w-4 sm:h-5 sm:w-5' />
                  </motion.div>
                </div>
                <motion.div
                  className='mt-4 h-[1px] bg-gradient-to-r from-[#FBFBFB]/50 to-transparent'
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
              </motion.div>

              <motion.div
                className='group cursor-pointer'
                variants={listItem}
                whileHover={cardHover}
                whileTap={cardTap}
              >
                <div className='flex items-start justify-between gap-4 text-right'>
                  <p className='font-inter-regular flex-1 text-sm text-[#FBFBFB] sm:text-base lg:text-lg'>
                    {t('features2.popup3')}
                  </p>
                  <motion.div whileHover={arrowHover} className='flex-shrink-0'>
                    <ArrowOutward className='h-4 w-4 sm:h-5 sm:w-5' />
                  </motion.div>
                </div>
                <motion.div
                  className='mt-4 h-[1px] bg-gradient-to-r from-[#FBFBFB]/50 to-transparent'
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                />
              </motion.div>

              <motion.div
                className='group cursor-pointer'
                variants={listItem}
                whileHover={cardHover}
                whileTap={cardTap}
              >
                <div className='flex items-start justify-between gap-4 text-right'>
                  <p className='font-inter-regular flex-1 text-sm text-[#FBFBFB] sm:text-base lg:text-lg'>
                    {t('features2.popup4')}
                  </p>
                  <motion.div whileHover={arrowHover} className='flex-shrink-0'>
                    <ArrowOutward className='h-4 w-4 sm:h-5 sm:w-5' />
                  </motion.div>
                </div>
                <motion.div
                  className='mt-4 h-[1px] bg-gradient-to-r from-[#FBFBFB]/50 to-transparent'
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                />
              </motion.div>
              
            </motion.div>

            <motion.div
              className='mx-auto pt-4 text-center lg:mx-0 lg:text-left'
              variants={goldenGlow}
            >
              <motion.h3
                className='font-inter-medium mb-2 bg-gradient-to-r from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] bg-clip-text text-xl text-transparent sm:text-2xl lg:text-3xl'
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 },
                }}
              >
                {t('features2.userCount')}
              </motion.h3>
              <motion.p
                className='font-inter-regular text-sm leading-relaxed text-[#FBFBFB] opacity-70 sm:text-base lg:text-lg'
                variants={slideUp}
              >
                {t('features2.userDescription')}
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
