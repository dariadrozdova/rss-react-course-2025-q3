'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState } from 'react';

import { classNames } from '@/utils/classNames';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'uk', name: 'Українська' },
  { code: 'ru', name: 'Русский' },
  { code: 'pt', name: 'Português' },
  { code: 'be', name: 'Беларуская' },
];

export default function LanguageSelector() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsLanguageMenuOpen(false);
  };

  const currentLanguage = languages.find((lang) => lang.code === locale);

  return (
    <div className="relative">
      <button
        aria-label="Select language"
        className={classNames(
          'flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer',
          'text-theme-primary hover:bg-theme-primary/20',
          'transition-colors duration-300 font-medium'
        )}
        onClick={() => {
          setIsLanguageMenuOpen(!isLanguageMenuOpen);
        }}
      >
        <span className="hidden sm:inline">{currentLanguage?.name}</span>
        <span className="sm:hidden">{currentLanguage?.code.toUpperCase()}</span>
        <svg
          className={classNames(
            'w-4 h-4 transition-transform duration-200',
            isLanguageMenuOpen ? 'rotate-180' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {isLanguageMenuOpen && (
        <div
          className={classNames(
            'absolute top-full right-0 mt-2 py-2 w-40 rounded-lg shadow-lg z-50',
            'bg-theme-secondary border border-theme'
          )}
        >
          {languages.map((language) => (
            <button
              className={classNames(
                'w-full text-left px-4 py-2 cursor-pointer',
                'transition-colors duration-200',
                locale === language.code
                  ? 'bg-green-600 text-white font-semibold'
                  : 'text-theme-primary hover:bg-theme-primary/20'
              )}
              key={language.code}
              onClick={() => {
                switchLanguage(language.code);
              }}
            >
              {language.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
