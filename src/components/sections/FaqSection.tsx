import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import {
  cardHover,
  cardTap,
  faqItem,
  goldenGlow,
  listItem,
  logoAnimation,
  staggerContainer,
  staggerList,
} from '../../animations/variants';
import faqBackground from '../../assets/images/faq-background.svg';
import faqCloseIcon from '../../assets/images/faq-close.svg';
import faqOpenIcon from '../../assets/images/faq-open.svg';
import logo from '../../assets/images/logo.svg';
import { useLocalization } from '../../hooks/useLocalization';
import { Section } from '../layout/Section';

const FaqSection = () => {
  const { t } = useLocalization();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set([0])); // First item open by default

  const faqItems = [
    {
      question: t('faq.question1'),
      answer: t('faq.answer1'),
    },
    {
      question: t('faq.question2'),
      answer: t('faq.answer2'),
    },
    {
      question: t('faq.question3'),
      answer: t('faq.answer3'),
    },
  ];

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <Section fullHeight={true} padding='lg' className='relative'>
      {/* FAQ Background - Enhanced with animation */}
      <motion.div
        className='absolute bottom-0 left-0 h-full w-full'
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      >
        {/* FAQ background image */}
        <img
          src={faqBackground}
          alt='FAQ background'
          className='object-fit h-full w-full object-cover'
        />

        {/* Enhanced overlay with gradient */}
        <div className='absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40'></div>
      </motion.div>

      <motion.div
        className='relative z-10 flex min-h-[120vh] flex-col items-center justify-center px-4 sm:min-h-[130vh] sm:px-6 lg:min-h-[150vh] lg:px-8'
        variants={staggerContainer}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          className='mb-4 flex items-center justify-center sm:mb-5'
          variants={logoAnimation}
        >
          <img src={logo} alt='Logo' className='h-10 w-16 sm:h-12 sm:w-20' />
        </motion.div>

        <motion.h2
          className='font-exo2-medium mt-4 mb-6 bg-gradient-to-b from-[#FFFFFF] to-[#6F4F1E85] bg-clip-text text-center text-2xl text-transparent sm:mt-5 sm:mb-8 sm:text-3xl md:text-4xl lg:text-5xl'
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
          variants={goldenGlow}
        >
          {t('faq.title')}
        </motion.h2>

        <motion.div
          className='mx-auto mt-16 flex max-w-4xl flex-col gap-4 sm:mt-20 sm:max-w-5xl sm:gap-5 lg:mt-28 lg:max-w-7xl'
          variants={staggerList}
        >
          {faqItems.map((item, index) => {
            const isOpen = openItems.has(index);

            return (
              <motion.div
                key={item.question}
                variants={faqItem}
                whileHover={cardHover}
                whileTap={cardTap}
                onClick={() => toggleItem(index)}
                className='relative flex cursor-pointer flex-col gap-4 overflow-hidden rounded-md bg-gradient-to-br from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] p-6 text-left sm:gap-5 sm:p-8 lg:p-10'
              >
                {/* Animated background glow */}
                <motion.div
                  className='absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Toggle Icon - Enhanced with rotation and better mobile positioning */}
                <motion.button
                  onClick={e => {
                    e.stopPropagation();
                    toggleItem(index);
                  }}
                  className='absolute top-4 right-4 z-10 touch-manipulation p-2 transition-opacity duration-200 hover:opacity-80 sm:top-6 sm:right-6'
                  aria-label={isOpen ? 'Close FAQ' : 'Open FAQ'}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <motion.img
                    src={isOpen ? faqCloseIcon : faqOpenIcon}
                    alt={isOpen ? 'Close' : 'Open'}
                    className='h-5 w-5 sm:h-6 sm:w-6'
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>

                <motion.h3
                  className='font-exo2-semibold relative z-10 pr-12 text-lg text-[#171717] sm:pr-16 sm:text-xl md:text-2xl lg:text-3xl'
                  variants={listItem}
                >
                  {item.question}
                </motion.h3>

                {/* Answer with enhanced smooth animation */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      className='relative z-10 overflow-hidden'
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        duration: 0.4,
                        ease: 'easeInOut',
                        height: { duration: 0.4 },
                        opacity: { duration: 0.3 },
                      }}
                    >
                      <motion.p
                        className='font-inter-regular pb-2 text-sm text-[#171717] sm:text-base md:text-lg'
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        {item.answer}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </Section>
  );
};

export default FaqSection;
