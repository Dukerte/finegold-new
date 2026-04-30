import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { detectUserLocation, getRecommendedLanguage } from './geolocation';

// Import translations
import enTranslation from '../locales/en/translation.json';
import mnTranslation from '../locales/mn/translation.json';

// Resources object
const resources = {
  en: {
    translation: enTranslation,
  },
  mn: {
    translation: mnTranslation,
  },
};

// Enhanced language detection with geolocation support
const enhancedLanguageDetector = {
  name: 'enhancedLanguageDetector',
  async lookup() {
    console.log('Enhanced language detector running...');

    // Check localStorage first (highest priority)
    const storedLanguage = localStorage.getItem('language');
    if (
      storedLanguage &&
      (storedLanguage === 'en' || storedLanguage === 'mn')
    ) {
      console.log('Using stored language preference:', storedLanguage);
      return storedLanguage;
    }

    // Check browser language with more comprehensive Mongolian detection
    const browserLanguage = navigator.language.toLowerCase();
    const browserLanguages =
      navigator.languages?.map(lang => lang.toLowerCase()) || [];

    // Check for Mongolian language codes
    const mongolianCodes = ['mn', 'mn-mn', 'mn-cyrl', 'mn-latn', 'khalkha'];
    const isMongolianBrowser = mongolianCodes.some(
      code =>
        browserLanguage.startsWith(code) ||
        browserLanguages.some(lang => lang.startsWith(code))
    );

    if (isMongolianBrowser) {
      console.log('Browser language detected as Mongolian');
      return 'mn';
    }

    // Try to detect location-based language preference
    try {
      console.log('Attempting location-based language detection...');
      const location = await detectUserLocation();
      const recommendedLanguage = getRecommendedLanguage(location);

      if (recommendedLanguage === 'mn') {
        console.log('Location-based detection recommends Mongolian');
        return 'mn';
      }
    } catch (error) {
      // Silently fail if geolocation fails
      console.debug('Geolocation detection failed:', error);
    }

    // Try to detect country from timezone
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (
        timezone.includes('Asia/Ulaanbaatar') ||
        timezone.includes('Asia/Hovd')
      ) {
        console.log('Timezone detection suggests Mongolia');
        return 'mn';
      }
    } catch (error) {
      // Silently fail if timezone detection fails
    }

    // Default to English
    console.log('Defaulting to English language');
    return 'en';
  },
  cacheUserLanguage(lng: string) {
    console.log('Caching user language preference:', lng);
    localStorage.setItem('language', lng);
  },
};

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',

    detection: {
      order: ['enhancedLanguageDetector', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
      lookupSessionStorage: 'language',
    },

    interpolation: {
      escapeValue: false, // React already escapes values
    },

    react: {
      useSuspense: false,
    },
  });

// Add enhanced detector
i18n.services.languageDetector.addDetector(enhancedLanguageDetector);

// Log the final detected language
console.log('i18n initialized with language:', i18n.language);

export default i18n;
