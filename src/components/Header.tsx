'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import LanguageSelector from '@/components/LanguageSelector';
import ThemeSwitch from '@/components/ThemeSwitch';
import { useSelectedItemsStorage } from '@/hooks/useSelectedItemsStorage';
import { classNames } from '@/utils/classNames';

export default function Header() {
  const t = useTranslations('Header');
  const pathname = usePathname();

  useSelectedItemsStorage();

  const getNavLinkStyles = (href: string) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';
    const isActive = pathWithoutLocale === href;

    return classNames(
      'block no-underline font-semibold rounded-lg cursor-pointer',
      'transition-colors duration-300',
      'px-6 py-3 text-center',
      'sm:text-base',
      'md:px-4 md:py-2 md:text-lg',
      'text-theme-primary hover:bg-theme-primary/20 hover:text-teal-500',
      isActive &&
        'bg-green-600 text-white font-bold shadow-md shadow-green-600/40'
    );
  };

  return (
    <nav
      className={classNames(
        'w-full max-w-7xl box-border rounded-lg shadow-sm border',
        'py-4 mb-8',
        'md:rounded-xl md:shadow-lg',
        'bg-theme-secondary border-theme'
      )}
    >
      <div className="flex justify-end items-center gap-2 px-4 pb-2">
        <LanguageSelector />
        <ThemeSwitch />
      </div>

      <ul
        className={classNames(
          'list-none p-0 m-0 flex justify-center flex-wrap flex-col',
          'gap-4',
          'sm:gap-2',
          'md:flex-row md:gap-10'
        )}
      >
        <li>
          <Link className={getNavLinkStyles('/')} href="/">
            {t('home')}
          </Link>
        </li>
        <li>
          <Link className={getNavLinkStyles('/about')} href="/about">
            {t('about')}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
