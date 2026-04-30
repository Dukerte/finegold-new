import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';
import {
  detectUserLocation,
  getRecommendedLanguage,
} from '../utils/geolocation';

export const useLocalization = () => {
  const { t, i18n } = useTranslation();
  const [isDetecting, setIsDetecting] = useState(false);

  const changeLanguage = useCallback(
    (language: Language) => {
      i18n.changeLanguage(language);
      localStorage.setItem('language', language);
    },
    [i18n]
  );

  const getCurrentLanguage = useCallback((): Language => {
    return i18n.language as Language;
  }, [i18n.language]);

  const isMongolian = useCallback((): boolean => {
    return i18n.language === 'mn';
  }, [i18n.language]);

  // Function to manually detect and set language based on user's location
  const detectAndSetLanguage = useCallback(async () => {
    setIsDetecting(true);
    try {
      const location = await detectUserLocation();
      const recommendedLanguage = getRecommendedLanguage(location);

      changeLanguage(recommendedLanguage);
      return recommendedLanguage;
    } catch (error) {
      console.debug('Language detection failed:', error);
      // Fallback to browser language detection
      const browserLanguage = navigator.language.toLowerCase();
      if (browserLanguage.startsWith('mn')) {
        changeLanguage('mn');
        return 'mn';
      } else {
        changeLanguage('en');
        return 'en';
      }
    } finally {
      setIsDetecting(false);
    }
  }, [changeLanguage]);

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    isMongolian,
    currentLanguage: i18n.language as Language,
    detectAndSetLanguage,
    isDetecting,
  };
};
