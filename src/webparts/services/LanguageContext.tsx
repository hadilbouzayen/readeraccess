import * as React from "react";
import { createContext, useContext, useState } from "react";
import * as fr from './translations/fr';
import * as en from './translations/en';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
  translations: typeof en | typeof fr;
}

export const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: (lang: string) => {
    throw new Error("setLanguage function must be overridden by LanguageProvider");
  },
  translations: en, // Default to English
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('en');
  const translations = language === 'en' ? en : fr;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
