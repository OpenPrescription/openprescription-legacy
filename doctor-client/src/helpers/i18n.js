import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

import { en, pt } from "../translations";
// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
};

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    detection: {
    
      // order and from where user language should be detected
      order: ['navigator', 'htmlTag', 'path', 'subdomain', 'querystring', 'cookie', 'localStorage'],
      
    },

    resources,
    //lng: "pt", // commented: enforces default language if enabled

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
