import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import pokeball from '@/app/pokeball.png';
import { classNames } from '@/utils/classNames';
import {
  BUTTON_BASE_CLASSES,
  BUTTON_COLOR_GREEN,
} from '@/utils/stylesConstants';

export default function NotFoundPage() {
  const t = useTranslations('NotFoundPage');

  const navLinkClasses = `${BUTTON_BASE_CLASSES} ${BUTTON_COLOR_GREEN}`;

  return (
    <div
      className={classNames(
        `theme-card p-6 rounded-lg shadow-md
          text-center flex flex-col items-center justify-center
          w-full box-border font-['Inter']
          min-h-[1016px]`
      )}
    >
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-8xl font-bold text-theme-primary">4</span>
          <Image alt="Poké Ball" height={80} src={pokeball} width={80} />
          <span className="text-8xl font-bold text-theme-primary">4</span>
        </div>
        <p className="text-xl mb-2 text-theme-secondary">{t('title')}</p>
        <p className="text-lg mb-8 text-theme-secondary">{t('description')}</p>
        <Link className={navLinkClasses} href="/">
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
}
