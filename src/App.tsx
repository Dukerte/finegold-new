import { motion } from 'motion/react';
import { AutoLanguageDetector } from './components/common/AutoLanguageDetector';
import { GlobalLoading } from './components/common/GlobalLoading';
import { Header } from './components/layout/Header';
import FaqSection from './components/sections/FaqSection';
import { Calculator } from './components/sections/Calculator';
import { ProductPillarsSection } from './components/sections/ProductPillarsSection';
import { HeritageSection } from './components/sections/HeritageSection';
import { Vision2030Section } from './components/sections/Vision2030Section';

import './utils/i18n';

import {
  LazyFooter,
  LazyHeroSection,
  LazyLoad,
} from './utils/lazyLoad';

import { ATMFeaturesSection } from './components/sections/ATMFeaturesSection';
import { APPFeaturesSection } from './components/sections/APPFeaturesSection';

function App() {
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