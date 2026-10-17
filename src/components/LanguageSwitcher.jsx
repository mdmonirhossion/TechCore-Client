'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher({ variant = 'navbar', className = '' }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function changeLanguage() {
    const nextLocale = locale === 'en' ? 'bn' : 'en';
    router.replace(pathname, { locale: nextLocale });
  }

  if (variant === 'footer') {
    return (
      <button
        type="button"
        onClick={changeLanguage}
        aria-label="Change website language"
        className={`flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium cursor-pointer ${className}`}
      >
        <Globe size={14} className="text-orange-500" />
        <span>{locale === 'en' ? 'English (Switch to বাংলা)' : 'বাংলা (Switch to English)'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={changeLanguage}
      aria-label="Change website language"
      title={locale === 'en' ? 'Switch to বাংলা' : 'Switch to English'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 shadow-sm active:scale-95 cursor-pointer ${className}`}
    >
      <Globe size={14} className="text-orange-400" />
      <span>{locale === 'en' ? 'বাংলা' : 'EN'}</span>
    </button>
  );
}
