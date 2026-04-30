import { motion } from 'motion/react';
import { AutoLanguageDetector } from './components/common/AutoLanguageDetector';
import { GlobalLoading } from './components/common/GlobalLoading';
import { Header } from './components/layout/Header';
import FaqSection from './components/sections/FaqSection';
import { Calculator } from './components/sections/Calculator';

import './utils/i18n';

import {
  LazyFooter,
  LazyHeroSection,
  LazyLoad,
} from './utils/lazyLoad';

// ✅ DIRECT IMPORT (NO LAZY for now)
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

  {/* HERO */}
  <LazyLoad>
    <LazyHeroSection />
  </LazyLoad>

  {/* ATM */}
  <ATMFeaturesSection />

  {/* APP */}
  <APPFeaturesSection />

  {/* ✅ ADD THIS */}
  <Calculator />


</main>

      <LazyLoad>
        <LazyFooter />
      </LazyLoad>

    </motion.div>
  );
}

export default App;