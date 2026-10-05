import { motion } from 'motion/react';
import { lazy, Suspense, useState, useEffect } from 'react';
import { AutoLanguageDetector } from './components/common/AutoLanguageDetector';
import { GlobalLoading } from './components/common/GlobalLoading';
import { Header } from './components/layout/Header';
import FaqSection from './components/sections/FaqSection';
import { Calculator } from './components/sections/Calculator';
import { ProductPillarsSection } from './components/sections/ProductPillarsSection';
import { HeritageSection } from './components/sections/HeritageSection';
import { Vision2030Section } from './components/sections/Vision2030Section';
import { ATMLocationsPage } from './pages/ATMLocationsPage';
import { NewsPage } from './pages/NewsPage';
import { AboutPage } from './pages/AboutPage';

import './utils/i18n';

import {
  LazyFooter,
  LazyHeroSection,
  LazyLoad,
} from './utils/lazyLoad';

import { ATMFeaturesSection } from './components/sections/ATMFeaturesSection';
import { APPFeaturesSection } from './components/sections/APPFeaturesSection';
import { PreOrderWidget } from './components/common/PreOrderWidget';

const GiftPage = lazy(() => import('./pages/GiftPage').then(m => ({ default: m.GiftPage })));

const HolidayGiftPage = lazy(() => import('./pages/HolidayGiftPage'));

// ─── Router — supports clean paths (/locations) and legacy hashes (#/atm) ─────
function useRoute() {
  const read = () => window.location.pathname + window.location.hash;
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const update = () => setRoute(read());
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);

    // Intercept same-origin clean-path links so they navigate without a reload
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      if (a.target && a.target !== '_self') return;
      e.preventDefault();
      window.history.pushState(null, '', href);
      update();
      window.scrollTo({ top: 0 });
    };
    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('hashchange', update);
      window.removeEventListener('popstate', update);
      document.removeEventListener('click', onClick);
    };
  }, []);
  return route;
}

function App() {
  const route = useRoute();
  const hash = window.location.hash;
  const path = window.location.pathname.replace(/\/+$/, '');
  void route; // re-render trigger

  const isATMPage   = path === '/locations' || hash === '#/locations' || hash === '#/atm';
  const isNewsPage  = path === '/medee' || path.startsWith('/medee/') || hash === '#/medee' || hash.startsWith('#/medee/');
  const isAboutPage = path === '/about' || hash === '#/about';
  const isHolidayPage = path === '/holiday' || hash === '#/holiday';
  const isGiftPage = path === '/executive' || hash === '#/executive' || path === '/special-edition' || path === '/gifts' || hash === '#/gifts' || hash === '#/special-edition';

  useEffect(() => {
    if (isATMPage || isNewsPage || isAboutPage || isGiftPage || isHolidayPage) window.scrollTo({ top: 0 });
  }, [isATMPage, isNewsPage, isAboutPage, isGiftPage, isHolidayPage]);

  useEffect(() => {
    if (isGiftPage && (path !== '/executive' || hash.startsWith('#/'))) {
      window.history.replaceState(null, '', '/executive' + window.location.search);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
    if (isHolidayPage && hash === '#/holiday') {
      window.history.replaceState(null, '', '/holiday' + window.location.search);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }, [isGiftPage, isHolidayPage, path, hash]);

  const isHome = !isATMPage && !isNewsPage && !isAboutPage && !isGiftPage && !isHolidayPage;

  return (
    <>
      {/* Pre-order widget floats on every page */}
      {!isGiftPage && !isHolidayPage && <PreOrderWidget />}

      {/* Language guard runs on every page, not just home */}
      <AutoLanguageDetector />

      {isATMPage   && <ATMLocationsPage />}
      {isNewsPage  && <NewsPage />}
      {isAboutPage && <AboutPage />}
      {isGiftPage && <Suspense fallback={<div className="p-12 text-[#E2B56D]">Бэлгийн багцыг бэлдэж байна…</div>}><GiftPage /></Suspense>}

      {isHolidayPage && <Suspense fallback={<div className="p-12 text-[#E2B56D]">Уншиж байна…</div>}><HolidayGiftPage /></Suspense>}

      {isHome && (
        <motion.div
          className='App min-h-screen bg-black'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <GlobalLoading />

          <Header />

          <main className='flex flex-col'>

            {/* 1. HERO CAROUSEL */}
            <LazyLoad>
              <LazyHeroSection />
            </LazyLoad>

            {/* 2. 3-PILLAR PRODUCTS (App / Kiosk / Factory) */}
            <ProductPillarsSection />

            {/* 3. ATM FEATURES */}
            <ATMFeaturesSection />

            {/* 4. APP FEATURES */}
            <APPFeaturesSection />

            {/* 5. MONGOLIAN HERITAGE — Мөнгөн мод */}
            <HeritageSection />

            {/* 6. VISION 2030 */}
            <Vision2030Section />

            {/* 7. CALCULATOR */}
            <Calculator />

            {/* 8. FAQ */}
            <FaqSection />

          </main>

          <LazyLoad>
            <LazyFooter />
          </LazyLoad>

        </motion.div>
      )}
    </>
  );
}

export default App;
