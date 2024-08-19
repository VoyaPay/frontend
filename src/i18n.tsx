import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEnglish from './translations/english.json';
import translationChinese from './translations/chinese.json';

const resources = {
  en: {
    translation: translationEnglish
  },
  zh: {
    translation: translationChinese
  }
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});