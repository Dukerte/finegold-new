import { motion } from 'motion/react';
import React from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import type { Language } from '../../types';

export const LanguageSwitcher: React.FC = () => {
  const { changeLanguage, currentLanguage } = useLocalization();

  const handleLanguageChange = (language: Language) => {
    changeLanguage(language);
  };

  return (
    <div className='flex flex-col items-center space-y-2'>
      {/* Language Toggle Buttons */}
      <motion.div
        className='flex items-center space-x-1 rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-sm'
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.button
          onClick={() => handleLanguageChange('en')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
            currentLanguage === 'en'
              ? 'bg-gradient-to-r from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] text-[#0F120A] shadow-lg'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          EN
        </motion.button>
        <motion.button
          onClick={() => handleLanguageChange('mn')}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
            currentLanguage === 'mn'
              ? 'bg-gradient-to-r from-[#FAE1B9] via-[#E2B56D] to-[#C28A34] text-[#0F120A] shadow-lg'
              : 'text-white/80 hover:bg-white/10 hover:text-white'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          МН
        </motion.button>
      </motion.div>
    </div>
  );
};
