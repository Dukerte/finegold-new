import React, { useEffect, useState } from 'react';
import { useLocalization } from '../../hooks/useLocalization';
import {
  detectUserLocation,
  getRecommendedLanguage,
} from '../../utils/geolocation';
import { LanguageNotification } from './LanguageNotification';

// EN translation is not ready yet — this component always enforces MN.
// Re-enable auto-detection once translations are complete.
export const AutoLanguageDetector: React.FC = () => {
  const { currentLanguage, changeLanguage } = useLocalization();

  useEffect(() => {
    if (currentLanguage !== 'mn') {
      changeLanguage('mn');
    }
    // Also clear any stored EN preference
    if (localStorage.getItem('language') === 'en') {
      localStorage.setItem('language', 'mn');
    }
  }, [currentLanguage, changeLanguage]);

  return null;
};
