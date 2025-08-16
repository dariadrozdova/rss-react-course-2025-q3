'use client';

import Link from 'next/link';

import ThemeSwitch from '@/components/ThemeSwitch';
import { useSelectedItemsStorage } from '@/hooks/useSelectedItemsStorage';
import { classNames } from '@/utils/classNames';

export default function Header() {
  useSelectedItemsStorage();

  return (
    <nav
      className={classNames(`py-4 rounded-lg shadow-sm mb-8 w-full
        max-w-7xl border box-border
        md:rounded-xl md:shadow-lg
        bg-theme-secondary border-theme`)}
    >
      <div className={classNames('flex justify-end px-4 pb-2')}>
        <ThemeSwitch />
      </div>

      <ul
        className={classNames(`list-none p-0 m-0 flex justify-center flex-wrap
          flex-col gap-4
          sm:gap-2
          md:flex-row md:gap-10`)}
      >
        <li>
          <Link
            className={classNames(
              'block no-underline font-semibold rounded-lg',
              'transition-colors duration-300',
              'px-6 py-3 text-center',
              'sm:text-base',
              'md:px-4 md:py-2 md:text-lg',
              'text-theme-primary hover:bg-theme-primary/20 hover:text-teal-500'
            )}
            href="/"
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            className={classNames(
              'block no-underline font-semibold rounded-lg',
              'transition-colors duration-300',
              'px-6 py-3 text-center',
              'sm:text-base',
              'md:px-4 md:py-2 md:text-lg',
              'text-theme-primary hover:bg-theme-primary/20 hover:text-teal-500'
            )}
            href="/about"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
}
