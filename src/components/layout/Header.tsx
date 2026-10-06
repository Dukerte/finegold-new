import { GoldOrderButton } from '../common/GoldOrderButton';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useId, useRef, useState } from 'react';
import logo from '../../assets/images/logo.svg';
import './Header.css';
import { useScrollHeader } from '../../hooks/useScrollHeader';

const GiftSparkle = () => <svg className="header-gift-sparkle" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m10 3 2.2 6.8L19 12l-6.8 2.2L10 21l-2.2-6.8L1 12l6.8-2.2L10 3Z" fill="currentColor"/><path d="m20 1 .9 2.1L23 4l-2.1.9L20 7l-.9-2.1L17 4l2.1-.9L20 1Z" fill="currentColor"/></svg>;

function GiftMenu({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const optionsId = useId();
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  return <div ref={ref} className={`gift-menu ${mobile ? 'gift-menu-mobile' : ''}`} data-open={open}
    onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { setOpen(false); event.currentTarget.querySelector<HTMLButtonElement>('.gift-menu-trigger')?.focus(); } }}>
    <button type="button" className="gift-menu-trigger header-nav-link" aria-expanded={open} aria-controls={optionsId} onClick={() => setOpen(value => !value)}><GiftSparkle />Бэлгийн багц<svg className="gift-menu-chevron" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="m3 4.5 3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.3" /></svg></button>
    <div id={optionsId} className="gift-menu-options" hidden={!open}>
      {[
        { href: '/executive', name: 'Executive Gift Set', description: 'Байгууллага, бизнесийн түншүүдэд' },
        { href: '/holiday', name: 'Holiday Gift Set', description: 'Гэр бүл, найз нөхөд, хайртай хүмүүст' },
      ].map(item => <a key={item.href} href={item.href} aria-current={window.location.pathname === item.href ? 'page' : undefined}
        onClick={() => { setOpen(false); onNavigate?.(); }}>
        <span>{item.name}</span><small>{item.description}</small>
      </a>)}
    </div>
  </div>;
}

const NAV_ITEMS = [
  { id: 'about',       label: 'Бидний тухай', href: '/about' },
  { id: 'products',    label: 'Мобайл АПП',   href: '#features-app' },
  { id: 'atm',         label: 'Салбар, байршил',  href: '/locations' },
  { id: 'news',        label: 'Мэдээ',        href: '/medee' },
];

export const Header: React.FC<{ solid?: boolean; onContact?: () => void; onOrder?: () => void }> = ({ solid = false, onContact, onOrder }) => {
  const { isScrolled, scrollDirection } = useScrollHeader();
  const [mobileOpen, setMobileOpen] = useState(false);

  const hidden = !mobileOpen && !onOrder && scrollDirection === 'down' && isScrolled;

  return (
    <motion.header
      className="site-header fixed top-0 left-0 right-0 z-50"
      animate={{
        y: hidden ? -100 : 0,
        backgroundColor: (solid || isScrolled) ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
        backdropFilter: isScrolled ? 'blur(20px)' : 'blur(0px)',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="site-header-row flex items-center justify-between h-[72px]">

          {/* LOGO */}
          <motion.a
            href="/"
            onClick={e => { if (window.location.pathname === '/' && !window.location.hash.startsWith('#/')) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="flex-shrink-0"
          >
            <img src={logo} alt="Fine Gold Nation" className="h-10 w-auto object-contain" />
          </motion.a>

          {/* CENTER NAV — desktop */}
          <nav aria-label="Үндсэн цэс" className="site-header-nav hidden lg:flex items-center gap-5">
            <GiftMenu />
            {NAV_ITEMS.map(item => (
              <a
                key={item.id}
                href={item.id === 'products' && solid ? '/#features-app' : item.href}
                onClick={e => { if (item.id === 'products' && solid) e.stopPropagation(); }}
                className="header-nav-link text-sm font-medium text-white/60 hover:text-white transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* RIGHT — CTA + Language */}
          <div className={onOrder ? "header-actions flex items-center gap-3 ml-auto lg:ml-0" : "hidden lg:flex items-center gap-4"}>
            {/* Language — МН only (EN disabled until translation complete) */}
            <div className="hidden lg:flex items-center gap-1 text-sm">
              <span className="px-3 py-1.5 rounded-full bg-[#E2B56D] text-black text-sm font-semibold select-none">МН</span>
            </div>

            {/* Холбоо барих CTA */}
            <a
              href={solid ? "/#contact" : "#contact"}
              onClick={e => { if(onContact) { e.preventDefault(); onContact(); } }}
              className={`header-contact-link hidden lg:inline-flex relative px-5 py-2 rounded-full text-sm font-semibold text-white border border-[#E2B56D]/60 hover:border-[#E2B56D] hover:bg-[#E2B56D]/8 transition-all duration-200 ${onOrder ? 'header-contact-secondary' : ''}`}
            >
              Холбоо барих
            </a>
            {onOrder && <GoldOrderButton onClick={() => { setMobileOpen(false); onOrder(); }} className="header-order-button" />}
          </div>

          {/* MOBILE BUTTON */}
          <button
            aria-label="Цэс" aria-expanded={mobileOpen}
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
            className="lg:hidden border-t border-white/8 bg-black/95 backdrop-blur-xl overflow-y-auto max-h-[calc(100svh-72px)]"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-1">
              <GiftMenu mobile onNavigate={() => setMobileOpen(false)} />
              {NAV_ITEMS.map(item => (
                <a
                  key={item.id}
                  href={item.id === 'products' && solid ? '/#features-app' : item.href}
                  onClick={e => { setMobileOpen(false); if (item.id === 'products' && solid) e.stopPropagation(); }}
                  className="header-nav-link px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/8 transition-all text-base font-medium"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={solid ? "/#contact" : "#contact"}
                onClick={e => { setMobileOpen(false); if(onContact) { e.preventDefault(); onContact(); } }}
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
