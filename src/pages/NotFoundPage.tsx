import { NavLink } from 'react-router-dom';

import Image from 'next/image';

import pokeball from '@/app/pokeball.png';
import { cn } from '@/utils/cn';
import {
  BUTTON_BASE_CLASSES,
  BUTTON_COLOR_GREEN,
} from '@/utils/stylesConstants';

function NotFoundPage() {
  const navLinkClasses = `${BUTTON_BASE_CLASSES} ${BUTTON_COLOR_GREEN}`;

  return (
    <div
      className={cn(`theme-card p-6 rounded-lg shadow-md
        text-center flex flex-col items-center justify-center
        w-full box-border font-['Inter']
        min-h-[1016px]`)}
    >
      <div className={cn('max-w-4xl w-full')}>
        <div className={cn('flex items-center justify-center gap-4 mb-6')}>
          <span className={cn('text-8xl font-bold text-theme-primary')}>4</span>
          <Image alt="Poké Ball" height={80} src={pokeball} width={80} />
          <span className={cn('text-8xl font-bold text-theme-primary')}>4</span>
        </div>

        <p className={cn('text-xl mb-2 text-theme-secondary')}>
          Looks like this page doesn't exist!
        </p>
        <p className={cn('text-lg mb-8 text-theme-secondary')}>
          Go back to the homepage and continue exploring.
        </p>

        <NavLink className={navLinkClasses} to="/">
          Back to Homepage
        </NavLink>
      </div>
    </div>
  );
}

export default NotFoundPage;
