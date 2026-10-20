'use client';

import React from 'react';
import { useLanguageStore } from '../../store/languageStore';
import { Languages } from 'lucide-react';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5 shadow-xs text-xs font-medium">
      <button
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded-md transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white shadow-xs font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('np')}
        className={`px-2 py-1 rounded-md transition-colors ${
          language === 'np'
            ? 'bg-blue-600 text-white shadow-xs font-semibold'
            : 'text-gray-600 hover:text-gray-900'
        }`}
        title="नेपाली भाषामा बदल्नुहोस्"
      >
        नेपाली
      </button>
    </div>
  );
}
