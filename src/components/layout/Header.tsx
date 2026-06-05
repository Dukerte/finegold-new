import { AnimatePresence, motion } from 'motion/react';
import React, { useState } from 'react';
import logo from '../../assets/images/logo.svg';
import { useScrollHeader } from '../../hooks/useScrollHeader';

const NAV_ITEMS = [
  { id: 'about',       label: 'Бидний тухай', href: '#about' },
  { id: 'products',    label: 'Мобайл АПП',   href: '#features-app' },
  { id: 'atm',         label: 'АТМ байршил',  href: '#/atm' },
  { id: 'news',        label: 'Мэдээ',        href: '#/medee' },
];

export const Header: React.FC = () => {
  const { isScrolled, scrollDirection } = useScrollHeader();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hidden = scrollDirection === 'down' && isScrolled;

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      animate={{
        y: hidden ? -100 : 0,
        backgroundColor: isScrolled ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px]">

          {/* LOGO */}
          <motion.a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0"
          >
            <img src={logo} alt="Fine Gold Nation" className="h-10 w-auto object-contain" />
          </motion.a>

          {/* CENTER NAV — desktop */}
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* RIGHT — CTA + Language */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language toggle */}
            <div className="flex items-center gap-1 text-sm">
              <button className="px-3 py-1.5 rounded-full text-white/40 hover:text-white/80 transition-colors text-sm font-medium">EN</button>
              <button className="px-3 py-1.5 rounded-full bg-[#E2B56D] text-black text-sm font-semibold">МН</button>
            </div>

            {/* Холбоо барих CTA */}
            <a
              href="#contact"
              className="relative px-5 py-2 rounded-full text-sm font-semibold text-white border border-[#E2B56D]/60 hover:border-[#E2B56D] hover:bg-[#E2B56D]/8 transition-all duration-200"
            >
              Холбоо барих
            </a>
          </div>

          {/* MOBILE BUTTON */}
          <button
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>

        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:hidden border-t border-white/8 bg-black/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
              {NAV_ITEMS.map(item => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all text-base font-medium"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="mt-3 px-4 py-3 rounded-xl text-center text-sm font-semibold text-white border border-[#E2B56D]/60"
              >
                Холбоо барих
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
