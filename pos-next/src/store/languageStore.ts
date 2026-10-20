import { create } from 'zustand';
import { Language, dictionaries, Translations } from '../lib/i18n';

interface LanguageState {
  language: Language;
  t: Translations;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>((set, get) => ({
  language: 'en',
  t: dictionaries.en,
  setLanguage: (lang: Language) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pos_lang', lang);
    }
    set({ language: lang, t: dictionaries[lang] });
  },
  toggleLanguage: () => {
    const nextLang = get().language === 'en' ? 'np' : 'en';
    if (typeof window !== 'undefined') {
      localStorage.setItem('pos_lang', nextLang);
    }
    set({ language: nextLang, t: dictionaries[nextLang] });
  },
}));

// Hydrate from localStorage on client side
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('pos_lang') as Language | null;
  if (saved && (saved === 'en' || saved === 'np')) {
    useLanguageStore.setState({ language: saved, t: dictionaries[saved] });
  }
}
