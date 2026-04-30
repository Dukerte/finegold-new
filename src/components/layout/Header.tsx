import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import {
  cardHover,
  cardTap,
  listItem,
  logoAnimation,
  slideInRight,
  staggerContainer,
  staggerList,
} from '../../animations/variants';
import logo from '../../assets/images/logo.svg';
import { useLocalization } from '../../hooks/useLocalization';
import { useScrollHeader } from '../../hooks/useScrollHeader';
import type { NavigationItem } from '../../types';
import { LanguageSwitcher } from '../common/LanguageSwitcher';

export const Header: React.FC = () => {
  const { t, isMongolian } = useLocalization();
  const { isScrolled, scrollDirection } = useScrollHeader();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    { id: 'about', label: { en: t('nav.about'), mn: t('nav.about') }, href: '#about' },
    { id: 'products', label: { en: t('nav.products'), mn: t('nav.products') }, href: '#products' },
    { id: 'atm-locations', label: { en: t('nav.atmLocations'), mn: t('nav.atmLocations') }, href: '#atm-locations' },
    { id: 'contact', label: { en: t('nav.contact'), mn: t('nav.contact') }, href: '#contact' },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <motion.header
      className='fixed top-0 right-0 left-0 z-50 transition-all duration-300'
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
        backgroundColor: isScrolled ? 'rgba(0,0,0,0.95)' : 'rgba(0,0,0,0.3)',
        backdropFilter: isScrolled ? 'blur(10px)' : 'blur(0px)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
      }}
      transition={{ duration: 0.4 }}
      style={{
        transform:
          scrollDirection === 'down' && isScrolled
            ? 'translateY(-100%)'
            : 'translateY(0)',
      }}
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <motion.div
          className='flex h-16 items-center justify-between'
          variants={staggerContainer}
          initial='hidden'
          animate='visible'
        >

          {/* LOGO */}
          <motion.a
  href="#home"
  onClick={(e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
  variants={logoAnimation}
  whileHover={{
    scale: 1.2,
    y: -2,
  }}
  whileTap={{ scale: 0.95 }}
  className="relative flex-shrink-0 group"
>
  {/* Glow background */}
  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 blur-md bg-gradient-to-r from-[#E2B56D]/40 to-[#F5D7A1]/40" />

  {/* Logo container */}
  <div className="relative px-2 py-1 rounded-xl transition-all duration-300 group-hover:bg-white/5 group-hover:border group-hover:border-white/10">
    <img
      src={logo}
      alt="Fine Gold Nation"
      className="h-10 w-20 object-contain transition duration-300"
    />
  </div>
</motion.a>

          {/* PREMIUM NAV */}
          <motion.nav
            className='hidden lg:flex items-center justify-center h-full'
            variants={staggerList}
          >
            <div className='flex items-center gap-2 px-2 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md shadow-[inset_0_0_20px_rgba(255,255,255,0.03)]'>

              {navigationItems.map(item => {
                const isActive = item.id === 'contact';

                return (
                  <motion.a
                    key={item.id}
                    href={item.href}
                    className={`
                      flex items-center justify-center
                      h-10 px-5 rounded-full
                      text-sm xl:text-base
                      font-medium
                      transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-[#F5D7A1] to-[#E2B56D] text-black shadow-[0_0_20px_rgba(226,181,109,0.35)]'
                        : 'text-white/70 hover:text-white hover:bg-white/10'}
                      ${isMongolian() ? 'mn' : ''}
                    `}
                    variants={listItem}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isMongolian() ? item.label.mn : item.label.en}
                  </motion.a>
                );
              })}

            </div>
          </motion.nav>

          {/* LANGUAGE */}
          <motion.div
            className='hidden md:flex items-center space-x-3'
            variants={slideInRight}
            whileHover={cardHover}
            whileTap={cardTap}
          >
            <LanguageSwitcher />
          </motion.div>

          {/* MOBILE MENU BUTTON */}
          <motion.button
            className='p-3 text-gray-300 hover:text-white lg:hidden'
            onClick={toggleMobileMenu}
            variants={slideInRight}
            whileTap={{ scale: 0.9 }}
          >
            <motion.svg
              className='h-6 w-6'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              animate={isMobileMenuOpen ? { rotate: 180 } : { rotate: 0 }}
            >
              {isMobileMenuOpen ? (
                <path strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              ) : (
                <path strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              )}
            </motion.svg>
          </motion.button>

        </motion.div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className='lg:hidden'
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className='space-y-2 border-t border-white/10 bg-black/95 px-4 py-4 backdrop-blur-md'>

                {navigationItems.map(item => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className='block px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 transition'
                  >
                    {isMongolian() ? item.label.mn : item.label.en}
                  </a>
                ))}

                <div className='pt-4'>
                  <LanguageSwitcher />
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </motion.header>
  );
};