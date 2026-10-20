import { en, Translations } from './en';
import { np } from './np';

export type Language = 'en' | 'np';

export const dictionaries: Record<Language, Translations> = {
  en,
  np,
};

export { en, np };
export type { Translations };
