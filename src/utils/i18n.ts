import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import mnTranslation from '../locales/mn/translation.json';

// initImmediate: false forces synchronous init so t() never returns raw keys
// on the first render frame before the Promise resolves.
i18n
  .use(initReactI18next)
  .init({
    resources: {
      mn: { translation: mnTranslation },
    },
    lng: 'mn',
    fallbackLng: 'mn',
    initImmediate: false,       // ← sync init, eliminates translation key flash
    detection: { order: [], caches: [] }, // disable any language auto-detection
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
