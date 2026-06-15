import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
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

// ─── Simple hash router ───────────────────────────────────────────────────────
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  return hash;
}

function App() {
  const hash = useHashRoute();
  const isATMPage   = hash === '#/atm';
  const isNewsPage  = hash === '#/medee' || hash.startsWith('#/medee/');
  const isAboutPage = hash === '#/about';

  useEffect(() => {
    if (isATMPage || isNewsPage || isAboutPage) window.scrollTo({ top: 0 });
  }, [isATMPage, isNewsPage, isAboutPage]);

  if (isATMPage)   return <ATMLocationsPage />;
  if (isNewsPage)  return <NewsPage />;
  if (isAboutPage) return <AboutPage />;

  return (
    <motion.div
      className='App min-h-screen bg-black'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <GlobalLoading />
      <AutoLanguageDetector />

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
  );
}

export default App;
